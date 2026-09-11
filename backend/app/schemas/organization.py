import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class OrganizationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200, pattern=r"^[a-z0-9-]+$")


class OrganizationOut(ORMModel):
    id: uuid.UUID
    name: str
    slug: str
    created_at: datetime


class WorkspaceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)


class WorkspaceOut(ORMModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    created_at: datetime
