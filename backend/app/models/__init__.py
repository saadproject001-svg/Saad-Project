"""Import every model module here so Alembic's autogenerate (env.py imports
app.models) sees the full metadata. Add a line for every new models/x.py file."""

from app.models.organization import Organization, Workspace  # noqa: F401
from app.models.user import Role, RolePermission, TeamMembership, User  # noqa: F401
from app.models.invitation import Invitation  # noqa: F401
from app.models.activity_log import ActivityLog  # noqa: F401
from app.models.product import Product, ProductFbaFees, ProductSpec  # noqa: F401
from app.models.warehouse import InventoryLocation, Warehouse  # noqa: F401
from app.models.supplier import ProductSupplier, Supplier  # noqa: F401
from app.models.order import Order, OrderDeliveryStep, OrderItem  # noqa: F401
from app.models.sellerboard_content import (  # noqa: F401
    SellerboardChartSeries,
    SellerboardKpiCard,
    SellerboardPageMeta,
    SellerboardProductCard,
    SellerboardSettingsField,
    SellerboardSettingsGroup,
    SellerboardTableColumn,
    SellerboardTableRow,
)
