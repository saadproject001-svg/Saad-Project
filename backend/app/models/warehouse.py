import uuid

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TenantScopedMixin, TimestampMixin


class Warehouse(Base, TenantScopedMixin, TimestampMixin):
    __tablename__ = "warehouses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    city: Mapped[str | None] = mapped_column(String(100))
    country: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Active")
    type: Mapped[str] = mapped_column(String(50), nullable=False, default="Self-Managed")  # Self-Managed | Amazon FBA
    # Total stock-unit capacity — used only to derive capacity_used_pct
    # (app.services.computed_fields.compute_capacity_used_pct) against the live
    # SUM(inventory_locations.stock) for this warehouse; never stored redundantly.
    capacity_units: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class InventoryLocation(Base, TenantScopedMixin, TimestampMixin):
    """Per-warehouse stock for a product — this is the real relational form of what
    the old mock data flattened into a single product.warehouseDistribution[] array."""

    __tablename__ = "inventory_locations"
    __table_args__ = (
        UniqueConstraint("organization_id", "product_id", "warehouse_id", name="uq_inventory_location"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    warehouse_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    location_code: Mapped[str | None] = mapped_column(String(50))
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    reserved: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
