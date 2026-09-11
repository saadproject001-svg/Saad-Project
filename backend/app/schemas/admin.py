import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class AdminOrganizationOut(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    member_count: int
    created_at: datetime


class AdminUserOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str | None
    is_platform_admin: bool
    last_login_at: datetime | None
    organizations: list[str]
    created_at: datetime


class AdminActivityOut(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID | None
    organization_name: str | None
    actor_email: str | None
    event_type: str
    summary: str
    created_at: datetime


class AdminOrderOut(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    organization_name: str
    order_number: str
    type: str
    counterparty_name: str | None
    total_amount: Decimal
    fulfillment_status: str
    order_date: date


class AdminProductOut(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    organization_name: str
    sku: str
    name: str
    stock: int
    unit_cost: Decimal
    status: str
