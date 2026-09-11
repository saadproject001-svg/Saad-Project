import uuid
from collections.abc import AsyncGenerator
from dataclasses import dataclass

from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import SupabasePrincipal, decode_supabase_jwt
from app.db.session import AsyncSessionLocal
from app.models.user import RolePermission, TeamMembership, User

_bearer = HTTPBearer(auto_error=True)


async def get_current_principal(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> SupabasePrincipal:
    return decode_supabase_jwt(credentials.credentials)


async def get_plain_db(
    principal: SupabasePrincipal = Depends(get_current_principal),
) -> AsyncGenerator[AsyncSession, None]:
    """A session with the caller's identity set (app.current_user_id) but NO org
    context (app.current_org_id unset) — RLS will reject any query against a
    tenant-scoped table through this session except the handful of permissive
    "see your own stuff" policies (users_self_access, team_memberships_self_select,
    roles_member_select, role_permissions_member_select, users_org_member_select;
    see the 0001 migration). Use this only for organization-less lookups: resolving
    which orgs a user belongs to, or the very first insert of a brand-new org.

    IMPORTANT: `SET LOCAL` only lasts for the current transaction — it resets on
    commit. Any service using this session that calls db.commit() must not run a
    further RLS-guarded query afterward (e.g. no db.refresh() after commit); rely on
    db.flush() before commit instead, since Postgres RETURNING already populates
    server-generated columns (created_at, etc.) at flush time. See
    app/services/auth_service.py and app/services/invitation_service.py.
    """
    async with AsyncSessionLocal() as session:
        await session.execute(
            text("SET LOCAL app.current_user_id = :uid"), {"uid": str(principal.user_id)}
        )
        yield session


async def get_current_user(
    principal: SupabasePrincipal = Depends(get_current_principal),
    db: AsyncSession = Depends(get_plain_db),
) -> User:
    user = await db.get(User, principal.user_id)
    if user is None:
        # The on_auth_user_created trigger (see the initial Alembic migration) inserts
        # this row synchronously on Supabase signup, so reaching here means either a
        # stale token for a deleted user, or the trigger hasn't fired yet.
        raise UnauthorizedError("No matching user record — try refreshing your session")
    return user


@dataclass(frozen=True)
class TenantContext:
    organization_id: uuid.UUID
    membership: TeamMembership
    permission_codes: frozenset[str]


async def get_current_org(
    x_organization_id: uuid.UUID = Header(..., description="Active organization for this request"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_plain_db),
) -> TenantContext:
    """Resolves and validates the caller's membership in the org named by the
    X-Organization-Id header, using the permissive self-lookup policies (this runs
    on get_plain_db, before any org context exists — that's the whole point)."""
    result = await db.execute(
        select(TeamMembership).where(
            TeamMembership.organization_id == x_organization_id,
            TeamMembership.user_id == user.id,
            TeamMembership.status == "active",
        )
    )
    membership = result.scalar_one_or_none()
    if membership is None:
        raise ForbiddenError("You are not an active member of this organization")

    perms_result = await db.execute(
        select(RolePermission.permission_code).where(RolePermission.role_id == membership.role_id)
    )
    permission_codes = frozenset(perms_result.scalars().all())

    return TenantContext(
        organization_id=x_organization_id, membership=membership, permission_codes=permission_codes
    )


async def get_db(
    tenant: TenantContext = Depends(get_current_org),
) -> AsyncGenerator[AsyncSession, None]:
    """The session every tenant-scoped route handler should depend on. Sets both
    app.current_user_id and app.current_org_id for the duration of the transaction
    so Postgres RLS policies enforce isolation at the database layer — this is the
    actual security boundary, not the Python membership check in get_current_org
    (that check exists to fail fast with a clean 403 instead of an opaque
    RLS-denied empty result). Same SET LOCAL/commit caveat as get_plain_db applies."""
    async with AsyncSessionLocal() as session:
        await session.execute(
            text("SET LOCAL app.current_user_id = :uid"), {"uid": str(tenant.membership.user_id)}
        )
        await session.execute(
            text("SET LOCAL app.current_org_id = :org_id"), {"org_id": str(tenant.organization_id)}
        )
        yield session


def require_permission(permission: str):
    async def _check(tenant: TenantContext = Depends(get_current_org)) -> TenantContext:
        if permission not in tenant.permission_codes:
            raise ForbiddenError(f"Missing required permission: {permission}")
        return tenant

    return _check


async def get_platform_admin(user: User = Depends(get_current_user)) -> User:
    """Gate for platform-superadmin-only routes (app/api/v1/admin.py). Raises 403
    for every ordinary user — is_platform_admin is a global flag on `users`, never
    settable via a user-facing endpoint (see migration 0002)."""
    if not user.is_platform_admin:
        raise ForbiddenError("Platform admin access required")
    return user


async def get_platform_admin_db(admin: User = Depends(get_platform_admin)) -> AsyncGenerator[AsyncSession, None]:
    """The ONLY code path that ever sets app.is_platform_admin — ordinary get_db/
    get_plain_db sessions never touch it, so a flagged user's normal tenant-scoped
    requests are completely unaffected by their admin status; only requests that
    explicitly depend on this function (and have already passed the get_platform_admin
    check above) get cross-tenant SELECT visibility, via the platform_admin_bypass_*
    RLS policies added in migration 0002. Same SET LOCAL/commit caveat as get_db:
    flush before commit, never refresh after."""
    async with AsyncSessionLocal() as session:
        await session.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(admin.id)})
        await session.execute(text("SET LOCAL app.is_platform_admin = 'true'"))
        yield session
