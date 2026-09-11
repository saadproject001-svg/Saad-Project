"""Proves the platform_admin_bypass_* RLS policies (migration 0002) grant
cross-tenant SELECT visibility ONLY when app.is_platform_admin is explicitly set to
'true' for the session — exactly like app.current_org_id, this must never be
inferred from a client-supplied value, only set by app.dependencies.get_platform_admin_db
after it has verified the caller's own is_platform_admin flag. Requires
TEST_DATABASE_URL (see tests/conftest.py)."""

import uuid

import pytest
from sqlalchemy import text

from app.services.auth_service import create_organization
from tests.conftest import create_auth_user


@pytest.mark.asyncio
async def test_platform_admin_flag_grants_cross_org_select(db_session):
    user_a, user_b, admin = uuid.uuid4(), uuid.uuid4(), uuid.uuid4()
    await create_auth_user(db_session, user_a, f"{user_a}@example.com")
    await create_auth_user(db_session, user_b, f"{user_b}@example.com")
    await create_auth_user(db_session, admin, f"{admin}@example.com")

    org_a = await create_organization(db_session, user_a, "Org A", f"org-a-{uuid.uuid4().hex[:8]}")
    org_b = await create_organization(db_session, user_b, "Org B", f"org-b-{uuid.uuid4().hex[:8]}")

    # No org context at all, just the admin flag — mirrors get_platform_admin_db.
    await db_session.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(admin)})
    await db_session.execute(text("SET LOCAL app.is_platform_admin = 'true'"))

    rows = (
        await db_session.execute(
            text("select count(*) from organizations where id in (:a, :b)"), {"a": str(org_a.id), "b": str(org_b.id)}
        )
    ).scalar()
    assert rows == 2

    rows = (
        await db_session.execute(
            text("select count(*) from team_memberships where organization_id in (:a, :b)"),
            {"a": str(org_a.id), "b": str(org_b.id)},
        )
    ).scalar()
    assert rows == 2  # the owner membership created for each org


@pytest.mark.asyncio
async def test_admin_flag_unset_still_blocks_cross_org(db_session):
    """A session that never sets app.is_platform_admin gets none of the bypass
    visibility, even for a user who genuinely has is_platform_admin=true in the
    users table — the flag must be explicitly asserted per-session by
    get_platform_admin_db, never implied by who the user is."""
    user_a, user_b = uuid.uuid4(), uuid.uuid4()
    await create_auth_user(db_session, user_a, f"{user_a}@example.com")
    await create_auth_user(db_session, user_b, f"{user_b}@example.com")

    org_a = await create_organization(db_session, user_a, "Org A2", f"org-a2-{uuid.uuid4().hex[:8]}")
    org_b = await create_organization(db_session, user_b, "Org B2", f"org-b2-{uuid.uuid4().hex[:8]}")

    await db_session.execute(
        text("update users set is_platform_admin = true where id = :uid"), {"uid": str(user_a)}
    )
    await db_session.commit()

    # user_a's ordinary tenant-scoped session (app.is_platform_admin never set).
    await db_session.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(user_a)})
    await db_session.execute(text("SET LOCAL app.current_org_id = :oid"), {"oid": str(org_a.id)})

    rows = (
        await db_session.execute(text("select count(*) from organizations where id = :oid"), {"oid": str(org_b.id)})
    ).scalar()
    assert rows == 0


@pytest.mark.asyncio
async def test_activity_log_visible_to_self_org_and_admin_only(db_session):
    from app.core.constants import ActivityEventType
    from app.services.activity_service import log_activity

    user_a, user_b, admin = uuid.uuid4(), uuid.uuid4(), uuid.uuid4()
    await create_auth_user(db_session, user_a, f"{user_a}@example.com")
    await create_auth_user(db_session, user_b, f"{user_b}@example.com")
    await create_auth_user(db_session, admin, f"{admin}@example.com")
    org_a = await create_organization(db_session, user_a, "Org AL", f"org-al-{uuid.uuid4().hex[:8]}")

    # AUTH_LOGIN-style event: org-less, actor-only.
    await db_session.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(user_b)})
    await log_activity(db_session, actor_user_id=user_b, event_type=ActivityEventType.AUTH_LOGIN, summary="login")
    await db_session.commit()

    # user_a (member of org_a, not user_b) shouldn't see user_b's login event.
    await db_session.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(user_a)})
    await db_session.execute(text("SET LOCAL app.current_org_id = :oid"), {"oid": str(org_a.id)})
    rows = (
        await db_session.execute(text("select count(*) from activity_log where actor_user_id = :uid"), {"uid": str(user_b)})
    ).scalar()
    assert rows == 0

    # The platform admin sees it regardless of org/actor.
    await db_session.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(admin)})
    await db_session.execute(text("SET LOCAL app.is_platform_admin = 'true'"))
    rows = (
        await db_session.execute(text("select count(*) from activity_log where actor_user_id = :uid"), {"uid": str(user_b)})
    ).scalar()
    assert rows == 1
