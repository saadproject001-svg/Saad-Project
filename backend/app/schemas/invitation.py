import uuid
from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import ORMModel


class InvitationOut(ORMModel):
    id: uuid.UUID
    email: str
    role_id: uuid.UUID
    status: str
    expires_at: datetime


class AcceptInvitationRequest(BaseModel):
    token: str


class InvitationCreateResult(BaseModel):
    invitation: InvitationOut
    # In production this is emailed via app/jobs/notification_tasks.py, never
    # returned in the API response — surfaced here only so local/dev flows without
    # email configured can still complete the loop.
    accept_url_dev_only: str | None = None
