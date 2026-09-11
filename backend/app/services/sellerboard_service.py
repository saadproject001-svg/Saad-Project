import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.sellerboard_content import (
    SellerboardChartSeries,
    SellerboardKpiCard,
    SellerboardPageMeta,
    SellerboardProductCard,
    SellerboardSettingsField,
    SellerboardSettingsGroup,
    SellerboardTableColumn,
    SellerboardTableRow,
)
from app.schemas.sellerboard import (
    SellerboardChartOut,
    SellerboardColumnOut,
    SellerboardKpiOut,
    SellerboardPageOut,
    SellerboardProductCardOut,
    SellerboardProductStatOut,
    SellerboardSettingsFieldOut,
    SellerboardSettingsGroupOut,
    SellerboardTableOut,
)


def _coerce_field_value(field_type: str, raw: str | None) -> bool | str | None:
    if field_type == "toggle":
        return raw == "true"
    return raw


async def get_sellerboard_page(db: AsyncSession, organization_id: uuid.UUID, route_path: str) -> SellerboardPageOut:
    page = (
        await db.execute(
            select(SellerboardPageMeta).where(
                SellerboardPageMeta.organization_id == organization_id, SellerboardPageMeta.route_path == route_path
            )
        )
    ).scalar_one_or_none()
    if page is None:
        raise NotFoundError(f"No Sellerboard page configured for {route_path!r}")

    kpis = None
    if page.variant not in ("products", "settings"):
        kpi_rows = (
            (await db.execute(select(SellerboardKpiCard).where(SellerboardKpiCard.page_id == page.id).order_by(SellerboardKpiCard.sort_order)))
            .scalars()
            .all()
        )
        if kpi_rows:
            kpis = [SellerboardKpiOut(label=k.label, value=k.value, delta=k.delta, tone=k.tone, bar=k.bar, note=k.note) for k in kpi_rows]

    chart = None
    if page.variant not in ("products", "settings"):
        chart_row = (await db.execute(select(SellerboardChartSeries).where(SellerboardChartSeries.page_id == page.id))).scalar_one_or_none()
        if chart_row is not None:
            chart = SellerboardChartOut(data=chart_row.data, labels=chart_row.labels, title=chart_row.chart_title)

    table = None
    if page.variant not in ("products", "settings"):
        columns = (
            (await db.execute(select(SellerboardTableColumn).where(SellerboardTableColumn.page_id == page.id).order_by(SellerboardTableColumn.sort_order)))
            .scalars()
            .all()
        )
        if columns:
            rows = (
                (await db.execute(select(SellerboardTableRow).where(SellerboardTableRow.page_id == page.id).order_by(SellerboardTableRow.sort_order)))
                .scalars()
                .all()
            )
            table = SellerboardTableOut(
                columns=[SellerboardColumnOut(key=c.key, header=c.header, type=c.col_type) for c in columns],
                rows=[r.data for r in rows],
            )

    products = None
    if page.variant == "products":
        product_rows = (
            (await db.execute(select(SellerboardProductCard).where(SellerboardProductCard.page_id == page.id).order_by(SellerboardProductCard.sort_order)))
            .scalars()
            .all()
        )
        products = [
            SellerboardProductCardOut(
                name=p.name, sku=p.sku, status=p.status, stats=[SellerboardProductStatOut(**s) for s in p.stats]
            )
            for p in product_rows
        ]

    settings = None
    if page.variant == "settings":
        group_rows = (
            (await db.execute(select(SellerboardSettingsGroup).where(SellerboardSettingsGroup.page_id == page.id).order_by(SellerboardSettingsGroup.sort_order)))
            .scalars()
            .all()
        )
        settings = []
        for group in group_rows:
            field_rows = (
                (
                    await db.execute(
                        select(SellerboardSettingsField)
                        .where(SellerboardSettingsField.group_id == group.id)
                        .order_by(SellerboardSettingsField.sort_order)
                    )
                )
                .scalars()
                .all()
            )
            settings.append(
                SellerboardSettingsGroupOut(
                    title=group.title,
                    description=group.description,
                    fields=[
                        SellerboardSettingsFieldOut(
                            label=f.label,
                            description=f.description,
                            type=f.field_type,
                            value=_coerce_field_value(f.field_type, f.value),
                            options=f.options,
                        )
                        for f in field_rows
                    ],
                )
            )

    return SellerboardPageOut(
        badge=page.badge,
        title=page.title,
        subtitle=page.subtitle,
        variant=page.variant,
        table_title=page.table_title,
        kpis=kpis,
        chart=chart,
        table=table,
        products=products,
        settings=settings,
    )
