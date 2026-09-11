import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import OPEN_ORDER_STATUSES, ActivityEventType
from app.core.exceptions import NotFoundError, ValidationAppError
from app.models.order import Order, OrderDeliveryStep, OrderItem
from app.models.product import Product
from app.models.warehouse import Warehouse
from app.schemas.common import Page
from app.schemas.dashboard import KpiCardOut
from app.schemas.order import CarrierPerformanceOut, DeliveryStepOut, OrderCreate, OrderItemOut, OrderOut
from app.services.activity_service import log_activity
from app.services.computed_fields import compute_order_total


async def _to_order_out(db: AsyncSession, order: Order) -> OrderOut:
    items_result = await db.execute(
        select(OrderItem, Product.name, Product.sku).join(Product, Product.id == OrderItem.product_id).where(
            OrderItem.order_id == order.id
        )
    )
    items = [
        OrderItemOut(
            product_id=item.product_id,
            product_name=name,
            sku=sku,
            quantity=item.quantity,
            unit_price=item.unit_price,
            line_total=item.line_total,
        )
        for item, name, sku in items_result.all()
    ]

    steps_result = await db.execute(
        select(OrderDeliveryStep).where(OrderDeliveryStep.order_id == order.id).order_by(OrderDeliveryStep.sort_order)
    )
    delivery_steps = [
        DeliveryStepOut(label=s.label, date=s.step_date, done=s.is_done) for s in steps_result.scalars().all()
    ]

    warehouse_id = order.destination_warehouse_id or order.source_warehouse_id
    warehouse_name = None
    if warehouse_id:
        warehouse = await db.get(Warehouse, warehouse_id)
        warehouse_name = warehouse.name if warehouse else None

    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        type=order.type,
        counterparty_name=order.counterparty_name,
        order_date=order.order_date,
        warehouse_name=warehouse_name,
        total_amount=order.total_amount,
        payment_status=order.payment_status,
        fulfillment_status=order.fulfillment_status,
        priority=order.priority,
        carrier=order.carrier,
        tracking_number=order.tracking_number,
        items=items,
        delivery_steps=delivery_steps,
    )


async def list_orders(
    db: AsyncSession, organization_id: uuid.UUID, *, page: int, page_size: int, order_type: str | None
) -> Page[OrderOut]:
    query = select(Order).where(Order.organization_id == organization_id)
    if order_type:
        query = query.where(Order.type == order_type)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar_one()
    result = await db.execute(query.order_by(Order.order_date.desc()).offset((page - 1) * page_size).limit(page_size))
    orders = list(result.scalars().all())

    items = [await _to_order_out(db, order) for order in orders]
    return Page[OrderOut](items=items, total=total, page=page, page_size=page_size)


async def get_order(db: AsyncSession, organization_id: uuid.UUID, order_id: uuid.UUID) -> OrderOut:
    order = await db.get(Order, order_id)
    if order is None or order.organization_id != organization_id:
        raise NotFoundError("Order not found")
    return await _to_order_out(db, order)


async def create_order(
    db: AsyncSession, organization_id: uuid.UUID, actor_user_id: uuid.UUID, payload: OrderCreate
) -> OrderOut:
    product_ids = [item.product_id for item in payload.items]
    products_result = await db.execute(
        select(Product.id).where(Product.organization_id == organization_id, Product.id.in_(product_ids))
    )
    found_ids = {row[0] for row in products_result.all()}
    missing = set(product_ids) - found_ids
    if missing:
        raise ValidationAppError(f"Unknown product id(s): {', '.join(str(m) for m in missing)}")

    total_amount = compute_order_total([(item.quantity, item.unit_price) for item in payload.items])

    order = Order(
        id=uuid.uuid4(),
        organization_id=organization_id,
        order_number=payload.order_number,
        type=payload.type.value,
        counterparty_name=payload.counterparty_name,
        source_warehouse_id=payload.source_warehouse_id,
        destination_warehouse_id=payload.destination_warehouse_id,
        order_date=payload.order_date,
        payment_status=payload.payment_status,
        fulfillment_status=payload.fulfillment_status,
        priority=payload.priority.value,
        carrier=payload.carrier,
        tracking_number=payload.tracking_number,
        expected_delivery_date=payload.expected_delivery_date,
        total_amount=total_amount,
    )
    db.add(order)
    await db.flush()

    for item in payload.items:
        db.add(
            OrderItem(
                id=uuid.uuid4(), order_id=order.id, product_id=item.product_id, quantity=item.quantity, unit_price=item.unit_price
            )
        )

    await log_activity(
        db,
        actor_user_id=actor_user_id,
        event_type=ActivityEventType.ORDER_CREATED,
        summary=f"Created {payload.type.value.lower()} order {order.order_number}",
        organization_id=organization_id,
        metadata={"order_id": str(order.id), "total_amount": str(total_amount)},
    )
    await db.flush()
    await db.commit()
    return await get_order(db, organization_id, order.id)


async def get_order_kpis(db: AsyncSession, organization_id: uuid.UUID) -> list[KpiCardOut]:
    total_count = (
        await db.execute(select(func.count()).where(Order.organization_id == organization_id))
    ).scalar_one()
    open_count = (
        await db.execute(
            select(func.count()).where(
                Order.organization_id == organization_id, Order.fulfillment_status.in_(OPEN_ORDER_STATUSES)
            )
        )
    ).scalar_one()
    total_value = (
        await db.execute(select(func.coalesce(func.sum(Order.total_amount), 0)).where(Order.organization_id == organization_id))
    ).scalar_one()
    avg_value = float(total_value) / total_count if total_count else 0.0

    return [
        KpiCardOut(label="Total Orders", value=str(total_count)),
        KpiCardOut(label="Open Orders", value=str(open_count)),
        KpiCardOut(label="Total Order Value", value=f"${float(total_value):,.2f}"),
        KpiCardOut(label="Avg. Order Value", value=f"${avg_value:,.2f}"),
    ]


async def get_carrier_performance(db: AsyncSession, organization_id: uuid.UUID) -> list[CarrierPerformanceOut]:
    # "On-time" and average lead-time are computed in Python from the raw rows
    # below rather than in SQL, since they depend on comparing two dates per row
    # (expected_delivery_date - order_date) and a status string match — clearer as
    # a Python loop than a dialect-specific aggregate expression.
    orders_result = await db.execute(
        select(Order.carrier, Order.fulfillment_status, Order.order_date, Order.expected_delivery_date).where(
            Order.organization_id == organization_id, Order.carrier.is_not(None)
        )
    )
    by_carrier: dict[str, list] = {}
    for carrier, fulfillment_status, order_date, expected_delivery_date in orders_result.all():
        by_carrier.setdefault(carrier, []).append((fulfillment_status, order_date, expected_delivery_date))

    out = []
    for carrier, rows in by_carrier.items():
        delivered = sum(1 for status, _, _ in rows if status == "Delivered")
        on_time_pct = round((delivered / len(rows)) * 100, 1) if rows else 0.0
        lead_times = [
            (expected - order_date).days for _, order_date, expected in rows if expected is not None
        ]
        avg_days = round(sum(lead_times) / len(lead_times), 1) if lead_times else 0.0
        out.append(CarrierPerformanceOut(name=carrier, on_time_pct=on_time_pct, avg_days=avg_days, shipments=len(rows)))

    return sorted(out, key=lambda c: c.shipments, reverse=True)
