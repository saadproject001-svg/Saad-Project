from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=not settings.is_production,
    # Explicit, not relied-on-as-default: a pooled connection MUST be rolled back
    # before reuse, since `SET LOCAL app.current_user_id/app.current_org_id`
    # (app.dependencies.get_db/get_plain_db) only lasts until the current Postgres
    # transaction ends — a connection handed to a new request while still "inside"
    # a previous request's transaction would leak that request's tenant context.
    # SQLAlchemy defaults to this already for asyncpg, but pinning it here means a
    # future SQLAlchemy default change or engine-config edit can't silently
    # reintroduce a cross-tenant leak. See tests/integration/test_connection_pool_isolation.py.
    pool_reset_on_return="rollback",
)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yields a session with no tenant context set. Only app.dependencies.get_db_with_tenant
    (which additionally sets app.current_org_id for RLS) should be used inside request handlers
    that touch tenant-scoped tables."""
    async with AsyncSessionLocal() as session:
        yield session
