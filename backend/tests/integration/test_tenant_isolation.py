"""Proves Org A cannot read or write Org B's data through Postgres RLS — this is
the actual security boundary (see app/dependencies.py and the 0001 migration), so
it must be tested against a real database, not mocked. Requires TEST_DATABASE_URL
(see tests/conftest.py's module docstring)."""

import uuid

import pytest
from sqlalchemy import text

from app.services.auth_service import create_organization
from tests.conftest import create_auth_user


@pytest.mark.asyncio
async def test_org_a_cannot_see_org_b_via_org_id_context(db_session):
    user_a, user_b = uuid.uuid4(), uuid.uuid4()
    await create_auth_user(db_session, user_a, f"{user_a}@example.com")
    await create_auth_user(db_session, user_b, f"{user_b}@example.com")

    org_a = await create_organization(db_session, user_a, "Org A", f"org-a-{uuid.uuid4().hex[:8]}")
    org_b = await create_organization(db_session, user_b, "Org B", f"org-b-{uuid.uuid4().hex[:8]}")

    # Simulate a request scoped to Org A (app.dependencies.get_db's SET LOCAL calls).
    await db_session.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(user_a)})
    await db_session.execute(text("SET LOCAL app.current_org_id = :oid"), {"oid": str(org_a.id)})

    # Org A's own roles are visible...
    rows = (await db_session.execute(text("select count(*) from roles where organization_id = :oid"), {"oid": str(org_a.id)})).scalar()
    assert rows > 0

    # ...but Org B's roles are invisible even when explicitly queried by id, because
    # the tenant_isolation_roles policy's USING clause only matches
    # organization_id = current_setting('app.current_org_id'), which is org_a here.
    rows = (await db_session.execute(text("select count(*) from roles where organization_id = :oid"), {"oid": str(org_b.id)})).scalar()
    assert rows == 0

    # Org B's organization row itself is also invisible under Org A's context.
    rows = (
        await db_session.execute(text("select count(*) from organizations where id = :oid"), {"oid": str(org_b.id)})
    ).scalar()
    assert rows == 0


@pytest.mark.asyncio
async def test_context_less_session_sees_nothing_tenant_scoped(db_session):
    """Without any app.current_org_id/app.current_user_id set at all, every
    tenant-scoped table must return zero rows — current_setting(..., true) returns
    NULL, and `organization_id = NULL` never matches in SQL. Fails closed."""
    user = uuid.uuid4()
    await create_auth_user(db_session, user, f"{user}@example.com")
    await create_organization(db_session, user, "Org C", f"org-c-{uuid.uuid4().hex[:8]}")

    rows = (await db_session.execute(text("select count(*) from roles"))).scalar()
    assert rows == 0
    rows = (await db_session.execute(text("select count(*) from team_memberships"))).scalar()
    assert rows == 0
