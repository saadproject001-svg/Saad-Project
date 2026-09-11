from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import Permission
from app.dependencies import TenantContext, get_db, require_permission
from app.schemas.supplier import SupplierCreate, SupplierOut
from app.services.supplier_service import create_supplier, list_suppliers

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


@router.get("", response_model=list[SupplierOut])
async def list_suppliers_route(
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_READ.value)),
    db: AsyncSession = Depends(get_db),
) -> list[SupplierOut]:
    return await list_suppliers(db, tenant.organization_id)


@router.post("", response_model=SupplierOut, status_code=201)
async def create_supplier_route(
    payload: SupplierCreate,
    tenant: TenantContext = Depends(require_permission(Permission.PRODUCTS_WRITE.value)),
    db: AsyncSession = Depends(get_db),
) -> SupplierOut:
    return await create_supplier(db, tenant.organization_id, payload)
