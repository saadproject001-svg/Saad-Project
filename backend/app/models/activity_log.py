import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class ActivityLog(Base):
    """Records real user actions across the whole platform — the backing table for
    the platform super-admin's "what is every user doing/buying" view (see
    app.services.activity_service.log_activity). Deliberately NOT TenantScopedMixin:
    organization_id is nullable because some events (AUTH_LOGIN) happen before any
    org context exists, and the RLS policy (migration 0002) grants visibility via
    org membership OR actor identity OR the platform-admin bypass, not a single
    organization_id match."""

    __tablename__ = "activity_log"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), index=True
    )
    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    event_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
