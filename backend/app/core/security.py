"""Verifies Supabase Auth JWTs. FastAPI never issues its own tokens for end users —
Supabase Auth (frontend calls supabase-js directly for signup/login) issues them,
and every backend request must present one. This module only verifies; it never
mints a user-facing token itself (see app/services/auth_service.py for invite-only
flows that DO need a server-issued, short-lived token, e.g. team invites).
"""

from dataclasses import dataclass
from uuid import UUID

from jose import JWTError, jwt

from app.config import get_settings
from app.core.exceptions import UnauthorizedError

settings = get_settings()

ALGORITHM = "HS256"  # Supabase's default JWT signing alg for the shared project secret.


@dataclass(frozen=True)
class SupabasePrincipal:
    user_id: UUID
    email: str | None
    raw_claims: dict


def decode_supabase_jwt(token: str) -> SupabasePrincipal:
    try:
        claims = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=[ALGORITHM],
            audience="authenticated",
            options={"verify_aud": True},
        )
    except JWTError as exc:
        raise UnauthorizedError("Invalid or expired token") from exc

    sub = claims.get("sub")
    if not sub:
        raise UnauthorizedError("Token missing subject claim")

    return SupabasePrincipal(user_id=UUID(sub), email=claims.get("email"), raw_claims=claims)
