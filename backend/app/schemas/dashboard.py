from pydantic import BaseModel


class KpiCardOut(BaseModel):
    label: str
    value: str
    delta: str | None = None
    trend: str | None = None  # "up" | "down"


class BreakdownSliceOut(BaseModel):
    name: str
    value: int
    pct: float


class TopProductOut(BaseModel):
    sku: str
    name: str
    category: str | None
    stock: int
    status: str


class TrendPointOut(BaseModel):
    label: str
    value: float


class DashboardSummaryOut(BaseModel):
    kpis: list[KpiCardOut]
    stock_by_category: list[BreakdownSliceOut]
    stock_by_warehouse: list[BreakdownSliceOut]
    quantity_by_supplier: list[BreakdownSliceOut]
    fulfillment_mix: list[BreakdownSliceOut]
    order_type_mix: list[BreakdownSliceOut]
    monthly_order_volume: list[TrendPointOut]
    top_products: list[TopProductOut]
