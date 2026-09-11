from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, computed_field

T = TypeVar("T")


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int

    @computed_field  # type: ignore[prop-decorator]
    @property
    def total_pages(self) -> int:
        # A plain @property is invisible to Pydantic's serializer — @computed_field
        # is required for total_pages to actually appear in the JSON response
        # (response_model=Page[...] would otherwise silently drop it).
        return max(1, -(-self.total // self.page_size))  # ceil div


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: object | None = None


class ErrorResponse(BaseModel):
    error: ErrorDetail
