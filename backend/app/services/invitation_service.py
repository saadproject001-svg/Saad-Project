import secrets
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import ActivityEventType
from app.core.exceptions import ConflictError, NotFoundError, ValidationAppError
from app.models.invitation import Invitation
from app.models.user import TeamMembership, User
from app.services.activity_service import log_activity

INVITE_TTL = timedelta(days=7)


async def create_invitation(
    db: AsyncSession, organization_id: uuid.UUID, invited_by_user_id: uuid.UUID, email: str, role_id: uuid.UUID
) -> Invitation:
    """`db` must be a tenant-scoped session (app.dependencies.get_db) — the RLS
    `with check` on invitations requires organization_id = current_setting(...),
    which the caller's already-validated org membership guarantees here."""
    existing = await db.execute(
        select(Invitation).where(
            Invitation.organization_id == organization_id,
            Invitation.email == email,
            Invitation.status == "pending",
        )
    )
    if existing.scalar_one_or_none() is not None:
        raise ConflictError(f"An invitation is already pending for {email}")

    invitation = Invitation(
        id=uuid.uuid4(),
        organization_id=organization_id,
        email=email,
        role_id=role_id,
        invited_by_user_id=invited_by_user_id,
        token=secrets.token_urlsafe(32),
        status="pending",
        expires_at=datetime.now(UTC) + INVITE_TTL,
    )
    db.add(invitation)
    await log_activity(
        db,
        actor_user_id=invited_by_user_id,
        event_type=ActivityEventType.TEAM_INVITE_SENT,
        summary=f"Invited {email} to join",
        organization_id=organization_id,
    )
    # flush before commit, not refresh after — SET LOCAL app.current_org_id resets
    # on commit, and a post-commit refresh would be a fresh RLS-guarded SELECT with
    # no context left to satisfy it. See app.dependencies.get_db's docstring.
    await db.flush()
    await db.commit()
    return invitation


async def accept_invitation(db: AsyncSession, accepting_user: User, token: str) -> TeamMembership:
    """Runs on a plain (non-tenant-scoped) session, since the accepting user has no
    established org context yet — this is exactly how they get one. Safe because the
    invitation is looked up by its unguessable token, not by organization_id."""
    result = await db.execute(select(Invitation).where(Invitation.token == token))
    invitation = result.scalar_one_or_none()
    if invitation is None:
        raise NotFoundError("Invitation not found")
    if invitation.status != "pending":
        raise ValidationAppError(f"Invitation is already {invitation.status}")
    if invitation.expires_at < datetime.now(UTC):
        raise ValidationAppError("Invitation has expired")
    if invitation.email.lower() != accepting_user.email.lower():
        raise ValidationAppError("This invitation was issued to a different email address")

    membership = TeamMembership(
        id=uuid.uuid4(),
        organization_id=invitation.organization_id,
        user_id=accepting_user.id,
        role_id=invitation.role_id,
        status="active",
    )
    invitation.status = "accepted"
    db.add(membership)
    # Same flush-before-commit rule: this runs on get_plain_db (app.current_org_id
    # was never set at all here), and a refresh-after-commit would also drop
    # app.current_user_id, breaking users_self_access etc. for any follow-up query.
    await db.flush()
    await db.commit()
    return membership
