import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import OPEN_ORDER_STATUSES, OrderType
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.warehouse import InventoryLocation, Warehouse
from app.schemas.warehouse import MovementOut, WarehouseOut, WarehouseSummaryOut
from app.services.computed_fields import compute_capacity_used_pct


async def list_warehouse_summary(db: AsyncSession, organization_id: uuid.UUID) -> WarehouseSummaryOut:
    warehouses = list(
        (await db.execute(select(Warehouse).where(Warehouse.organization_id == organization_id).order_by(Warehouse.name)))
        .scalars()
        .all()
    )

    agg_result = await db.execute(
        select(
            InventoryLocation.warehouse_id,
            func.count(func.distinct(InventoryLocation.product_id)),
            func.coalesce(func.sum(InventoryLocation.stock), 0),
            func.coalesce(func.sum(InventoryLocation.stock * Product.unit_cost), 0),
        )
        .join(Product, Product.id == InventoryLocation.product_id)
        .where(InventoryLocation.organization_id == organization_id)
        .group_by(InventoryLocation.warehouse_id)
    )
    agg_by_warehouse = {row[0]: row[1:] for row in agg_result.all()}

    warehouse_rows = []
    for w in warehouses:
        product_count, used_units, total_value = agg_by_warehouse.get(w.id, (0, 0, 0))
        warehouse_rows.append(
            WarehouseOut(
                id=w.id,
                name=w.name,
                city=w.city,
                country=w.country,
                status=w.status,
                type=w.type,
                product_count=product_count,
                total_value=float(total_value),
                capacity_used_pct=compute_capacity_used_pct(int(used_units), w.capacity_units),
            )
        )

    qty_subq = (
        select(OrderItem.order_id, func.sum(OrderItem.quantity).label("qty")).group_by(OrderItem.order_id).subquery()
    )

    async def _movements_for(order_type: OrderType, destination_field) -> list[MovementOut]:
        result = await db.execute(
            select(Order, Warehouse.name, qty_subq.c.qty)
            .join(qty_subq, qty_subq.c.order_id == Order.id, isouter=True)
            .join(Warehouse, Warehouse.id == destination_field, isouter=True)
            .where(
                Order.organization_id == organization_id,
                Order.type == order_type.value,
                Order.fulfillment_status.in_(OPEN_ORDER_STATUSES),
            )
            .order_by(Order.order_date.desc())
            .limit(20)
        )
        rows = []
        for order, warehouse_name, qty in result.all():
            label = warehouse_name if order_type == OrderType.TRANSFER else (order.counterparty_name or "—")
            rows.append(
                MovementOut(
                    id=order.id,
                    order_number=order.order_number,
                    counterparty_or_destination=label,
                    warehouse_name=warehouse_name,
                    quantity=int(qty or 0),
                    status=order.fulfillment_status,
                    carrier=order.carrier,
                    eta=order.expected_delivery_date.isoformat() if order.expected_delivery_date else None,
                )
            )
        return rows

    incoming = await _movements_for(OrderType.PURCHASE, Order.destination_warehouse_id)
    outgoing = await _movements_for(OrderType.SALES, Order.source_warehouse_id)
    pending_transfers = await _movements_for(OrderType.TRANSFER, Order.destination_warehouse_id)

    return WarehouseSummaryOut(
        warehouses=warehouse_rows,
        incoming_shipments=incoming,
        outgoing_shipments=outgoing,
        pending_transfers=pending_transfers,
    )
