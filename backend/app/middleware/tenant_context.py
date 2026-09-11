"""Tenant context (SET LOCAL app.current_org_id) is established per-request inside
app.dependencies.get_db, not here as FastAPI middleware — it needs the resolved,
membership-validated TenantContext (see app.dependencies.get_current_org), which
depends on parsing the JWT and checking the X-Organization-Id header, i.e. it's
naturally a Depends() chain, not a raw ASGI middleware. This module intentionally
has no logic; it exists so the folder layout matches the documented architecture,
and as the place to add cross-cutting *request* concerns (e.g. attaching org_id to
structured logs) once app/core/logging.py exists.
"""
