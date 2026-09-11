import uuid
from decimal import Decimal

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class SupplierOut(ORMModel):
    id: uuid.UUID
    name: str
    icon: str | None
    contact_name: str | None
    email: str | None
    phone: str | None
    country: str | None
    lead_time_days: int
    rating: Decimal
    status: str
    product_count: int
    order_count: int
    purchase_value: Decimal


class SupplierCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    icon: str | None = Field(default=None, max_length=10)
    contact_name: str | None = Field(default=None, max_length=200)
    email: str | None = Field(default=None, max_length=320)
    phone: str | None = Field(default=None, max_length=50)
    country: str | None = Field(default=None, max_length=100)
    lead_time_days: int = 0
    rating: Decimal = Decimal("0")
    status: str = Field(default="Active", max_length=50)
