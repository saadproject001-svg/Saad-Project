from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "development"
    database_url: str
    # Elevated connection for Alembic migrations and local dev seed scripts ONLY —
    # never used by the running API process (see app/db/session.py, which reads
    # database_url exclusively). Falls back to database_url so local dev works
    # out of the box, but production should point this at a role that owns the
    # schema (or has BYPASSRLS) while database_url points at a role that does
    # NOT — otherwise a compromised/buggy app process could run DDL against its
    # own RLS policies (e.g. `ALTER TABLE ... DISABLE ROW LEVEL SECURITY`) using
    # the exact same credentials it serves normal requests with. See README.md's
    # "Database roles" section.
    migrations_database_url: str = ""
    supabase_url: str
    supabase_jwt_secret: str
    supabase_service_role_key: str
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str
    api_v1_prefix: str = "/api/v1"
    cors_origins: str = "http://localhost:5173"
    credential_encryption_key: str
    sentry_dsn: str = ""
    log_level: str = "INFO"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def resolved_migrations_database_url(self) -> str:
        return self.migrations_database_url or self.database_url


@lru_cache
def get_settings() -> Settings:
    return Settings()
