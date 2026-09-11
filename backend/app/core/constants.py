"""App-wide enums that are NOT part of the frontend StatusBadge contract (see
app/utils/status_enum.py for that one). These are internal/domain enums with no
existing frontend UI to match against.
"""

from enum import StrEnum


class SystemRole(StrEnum):
    """Built-in roles every organization gets on creation. Custom roles can be
    added per-org later, layered on top of these via role_permissions."""

    OWNER = "owner"
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    VIEWER = "viewer"


class Permission(StrEnum):
    """Granular permission codes. Roles are a bundle of these, checked server-side
    on every mutating endpoint via app.dependencies.require_permission()."""

    ORG_MANAGE = "org:manage"
    USERS_INVITE = "users:invite"
    USERS_MANAGE = "users:manage"
    PRODUCTS_READ = "products:read"
    PRODUCTS_WRITE = "products:write"
    INVENTORY_READ = "inventory:read"
    INVENTORY_WRITE = "inventory:write"
    ORDERS_READ = "orders:read"
    ORDERS_WRITE = "orders:write"
    FINANCE_READ = "finance:read"
    FINANCE_WRITE = "finance:write"
    INTEGRATIONS_MANAGE = "integrations:manage"
    SETTINGS_MANAGE = "settings:manage"


# Default permission bundles for the built-in system roles. Stored to DB on
# organization creation (see services/permission_service.seed_default_roles) so
# they can be edited per-org afterward without touching code.
DEFAULT_ROLE_PERMISSIONS: dict[SystemRole, list[Permission]] = {
    SystemRole.OWNER: list(Permission),
    SystemRole.ADMIN: [p for p in Permission if p != Permission.ORG_MANAGE],
    SystemRole.MANAGER: [
        Permission.PRODUCTS_READ,
        Permission.PRODUCTS_WRITE,
        Permission.INVENTORY_READ,
        Permission.INVENTORY_WRITE,
        Permission.ORDERS_READ,
        Permission.ORDERS_WRITE,
        Permission.FINANCE_READ,
    ],
    SystemRole.MEMBER: [
        Permission.PRODUCTS_READ,
        Permission.INVENTORY_READ,
        Permission.ORDERS_READ,
        Permission.ORDERS_WRITE,
    ],
    SystemRole.VIEWER: [
        Permission.PRODUCTS_READ,
        Permission.INVENTORY_READ,
        Permission.ORDERS_READ,
        Permission.FINANCE_READ,
    ],
}


class OrderType(StrEnum):
    """orders.type — a single unified order concept covering what the old mock data
    split into orders/incomingShipments/outgoingShipments/pendingTransfers
    (Warehouse.jsx's incoming/outgoing/pending lists are just these, filtered by
    type+status — see app.services.order_service)."""

    PURCHASE = "Purchase"
    SALES = "Sales"
    TRANSFER = "Transfer"


OPEN_ORDER_STATUSES: tuple[str, ...] = (
    "Pending",
    "Processing",
    "Preparing",
    "Packed",
    "Shipped",
    "In Transit",
    "Requested",
)
"""orders.fulfillment_status values that count as "not yet complete" — used to
derive Warehouse.jsx's incoming/outgoing/pending-transfer lists and the
Dashboard's "Open Orders" KPI (see app.services.{warehouse,dashboard}_service)
from the unified orders table, rather than a separate shipments concept."""


class Priority(StrEnum):
    """orders.priority — deliberately separate from KnownStatus (app/utils/status_enum.py):
    this is an urgency label, not a lifecycle status, and StatusBadge.jsx styles it
    via its own local map in Orders.jsx, not the shared status component."""

    HIGH = "High"
    URGENT = "Urgent"
    NORMAL = "Normal"


class ActivityEventType(StrEnum):
    """Event types recorded to activity_log (app.services.activity_service.log_activity).
    Only real write paths log an event — this is not instrumented into every read
    endpoint, just the actions the platform admin's activity feed needs to surface."""

    AUTH_LOGIN = "auth.login"
    ORG_CREATED = "org.created"
    TEAM_INVITE_SENT = "team.invite_sent"
    TEAM_MEMBER_REMOVED = "team.member_removed"
    PRODUCT_CREATED = "product.created"
    PRODUCT_UPDATED = "product.updated"
    PRODUCT_DELETED = "product.deleted"
    INVENTORY_ADJUSTED = "inventory.adjusted"
    ORDER_CREATED = "order.created"
    ORDER_STATUS_CHANGED = "order.status_changed"
