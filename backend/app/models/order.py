import uuid
from datetime import date
from decimal import Decimal

from sqlalchemy import Boolean, Computed, Date, ForeignKey, Integer, Numeric, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TenantScopedMixin, TimestampMixin


class Order(Base, TenantScopedMixin, TimestampMixin):
    """Unified purchase/sales/transfer order (app.core.constants.OrderType) —
    replaces three separate mock concepts (Orders.jsx's orders, and Warehouse.jsx's
    incomingShipments/outgoingShipments/pendingTransfers, which are really just
    Purchase/Sales/Transfer orders filtered by status; see
    app.services.order_service for those derived queries). total_amount is always
    recomputed server-side from order_items, never client-set directly."""

    __tablename__ = "orders"
    __table_args__ = (UniqueConstraint("organization_id", "order_number", name="uq_orders_org_number"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number: Mapped[str] = mapped_column(String(50), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # OrderType: Purchase | Sales | Transfer
    counterparty_name: Mapped[str | None] = mapped_column(String(200))  # supplier name / customer name
    source_warehouse_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="SET NULL")
    )
    destination_warehouse_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("warehouses.id", ondelete="SET NULL")
    )
    order_date: Mapped[date] = mapped_column(Date, nullable=False)
    payment_status: Mapped[str | None] = mapped_column(String(50))  # KnownStatus
    fulfillment_status: Mapped[str] = mapped_column(String(50), nullable=False)  # KnownStatus
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="Normal")  # Priority
    assigned_to_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    carrier: Mapped[str | None] = mapped_column(String(50))
    tracking_number: Mapped[str | None] = mapped_column(String(100))
    expected_delivery_date: Mapped[date | None] = mapped_column(Date)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("products.id", ondelete="RESTRICT"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    line_total: Mapped[Decimal] = mapped_column(
        Numeric(14, 2), Computed("quantity * unit_price", persisted=True)
    )


class OrderDeliveryStep(Base):
    """Backs Orders.jsx's deliverySteps[] / DeliveryTimeline.jsx."""

    __tablename__ = "order_delivery_steps"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    step_date: Mapped[date | None] = mapped_column(Date)
    is_done: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
