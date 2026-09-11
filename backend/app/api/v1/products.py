import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import Permission
from app.dependencies import TenantContext, get_db, require_permission
from app.schemas.common import Page
from app.schemas.dashboard import KpiCardOut
from app.schemas.product import ProductCreate, ProductDetailOut, ProductListItemOut, ProductUpdate
from app.services.product_service import (
    create_product,
    get_inventory_kpis,
    get_low_stock_products,
    get_product_detail,
    list_products,
    update_product,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/kpis", response_model=list[KpiCardOut])
async def inventory_kpis_route(
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> list[KpiCardOut]:
    return await get_inventory_kpis(db, tenant.organization_id)


@router.get("", response_model=Page[ProductListItemOut])
async def list_products_route(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    q: str | None = None,
    status: str | None = None,
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> Page[ProductListItemOut]:
    return await list_products(db, tenant.organization_id, page=page, page_size=page_size, q=q, status=status)


@router.get("/low-stock", response_model=list[ProductListItemOut])
async def low_stock_route(
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> list[ProductListItemOut]:
    return await get_low_stock_products(db, tenant.organization_id)


@router.get("/{product_id}", response_model=ProductDetailOut)
async def get_product_route(
    product_id: uuid.UUID,
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> ProductDetailOut:
    return await get_product_detail(db, tenant.organization_id, product_id)


@router.post("", response_model=ProductDetailOut, status_code=201)
async def create_product_route(
    payload: ProductCreate,
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_WRITE.value)),
    db: AsyncSession = Depends(get_db),
) -> ProductDetailOut:
    return await create_product(db, tenant.organization_id, tenant.membership.user_id, payload)


@router.patch("/{product_id}", response_model=ProductDetailOut)
async def update_product_route(
    product_id: uuid.UUID,
    payload: ProductUpdate,
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_WRITE.value)),
    db: AsyncSession = Depends(get_db),
) -> ProductDetailOut:
    return await update_product(db, tenant.organization_id, tenant.membership.user_id, product_id, payload)
