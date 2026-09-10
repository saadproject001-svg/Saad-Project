import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class TenantScopedMixin:
    """Every tenant-scoped table gets an organization_id FK. This column alone is NOT
    the enforcement mechanism — the corresponding Alembic migration MUST also add:

        alter table <table> enable row level security;
        create policy tenant_isolation_<table> on <table>
          using (organization_id = current_setting('app.current_org_id')::uuid)
          with check (organization_id = current_setting('app.current_org_id')::uuid);

    app.current_org_id is set per-request by app.middleware.tenant_context, via
    `SET LOCAL app.current_org_id = :org_id` inside the request's transaction — never
    trust a client-supplied org_id for this value. See app/middleware/tenant_context.py.
    """

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="RESTRICT"), nullable=False, index=True
    )


class SoftDeleteMixin:
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
