"""Integration/API tests need a real Postgres instance with a Supabase-shaped
`auth` schema — RLS, `SET LOCAL`, and the `users` table's FK to `auth.users(id)`
have no SQLite equivalent and no plain-Postgres equivalent either (a vanilla
Postgres has no `auth` schema at all, so the 0001 migration would fail outright).
Point TEST_DATABASE_URL at a local Supabase CLI instance (`supabase start`) or a
disposable Supabase branch/project before running `pytest tests/integration` or
`pytest tests/api`. Unit tests under tests/unit/ must not depend on this fixture —
they test pure Python logic only.
"""

import os
import uuid

import pytest
import pytest_asyncio
from alembic import command
from alembic.config import Config
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")


def pytest_collection_modifyitems(items: list[pytest.Item]) -> None:
    """A `pytestmark` assigned here would only apply to tests defined directly in
    this conftest.py (pytest does not propagate it to sibling test modules), so
    tests/integration and tests/api would otherwise fail with a raw TypeError
    from Alembic (None passed as a config value) instead of skipping cleanly
    when TEST_DATABASE_URL is unset. This hook applies the skip to every test
    collected under those two directories."""
    if TEST_DATABASE_URL:
        return
    skip = pytest.mark.skip(reason="TEST_DATABASE_URL not set — skipping tests that require a real Postgres instance")
    for item in items:
        path = item.path.as_posix()
        if "/tests/integration/" in path or "/tests/api/" in path:
            item.add_marker(skip)


@pytest.fixture(scope="session")
def _migrated_test_db():
    """Runs the real Alembic migrations (including RLS policies) against
    TEST_DATABASE_URL once per test session — we test against the actual schema
    that will ship, not a hand-rolled approximation of it."""
    cfg = Config(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
    cfg.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    command.upgrade(cfg, "head")
    yield
    command.downgrade(cfg, "base")


@pytest_asyncio.fixture
async def db_session(_migrated_test_db):
    engine = create_async_engine(TEST_DATABASE_URL)
    session_factory = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        yield session
    await engine.dispose()


@pytest.fixture
def fake_user_id() -> uuid.UUID:
    return uuid.uuid4()


async def create_auth_user(session: AsyncSession, user_id: uuid.UUID, email: str) -> None:
    """Inserts directly into Supabase's auth.users so the on_auth_user_created
    trigger fires and mirrors a row into public.users — the FK on users.id requires
    a real auth.users row to exist first, same as a real signup would produce."""
    from sqlalchemy import text

    await session.execute(
        text(
            "insert into auth.users (id, email, instance_id, aud, role) "
            "values (:id, :email, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')"
        ),
        {"id": str(user_id), "email": email},
    )
    await session.commit()
