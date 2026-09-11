import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class ProductSpecOut(ORMModel):
    label: str
    value: str


class ProductFbaFeesOut(ORMModel):
    referral: Decimal
    fulfillment: Decimal
    storage: Decimal
    long_term: Decimal
    total: Decimal


class WarehouseDistributionOut(BaseModel):
    warehouse_id: uuid.UUID
    warehouse_name: str
    location_code: str | None
    stock: int
    reserved: int
    available: int
    status: str


class ProductListItemOut(BaseModel):
    """One row of GET /products — aggregated across all warehouses. Real pagination
    (Page[ProductListItemOut]) replaces the frontend's old fake totalPages={498}."""

    id: uuid.UUID
    sku: str
    name: str
    category: str | None
    brand: str | None
    icon: str | None
    stock: int
    reserved: int
    available: int
    reorder_point: int
    unit_cost: Decimal
    selling_price: Decimal
    total_value: Decimal
    status: str
    fulfillment_type: str | None
    updated_at: datetime


class ProductDetailOut(ProductListItemOut):
    description: str | None
    barcode: str | None
    unit: str
    margin_pct: float | None
    primary_supplier: str | None
    fba_fees: ProductFbaFeesOut | None
    specs: list[ProductSpecOut]
    warehouse_distribution: list[WarehouseDistributionOut]


class ProductCreate(BaseModel):
    sku: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=200)
    category: str | None = Field(default=None, max_length=100)
    brand: str | None = Field(default=None, max_length=100)
    description: str | None = None
    barcode: str | None = Field(default=None, max_length=100)
    unit: str = Field(default="Each", max_length=50)
    icon: str | None = Field(default=None, max_length=10)
    unit_cost: Decimal = Decimal("0")
    selling_price: Decimal = Decimal("0")
    reorder_point: int = 0
    fulfillment_type: str | None = Field(default=None, max_length=20)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=200)
    category: str | None = Field(default=None, max_length=100)
    brand: str | None = Field(default=None, max_length=100)
    description: str | None = None
    barcode: str | None = Field(default=None, max_length=100)
    unit: str | None = Field(default=None, max_length=50)
    icon: str | None = Field(default=None, max_length=10)
    unit_cost: Decimal | None = None
    selling_price: Decimal | None = None
    reorder_point: int | None = None
    fulfillment_type: str | None = Field(default=None, max_length=20)
