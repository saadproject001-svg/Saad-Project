import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TenantScopedMixin, TimestampMixin


class User(Base, TimestampMixin):
    """Canonical user record. id MUST equal the corresponding Supabase auth.users.id
    (mirrored via the on_auth_user_created trigger in the Alembic migration) — this
    table is the single replacement for the frontend's three disconnected mock
    sources (currentUser, workspaceUsers, the /account/users table). A user is NOT
    tenant-scoped: the same person can belong to multiple organizations via
    TeamMembership, matching how Supabase Auth accounts work."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(200))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    # Platform-wide (not per-org) operator flag — see migration 0002 and
    # app.dependencies.get_platform_admin_db. Never settable via a user-facing
    # endpoint; only via direct DB update (seed script / ops).
    is_platform_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class Role(Base, TenantScopedMixin, TimestampMixin):
    """Per-organization role. Seeded with SystemRole defaults (app.core.constants)
    on org creation, editable afterward — replaces the frontend's static, read-only
    permissionMatrix mockup with an actually-enforced model."""

    __tablename__ = "roles"
    __table_args__ = (UniqueConstraint("organization_id", "name", name="uq_roles_org_name"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class RolePermission(Base):
    """Permission codes (app.core.constants.Permission) granted to a role. No
    organization_id of its own — scoped transitively through role_id -> roles.organization_id
    (RLS policy joins through roles, see the migration)."""

    __tablename__ = "role_permissions"

    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True
    )
    permission_code: Mapped[str] = mapped_column(String(100), primary_key=True)


class TeamMembership(Base, TenantScopedMixin, TimestampMixin):
    """Links a User to an Organization with a Role. A user can hold at most one
    membership per organization; multiple organizations => multiple rows."""

    __tablename__ = "team_memberships"
    __table_args__ = (UniqueConstraint("organization_id", "user_id", name="uq_membership_org_user"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")  # active | invited | disabled
    invited_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
