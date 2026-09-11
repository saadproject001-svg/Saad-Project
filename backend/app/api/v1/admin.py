import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_platform_admin_db
from app.schemas.admin import AdminActivityOut, AdminOrderOut, AdminOrganizationOut, AdminProductOut, AdminUserOut
from app.schemas.common import Page
from app.services.admin_service import list_activity, list_orders, list_organizations, list_products, list_users

router = APIRouter(prefix="/admin", tags=["admin"])

# Every route here depends on get_platform_admin_db, which itself depends on
# get_platform_admin (403s any non-flagged user) — see app/dependencies.py. This
# is the platform super-admin surface: cross-tenant visibility into every
# organization/user/activity/order/product, per the product decision that admin
# visibility covers real business data broadly, not just orgs/users.


@router.get("/organizations", response_model=list[AdminOrganizationOut])
async def admin_list_organizations(db: AsyncSession = Depends(get_platform_admin_db)) -> list[AdminOrganizationOut]:
    return await list_organizations(db)


@router.get("/users", response_model=Page[AdminUserOut])
async def admin_list_users(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    db: AsyncSession = Depends(get_platform_admin_db),
) -> Page[AdminUserOut]:
    return await list_users(db, page=page, page_size=page_size)


@router.get("/activity", response_model=Page[AdminActivityOut])
async def admin_list_activity(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    organization_id: uuid.UUID | None = None,
    event_type: str | None = None,
    db: AsyncSession = Depends(get_platform_admin_db),
) -> Page[AdminActivityOut]:
    return await list_activity(db, page=page, page_size=page_size, organization_id=organization_id, event_type=event_type)


@router.get("/orders", response_model=Page[AdminOrderOut])
async def admin_list_orders(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    organization_id: uuid.UUID | None = None,
    db: AsyncSession = Depends(get_platform_admin_db),
) -> Page[AdminOrderOut]:
    return await list_orders(db, page=page, page_size=page_size, organization_id=organization_id)


@router.get("/products", response_model=Page[AdminProductOut])
async def admin_list_products(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    organization_id: uuid.UUID | None = None,
    db: AsyncSession = Depends(get_platform_admin_db),
) -> Page[AdminProductOut]:
    return await list_products(db, page=page, page_size=page_size, organization_id=organization_id)
