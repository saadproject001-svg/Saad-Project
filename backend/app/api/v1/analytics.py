from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import Permission
from app.dependencies import TenantContext, get_db, require_permission
from app.schemas.analytics import AnalyticsSummaryOut
from app.services.analytics_service import get_analytics_summary

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummaryOut)
async def analytics_summary_route(
    tenant: TenantContext = Depends(require_permission(Permission.FINANCE_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> AnalyticsSummaryOut:
    return await get_analytics_summary(db, tenant.organization_id)
