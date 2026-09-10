import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.core.constants import Permission
from app.core.exceptions import NotFoundError
from app.dependencies import TenantContext, get_current_org, get_current_user, get_db, get_plain_db, require_permission
from app.models.user import Role, RolePermission, TeamMembership, User
from app.schemas.invitation import InvitationCreateResult, InvitationOut
from app.schemas.user import InviteMemberRequest, RoleOut, TeamMemberOut, UpdateProfileRequest, UserOut
from app.services.invitation_service import create_invitation

router = APIRouter(tags=["users"])


@router.get("/users/me", response_model=UserOut)
async def get_my_profile(user: User = Depends(get_current_user)) -> User:
    return user


@router.patch("/users/me", response_model=UserOut)
async def update_my_profile(
    payload: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_plain_db),
) -> User:
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.avatar_url is not None:
        user.avatar_url = payload.avatar_url
    await db.commit()
    return user


@router.get("/team", response_model=list[TeamMemberOut])
async def list_team(
    tenant: TenantContext = Depends(get_current_org),
    db: AsyncSession = Depends(get_db),
) -> list[TeamMemberOut]:
    result = await db.execute(select(TeamMembership).where(TeamMembership.organization_id == tenant.organization_id))
    memberships = result.scalars().all()

    members: list[TeamMemberOut] = []
    for m in memberships:
        member_user = await db.get(User, m.user_id)
        role = await db.get(Role, m.role_id)
        perms_result = await db.execute(
            select(RolePermission.permission_code).where(RolePermission.role_id == role.id)
        )
        members.append(
            TeamMemberOut(
                id=m.id,
                user=UserOut.model_validate(member_user),
                role=RoleOut(id=role.id, name=role.name, is_system=role.is_system, permissions=list(perms_result.scalars().all())),
                status=m.status,
                created_at=m.created_at,
            )
        )
    return members


@router.post("/team/invite", response_model=InvitationCreateResult, status_code=201)
async def invite_team_member(
    payload: InviteMemberRequest,
    tenant: TenantContext = Depends(require_permission(Permission.USERS_INVITE.value)),
    db: AsyncSession = Depends(get_db),
) -> InvitationCreateResult:
    role_result = await db.execute(
        select(Role).where(Role.organization_id == tenant.organization_id, Role.name == payload.role.value)
    )
    role = role_result.scalar_one()

    invitation = await create_invitation(
        db,
        organization_id=tenant.organization_id,
        invited_by_user_id=tenant.membership.user_id,
        email=payload.email,
        role_id=role.id,
    )

    # TODO(jobs-phase): dispatch the invitation email via a Celery task
    # (app/jobs/notification_tasks.py) once the background-jobs deliverable lands.
    # Until then this endpoint only creates the invitations row — accepting it
    # requires the token, which we surface directly in the response ONLY outside
    # production so the flow stays testable end-to-end without email. Returning
    # this unconditionally (including in prod) would leak a working accept token
    # into the API response body and any request/response logging.
    settings = get_settings()
    return InvitationCreateResult(
        invitation=InvitationOut.model_validate(invitation),
        accept_url_dev_only=(
            None if settings.is_production else f"/api/v1/auth/accept-invite?token={invitation.token}"
        ),
    )


@router.delete("/team/{membership_id}", status_code=204)
async def remove_team_member(
    membership_id: uuid.UUID,
    tenant: TenantContext = Depends(require_permission(Permission.USERS_MANAGE.value)),
    db: AsyncSession = Depends(get_db),
) -> None:
    membership = await db.get(TeamMembership, membership_id)
    if membership is None or membership.organization_id != tenant.organization_id:
        raise NotFoundError("Team member not found")
    await db.delete(membership)
    await db.commit()
