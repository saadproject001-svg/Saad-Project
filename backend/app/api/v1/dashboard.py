from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import Permission
from app.dependencies import TenantContext, get_db, require_permission
from app.schemas.dashboard import DashboardSummaryOut
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummaryOut)
async def dashboard_summary_route(
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> DashboardSummaryOut:
    return await get_dashboard_summary(db, tenant.organization_id)
