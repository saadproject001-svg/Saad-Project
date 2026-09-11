import uuid
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field

from app.core.constants import OrderType, Priority


class OrderItemOut(BaseModel):
    product_id: uuid.UUID
    product_name: str
    sku: str
    quantity: int
    unit_price: Decimal
    line_total: Decimal


class DeliveryStepOut(BaseModel):
    label: str
    date: date | None
    done: bool


class OrderOut(BaseModel):
    id: uuid.UUID
    order_number: str
    type: str
    counterparty_name: str | None
    order_date: date
    warehouse_name: str | None
    total_amount: Decimal
    payment_status: str | None
    fulfillment_status: str
    priority: str
    carrier: str | None
    tracking_number: str | None
    items: list[OrderItemOut]
    delivery_steps: list[DeliveryStepOut]


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(ge=0)


class OrderCreate(BaseModel):
    order_number: str = Field(min_length=1, max_length=50)
    type: OrderType
    counterparty_name: str | None = Field(default=None, max_length=200)
    source_warehouse_id: uuid.UUID | None = None
    destination_warehouse_id: uuid.UUID | None = None
    order_date: date
    payment_status: str | None = None
    fulfillment_status: str
    priority: Priority = Priority.NORMAL
    carrier: str | None = Field(default=None, max_length=50)
    tracking_number: str | None = Field(default=None, max_length=100)
    expected_delivery_date: date | None = None
    items: list[OrderItemCreate] = Field(min_length=1)


class CarrierPerformanceOut(BaseModel):
    name: str
    on_time_pct: float
    avg_days: float
    shipments: int
