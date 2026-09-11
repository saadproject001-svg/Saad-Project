from pydantic import BaseModel


class SellerboardKpiOut(BaseModel):
    label: str
    value: str
    delta: str | None = None
    tone: str | None = None
    bar: int | None = None
    note: str | None = None


class SellerboardChartOut(BaseModel):
    data: list[float]
    labels: list[str]
    title: str


class SellerboardColumnOut(BaseModel):
    key: str
    header: str
    type: str | None = None


class SellerboardTableOut(BaseModel):
    columns: list[SellerboardColumnOut]
    rows: list[dict]


class SellerboardProductStatOut(BaseModel):
    label: str
    value: str


class SellerboardProductCardOut(BaseModel):
    name: str
    sku: str | None
    status: str | None
    stats: list[SellerboardProductStatOut]


class SellerboardSettingsFieldOut(BaseModel):
    label: str
    description: str | None = None
    type: str
    value: bool | str | None = None
    options: list[str] | None = None


class SellerboardSettingsGroupOut(BaseModel):
    title: str
    description: str | None = None
    fields: list[SellerboardSettingsFieldOut]


class SellerboardPageOut(BaseModel):
    badge: str | None
    title: str
    subtitle: str | None
    variant: str | None
    table_title: str | None
    kpis: list[SellerboardKpiOut] | None = None
    chart: SellerboardChartOut | None = None
    table: SellerboardTableOut | None = None
    products: list[SellerboardProductCardOut] | None = None
    settings: list[SellerboardSettingsGroupOut] | None = None
