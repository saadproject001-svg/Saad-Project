"""Import every model module here so Alembic's autogenerate (env.py imports
app.models) sees the full metadata. Add a line for every new models/x.py file."""

from app.models.organization import Organization, Workspace  # noqa: F401
from app.models.user import Role, RolePermission, TeamMembership, User  # noqa: F401
from app.models.invitation import Invitation  # noqa: F401
