import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity_log import ActivityLog
from app.models.order import Order
from app.models.organization import Organization
from app.models.product import Product
from app.models.user import TeamMembership, User
from app.models.warehouse import InventoryLocation
from app.schemas.admin import AdminActivityOut, AdminOrderOut, AdminOrganizationOut, AdminProductOut, AdminUserOut
from app.schemas.common import Page
from app.services.computed_fields import compute_stock_status

# Every query in this module runs on app.dependencies.get_platform_admin_db — a
# session with app.is_platform_admin = 'true' and NO app.current_org_id. The
# platform_admin_bypass_<table> RLS policies (migrations 0002/0003) grant
# unrestricted SELECT across every organization to that session, which is what
# makes an unfiltered (or admin-supplied organization_id-filtered) query here
# return cross-tenant results instead of the empty set an ordinary session
# would see.


async def list_organizations(db: AsyncSession) -> list[AdminOrganizationOut]:
    result = await db.execute(
        select(Organization, func.count(TeamMembership.id))
        .outerjoin(TeamMembership, TeamMembership.organization_id == Organization.id)
        .group_by(Organization.id)
        .order_by(Organization.created_at.desc())
    )
    return [
        AdminOrganizationOut(id=org.id, name=org.name, slug=org.slug, member_count=count, created_at=org.created_at)
        for org, count in result.all()
    ]


async def list_users(db: AsyncSession, *, page: int, page_size: int) -> Page[AdminUserOut]:
    total = (await db.execute(select(func.count()).select_from(User))).scalar_one()
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    )
    users = list(result.scalars().all())

    org_names_by_user: dict[uuid.UUID, list[str]] = {}
    if users:
        rows = await db.execute(
            select(TeamMembership.user_id, Organization.name)
            .join(Organization, Organization.id == TeamMembership.organization_id)
            .where(TeamMembership.user_id.in_([u.id for u in users]))
        )
        for user_id, org_name in rows.all():
            org_names_by_user.setdefault(user_id, []).append(org_name)

    items = [
        AdminUserOut(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            is_platform_admin=u.is_platform_admin,
            last_login_at=u.last_login_at,
            organizations=org_names_by_user.get(u.id, []),
            created_at=u.created_at,
        )
        for u in users
    ]
    return Page[AdminUserOut](items=items, total=total, page=page, page_size=page_size)


async def list_activity(
    db: AsyncSession, *, page: int, page_size: int, organization_id: uuid.UUID | None, event_type: str | None
) -> Page[AdminActivityOut]:
    query = select(ActivityLog)
    if organization_id:
        query = query.where(ActivityLog.organization_id == organization_id)
    if event_type:
        query = query.where(ActivityLog.event_type == event_type)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar_one()
    result = await db.execute(query.order_by(ActivityLog.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    entries = list(result.scalars().all())

    org_ids = {e.organization_id for e in entries if e.organization_id}
    actor_ids = {e.actor_user_id for e in entries if e.actor_user_id}
    org_names = {}
    if org_ids:
        rows = await db.execute(select(Organization.id, Organization.name).where(Organization.id.in_(org_ids)))
        org_names = dict(rows.all())
    actor_emails = {}
    if actor_ids:
        rows = await db.execute(select(User.id, User.email).where(User.id.in_(actor_ids)))
        actor_emails = dict(rows.all())

    items = [
        AdminActivityOut(
            id=e.id,
            organization_id=e.organization_id,
            organization_name=org_names.get(e.organization_id),
            actor_email=actor_emails.get(e.actor_user_id),
            event_type=e.event_type,
            summary=e.summary,
            created_at=e.created_at,
        )
        for e in entries
    ]
    return Page[AdminActivityOut](items=items, total=total, page=page, page_size=page_size)


async def list_orders(db: AsyncSession, *, page: int, page_size: int, organization_id: uuid.UUID | None) -> Page[AdminOrderOut]:
    query = select(Order)
    if organization_id:
        query = query.where(Order.organization_id == organization_id)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar_one()
    result = await db.execute(query.order_by(Order.order_date.desc()).offset((page - 1) * page_size).limit(page_size))
    orders = list(result.scalars().all())

    org_ids = {o.organization_id for o in orders}
    org_names = {}
    if org_ids:
        rows = await db.execute(select(Organization.id, Organization.name).where(Organization.id.in_(org_ids)))
        org_names = dict(rows.all())

    items = [
        AdminOrderOut(
            id=o.id,
            organization_id=o.organization_id,
            organization_name=org_names.get(o.organization_id, "—"),
            order_number=o.order_number,
            type=o.type,
            counterparty_name=o.counterparty_name,
            total_amount=o.total_amount,
            fulfillment_status=o.fulfillment_status,
            order_date=o.order_date,
        )
        for o in orders
    ]
    return Page[AdminOrderOut](items=items, total=total, page=page, page_size=page_size)


async def list_products(db: AsyncSession, *, page: int, page_size: int, organization_id: uuid.UUID | None) -> Page[AdminProductOut]:
    query = select(Product).where(Product.deleted_at.is_(None))
    if organization_id:
        query = query.where(Product.organization_id == organization_id)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar_one()
    result = await db.execute(query.order_by(Product.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    products = list(result.scalars().all())

    org_ids = {p.organization_id for p in products}
    org_names = {}
    if org_ids:
        rows = await db.execute(select(Organization.id, Organization.name).where(Organization.id.in_(org_ids)))
        org_names = dict(rows.all())

    stock_by_product: dict[uuid.UUID, int] = {}
    if products:
        rows = await db.execute(
            select(InventoryLocation.product_id, func.coalesce(func.sum(InventoryLocation.stock), 0))
            .where(InventoryLocation.product_id.in_([p.id for p in products]))
            .group_by(InventoryLocation.product_id)
        )
        stock_by_product = dict(rows.all())

    items = []
    for p in products:
        stock = stock_by_product.get(p.id, 0)
        items.append(
            AdminProductOut(
                id=p.id,
                organization_id=p.organization_id,
                organization_name=org_names.get(p.organization_id, "—"),
                sku=p.sku,
                name=p.name,
                stock=stock,
                unit_cost=p.unit_cost,
                status=compute_stock_status(stock, 0, p.reorder_point).value,
            )
        )
    return Page[AdminProductOut](items=items, total=total, page=page, page_size=page_size)
