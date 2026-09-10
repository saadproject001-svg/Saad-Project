import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.core.constants import SystemRole
from app.schemas.common import ORMModel


class UserOut(ORMModel):
    id: uuid.UUID
    email: str
    full_name: str | None
    avatar_url: str | None
    last_login_at: datetime | None


class RoleOut(ORMModel):
    id: uuid.UUID
    name: str
    is_system: bool
    permissions: list[str] = []


class TeamMemberOut(ORMModel):
    id: uuid.UUID
    user: UserOut
    role: RoleOut
    status: str
    created_at: datetime


class MembershipOut(ORMModel):
    """Bare membership shape (no joined user/role) — used where the caller already
    knows who/what those refer to, e.g. right after accepting their own invite."""

    id: uuid.UUID
    organization_id: uuid.UUID
    role_id: uuid.UUID
    status: str


class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: SystemRole = SystemRole.MEMBER


class UpdateMemberRoleRequest(BaseModel):
    role_id: uuid.UUID


class UpdateProfileRequest(BaseModel):
    full_name: str | None = Field(default=None, max_length=200)
    avatar_url: str | None = Field(default=None, max_length=500)
