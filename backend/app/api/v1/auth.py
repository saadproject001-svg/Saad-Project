from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_plain_db
from app.models.user import TeamMembership, User
from app.schemas.invitation import AcceptInvitationRequest
from app.schemas.user import MembershipOut
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
