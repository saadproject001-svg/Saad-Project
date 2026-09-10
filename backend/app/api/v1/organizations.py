from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_plain_db
from app.models.organization import Organization
from app.models.user import TeamMembership, User
from app.schemas.organization import OrganizationCreate, OrganizationOut
from app.services.auth_service import create_organization

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.post("", response_model=OrganizationOut, status_code=201)
async def create_org(
    payload: OrganizationCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_plain_db),
) -> Organization:
    return await create_organization(db, creator_user_id=user.id, name=payload.name, slug=payload.slug)


@router.get("/me", response_model=list[OrganizationOut])
async def list_my_organizations(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_plain_db),
) -> list[Organization]:
    """Every org the caller belongs to — used by the frontend to populate the
    workspace switcher and to know which X-Organization-Id to send on subsequent
    requests. Filtered by user_id (verified via JWT), so this is safe on a
    non-tenant-scoped session."""
    result = await db.execute(
        select(Organization)
        .join(TeamMembership, TeamMembership.organization_id == Organization.id)
        .where(TeamMembership.user_id == user.id, TeamMembership.status == "active")
    )
    return list(result.scalars().all())
