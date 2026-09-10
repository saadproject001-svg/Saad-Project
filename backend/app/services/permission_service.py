import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import DEFAULT_ROLE_PERMISSIONS, SystemRole
from app.models.user import Role, RolePermission


async def seed_default_roles(db: AsyncSession, organization_id: uuid.UUID) -> dict[SystemRole, Role]:
    """Creates the built-in role set for a brand-new organization. Called once, inside
    the same transaction as organization creation (see auth_service.create_organization) —
    an org must never exist without at least an Owner role to assign to its creator."""
    roles: dict[SystemRole, Role] = {}
    for system_role, permissions in DEFAULT_ROLE_PERMISSIONS.items():
        role = Role(
            id=uuid.uuid4(),
            organization_id=organization_id,
            name=system_role.value,
            is_system=True,
        )
        db.add(role)
        await db.flush()  # need role.id before inserting role_permissions

        for permission in permissions:
            db.add(RolePermission(role_id=role.id, permission_code=permission.value))

        roles[system_role] = role

    return roles
