import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import SoftDeleteMixin, TenantScopedMixin, TimestampMixin


class Product(Base, TenantScopedMixin, TimestampMixin, SoftDeleteMixin):
    """Canonical product — the single source of truth that replaces the frontend's
    6 previously-incompatible mock shapes (see BACKEND_READINESS_REPORT.md §3).
    Soft-deleted (not hard-deleted) because historical order_items must still be
    able to resolve a discontinued product's name/sku. status/totalValue/marginPct
    are deliberately NOT columns — see app.services.computed_fields, the single
    place those are derived, so they can never drift from the raw cost/stock data."""

    __tablename__ = "products"
    __table_args__ = (UniqueConstraint("organization_id", "sku", name="uq_products_org_sku"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))
    brand: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    barcode: Mapped[str | None] = mapped_column(String(100))
    unit: Mapped[str] = mapped_column(String(50), nullable=False, default="Each")
    icon: Mapped[str | None] = mapped_column(String(10))
    unit_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    selling_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    reorder_point: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fulfillment_type: Mapped[str | None] = mapped_column(String(20))  # FBA | FBM | SFP


class ProductSpec(Base):
    """Free-form label/value spec rows (ProductDetails.jsx's specs table). Scoped
    transitively through product_id -> products.organization_id, no organization_id
    of its own (see migration 0003's tenant_isolation_product_specs policy)."""

    __tablename__ = "product_specs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(String(300), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class ProductFbaFees(Base):
    """Optional 1:1 FBA fee breakdown — Amazon-fulfillment-specific, so it's a
    child table rather than columns on every product (most rows won't have one)."""

    __tablename__ = "product_fba_fees"

    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    )
    referral: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    fulfillment: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    storage: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    long_term: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
