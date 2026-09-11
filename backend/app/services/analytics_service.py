import uuid
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import OrderType
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.analytics import AnalyticsSummaryOut, ProductProfitabilityOut
from app.schemas.dashboard import KpiCardOut


async def get_analytics_summary(db: AsyncSession, organization_id: uuid.UUID) -> AnalyticsSummaryOut:
    # Pre-filter order_items to Sales orders only, THEN outer-join to Product — doing
    # the type filter inside a subquery (rather than as an ON-clause condition on a
    # join straight from OrderItem) means Purchase/Transfer order_items are excluded
    # from the aggregate entirely, not merely left with a NULL Order match while
    # their quantity/line_total still get summed.
    sales_items = (
        select(OrderItem.product_id, OrderItem.quantity, OrderItem.line_total)
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.organization_id == organization_id, Order.type == OrderType.SALES.value)
        .subquery()
    )

    result = await db.execute(
        select(
            Product.id,
            Product.name,
            Product.sku,
            Product.unit_cost,
            func.coalesce(func.sum(sales_items.c.quantity), 0),
            func.coalesce(func.sum(sales_items.c.line_total), 0),
        )
        .select_from(Product)
        .outerjoin(sales_items, sales_items.c.product_id == Product.id)
        .where(Product.organization_id == organization_id, Product.deleted_at.is_(None))
        .group_by(Product.id, Product.name, Product.sku, Product.unit_cost)
    )

    rows = []
    total_revenue = Decimal("0")
    total_profit = Decimal("0")
    total_units = 0
    for _product_id, name, sku, unit_cost, units_sold, revenue in result.all():
        if units_sold == 0:
            continue
        cost = Decimal(units_sold) * unit_cost
        net_profit = revenue - cost
        margin_pct = round(float(net_profit / revenue) * 100, 1) if revenue else None
        rows.append(
            ProductProfitabilityOut(
                name=name, sku=sku, units_sold=units_sold, revenue=revenue, net_profit=net_profit, margin_pct=margin_pct
            )
        )
        total_revenue += revenue
        total_profit += net_profit
        total_units += units_sold

    rows.sort(key=lambda r: r.revenue, reverse=True)

    overall_margin = round(float(total_profit / total_revenue) * 100, 1) if total_revenue else 0.0
    kpis = [
        KpiCardOut(label="Total Revenue", value=f"${total_revenue:,.2f}"),
        KpiCardOut(label="Net Profit", value=f"${total_profit:,.2f}"),
        KpiCardOut(label="Overall Margin", value=f"{overall_margin}%"),
        KpiCardOut(label="Units Sold", value=str(total_units)),
    ]

    return AnalyticsSummaryOut(kpis=kpis, product_profitability=rows[:20])
