import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import ActivityEventType
from app.models.activity_log import ActivityLog


async def log_activity(
    db: AsyncSession,
    *,
    actor_user_id: uuid.UUID,
    event_type: ActivityEventType,
    summary: str,
    organization_id: uuid.UUID | None = None,
    metadata: dict | None = None,
) -> ActivityLog:
    """Writes one activity_log row. `actor_user_id` MUST equal the calling session's
    own app.current_user_id — the activity_log_insert RLS policy (migration 0002)
    enforces this, so pass the identity the session was already authenticated as,
    never a client-supplied value. Caller is responsible for flush/commit timing,
    matching every other service in this codebase (see auth_service.create_organization) —
    this function only adds to the session, it never commits."""
    entry = ActivityLog(
        id=uuid.uuid4(),
        organization_id=organization_id,
        actor_user_id=actor_user_id,
        event_type=event_type.value,
        summary=summary,
        event_metadata=metadata,
    )
    db.add(entry)
    await db.flush()
    return entry
