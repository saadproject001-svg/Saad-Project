from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import ActivityEventType
from app.dependencies import get_current_user, get_plain_db
from app.models.user import TeamMembership, User
from app.schemas.invitation import AcceptInvitationRequest
from app.schemas.user import MembershipOut, UserOut
from app.services.activity_service import log_activity
from app.services.invitation_service import accept_invitation

router = APIRouter(prefix="/auth", tags=["auth"])

# Signup/login/password-reset happen client-side via supabase-js directly against
# Supabase Auth — this backend never sees a password. This router only covers flows
# that need server-side business logic after Supabase has already authenticated
# the caller (e.g. accepting an org invite).


@router.post("/accept-invite", response_model=MembershipOut)
async def accept_invite(
    payload: AcceptInvitationRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_plain_db),
) -> TeamMembership:
    return await accept_invitation(db, accepting_user=user, token=payload.token)


@router.post("/session-touch", response_model=UserOut)
async def session_touch(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_plain_db),
) -> User:
    """Called once by the frontend right after a Supabase sign-in resolves, since
    Supabase — not this backend — owns the actual login call and therefore never
    hits our API. Updates last_login_at and logs an AUTH_LOGIN event so the
    platform admin's activity feed reflects real logins, not just API writes."""
    user.last_login_at = datetime.now(UTC)
    await log_activity(
        db, actor_user_id=user.id, event_type=ActivityEventType.AUTH_LOGIN, summary=f"{user.email} logged in"
    )
    await db.commit()
    return user
