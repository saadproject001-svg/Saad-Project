import uuid
from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TenantScopedMixin, TimestampMixin


class Supplier(Base, TenantScopedMixin, TimestampMixin):
    __tablename__ = "suppliers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(10))
    contact_name: Mapped[str | None] = mapped_column(String(200))
    email: Mapped[str | None] = mapped_column(String(320))
    phone: Mapped[str | None] = mapped_column(String(50))
    country: Mapped[str | None] = mapped_column(String(100))
    lead_time_days: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rating: Mapped[Decimal] = mapped_column(Numeric(2, 1), nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Active")


class ProductSupplier(Base):
    """Product <-> Supplier link, relational (replaces the old mock data's free-text
    supplier name on each product). Scoped transitively through product_id."""

    __tablename__ = "product_suppliers"

    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    )
    supplier_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="CASCADE"), primary_key=True
    )
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
