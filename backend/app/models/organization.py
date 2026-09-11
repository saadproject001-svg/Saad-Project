import uuid

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TenantScopedMixin, TimestampMixin


class Organization(Base, TimestampMixin):
    """The tenant boundary. Every tenant-scoped table (via TenantScopedMixin) points
    back to this. Organization itself is NOT tenant-scoped — its own RLS policy
    scopes by `id` rather than `organization_id` (see the accompanying migration)."""

    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), nullable=False, unique=True, index=True)


class Workspace(Base, TenantScopedMixin, TimestampMixin):
    """A store/brand/business-unit within an organization (e.g. distinct Amazon
    seller account, distinct Shopify store). Optional subdivision below the tenant
    boundary — most orgs will have exactly one."""

    __tablename__ = "workspaces"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
