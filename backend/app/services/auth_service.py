import uuid

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import SystemRole
from app.core.exceptions import ConflictError
from app.models.organization import Organization
from app.models.user import TeamMembership
from app.services.permission_service import seed_default_roles


async def create_organization(db: AsyncSession, creator_user_id: uuid.UUID, name: str, slug: str) -> Organization:
    """Creates a brand-new organization, its default role set, and an Owner
    membership for the creating user — all in one transaction, since an org must
    never exist without an owner able to manage it.

    Must run on a plain session (app.dependencies.get_plain_db), not the tenant-scoped
    get_db, because no organization_id exists yet to scope that session to. We set
    app.current_org_id to the freshly-generated id ourselves so the RLS `with check`
    clauses on roles/role_permissions/team_memberships (which require
    organization_id = current_setting('app.current_org_id')::uuid) are satisfied for
    these very first inserts.
    """
    org_id = uuid.uuid4()
    await db.execute(text("SET LOCAL app.current_org_id = :org_id"), {"org_id": str(org_id)})

    organization = Organization(id=org_id, name=name, slug=slug)
    db.add(organization)
    try:
        await db.flush()
    except IntegrityError as exc:
        raise ConflictError(f"Organization slug {slug!r} is already taken") from exc

    roles = await seed_default_roles(db, org_id)

    db.add(
        TeamMembership(
            id=uuid.uuid4(),
            organization_id=org_id,
            user_id=creator_user_id,
            role_id=roles[SystemRole.OWNER].id,
            status="active",
        )
    )

    # flush (not refresh-after-commit) so Postgres RETURNING populates created_at/
    # updated_at while app.current_org_id is still set for this transaction — see
    # the SET LOCAL/commit caveat documented in app.dependencies.get_plain_db.
    await db.flush()
    await db.commit()
    return organization
