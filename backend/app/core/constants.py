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
