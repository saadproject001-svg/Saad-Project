import uuid

from pydantic import BaseModel, Field


class WarehouseOut(BaseModel):
    id: uuid.UUID
    name: str
    city: str | None
    country: str | None
    status: str
    type: str
    product_count: int
    total_value: float
    capacity_used_pct: float | None


class WarehouseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    city: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)
    status: str = Field(default="Active", max_length=50)
    type: str = Field(default="Self-Managed", max_length=50)
    capacity_units: int = 0


class MovementOut(BaseModel):
    """One row of the incoming/outgoing/pending-transfer lists on Warehouse.jsx —
    a projection of Order (app.services.order_service), not a separate table."""

    id: uuid.UUID
    order_number: str
    counterparty_or_destination: str
    warehouse_name: str | None
    quantity: int
    status: str
    carrier: str | None
    eta: str | None


class WarehouseSummaryOut(BaseModel):
    warehouses: list[WarehouseOut]
    incoming_shipments: list[MovementOut]
    outgoing_shipments: list[MovementOut]
    pending_transfers: list[MovementOut]
