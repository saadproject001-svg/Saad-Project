from decimal import Decimal

from pydantic import BaseModel

from app.schemas.dashboard import KpiCardOut


class ProductProfitabilityOut(BaseModel):
    name: str
    sku: str
    units_sold: int
    revenue: Decimal
    net_profit: Decimal
    margin_pct: float | None


class AnalyticsSummaryOut(BaseModel):
    kpis: list[KpiCardOut]
    product_profitability: list[ProductProfitabilityOut]
