"""Generic Sellerboard page content.

The 61 "Sellerboard" pages (Profit/PPC/Inventory Tools/Autoresponder/Money Back/
Alerts/eBay/Walmart/Amazon/Shopify/QuickBooks/Account Settings) share ONE frontend
renderer (SellerboardPage.jsx) driven by a per-route config object. None of them
have a real integration behind them (no Amazon/eBay/Walmart/Shopify/QuickBooks
OAuth exists or is in scope) — see BACKEND_READINESS_REPORT.md §5/§9 and the
project plan's "generic Sellerboard content" section. Modeling ~40 bespoke
per-page schemas for placeholder data would be pure speculative engineering, so
these tables instead capture exactly the presentation contract the frontend
already proves correct: kpi cards / a chart series / a table (generic columns +
JSONB rows) / product cards / a settings form, all keyed by (organization_id,
route_path). Real per-org rows are written by scripts/seed_sellerboard_shapes.py.

Standard tenant_isolation RLS only — no platform_admin_bypass here (see the
project plan: this content isn't meaningful "what is a user doing/buying"
signal, unlike the core domain and activity_log).

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-11

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None

_TABLES = (
    "sellerboard_page_meta",
    "sellerboard_kpi_cards",
    "sellerboard_chart_series",
    "sellerboard_table_columns",
    "sellerboard_table_rows",
    "sellerboard_product_cards",
    "sellerboard_settings_groups",
    "sellerboard_settings_fields",
)


def upgrade() -> None:
    op.execute(
        """
        create table sellerboard_page_meta (
            id                uuid primary key default gen_random_uuid(),
            organization_id   uuid not null references organizations(id) on delete restrict,
            route_path        text not null,
            badge             text,
            title             text not null,
            subtitle          text,
            variant           text,
            table_title       text,
            created_at        timestamptz not null default now(),
            updated_at        timestamptz not null default now(),
            unique (organization_id, route_path)
        )
        """
    )
    op.execute(
        """
        create table sellerboard_kpi_cards (
            id           uuid primary key default gen_random_uuid(),
            page_id      uuid not null references sellerboard_page_meta(id) on delete cascade,
            label        text not null,
            value        text not null,
            delta        text,
            tone         text,
            bar          integer,
            note         text,
            sort_order   integer not null default 0
        )
        """
    )
    op.execute(
        """
        create table sellerboard_chart_series (
            id           uuid primary key default gen_random_uuid(),
            page_id      uuid not null references sellerboard_page_meta(id) on delete cascade unique,
            chart_title  text not null,
            data         jsonb not null,
            labels       jsonb not null
        )
        """
    )
    op.execute(
        """
        create table sellerboard_table_columns (
            id           uuid primary key default gen_random_uuid(),
            page_id      uuid not null references sellerboard_page_meta(id) on delete cascade,
            key          text not null,
            header       text not null,
            col_type     text,
            sort_order   integer not null default 0
        )
        """
    )
    op.execute(
        """
        create table sellerboard_table_rows (
            id           uuid primary key default gen_random_uuid(),
            page_id      uuid not null references sellerboard_page_meta(id) on delete cascade,
            row_key      text not null,
            data         jsonb not null,
            sort_order   integer not null default 0
        )
        """
    )
    op.execute(
        """
        create table sellerboard_product_cards (
            id           uuid primary key default gen_random_uuid(),
            page_id      uuid not null references sellerboard_page_meta(id) on delete cascade,
            name         text not null,
            sku          text,
            status       text,
            stats        jsonb not null,
            sort_order   integer not null default 0
        )
        """
    )
    op.execute(
        """
        create table sellerboard_settings_groups (
            id           uuid primary key default gen_random_uuid(),
            page_id      uuid not null references sellerboard_page_meta(id) on delete cascade,
            title        text not null,
            description  text,
            sort_order   integer not null default 0
        )
        """
    )
    op.execute(
        """
        create table sellerboard_settings_fields (
            id           uuid primary key default gen_random_uuid(),
            group_id     uuid not null references sellerboard_settings_groups(id) on delete cascade,
            label        text not null,
            description  text,
            field_type   text not null,
            value        text,
            options      jsonb,
            sort_order   integer not null default 0
        )
        """
    )

    op.execute("create index idx_sellerboard_page_meta_org on sellerboard_page_meta(organization_id)")
    op.execute("create index idx_sellerboard_kpi_cards_page on sellerboard_kpi_cards(page_id)")
    op.execute("create index idx_sellerboard_table_columns_page on sellerboard_table_columns(page_id)")
    op.execute("create index idx_sellerboard_table_rows_page on sellerboard_table_rows(page_id)")
    op.execute("create index idx_sellerboard_product_cards_page on sellerboard_product_cards(page_id)")
    op.execute("create index idx_sellerboard_settings_groups_page on sellerboard_settings_groups(page_id)")
    op.execute("create index idx_sellerboard_settings_fields_group on sellerboard_settings_fields(group_id)")

    # sellerboard_page_meta is the only table here with its own organization_id;
    # every other table is scoped transitively through page_id (or group_id, for
    # settings_fields) — same reasoning as 0001's role_permissions policy.
    op.execute("alter table sellerboard_page_meta enable row level security")
    op.execute("alter table sellerboard_page_meta force row level security")
    op.execute(
        """
        create policy tenant_isolation_sellerboard_page_meta on sellerboard_page_meta for all
        using (organization_id = current_setting('app.current_org_id', true)::uuid)
        with check (organization_id = current_setting('app.current_org_id', true)::uuid)
        """
    )

    for table in (
        "sellerboard_kpi_cards",
        "sellerboard_chart_series",
        "sellerboard_table_columns",
        "sellerboard_table_rows",
        "sellerboard_product_cards",
        "sellerboard_settings_groups",
    ):
        op.execute(f"alter table {table} enable row level security")
        op.execute(f"alter table {table} force row level security")
        op.execute(
            f"""
            create policy tenant_isolation_{table} on {table} for all
            using (page_id in (
                select id from sellerboard_page_meta
                where organization_id = current_setting('app.current_org_id', true)::uuid
            ))
            with check (page_id in (
                select id from sellerboard_page_meta
                where organization_id = current_setting('app.current_org_id', true)::uuid
            ))
            """
        )

    op.execute("alter table sellerboard_settings_fields enable row level security")
    op.execute("alter table sellerboard_settings_fields force row level security")
    op.execute(
        """
        create policy tenant_isolation_sellerboard_settings_fields on sellerboard_settings_fields for all
        using (group_id in (
            select g.id from sellerboard_settings_groups g
            join sellerboard_page_meta p on p.id = g.page_id
            where p.organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        with check (group_id in (
            select g.id from sellerboard_settings_groups g
            join sellerboard_page_meta p on p.id = g.page_id
            where p.organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        """
    )


def downgrade() -> None:
    for table in reversed(_TABLES):
        op.execute(f"drop table if exists {table} cascade")
