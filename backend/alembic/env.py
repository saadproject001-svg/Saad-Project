import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from app.config import get_settings
from app.db.base import Base

# Import every model module so Base.metadata is fully populated for autogenerate.
import app.models  # noqa: F401,E402

config = context.config
settings = get_settings()
# Deliberately NOT settings.database_url: migrations run DDL (create table, alter
# table ... force row level security, create policy) which requires the
# connecting role to own the schema — the runtime app role (settings.database_url)
# should NOT have that ownership, so it can't be tricked/abused into altering its
# own RLS policies. See app/config.py's migrations_database_url docstring.
config.set_main_option("sqlalchemy.url", settings.resolved_migrations_database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
