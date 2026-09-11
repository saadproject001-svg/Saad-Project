from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import Permission
from app.dependencies import TenantContext, get_db, require_permission
from app.schemas.warehouse import WarehouseSummaryOut
from app.services.warehouse_service import list_warehouse_summary

router = APIRouter(prefix="/warehouses", tags=["warehouses"])


@router.get("/summary", response_model=WarehouseSummaryOut)
async def warehouse_summary_route(
    tenant: TenantContext = Depends(require_permission(Permission.INVENTORY_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> WarehouseSummaryOut:
    return await list_warehouse_summary(db, tenant.organization_id)
