from fastapi import APIRouter

from app.api.v1 import admin, analytics, auth, dashboard, orders, organizations, products, sellerboard, suppliers, users, warehouses

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(organizations.router)
api_router.include_router(users.router)
api_router.include_router(products.router)
api_router.include_router(warehouses.router)
api_router.include_router(suppliers.router)
api_router.include_router(orders.router)
api_router.include_router(dashboard.router)
api_router.include_router(analytics.router)
api_router.include_router(sellerboard.router)
api_router.include_router(admin.router)

# Future domain routers land here, one line each, as each deliverable is built:
# sales_channels, integrations, advertising, reports, notifications, automation.
