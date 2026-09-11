import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import Permission
from app.dependencies import TenantContext, get_db, require_permission
from app.schemas.common import Page
from app.schemas.dashboard import KpiCardOut
from app.schemas.order import CarrierPerformanceOut, OrderCreate, OrderOut
from app.services.order_service import create_order, get_carrier_performance, get_order, get_order_kpis, list_orders

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/kpis", response_model=list[KpiCardOut])
async def order_kpis_route(
    tenant: TenantContext = Depends(require_permission(Permission.ORDERS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> list[KpiCardOut]:
    return await get_order_kpis(db, tenant.organization_id)


@router.get("", response_model=Page[OrderOut])
async def list_orders_route(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    type: str | None = None,
    tenant: TenantContext = Depends(require_permission(Permission.ORDERS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> Page[OrderOut]:
    return await list_orders(db, tenant.organization_id, page=page, page_size=page_size, order_type=type)


@router.get("/carrier-performance", response_model=list[CarrierPerformanceOut])
async def carrier_performance_route(
    tenant: TenantContext = Depends(require_permission(Permission.ORDERS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> list[CarrierPerformanceOut]:
    return await get_carrier_performance(db, tenant.organization_id)


@router.get("/{order_id}", response_model=OrderOut)
async def get_order_route(
    order_id: uuid.UUID,
    tenant: TenantContext = Depends(require_permission(Permission.ORDERS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> OrderOut:
    return await get_order(db, tenant.organization_id, order_id)


@router.post("", response_model=OrderOut, status_code=201)
async def create_order_route(
    payload: OrderCreate,
    tenant: TenantContext = Depends(require_permission(Permission.ORDERS_WRITE.value)),
    db: AsyncSession = Depends(get_db),
) -> OrderOut:
    return await create_order(db, tenant.organization_id, tenant.membership.user_id, payload)
