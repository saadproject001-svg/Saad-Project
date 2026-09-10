-- ============================================================================
-- Inventory Insights Pro — Supabase schema
-- Run this whole file once in: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------
create type product_status as enum ('Optimal', 'Low Stock', 'Out of Stock', 'Overstock');
create type fulfillment_type as enum ('FBA', 'FBM', 'SFP');
create type supplier_status as enum ('Active', 'Pending', 'Inactive');
create type warehouse_status as enum ('Active', 'Near Full', 'Maintenance', 'Inactive');
create type warehouse_type as enum ('Self-Managed', 'Amazon FBA');
create type order_type as enum ('Purchase', 'Sales', 'Transfer');
create type payment_status as enum ('Paid', 'Pending', 'Failed', 'N/A');
create type order_fulfillment_status as enum ('Pending', 'Processing', 'Shipped', 'In Transit', 'Delivered', 'On Hold', 'Cancelled', 'Returned');
create type order_priority as enum ('Low', 'Normal', 'High', 'Urgent');
create type transfer_status as enum ('Requested', 'Approved', 'In Transit', 'Completed', 'Cancelled');
create type refund_status as enum ('Refunded', 'Processing', 'Rejected');
create type user_role as enum ('Administrator', 'Manager', 'Inventory Manager', 'Warehouse Manager');
create type user_status as enum ('Active', 'Inactive');

-- ---------------------------------------------------------------------------
-- REFERENCE TABLES
-- ---------------------------------------------------------------------------
create table categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

create table suppliers (
  id             uuid primary key default gen_random_uuid(),
  supplier_code  text unique,                       -- e.g. SUP-1028
  name           text not null,
  contact_name   text,
  email          text,
  phone          text,
  country        text,
  lead_time_days int,
  rating         numeric(2,1),
  purchase_value numeric(14,2) default 0,
  outstanding    numeric(14,2) default 0,
  status         supplier_status not null default 'Active',
  last_order_at  date,
  created_at     timestamptz not null default now()
);

create table warehouses (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  city              text,
  country           text,
  type              warehouse_type not null default 'Self-Managed',
  status            warehouse_status not null default 'Active',
  capacity_sqft     numeric(14,2),
  used_capacity_pct numeric(5,2),
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------------
create table products (
  id               uuid primary key default gen_random_uuid(),
  sku              text not null unique,
  product_code     text,                              -- e.g. PP15-GX-256
  name             text not null,
  icon             text,                               -- lucide icon name
  category_id      uuid references categories(id) on delete set null,
  brand            text,
  supplier_id      uuid references suppliers(id) on delete set null,
  primary_warehouse_id uuid references warehouses(id) on delete set null,
  reorder_point    int not null default 0,
  unit_cost        numeric(12,2) not null default 0,
  selling_price    numeric(12,2) not null default 0,
  fulfillment_type fulfillment_type not null default 'FBM',
  barcode          text,
  unit             text default 'Each',
  description      text,
  status           product_status not null default 'Optimal', -- kept in sync by trigger below
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table product_specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,
  value       text not null,
  sort_order  int not null default 0
);

create table product_fba_fees (
  product_id  uuid primary key references products(id) on delete cascade,
  referral    numeric(10,2) default 0,
  fulfillment numeric(10,2) default 0,
  storage     numeric(10,2) default 0,
  long_term   numeric(10,2) default 0
);

-- Per-warehouse stock split. This is the single source of truth for stock
-- quantities — product-level totals are derived, never stored twice.
create table warehouse_stock (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  warehouse_id uuid not null references warehouses(id) on delete cascade,
  location     text,                     -- e.g. A01-R03-B12
  stock        int not null default 0,
  reserved     int not null default 0,
  available    int generated always as (stock - reserved) stored,
  updated_at   timestamptz not null default now(),
  unique (product_id, warehouse_id)
);

-- ---------------------------------------------------------------------------
-- STOCK TRANSFERS (between warehouses)
-- ---------------------------------------------------------------------------
create table stock_transfers (
  id                      uuid primary key default gen_random_uuid(),
  transfer_code           text unique,               -- e.g. #TR-20841
  source_warehouse_id     uuid references warehouses(id),
  destination_warehouse_id uuid references warehouses(id),
  status                  transfer_status not null default 'Requested',
  requested_at            timestamptz not null default now(),
  completed_at            timestamptz
);

create table stock_transfer_items (
  id            uuid primary key default gen_random_uuid(),
  transfer_id   uuid not null references stock_transfers(id) on delete cascade,
  product_id    uuid not null references products(id),
  quantity      int not null check (quantity > 0)
);

-- ---------------------------------------------------------------------------
-- ORDERS (Purchase / Sales) + line items + delivery tracking
-- ---------------------------------------------------------------------------
create table orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null unique,          -- e.g. #PO-10482, #SO-78314
  type               order_type not null,
  party_name         text not null,                 -- supplier or customer name
  party_ref          text,                           -- e.g. SUP-2041 / CUS-8842
  order_date         date not null default current_date,
  warehouse_id       uuid references warehouses(id),
  payment_status     payment_status not null default 'Pending',
  fulfillment_status order_fulfillment_status not null default 'Pending',
  delivery_date      date,
  priority           order_priority not null default 'Normal',
  assigned_to        text,
  carrier            text,
  tracking_number    text,
  total              numeric(14,2) not null default 0,
  created_at         timestamptz not null default now()
);

create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id),
  quantity    int not null check (quantity > 0),
  unit_price  numeric(12,2) not null default 0
);

create table order_delivery_steps (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  label       text not null,           -- Label Created / Picked Up / In Transit / Delivered
  step_date   date,
  done        boolean not null default false,
  sort_order  int not null default 0
);

create table carrier_performance (
  id             uuid primary key default gen_random_uuid(),
  carrier_name   text not null unique,
  on_time_pct    numeric(5,2),
  avg_days       numeric(4,1),
  shipments      int default 0,
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- REFUNDS / RETURNS
-- ---------------------------------------------------------------------------
create table refunds (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id),
  product_id  uuid references products(id),
  reason      text,
  amount      numeric(12,2) not null default 0,
  status      refund_status not null default 'Processing',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PROFIT / ADS / CASH FLOW (periodic snapshots, feed the Analytics page)
-- ---------------------------------------------------------------------------
create table product_profit_stats (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products(id) on delete cascade,
  period_start  date not null,
  period_end    date not null,
  units_sold    int default 0,
  revenue       numeric(14,2) default 0,
  amazon_fees   numeric(14,2) default 0,
  ad_spend      numeric(14,2) default 0,
  net_profit    numeric(14,2) default 0,
  margin_pct    numeric(5,2) default 0,
  unique (product_id, period_start, period_end)
);

create table ad_stats (
  id            uuid primary key default gen_random_uuid(),
  period_start  date not null,
  period_end    date not null,
  acos          numeric(5,2),
  tacos         numeric(5,2),
  spend         numeric(14,2),
  sales         numeric(14,2),
  unique (period_start, period_end)
);

create table cash_flow_snapshots (
  id                uuid primary key default gen_random_uuid(),
  snapshot_date     date not null unique,
  current_balance   numeric(14,2) not null,
  projected_30d     numeric(14,2)
);

-- ---------------------------------------------------------------------------
-- USERS, ROLES & PERMISSIONS  (profiles extend Supabase auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        user_role not null default 'Inventory Manager',
  status      user_status not null default 'Active',
  last_login  timestamptz,
  created_at  timestamptz not null default now()
);

create table role_permissions (
  role        user_role not null,
  module      text not null,          -- Dashboard / Inventory / Suppliers / Orders / Warehouse / Reports / Settings
  can_access  boolean not null default false,
  primary key (role, module)
);

-- ---------------------------------------------------------------------------
-- APP SETTINGS (company profile, notification toggles, etc. as key/value)
-- ---------------------------------------------------------------------------
create table app_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ============================================================================
-- DERIVED VIEWS — power the Dashboard / Inventory / Low Stock pages without
-- duplicating stock numbers anywhere.
-- ============================================================================

-- Aggregated stock per product across all warehouses.
create view v_product_stock as
select
  p.id as product_id,
  coalesce(sum(ws.stock), 0)::int    as total_stock,
  coalesce(sum(ws.reserved), 0)::int as total_reserved,
  coalesce(sum(ws.available), 0)::int as total_available
from products p
left join warehouse_stock ws on ws.product_id = p.id
group by p.id;

-- One row per product with everything the Inventory / Product Details pages need.
create view v_product_overview as
select
  p.*,
  c.name as category_name,
  s.name as supplier_name,
  vs.total_stock,
  vs.total_reserved,
  vs.total_available,
  (vs.total_stock * p.unit_cost)::numeric(14,2) as total_value
from products p
left join categories c on c.id = p.category_id
left join suppliers s on s.id = p.supplier_id
left join v_product_stock vs on vs.product_id = p.id;

-- Low stock / reorder view — replaces the static lowStockItems mock.
create view v_low_stock as
select *
from v_product_overview
where total_available <= reorder_point;

-- Per-warehouse summary for the Warehouse page.
create view v_warehouse_summary as
select
  w.id,
  w.name,
  w.city,
  w.country,
  w.type,
  w.status,
  w.capacity_sqft,
  w.used_capacity_pct,
  count(distinct ws.product_id) as product_count,
  coalesce(sum(ws.stock), 0)::int as total_units,
  coalesce(sum(ws.stock * p.unit_cost), 0)::numeric(14,2) as total_value
from warehouses w
left join warehouse_stock ws on ws.warehouse_id = w.id
left join products p on p.id = ws.product_id
group by w.id;

-- ============================================================================
-- TRIGGERS — keep products.status in sync with actual stock automatically.
-- ============================================================================
create or replace function sync_product_status() returns trigger as $$
declare
  v_available int;
  v_reorder int;
  v_status product_status;
begin
  select coalesce(sum(stock - reserved), 0) into v_available
  from warehouse_stock where product_id = coalesce(new.product_id, old.product_id);

  select reorder_point into v_reorder
  from products where id = coalesce(new.product_id, old.product_id);

  if v_available <= 0 then
    v_status := 'Out of Stock';
  elsif v_available <= v_reorder then
    v_status := 'Low Stock';
  elsif v_available >= v_reorder * 3 then
    v_status := 'Overstock';
  else
    v_status := 'Optimal';
  end if;

  update products set status = v_status, updated_at = now()
  where id = coalesce(new.product_id, old.product_id);

  return null;
end;
$$ language plpgsql;

create trigger trg_sync_product_status
after insert or update or delete on warehouse_stock
for each row execute function sync_product_status();

-- ============================================================================
-- INDEXES
-- ============================================================================
create index idx_products_category on products(category_id);
create index idx_products_supplier on products(supplier_id);
create index idx_warehouse_stock_product on warehouse_stock(product_id);
create index idx_warehouse_stock_warehouse on warehouse_stock(warehouse_id);
create index idx_orders_type on orders(type);
create index idx_orders_fulfillment_status on orders(fulfillment_status);
create index idx_order_items_order on order_items(order_id);
create index idx_stock_transfer_items_transfer on stock_transfer_items(transfer_id);

-- ============================================================================
-- ROW LEVEL SECURITY — enable on every table, allow any signed-in user to
-- read/write for now. Tighten later with role-based policies if needed.
-- ============================================================================
alter table categories enable row level security;
alter table suppliers enable row level security;
alter table warehouses enable row level security;
alter table products enable row level security;
alter table product_specs enable row level security;
alter table product_fba_fees enable row level security;
alter table warehouse_stock enable row level security;
alter table stock_transfers enable row level security;
alter table stock_transfer_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_delivery_steps enable row level security;
alter table carrier_performance enable row level security;
alter table refunds enable row level security;
alter table product_profit_stats enable row level security;
alter table ad_stats enable row level security;
alter table cash_flow_snapshots enable row level security;
alter table profiles enable row level security;
alter table role_permissions enable row level security;
alter table app_settings enable row level security;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'categories','suppliers','warehouses','products','product_specs',
      'product_fba_fees','warehouse_stock','stock_transfers','stock_transfer_items',
      'orders','order_items','order_delivery_steps','carrier_performance','refunds',
      'product_profit_stats','ad_stats','cash_flow_snapshots','profiles',
      'role_permissions','app_settings'
    ])
  loop
    execute format(
      'create policy "authenticated_read_write_%1$s" on %1$s for all to authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- profiles: a user can always see/update their own row, in addition to the
-- blanket authenticated policy above.
create policy "profiles_self_access" on profiles
  for all to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();
