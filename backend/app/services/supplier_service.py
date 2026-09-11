import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import OrderType
from app.models.order import Order
from app.models.supplier import ProductSupplier, Supplier
from app.schemas.supplier import SupplierCreate, SupplierOut


async def list_suppliers(db: AsyncSession, organization_id: uuid.UUID) -> list[SupplierOut]:
    suppliers = list(
        (await db.execute(select(Supplier).where(Supplier.organization_id == organization_id).order_by(Supplier.name)))
        .scalars()
        .all()
    )

    product_counts = dict(
        (
            await db.execute(
                select(ProductSupplier.supplier_id, func.count())
                .where(ProductSupplier.supplier_id.in_([s.id for s in suppliers]))
                .group_by(ProductSupplier.supplier_id)
            )
        ).all()
    )

    # Purchase orders are matched to a supplier by name (this schema has no
    # supplier_id FK on orders — counterparty_name is a free-text snapshot, same as
    # a real PO would capture "who we ordered from" at the time, independent of the
    # suppliers table changing later).
    order_stats = dict(
        (
            await db.execute(
                select(Order.counterparty_name, func.count(), func.coalesce(func.sum(Order.total_amount), 0))
                .where(Order.organization_id == organization_id, Order.type == OrderType.PURCHASE.value)
                .group_by(Order.counterparty_name)
            )
        ).all()
    )

    out = []
    for s in suppliers:
        order_count, purchase_value = order_stats.get(s.name, (0, 0))
        out.append(
            SupplierOut(
                id=s.id,
                name=s.name,
                icon=s.icon,
                contact_name=s.contact_name,
                email=s.email,
                phone=s.phone,
                country=s.country,
                lead_time_days=s.lead_time_days,
                rating=s.rating,
                status=s.status,
                product_count=product_counts.get(s.id, 0),
                order_count=order_count,
                purchase_value=purchase_value,
            )
        )
    return out


async def create_supplier(db: AsyncSession, organization_id: uuid.UUID, payload: SupplierCreate) -> SupplierOut:
    supplier = Supplier(id=uuid.uuid4(), organization_id=organization_id, **payload.model_dump())
    db.add(supplier)
    await db.commit()
    return SupplierOut(
        id=supplier.id,
        name=supplier.name,
        icon=supplier.icon,
        contact_name=supplier.contact_name,
        email=supplier.email,
        phone=supplier.phone,
        country=supplier.country,
        lead_time_days=supplier.lead_time_days,
        rating=supplier.rating,
        status=supplier.status,
        product_count=0,
        order_count=0,
        purchase_value=0,
    )
