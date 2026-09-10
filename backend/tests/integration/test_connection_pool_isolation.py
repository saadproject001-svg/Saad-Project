"""Proves the specific failure mode the tenancy model depends on NOT happening:
a pooled connection carrying one request's `SET LOCAL app.current_org_id` context
into the next request that reuses the same underlying connection.

Uses a dedicated engine with pool_size=1, max_overflow=0 so the second "request"
is GUARANTEED to reuse the exact same physical connection the first one used
(rather than just hoping the default pool happens to reuse it) — that's what makes
this test actually prove something about pooling, not just about RLS in general
(which test_tenant_isolation.py already covers on its own connection)."""

import os
import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.services.auth_service import create_organization
from tests.conftest import create_auth_user

TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")

pytestmark = pytest.mark.skipif(not TEST_DATABASE_URL, reason="TEST_DATABASE_URL not set")


@pytest.mark.asyncio
async def test_no_context_leaks_across_reused_pooled_connection(_migrated_test_db):
    single_conn_engine = create_async_engine(
        TEST_DATABASE_URL, pool_size=1, max_overflow=0, pool_reset_on_return="rollback"
    )
    from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

    SessionFactory = async_sessionmaker(bind=single_conn_engine, expire_on_commit=False, class_=AsyncSession)

    user_a, user_b = uuid.uuid4(), uuid.uuid4()

    try:
        # "Request 1": establish Org A, set its tenant context, read successfully,
        # then close WITHOUT ever calling commit() on the tenant-context statements
        # (mirrors a plain read-only GET request) — this is the scenario most likely
        # to leak, since there's no explicit transaction-ending call in the handler
        # itself; only session.close() (via the `async with` exit) ends it.
        async with SessionFactory() as session1:
            await create_auth_user(session1, user_a, f"{user_a}@example.com")
            org_a = await create_organization(session1, user_a, "Pool Org A", f"pool-org-a-{uuid.uuid4().hex[:8]}")

            await session1.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(user_a)})
            await session1.execute(text("SET LOCAL app.current_org_id = :oid"), {"oid": str(org_a.id)})
            visible = (
                await session1.execute(text("select count(*) from roles where organization_id = :oid"), {"oid": str(org_a.id)})
            ).scalar()
            assert visible > 0  # sanity: context was actually applied for request 1
            # No explicit commit/rollback here — session.close() on scope exit must
            # be what ends the transaction and discards the SET LOCAL values.

        # "Request 2": a fresh session/transaction that, on a pool_size=1 engine,
        # MUST have checked out the identical physical connection request 1 used.
        # It sets no tenant context at all (simulates a request that hasn't yet
        # resolved org context, or a bug that forgot to). If SET LOCAL leaked
        # across the reused connection, Org A's roles would still be visible here.
        async with SessionFactory() as session2:
            leaked = (
                await session2.execute(text("select count(*) from roles where organization_id = :oid"), {"oid": str(org_a.id)})
            ).scalar()
            assert leaked == 0, "Org A's tenant context leaked into a new session on the reused pooled connection"

        # "Request 3": same reused connection, this time scoped to Org B — must see
        # only Org B's data, never Org A's, proving isolation holds under reuse in
        # both directions (missing context AND a different org's context).
        async with SessionFactory() as session3:
            await create_auth_user(session3, user_b, f"{user_b}@example.com")
            org_b = await create_organization(session3, user_b, "Pool Org B", f"pool-org-b-{uuid.uuid4().hex[:8]}")

            await session3.execute(text("SET LOCAL app.current_user_id = :uid"), {"uid": str(user_b)})
            await session3.execute(text("SET LOCAL app.current_org_id = :oid"), {"oid": str(org_b.id)})

            org_a_visible = (
                await session3.execute(text("select count(*) from roles where organization_id = :oid"), {"oid": str(org_a.id)})
            ).scalar()
            org_b_visible = (
                await session3.execute(text("select count(*) from roles where organization_id = :oid"), {"oid": str(org_b.id)})
            ).scalar()
            assert org_a_visible == 0, "Org B's session context leaked visibility into Org A's rows"
            assert org_b_visible > 0
    finally:
        await single_conn_engine.dispose()
