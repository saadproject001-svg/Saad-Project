import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TenantScopedMixin, TimestampMixin


class Invitation(Base, TenantScopedMixin, TimestampMixin):
    """A pending invite by email, before the invitee necessarily has a Supabase Auth
    account. TeamMembership can't model this directly since its user_id FK requires
    an existing users row (which only exists once someone has actually signed up).
    On acceptance (see auth_service.accept_invitation), a TeamMembership row is
    created and this row's status flips to 'accepted'."""

    __tablename__ = "invitations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="RESTRICT"))
    invited_by_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    token: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")  # pending|accepted|revoked
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
