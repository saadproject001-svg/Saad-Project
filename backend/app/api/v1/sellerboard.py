from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import TenantContext, get_current_org, get_db
from app.schemas.sellerboard import SellerboardPageOut
from app.services.sellerboard_service import get_sellerboard_page

router = APIRouter(prefix="/sellerboard", tags=["sellerboard"])


@router.get("/pages/{path:path}", response_model=SellerboardPageOut)
async def get_sellerboard_page_route(
    path: str,
    tenant: TenantContext = Depends(get_current_org),
    db: AsyncSession = Depends(get_db),
) -> SellerboardPageOut:
    """Generic content endpoint backing all 61 Sellerboard pages — `path` is the
    frontend route (e.g. `profit`, `ppc/recommendations`) with the leading slash
    stripped by FastAPI's :path converter, restored here to match how route_path
    is stored (see scripts/seed_sellerboard_shapes.py)."""
    return await get_sellerboard_page(db, tenant.organization_id, f"/{path}")
