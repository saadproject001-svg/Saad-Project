"""Seeds a local dev database with a realistic organization/user/team setup.

Deliberately NOT a copy of the frontend's mock numbers (BACKEND_READINESS_REPORT.md
flags those as fake/decorative — e.g. pagination totals disconnected from actual
row counts). Ask for real volume expectations before using this for load testing.

Usage: `python scripts/seed_dev_data.py` (requires DATABASE_URL in .env, and a
Supabase auth.users row for the dev user already created via the Supabase
dashboard or `supabase auth signup`, since users.id has a hard FK to auth.users).
"""

import asyncio
import sys
import uuid

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import get_settings
from app.services.auth_service import create_organization

# Deliberately its own engine on migrations_database_url, NOT app.db.session's
# AsyncSessionLocal — dev tooling like this should run as the elevated/admin role,
# never the runtime app role. See app/config.py's migrations_database_url docstring.
settings = get_settings()
_engine = create_async_engine(settings.resolved_migrations_database_url)
_SeedSession = async_sessionmaker(bind=_engine, expire_on_commit=False, class_=AsyncSession)


async def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python scripts/seed_dev_data.py <existing-auth-user-uuid>")
        sys.exit(1)

    dev_user_id = uuid.UUID(sys.argv[1])

    async with _SeedSession() as db:
        org = await create_organization(db, creator_user_id=dev_user_id, name="Dev Organization", slug="dev-org")
        print(f"Created organization {org.name} ({org.id}) with {dev_user_id} as Owner")
    await _engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
