# Inventory Insights Pro — Backend

FastAPI + SQLAlchemy (async) + Supabase Postgres + Celery/Redis, deployed on Railway.
See `../BACKEND_READINESS_REPORT.md` for the frontend audit this backend is built
against, and the Prompt 2 master prompt (in conversation history) for the full
architecture decision log — key locked decisions:

- Financial computation (margins, ACOS/TACOS, FBA-fee totals) is always server-side.
- Status values must match `app/utils/status_enum.py`'s `KnownStatus` enum exactly
  (mirrors `frontend/src/components/StatusBadge.jsx`, which silently renders gray
  for anything unrecognized) — see `tests/integration/test_status_enum_contract.py`.
- MVP is single-currency (USD) but the schema is multi-currency-ready from day one.
- API endpoints are generic/composable (`/api/v1/analytics/*`), not one per
  Sellerboard page — see the analytics deliverable once it lands.

## Status

**Deliverable 1 complete: multi-tenant foundation.** Organizations, canonical
Users (replacing the frontend's three disconnected mock sources), per-org
Roles/Permissions (RBAC), team invitations, and Postgres RLS enforced at the
database layer — see `alembic/versions/0001_multi_tenant_foundation.py`.

`backend/supabase/legacy/` holds the prior single-tenant, blanket-RLS prototype
schema (`schema.sql`, `seed.sql`) that this backend supersedes — kept for
reference only, not applied to any database this app connects to.

Everything past this point (canonical Product model, inventory ledger, orders,
finance engine, integrations, etc.) is the next deliverables in the locked build
order — not yet implemented.

## Local setup

```bash
cp .env.example .env   # fill in DATABASE_URL, SUPABASE_*, SECRET_KEY, etc.
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
```

## Database roles

Two separate connection strings, two separate purposes — never conflate them:

- **`DATABASE_URL`** — the runtime app role. Every API request uses this
  (`app/db/session.py`). In production this role must **not** own the schema and
  must **not** have `BYPASSRLS`. If it did, a compromised or buggy app process
  could run DDL against its own RLS setup (e.g. `ALTER TABLE ... DISABLE ROW
  LEVEL SECURITY`) using the exact same credentials it serves normal traffic
  with — RLS would then protect nothing.
- **`MIGRATIONS_DATABASE_URL`** — the elevated/admin role. Used only by
  `alembic upgrade` (`alembic/env.py`) and `scripts/seed_dev_data.py`, never by
  the deployed API. Needs schema ownership to run `CREATE TABLE`,
  `ALTER TABLE ... FORCE ROW LEVEL SECURITY`, `CREATE POLICY`, etc. Falls back to
  `DATABASE_URL` if unset (fine for local dev where the distinction doesn't
  matter yet) — set it explicitly and differently in CI/production.

Note on scope: the current schema (0001) is pure DDL plus one self-contained
trigger (see below), so today's migration would actually run fine even without
this split, since RLS only restricts DML (`SELECT`/`INSERT`/`UPDATE`/`DELETE`),
never `CREATE`/`ALTER` statements. The split exists for blast-radius reduction as
the schema grows, not because migrations are broken without it.

**A concrete bug this area did surface:** the `on_auth_user_created` trigger
(fires inside *Supabase Auth's own* signup transaction, not anything our backend
controls) inserts into `public.users`, which has `FORCE ROW LEVEL SECURITY`. Its
`users_self_access` policy requires `id = current_setting('app.current_user_id')`
— a variable that would never be set during a real signup, so every signup would
have failed RLS. Fixed in the migration by having the trigger call
`perform set_config('app.current_user_id', new.id::text, true)` on itself
immediately before the insert.

## Architecture notes worth knowing before extending this

- **RLS uses our own session variables, not Supabase's `auth.uid()`.** This
  backend connects to Postgres directly via asyncpg, not through Supabase's
  PostgREST layer, so `auth.uid()` (which reads a PostgREST-only session setting)
  and `to authenticated` (a Postgres role PostgREST assumes) do nothing here. Every
  RLS policy instead keys off `app.current_user_id` / `app.current_org_id`, set
  per-request by `app/dependencies.py` from the already-verified Supabase JWT. All
  tenant tables use `FORCE ROW LEVEL SECURITY` so the connecting role can't bypass
  RLS as table owner.
- **`SET LOCAL` doesn't survive `commit()`.** Any service that commits mid-flow
  must not run a further RLS-guarded query afterward — use `db.flush()` (Postgres
  RETURNING already populates server-generated columns) instead of
  `commit()` + `refresh()`. See the docstrings in `app/dependencies.py`,
  `app/services/auth_service.py`, and `app/services/invitation_service.py`.
- **`models/` vs `schemas/` vs `services/` vs `api/v1/`**: routes stay thin and
  only call services; services hold business logic and are independently
  unit-testable; models are DB shape; schemas are API shape. Never return a raw
  ORM model from a route.

## Testing

```bash
pytest tests/unit                                    # no DB required
TEST_DATABASE_URL=postgresql+asyncpg://... pytest tests/integration tests/api
```

Integration/API tests need a real Supabase-shaped Postgres (local `supabase start`
or a disposable Supabase project) — `auth.users` and RLS have no SQLite/plain-Postgres
equivalent. See `tests/conftest.py`.
