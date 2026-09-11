import uuid

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TenantScopedMixin, TimestampMixin

# All child tables below are intentionally NOT TenantScopedMixin — they carry no
# organization_id of their own, scoped transitively through page_id (or group_id
# for SellerboardSettingsField), matching the RLS policies in migration 0004.


class SellerboardPageMeta(Base, TenantScopedMixin, TimestampMixin):
    """One row per (organization, route_path) — the generic replacement for a
    single hand-written entry in the old frontend/src/data/sellerboardData.js."""

    __tablename__ = "sellerboard_page_meta"
    __table_args__ = (UniqueConstraint("organization_id", "route_path", name="uq_sellerboard_page_meta_org_route"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_path: Mapped[str] = mapped_column(String(200), nullable=False)
    badge: Mapped[str | None] = mapped_column(String(200))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(Text)
    variant: Mapped[str | None] = mapped_column(String(20))  # null | "products" | "settings"
    table_title: Mapped[str | None] = mapped_column(String(200))


class SellerboardKpiCard(Base):
    __tablename__ = "sellerboard_kpi_cards"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sellerboard_page_meta.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(String(100), nullable=False)
    delta: Mapped[str | None] = mapped_column(String(50))
    tone: Mapped[str | None] = mapped_column(String(20))
    bar: Mapped[int | None] = mapped_column(Integer)
    note: Mapped[str | None] = mapped_column(String(200))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class SellerboardChartSeries(Base):
    __tablename__ = "sellerboard_chart_series"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sellerboard_page_meta.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    chart_title: Mapped[str] = mapped_column(String(200), nullable=False)
    data: Mapped[list] = mapped_column(JSONB, nullable=False)
    labels: Mapped[list] = mapped_column(JSONB, nullable=False)


class SellerboardTableColumn(Base):
    __tablename__ = "sellerboard_table_columns"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sellerboard_page_meta.id", ondelete="CASCADE"), nullable=False, index=True
    )
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    header: Mapped[str] = mapped_column(String(100), nullable=False)
    col_type: Mapped[str | None] = mapped_column(String(20))  # status | bold | muted | thumb | avatar
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class SellerboardTableRow(Base):
    """`data` is deliberately JSONB, not a fixed set of columns — the old mock
    file documented 40+ ad hoc row shapes across these tables with no shared
    schema and no real business rules behind any of them (see the project plan's
    rationale for this generic design)."""

    __tablename__ = "sellerboard_table_rows"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sellerboard_page_meta.id", ondelete="CASCADE"), nullable=False, index=True
    )
    row_key: Mapped[str] = mapped_column(String(100), nullable=False)
    data: Mapped[dict] = mapped_column(JSONB, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class SellerboardProductCard(Base):
    __tablename__ = "sellerboard_product_cards"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sellerboard_page_meta.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    sku: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[str | None] = mapped_column(String(50))
    stats: Mapped[list] = mapped_column(JSONB, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class SellerboardSettingsGroup(Base):
    __tablename__ = "sellerboard_settings_groups"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sellerboard_page_meta.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class SellerboardSettingsField(Base):
    __tablename__ = "sellerboard_settings_fields"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sellerboard_settings_groups.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    field_type: Mapped[str] = mapped_column(String(20), nullable=False)  # toggle | input | select | button
    value: Mapped[str | None] = mapped_column(Text)
    options: Mapped[list | None] = mapped_column(JSONB)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
