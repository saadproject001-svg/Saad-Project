import uuid
from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import OPEN_ORDER_STATUSES
from app.models.order import Order
from app.models.product import Product
from app.models.supplier import ProductSupplier, Supplier
from app.models.warehouse import InventoryLocation, Warehouse
from app.schemas.dashboard import BreakdownSliceOut, DashboardSummaryOut, KpiCardOut, TopProductOut, TrendPointOut
from app.services.computed_fields import compute_stock_status


async def get_dashboard_summary(db: AsyncSession, organization_id: uuid.UUID) -> DashboardSummaryOut:
    products = list(
        (
            await db.execute(
                select(Product).where(Product.organization_id == organization_id, Product.deleted_at.is_(None))
            )
        )
        .scalars()
        .all()
    )

    stock_result = await db.execute(
        select(
            InventoryLocation.product_id,
            func.coalesce(func.sum(InventoryLocation.stock), 0),
            func.coalesce(func.sum(InventoryLocation.reserved), 0),
        )
        .where(InventoryLocation.organization_id == organization_id)
        .group_by(InventoryLocation.product_id)
    )
    stock_by_product = {row[0]: (row[1], row[2]) for row in stock_result.all()}

    total_stock_value = 0.0
    low_stock_count = 0
    category_stock: dict[str, int] = {}
    top_products: list[TopProductOut] = []

    for product in products:
        stock, reserved = stock_by_product.get(product.id, (0, 0))
        status = compute_stock_status(stock, reserved, product.reorder_point)
        total_stock_value += float(stock) * float(product.unit_cost)
        if status.value in ("Low Stock", "Out of Stock"):
            low_stock_count += 1
        category = product.category or "Uncategorized"
        category_stock[category] = category_stock.get(category, 0) + stock
        top_products.append(TopProductOut(sku=product.sku, name=product.name, category=product.category, stock=stock, status=status.value))

    top_products.sort(key=lambda p: p.stock, reverse=True)
    top_products = top_products[:5]

    total_category_stock = sum(category_stock.values()) or 1
    stock_by_category = [
        BreakdownSliceOut(name=name, value=value, pct=round(value / total_category_stock * 100, 1))
        for name, value in sorted(category_stock.items(), key=lambda kv: kv[1], reverse=True)
    ]

    supplier_stock_result = await db.execute(
        select(Supplier.name, func.coalesce(func.sum(InventoryLocation.stock), 0))
        .select_from(ProductSupplier)
        .join(Supplier, Supplier.id == ProductSupplier.supplier_id)
        .join(InventoryLocation, InventoryLocation.product_id == ProductSupplier.product_id)
        .where(Supplier.organization_id == organization_id, InventoryLocation.organization_id == organization_id)
        .group_by(Supplier.name)
    )
    supplier_rows = supplier_stock_result.all()
    total_supplier_stock = sum(v for _, v in supplier_rows) or 1
    quantity_by_supplier = [
        BreakdownSliceOut(name=name, value=value, pct=round(value / total_supplier_stock * 100, 1))
        for name, value in sorted(supplier_rows, key=lambda kv: kv[1], reverse=True)
    ]

    open_orders_count = (
        await db.execute(
            select(func.count()).where(
                Order.organization_id == organization_id, Order.fulfillment_status.in_(OPEN_ORDER_STATUSES)
            )
        )
    ).scalar_one()

    kpis = [
        KpiCardOut(label="Total Products", value=str(len(products))),
        KpiCardOut(label="Total Stock Value", value=f"${total_stock_value:,.2f}"),
        KpiCardOut(label="Low Stock Items", value=str(low_stock_count)),
        KpiCardOut(label="Open Orders", value=str(open_orders_count)),
    ]

    warehouse_stock_result = await db.execute(
        select(Warehouse.name, func.coalesce(func.sum(InventoryLocation.stock), 0))
        .select_from(InventoryLocation)
        .join(Warehouse, Warehouse.id == InventoryLocation.warehouse_id)
        .where(InventoryLocation.organization_id == organization_id)
        .group_by(Warehouse.name)
    )
    warehouse_rows = warehouse_stock_result.all()
    total_warehouse_stock = sum(v for _, v in warehouse_rows) or 1
    stock_by_warehouse = [
        BreakdownSliceOut(name=name, value=value, pct=round(value / total_warehouse_stock * 100, 1))
        for name, value in sorted(warehouse_rows, key=lambda kv: kv[1], reverse=True)
    ]

    fulfillment_counts: dict[str, int] = {}
    for product in products:
        key = product.fulfillment_type or "Unspecified"
        fulfillment_counts[key] = fulfillment_counts.get(key, 0) + 1
    total_fulfillment = sum(fulfillment_counts.values()) or 1
    fulfillment_mix = [
        BreakdownSliceOut(name=name, value=value, pct=round(value / total_fulfillment * 100, 1))
        for name, value in sorted(fulfillment_counts.items(), key=lambda kv: kv[1], reverse=True)
    ]

    order_type_result = await db.execute(
        select(Order.type, func.count()).where(Order.organization_id == organization_id).group_by(Order.type)
    )
    order_type_rows = order_type_result.all()
    total_orders_typed = sum(v for _, v in order_type_rows) or 1
    order_type_mix = [
        BreakdownSliceOut(name=name, value=value, pct=round(value / total_orders_typed * 100, 1))
        for name, value in sorted(order_type_rows, key=lambda kv: kv[1], reverse=True)
    ]

    # Trailing 6 calendar months of order volume, oldest first — grouped in Python
    # rather than a SQL date_trunc so the label formatting stays dialect-agnostic.
    today = date.today()
    month_starts = []
    cursor = today.replace(day=1)
    for _ in range(6):
        month_starts.append(cursor)
        cursor = (cursor - timedelta(days=1)).replace(day=1)
    month_starts.reverse()
    range_start = month_starts[0]

    orders_in_range = (
        await db.execute(
            select(Order.order_date).where(Order.organization_id == organization_id, Order.order_date >= range_start)
        )
    ).scalars().all()

    monthly_order_volume = []
    for i, month_start in enumerate(month_starts):
        next_month = month_starts[i + 1] if i + 1 < len(month_starts) else (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
        count = sum(1 for d in orders_in_range if month_start <= d < next_month)
        monthly_order_volume.append(TrendPointOut(label=month_start.strftime("%b %y"), value=count))

    return DashboardSummaryOut(
        kpis=kpis,
        stock_by_category=stock_by_category,
        stock_by_warehouse=stock_by_warehouse,
        quantity_by_supplier=quantity_by_supplier,
        fulfillment_mix=fulfillment_mix,
        order_type_mix=order_type_mix,
        monthly_order_volume=monthly_order_volume,
        top_products=top_products,
    )
