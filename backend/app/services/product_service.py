import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import ActivityEventType
from app.core.exceptions import ConflictError, NotFoundError
from app.models.product import Product, ProductFbaFees, ProductSpec
from app.models.supplier import ProductSupplier, Supplier
from app.models.warehouse import InventoryLocation, Warehouse
from app.schemas.common import Page
from app.schemas.dashboard import KpiCardOut
from app.schemas.product import (
    ProductCreate,
    ProductDetailOut,
    ProductFbaFeesOut,
    ProductListItemOut,
    ProductSpecOut,
    ProductUpdate,
    WarehouseDistributionOut,
)
from app.services.activity_service import log_activity
from app.services.computed_fields import compute_available, compute_stock_status, compute_total_value


async def _stock_totals(db: AsyncSession, organization_id: uuid.UUID, product_ids: list[uuid.UUID]) -> dict:
    if not product_ids:
        return {}
    result = await db.execute(
        select(
            InventoryLocation.product_id,
            func.coalesce(func.sum(InventoryLocation.stock), 0),
            func.coalesce(func.sum(InventoryLocation.reserved), 0),
        )
        .where(InventoryLocation.organization_id == organization_id, InventoryLocation.product_id.in_(product_ids))
        .group_by(InventoryLocation.product_id)
    )
    return {row[0]: (row[1], row[2]) for row in result.all()}


def _to_list_item(product: Product, stock: int, reserved: int) -> ProductListItemOut:
    available = compute_available(stock, reserved)
    return ProductListItemOut(
        id=product.id,
        sku=product.sku,
        name=product.name,
        category=product.category,
        brand=product.brand,
        icon=product.icon,
        stock=stock,
        reserved=reserved,
        available=available,
        reorder_point=product.reorder_point,
        unit_cost=product.unit_cost,
        selling_price=product.selling_price,
        total_value=compute_total_value(stock, product.unit_cost),
        status=compute_stock_status(stock, reserved, product.reorder_point).value,
        fulfillment_type=product.fulfillment_type,
        updated_at=product.updated_at,
    )


async def list_products(
    db: AsyncSession, organization_id: uuid.UUID, *, page: int, page_size: int, q: str | None, status: str | None
) -> Page[ProductListItemOut]:
    query = select(Product).where(Product.organization_id == organization_id, Product.deleted_at.is_(None))
    if q:
        like = f"%{q}%"
        query = query.where((Product.name.ilike(like)) | (Product.sku.ilike(like)))

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    result = await db.execute(query.order_by(Product.name).offset((page - 1) * page_size).limit(page_size))
    products = list(result.scalars().all())

    stock_by_product = await _stock_totals(db, organization_id, [p.id for p in products])
    items = []
    for product in products:
        stock, reserved = stock_by_product.get(product.id, (0, 0))
        item = _to_list_item(product, stock, reserved)
        if status and item.status != status:
            continue
        items.append(item)

    return Page[ProductListItemOut](items=items, total=total, page=page, page_size=page_size)


async def get_inventory_kpis(db: AsyncSession, organization_id: uuid.UUID) -> list[KpiCardOut]:
    result = await db.execute(
        select(Product).where(Product.organization_id == organization_id, Product.deleted_at.is_(None))
    )
    products = list(result.scalars().all())
    stock_by_product = await _stock_totals(db, organization_id, [p.id for p in products])

    total_value = 0.0
    low_stock = 0
    out_of_stock = 0
    for product in products:
        stock, reserved = stock_by_product.get(product.id, (0, 0))
        status = compute_stock_status(stock, reserved, product.reorder_point)
        total_value += float(stock) * float(product.unit_cost)
        if status.value == "Low Stock":
            low_stock += 1
        elif status.value == "Out of Stock":
            out_of_stock += 1

    return [
        KpiCardOut(label="Total SKUs", value=str(len(products))),
        KpiCardOut(label="In-Stock Value", value=f"${total_value:,.2f}"),
        KpiCardOut(label="Low Stock", value=str(low_stock)),
        KpiCardOut(label="Out of Stock", value=str(out_of_stock)),
    ]


async def get_low_stock_products(db: AsyncSession, organization_id: uuid.UUID) -> list[ProductListItemOut]:
    result = await db.execute(
        select(Product).where(Product.organization_id == organization_id, Product.deleted_at.is_(None))
    )
    products = list(result.scalars().all())
    stock_by_product = await _stock_totals(db, organization_id, [p.id for p in products])

    items = []
    for product in products:
        stock, reserved = stock_by_product.get(product.id, (0, 0))
        item = _to_list_item(product, stock, reserved)
        if item.status in ("Low Stock", "Out of Stock"):
            items.append(item)
    return items


async def get_product_detail(db: AsyncSession, organization_id: uuid.UUID, product_id: uuid.UUID) -> ProductDetailOut:
    product = await db.get(Product, product_id)
    if product is None or product.organization_id != organization_id or product.deleted_at is not None:
        raise NotFoundError("Product not found")

    stock_by_product = await _stock_totals(db, organization_id, [product.id])
    stock, reserved = stock_by_product.get(product.id, (0, 0))
    list_item = _to_list_item(product, stock, reserved)

    specs_result = await db.execute(
        select(ProductSpec).where(ProductSpec.product_id == product.id).order_by(ProductSpec.sort_order)
    )
    specs = [ProductSpecOut(label=s.label, value=s.value) for s in specs_result.scalars().all()]

    fba_fees_row = await db.get(ProductFbaFees, product.id)
    fba_fees = None
    if fba_fees_row is not None:
        total = fba_fees_row.referral + fba_fees_row.fulfillment + fba_fees_row.storage + fba_fees_row.long_term
        fba_fees = ProductFbaFeesOut(
            referral=fba_fees_row.referral,
            fulfillment=fba_fees_row.fulfillment,
            storage=fba_fees_row.storage,
            long_term=fba_fees_row.long_term,
            total=total,
        )

    dist_result = await db.execute(
        select(InventoryLocation, Warehouse.name)
        .join(Warehouse, Warehouse.id == InventoryLocation.warehouse_id)
        .where(InventoryLocation.organization_id == organization_id, InventoryLocation.product_id == product.id)
    )
    distribution = [
        WarehouseDistributionOut(
            warehouse_id=loc.warehouse_id,
            warehouse_name=name,
            location_code=loc.location_code,
            stock=loc.stock,
            reserved=loc.reserved,
            available=compute_available(loc.stock, loc.reserved),
            status=compute_stock_status(loc.stock, loc.reserved, product.reorder_point).value,
        )
        for loc, name in dist_result.all()
    ]

    supplier_result = await db.execute(
        select(Supplier.name)
        .join(ProductSupplier, ProductSupplier.supplier_id == Supplier.id)
        .where(ProductSupplier.product_id == product.id, ProductSupplier.is_primary.is_(True))
        .limit(1)
    )
    primary_supplier = supplier_result.scalar_one_or_none()

    margin_pct = None
    if product.selling_price:
        margin_pct = round(float((product.selling_price - product.unit_cost) / product.selling_price) * 100, 1)

    return ProductDetailOut(
        **list_item.model_dump(),
        description=product.description,
        barcode=product.barcode,
        unit=product.unit,
        margin_pct=margin_pct,
        primary_supplier=primary_supplier,
        fba_fees=fba_fees,
        specs=specs,
        warehouse_distribution=distribution,
    )


async def create_product(
    db: AsyncSession, organization_id: uuid.UUID, actor_user_id: uuid.UUID, payload: ProductCreate
) -> ProductDetailOut:
    product = Product(id=uuid.uuid4(), organization_id=organization_id, **payload.model_dump())
    db.add(product)
    try:
        await db.flush()
    except Exception as exc:
        raise ConflictError(f"SKU {payload.sku!r} is already in use") from exc

    await log_activity(
        db,
        actor_user_id=actor_user_id,
        event_type=ActivityEventType.PRODUCT_CREATED,
        summary=f"Created product {product.name!r} ({product.sku})",
        organization_id=organization_id,
        metadata={"product_id": str(product.id)},
    )
    await db.commit()
    return await get_product_detail(db, organization_id, product.id)


async def update_product(
    db: AsyncSession, organization_id: uuid.UUID, actor_user_id: uuid.UUID, product_id: uuid.UUID, payload: ProductUpdate
) -> ProductDetailOut:
    product = await db.get(Product, product_id)
    if product is None or product.organization_id != organization_id or product.deleted_at is not None:
        raise NotFoundError("Product not found")

    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(product, field, value)

    if changes:
        await log_activity(
            db,
            actor_user_id=actor_user_id,
            event_type=ActivityEventType.PRODUCT_UPDATED,
            summary=f"Updated product {product.name!r} ({product.sku})",
            organization_id=organization_id,
            metadata={"product_id": str(product.id), "fields": list(changes.keys())},
        )
    await db.commit()
    return await get_product_detail(db, organization_id, product.id)
