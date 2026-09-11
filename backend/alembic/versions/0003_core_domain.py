"""Core domain: products, warehouses/inventory, suppliers, orders.

This is real business data (unlike the generic Sellerboard content in migration
0004), so it gets a normalized schema rather than the JSONB-content approach used
there. Every derived number (margin %, total value, FBA fee totals, stock status,
capacity %) is deliberately NOT a stored column — see app.services.computed_fields,
the single place those are computed, closing the "hand-typed percentages" risk
flagged in BACKEND_READINESS_REPORT.md §4/§8.

RLS follows 0001's pattern exactly: tenant_isolation_<table> for tables with their
own organization_id, a transitive policy (join through the parent) for child
tables that don't, and a platform_admin_bypass_<table> SELECT-only policy on every
table here — per the product decision that the platform super-admin's visibility
covers all real business data (products/inventory/suppliers/orders), not just
orgs/users/activity.

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-11

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None

_TENANT_SCOPED_TABLES = ("products", "warehouses", "inventory_locations", "suppliers", "orders")


def upgrade() -> None:
    # -----------------------------------------------------------------------
    # products
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table products (
            id                uuid primary key default gen_random_uuid(),
            organization_id   uuid not null references organizations(id) on delete restrict,
            sku               text not null,
            name              text not null,
            category          text,
            brand             text,
            description       text,
            barcode           text,
            unit              text not null default 'Each',
            icon              text,
            unit_cost         numeric(12,2) not null default 0,
            selling_price     numeric(12,2) not null default 0,
            reorder_point     integer not null default 0,
            fulfillment_type  text,
            deleted_at        timestamptz,
            created_at        timestamptz not null default now(),
            updated_at        timestamptz not null default now(),
            unique (organization_id, sku)
        )
        """
    )
    op.execute(
        """
        create table product_specs (
            id           uuid primary key default gen_random_uuid(),
            product_id   uuid not null references products(id) on delete cascade,
            label        text not null,
            value        text not null,
            sort_order   integer not null default 0
        )
        """
    )
    op.execute(
        """
        create table product_fba_fees (
            product_id   uuid primary key references products(id) on delete cascade,
            referral     numeric(10,2) not null default 0,
            fulfillment  numeric(10,2) not null default 0,
            storage      numeric(10,2) not null default 0,
            long_term    numeric(10,2) not null default 0
        )
        """
    )

    # -----------------------------------------------------------------------
    # warehouses / inventory_locations
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table warehouses (
            id                uuid primary key default gen_random_uuid(),
            organization_id   uuid not null references organizations(id) on delete restrict,
            name              text not null,
            city              text,
            country           text,
            status            text not null default 'Active',
            type              text not null default 'Self-Managed',
            capacity_units    integer not null default 0,
            created_at        timestamptz not null default now(),
            updated_at        timestamptz not null default now()
        )
        """
    )
    op.execute(
        """
        create table inventory_locations (
            id                uuid primary key default gen_random_uuid(),
            organization_id   uuid not null references organizations(id) on delete restrict,
            product_id        uuid not null references products(id) on delete cascade,
            warehouse_id      uuid not null references warehouses(id) on delete cascade,
            location_code     text,
            stock             integer not null default 0,
            reserved          integer not null default 0,
            created_at        timestamptz not null default now(),
            updated_at        timestamptz not null default now(),
            unique (organization_id, product_id, warehouse_id)
        )
        """
    )

    # -----------------------------------------------------------------------
    # suppliers
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table suppliers (
            id                uuid primary key default gen_random_uuid(),
            organization_id   uuid not null references organizations(id) on delete restrict,
            name              text not null,
            icon              text,
            contact_name      text,
            email             text,
            phone             text,
            country           text,
            lead_time_days    integer not null default 0,
            rating            numeric(2,1) not null default 0,
            status            text not null default 'Active',
            created_at        timestamptz not null default now(),
            updated_at        timestamptz not null default now()
        )
        """
    )
    op.execute(
        """
        create table product_suppliers (
            product_id   uuid not null references products(id) on delete cascade,
            supplier_id  uuid not null references suppliers(id) on delete cascade,
            is_primary   boolean not null default false,
            primary key (product_id, supplier_id)
        )
        """
    )

    # -----------------------------------------------------------------------
    # orders — unified purchase/sales/transfer (app.core.constants.OrderType).
    # Warehouse.jsx's incoming/outgoing/pending-transfer lists are filtered
    # queries over this table (see app.services.order_service), not separate
    # tables — there is no independent "shipment" concept in this schema.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table orders (
            id                        uuid primary key default gen_random_uuid(),
            organization_id           uuid not null references organizations(id) on delete restrict,
            order_number              text not null,
            type                      text not null,
            counterparty_name         text,
            source_warehouse_id       uuid references warehouses(id) on delete set null,
            destination_warehouse_id  uuid references warehouses(id) on delete set null,
            order_date                date not null,
            payment_status            text,
            fulfillment_status        text not null,
            priority                  text not null default 'Normal',
            assigned_to_user_id       uuid references users(id) on delete set null,
            carrier                   text,
            tracking_number           text,
            expected_delivery_date    date,
            total_amount              numeric(12,2) not null default 0,
            created_at                timestamptz not null default now(),
            updated_at                timestamptz not null default now(),
            unique (organization_id, order_number)
        )
        """
    )
    op.execute(
        """
        create table order_items (
            id           uuid primary key default gen_random_uuid(),
            order_id     uuid not null references orders(id) on delete cascade,
            product_id   uuid not null references products(id) on delete restrict,
            quantity     integer not null,
            unit_price   numeric(12,2) not null,
            line_total   numeric(14,2) generated always as (quantity * unit_price) stored
        )
        """
    )
    op.execute(
        """
        create table order_delivery_steps (
            id           uuid primary key default gen_random_uuid(),
            order_id     uuid not null references orders(id) on delete cascade,
            label        text not null,
            step_date    date,
            is_done      boolean not null default false,
            sort_order   integer not null default 0
        )
        """
    )

    # -----------------------------------------------------------------------
    # Indexes
    # -----------------------------------------------------------------------
    op.execute("create index idx_products_org on products(organization_id)")
    op.execute("create index idx_product_specs_product on product_specs(product_id)")
    op.execute("create index idx_warehouses_org on warehouses(organization_id)")
    op.execute("create index idx_inventory_locations_org on inventory_locations(organization_id)")
    op.execute("create index idx_inventory_locations_product on inventory_locations(product_id)")
    op.execute("create index idx_inventory_locations_warehouse on inventory_locations(warehouse_id)")
    op.execute("create index idx_suppliers_org on suppliers(organization_id)")
    op.execute("create index idx_orders_org on orders(organization_id)")
    op.execute("create index idx_orders_type on orders(organization_id, type)")
    op.execute("create index idx_order_items_order on order_items(order_id)")
    op.execute("create index idx_order_items_product on order_items(product_id)")
    op.execute("create index idx_order_delivery_steps_order on order_delivery_steps(order_id)")

    # -----------------------------------------------------------------------
    # RLS — same reasoning as 0001/0002 (this backend connects directly, so
    # tenant_isolation_* + FORCE ROW LEVEL SECURITY is the real boundary, not
    # anything PostgREST-flavored).
    # -----------------------------------------------------------------------
    all_tables = _TENANT_SCOPED_TABLES + (
        "product_specs",
        "product_fba_fees",
        "product_suppliers",
        "order_items",
        "order_delivery_steps",
    )
    for table in all_tables:
        op.execute(f"alter table {table} enable row level security")
        op.execute(f"alter table {table} force row level security")

    for table in _TENANT_SCOPED_TABLES:
        op.execute(
            f"""
            create policy tenant_isolation_{table} on {table} for all
            using (organization_id = current_setting('app.current_org_id', true)::uuid)
            with check (organization_id = current_setting('app.current_org_id', true)::uuid)
            """
        )

    # Child tables with no organization_id of their own — scope transitively
    # through their parent, same pattern as 0001's role_permissions policy.
    op.execute(
        """
        create policy tenant_isolation_product_specs on product_specs for all
        using (product_id in (
            select id from products where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        with check (product_id in (
            select id from products where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        """
    )
    op.execute(
        """
        create policy tenant_isolation_product_fba_fees on product_fba_fees for all
        using (product_id in (
            select id from products where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        with check (product_id in (
            select id from products where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        """
    )
    op.execute(
        """
        create policy tenant_isolation_product_suppliers on product_suppliers for all
        using (product_id in (
            select id from products where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        with check (product_id in (
            select id from products where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        """
    )
    op.execute(
        """
        create policy tenant_isolation_order_items on order_items for all
        using (order_id in (
            select id from orders where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        with check (order_id in (
            select id from orders where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        """
    )
    op.execute(
        """
        create policy tenant_isolation_order_delivery_steps on order_delivery_steps for all
        using (order_id in (
            select id from orders where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        with check (order_id in (
            select id from orders where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        """
    )

    # Platform-admin cross-tenant SELECT bypass (see migration 0002) — applied
    # broadly across all core-domain tables per the product decision that admin
    # visibility covers real business data, not just orgs/users/activity/orders.
    for table in all_tables:
        op.execute(
            f"""
            create policy platform_admin_bypass_{table} on {table} for select
            using (current_setting('app.is_platform_admin', true)::boolean is true)
            """
        )


def downgrade() -> None:
    op.execute("drop table if exists order_delivery_steps cascade")
    op.execute("drop table if exists order_items cascade")
    op.execute("drop table if exists orders cascade")
    op.execute("drop table if exists product_suppliers cascade")
    op.execute("drop table if exists suppliers cascade")
    op.execute("drop table if exists inventory_locations cascade")
    op.execute("drop table if exists warehouses cascade")
    op.execute("drop table if exists product_fba_fees cascade")
    op.execute("drop table if exists product_specs cascade")
    op.execute("drop table if exists products cascade")
