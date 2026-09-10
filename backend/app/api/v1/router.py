from fastapi import APIRouter

from app.api.v1 import auth, organizations, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(organizations.router)
api_router.include_router(users.router)

# Future domain routers land here, one line each, as each deliverable is built:
# products, inventory, suppliers, purchase_orders, orders, sales_channels,
# integrations, finance, advertising, analytics, reports, notifications,
# automation, admin.
