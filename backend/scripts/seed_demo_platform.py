"""Seeds 2+ full demo organizations with real Supabase Auth users, team members,
products/warehouses/suppliers/inventory/orders, and backdated activity — so the
app has real, non-empty data to show immediately after a real login, instead of
the frontend's old static mock literals.

Deliberately NOT a copy of frontend/src/data/{mockData,sellerboardData}.js's exact
numbers (BACKEND_READINESS_REPORT.md flags those as fake/decorative, and copying
them verbatim would defeat the point of "real data") — only category/status/field
*shapes* are referenced; values are generated with a fixed random seed so runs are
reproducible.

Requires (in backend/.env): DATABASE_URL / MIGRATIONS_DATABASE_URL pointing at your
real Supabase project, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (used here only,
via the Admin API, to create real auth.users accounts — never used by the running
API process; see app/config.py's migrations_database_url docstring for the same
elevated-vs-runtime-role reasoning).

Usage:
    python scripts/seed_demo_platform.py [--orgs 2] [--reset] [--admin-email you@example.com]

--reset truncates every table this script writes to first (refused outside local
dev — see the is_production guard below). Every seeded user's password is
"DemoPass123!" (printed again at the end) — change it via the Supabase dashboard
before this ever touches a real production project.
"""

import argparse
import asyncio
import random
import sys
import uuid
from datetime import UTC, date, datetime, timedelta
from decimal import Decimal

import httpx
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import get_settings
from app.core.constants import ActivityEventType, OrderType, Priority, SystemRole
from app.models.activity_log import ActivityLog
from app.models.order import Order, OrderDeliveryStep, OrderItem
from app.models.product import Product, ProductFbaFees, ProductSpec
from app.models.sellerboard_content import (
    SellerboardChartSeries,
    SellerboardKpiCard,
    SellerboardPageMeta,
    SellerboardProductCard,
    SellerboardSettingsField,
    SellerboardSettingsGroup,
    SellerboardTableColumn,
    SellerboardTableRow,
)
from app.models.supplier import ProductSupplier, Supplier
from app.models.user import TeamMembership
from app.models.warehouse import InventoryLocation, Warehouse
from app.services.auth_service import create_organization
from scripts.seed_sellerboard_shapes import GenContext, all_page_specs, build_page_rows

DEMO_PASSWORD = "DemoPass123!"
RESET_TABLES = (
    "activity_log",
    "order_delivery_steps",
    "order_items",
    "orders",
    "product_suppliers",
    "product_fba_fees",
    "product_specs",
    "inventory_locations",
    "products",
    "suppliers",
    "warehouses",
)

CATEGORIES = ["Electronics", "Home & Kitchen", "Sports & Outdoors", "Beauty", "Office Supplies", "Toys & Games"]
BRANDS = ["Nova", "Crestline", "Aurea", "Polarix", "Summit", "Kindred", "Vantage", "Brightwell"]
ADJECTIVES = ["Pro", "Max", "Lite", "Plus", "Ultra", "Essential", "Compact", "Classic"]
NOUNS = ["Charger", "Blender", "Backpack", "Headphones", "Desk Lamp", "Water Bottle", "Yoga Mat", "Keyboard"]
CARRIERS = ["FedEx", "UPS", "DHL", "USPS", "Amazon Logistics"]
WAREHOUSE_CITIES = [("Dallas", "USA"), ("Reno", "USA"), ("Columbus", "USA"), ("Leipzig", "Germany")]


def rand_icon() -> str:
    return random.choice(["📦", "🎧", "💡", "🧴", "🖥️", "🧢", "🔋", "🧰"])


async def create_auth_user(client: httpx.AsyncClient, settings, email: str) -> uuid.UUID:
    resp = await client.post(
        f"{settings.supabase_url}/auth/v1/admin/users",
        headers={
            "apikey": settings.supabase_service_role_key,
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
        },
        json={"email": email, "password": DEMO_PASSWORD, "email_confirm": True},
    )
    if resp.status_code == 422 and "already been registered" in resp.text:
        # Idempotent re-runs: look the existing user up by email instead of failing.
        list_resp = await client.get(
            f"{settings.supabase_url}/auth/v1/admin/users",
            headers={
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
            },
            params={"email": email},
        )
        list_resp.raise_for_status()
        users = list_resp.json().get("users", [])
        if not users:
            resp.raise_for_status()
        return uuid.UUID(users[0]["id"])
    resp.raise_for_status()
    return uuid.UUID(resp.json()["id"])


async def add_member(db: AsyncSession, organization_id: uuid.UUID, user_id: uuid.UUID, role: SystemRole) -> None:
    role_row = (
        await db.execute(
            text("select id from roles where organization_id = :org and name = :name"),
            {"org": str(organization_id), "name": role.value},
        )
    ).first()
    db.add(
        TeamMembership(
            id=uuid.uuid4(), organization_id=organization_id, user_id=user_id, role_id=role_row[0], status="active"
        )
    )


def gen_product(index: int) -> dict:
    category = random.choice(CATEGORIES)
    brand = random.choice(BRANDS)
    name = f"{brand} {random.choice(ADJECTIVES)} {random.choice(NOUNS)}"
    unit_cost = Decimal(random.randint(400, 8000)) / 100
    margin = Decimal(random.randint(120, 220)) / 100
    selling_price = (unit_cost * margin).quantize(Decimal("0.01"))
    return {
        "sku": f"SKU-{1000 + index}",
        "name": name,
        "category": category,
        "brand": brand,
        "description": f"{name} — a {category.lower()} best-seller sourced for reliable fulfillment.",
        "barcode": f"{random.randint(10**11, 10**12 - 1)}",
        "unit": "Each",
        "icon": rand_icon(),
        "unit_cost": unit_cost,
        "selling_price": selling_price,
        "reorder_point": random.choice([10, 20, 25, 40, 50]),
        "fulfillment_type": random.choice(["FBA", "FBM", "SFP"]),
    }


async def seed_organization(
    db: AsyncSession, client: httpx.AsyncClient, settings, org_index: int, owner_email: str | None
) -> uuid.UUID:
    org_name = f"Demo Org {org_index}"
    owner_email = owner_email or f"owner{org_index}@demo.inventoryinsights.test"
    owner_id = await create_auth_user(client, settings, owner_email)

    organization = await create_organization(db, owner_id, org_name, f"demo-org-{org_index}-{uuid.uuid4().hex[:6]}")
    org_id = organization.id

    # create_organization() commits internally (see app/services/auth_service.py),
    # which ends the transaction its own SET LOCAL app.current_org_id belonged to.
    # Every insert below is tenant-scoped (organization_id = org_id), so the RLS
    # `with check` needs that session variable set again for THIS new transaction
    # before anything else is added — same pattern create_organization itself uses.
    await db.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(owner_id)})
    await db.execute(text("SET LOCAL app.current_org_id = :org_id"), {"org_id": str(org_id)})

    admin_id = await create_auth_user(client, settings, f"admin{org_index}@demo.inventoryinsights.test")
    member_id = await create_auth_user(client, settings, f"member{org_index}@demo.inventoryinsights.test")
    await add_member(db, org_id, admin_id, SystemRole.ADMIN)
    await add_member(db, org_id, member_id, SystemRole.MEMBER)
    await db.flush()

    # --- warehouses ---------------------------------------------------
    warehouses = []
    for city, country in random.sample(WAREHOUSE_CITIES, k=random.randint(2, len(WAREHOUSE_CITIES))):
        w = Warehouse(
            id=uuid.uuid4(),
            organization_id=org_id,
            name=f"{city} Fulfillment Center",
            city=city,
            country=country,
            status="Active",
            type=random.choice(["Self-Managed", "Amazon FBA"]),
            capacity_units=random.randint(8000, 25000),
        )
        db.add(w)
        warehouses.append(w)
    await db.flush()

    # --- suppliers ------------------------------------------------------
    suppliers = []
    for i in range(random.randint(4, 7)):
        s = Supplier(
            id=uuid.uuid4(),
            organization_id=org_id,
            name=f"{random.choice(BRANDS)} Supply Co.",
            icon=rand_icon(),
            contact_name=f"Contact {i + 1}",
            email=f"supplier{org_index}{i}@vendors.test",
            phone=f"+1-555-01{i:02d}",
            country=random.choice(["USA", "China", "Vietnam", "Mexico"]),
            lead_time_days=random.randint(5, 30),
            rating=Decimal(random.randint(30, 50)) / 10,
            status="Active",
        )
        db.add(s)
        suppliers.append(s)
    await db.flush()

    # --- products + specs + fba fees + inventory + supplier links -------
    products = []
    for i in range(random.randint(40, 60)):
        data = gen_product(i)
        product = Product(id=uuid.uuid4(), organization_id=org_id, **data)
        db.add(product)
        products.append(product)
    await db.flush()

    for product in products:
        db.add(ProductSpec(id=uuid.uuid4(), product_id=product.id, label="Weight", value=f"{random.uniform(0.2, 5):.2f} kg", sort_order=0))
        db.add(ProductSpec(id=uuid.uuid4(), product_id=product.id, label="Dimensions", value=f"{random.randint(5,40)}x{random.randint(5,40)}x{random.randint(5,40)} cm", sort_order=1))

        if product.fulfillment_type == "FBA":
            db.add(
                ProductFbaFees(
                    product_id=product.id,
                    referral=(product.selling_price * Decimal("0.15")).quantize(Decimal("0.01")),
                    fulfillment=Decimal(random.randint(200, 600)) / 100,
                    storage=Decimal(random.randint(20, 120)) / 100,
                    long_term=Decimal(random.randint(0, 80)) / 100,
                )
            )

        primary_supplier = random.choice(suppliers)
        db.add(ProductSupplier(product_id=product.id, supplier_id=primary_supplier.id, is_primary=True))

        for warehouse in random.sample(warehouses, k=random.randint(1, len(warehouses))):
            stock = random.randint(0, 400)
            db.add(
                InventoryLocation(
                    id=uuid.uuid4(),
                    organization_id=org_id,
                    product_id=product.id,
                    warehouse_id=warehouse.id,
                    location_code=f"{warehouse.name[:2].upper()}-{random.randint(1,9)}-{random.randint(10,99)}",
                    stock=stock,
                    reserved=random.randint(0, min(stock, 40)),
                )
            )
    await db.flush()

    # --- orders (purchase / sales / transfer) ---------------------------
    today = date.today()
    for i in range(random.randint(60, 100)):
        order_type = random.choices([OrderType.SALES, OrderType.PURCHASE, OrderType.TRANSFER], weights=[6, 3, 1])[0]
        order_date = today - timedelta(days=random.randint(0, 180))
        fulfillment_status = random.choices(
            ["Delivered", "Shipped", "In Transit", "Processing", "Pending", "Cancelled"], weights=[5, 2, 2, 2, 2, 1]
        )[0]

        counterparty_name = None
        source_wh = destination_wh = None
        if order_type == OrderType.PURCHASE:
            counterparty_name = random.choice(suppliers).name
            destination_wh = random.choice(warehouses).id
        elif order_type == OrderType.SALES:
            counterparty_name = f"Customer #{random.randint(1000, 9999)}"
            source_wh = random.choice(warehouses).id
        else:
            src, dst = random.sample(warehouses, k=2) if len(warehouses) >= 2 else (warehouses[0], warehouses[0])
            source_wh, destination_wh = src.id, dst.id

        order = Order(
            id=uuid.uuid4(),
            organization_id=org_id,
            order_number=f"{order_type.value[:2].upper()}-{100000 + i}",
            type=order_type.value,
            counterparty_name=counterparty_name,
            source_warehouse_id=source_wh,
            destination_warehouse_id=destination_wh,
            order_date=order_date,
            payment_status=random.choice(["Paid", "Pending", "Refunded"]) if order_type == OrderType.SALES else None,
            fulfillment_status=fulfillment_status,
            priority=random.choice(list(Priority)).value,
            carrier=random.choice(CARRIERS) if fulfillment_status != "Pending" else None,
            tracking_number=f"TRK{random.randint(10**9, 10**10 - 1)}" if fulfillment_status != "Pending" else None,
            expected_delivery_date=order_date + timedelta(days=random.randint(2, 14)),
            total_amount=Decimal("0"),
        )
        db.add(order)
        await db.flush()

        chosen = random.sample(products, k=random.randint(1, 4))
        total = Decimal("0")
        for product in chosen:
            qty = random.randint(1, 20)
            price = product.selling_price if order_type == OrderType.SALES else product.unit_cost
            db.add(OrderItem(id=uuid.uuid4(), order_id=order.id, product_id=product.id, quantity=qty, unit_price=price))
            total += Decimal(qty) * price
        order.total_amount = total

        for step_i, (label, done) in enumerate(
            [
                ("Order Placed", True),
                ("Packed", fulfillment_status not in ("Pending",)),
                ("Shipped", fulfillment_status in ("Shipped", "In Transit", "Delivered")),
                ("Delivered", fulfillment_status == "Delivered"),
            ]
        ):
            db.add(
                OrderDeliveryStep(
                    id=uuid.uuid4(),
                    order_id=order.id,
                    label=label,
                    step_date=order_date + timedelta(days=step_i * 2) if done else None,
                    is_done=done,
                    sort_order=step_i,
                )
            )
    await db.flush()

    # --- backdated activity feed -----------------------------------------
    # activity_log_insert's RLS with-check requires actor_user_id to equal the
    # session's own app.current_user_id (see migration 0002) — since these rows
    # are attributed to three different demo users, re-SET LOCAL before each one
    # rather than relying on the single owner_id context set above.
    actors = [owner_id, admin_id, member_id]
    for _ in range(random.randint(40, 80)):
        actor = random.choice(actors)
        await db.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(actor)})
        db.add(
            ActivityLog(
                id=uuid.uuid4(),
                organization_id=org_id,
                actor_user_id=actor,
                event_type=random.choice(list(ActivityEventType)).value,
                summary="Demo activity event",
                created_at=datetime.now(UTC) - timedelta(days=random.uniform(0, 60)),
            )
        )
        await db.flush()

    # --- Sellerboard generic content (all 61 routes, real per-org rows) ------
    # app.current_org_id is still set from earlier in this transaction (never
    # touched by the activity-feed loop above); these tables' RLS only checks
    # organization_id via page_id, not the current actor, so no further SET
    # LOCAL is needed here.
    sb_ctx = GenContext(
        rng=random,
        product_names=[p.name for p in products],
        product_skus=[p.sku for p in products],
        supplier_names=[s.name for s in suppliers],
    )
    for route_path, spec in all_page_specs().items():
        content = build_page_rows(sb_ctx, route_path, spec)
        page = SellerboardPageMeta(id=uuid.uuid4(), organization_id=org_id, **content["meta"])
        db.add(page)
        await db.flush()

        for i, kpi in enumerate(content["kpis"]):
            db.add(SellerboardKpiCard(id=uuid.uuid4(), page_id=page.id, sort_order=i, **kpi))

        if content["chart"]:
            db.add(
                SellerboardChartSeries(
                    id=uuid.uuid4(),
                    page_id=page.id,
                    chart_title=content["chart"]["title"],
                    data=content["chart"]["data"],
                    labels=content["chart"]["labels"],
                )
            )

        for i, colspec in enumerate(content["columns"]):
            db.add(SellerboardTableColumn(id=uuid.uuid4(), page_id=page.id, sort_order=i, **colspec))

        for i, row in enumerate(content["rows"]):
            db.add(SellerboardTableRow(id=uuid.uuid4(), page_id=page.id, row_key=str(i), data=row, sort_order=i))

        for i, card in enumerate(content["products"]):
            db.add(SellerboardProductCard(id=uuid.uuid4(), page_id=page.id, sort_order=i, **card))

        for i, group in enumerate(content["settings_groups"]):
            group_row = SellerboardSettingsGroup(
                id=uuid.uuid4(), page_id=page.id, title=group["title"], description=group["description"], sort_order=i
            )
            db.add(group_row)
            await db.flush()
            for j, field_row in enumerate(group["fields"]):
                db.add(SellerboardSettingsField(id=uuid.uuid4(), group_id=group_row.id, sort_order=j, **field_row))

        await db.flush()

    await db.commit()
    print(f"Seeded {org_name} ({org_id}) — owner={owner_email}")
    return org_id


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--orgs", type=int, default=2)
    parser.add_argument("--reset", action="store_true")
    parser.add_argument("--admin-email", default="basit.yousuf.359@gmail.com")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    random.seed(args.seed)

    settings = get_settings()
    if args.reset and settings.is_production:
        print("Refusing --reset against a production ENVIRONMENT setting.")
        sys.exit(1)

    engine = create_async_engine(settings.resolved_migrations_database_url)
    session_factory = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

    async with httpx.AsyncClient(timeout=30) as client, session_factory() as db:
        if args.reset:
            for table in RESET_TABLES:
                await db.execute(text(f"truncate table {table} cascade"))
            await db.commit()
            print("Reset seeded tables.")

        org_ids = []
        for i in range(1, args.orgs + 1):
            owner_email = args.admin_email if i == 1 else None
            org_ids.append(await seed_organization(db, client, settings, i, owner_email))

        # The platform super-admin flag is global, not per-org — the seeded owner
        # of org #1 (or --admin-email) can browse every organization via /admin.
        # users_self_access RLS (0001) requires app.current_user_id = the row's own
        # id for an UPDATE to pass its `with check`, even on this elevated role
        # (FORCE ROW LEVEL SECURITY denies owner-bypass) — set it for this admin.
        admin_id = await create_auth_user(client, settings, args.admin_email)
        await db.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(admin_id)})
        await db.execute(text("update users set is_platform_admin = true where id = :uid"), {"uid": str(admin_id)})
        await db.commit()

    await engine.dispose()
    print(f"\nDone. All seeded users' password: {DEMO_PASSWORD}")
    print(f"Platform super-admin: {args.admin_email}")


if __name__ == "__main__":
    asyncio.run(main())
