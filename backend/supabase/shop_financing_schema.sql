-- ============================================================================
-- Shop / Device-Financing module — separate from schema.sql (Inventory
-- Insights Pro's product/order tables). Run AFTER schema.sql if you also use
-- that one; this module is self-contained otherwise.
--
-- Implements exactly the tables and design decisions from the plan:
--   shops, branches, users, roles, permissions, shop_role_permissions,
--   customers, customer_documents, witnesses,
--   devices, device_imeis, device_metadata,
--   contracts, installment_plans, installments,
--   payments, payment_receipts,
--   device_pairs, device_status_logs, device_locations, device_events,
--   notifications, notification_templates, notification_logs,
--   audit_logs, settings
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------
create type device_status as enum ('in_stock', 'reserved', 'sold', 'repossessed', 'damaged');
create type imei_status as enum ('active', 'inactive', 'blocked');
create type contract_status as enum ('active', 'completed', 'defaulted', 'cancelled');
create type installment_frequency as enum ('weekly', 'biweekly', 'monthly');
create type installment_status as enum ('pending', 'partial', 'paid', 'overdue', 'waived');
create type payment_method as enum ('cash', 'card', 'bank_transfer', 'mobile_wallet');
create type device_event_type as enum ('locked', 'unlocked', 'lost_mode', 'alarm_triggered', 'geofence_exit', 'low_battery');
create type notification_channel as enum ('sms', 'email', 'push');
create type notification_status as enum ('pending', 'sent', 'failed');

-- ---------------------------------------------------------------------------
-- TENANCY: shops, branches
-- ---------------------------------------------------------------------------
create table shops (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_name  text,
  phone       text,
  email       text,
  address     text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table branches (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references shops(id) on delete restrict,
  name        text not null,
  address     text,
  phone       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RBAC: roles, permissions, shop_role_permissions, users
-- (permissions is a global catalog; roles are per-shop so each shop can
--  customize which permissions a role carries)
-- ---------------------------------------------------------------------------
create table permissions (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,   -- e.g. 'contracts.create', 'payments.void'
  description  text
);

create table roles (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references shops(id) on delete restrict,
  name        text not null,
  is_system   boolean not null default false,  -- true for a shop's built-in Owner/Admin role
  created_at  timestamptz not null default now(),
  unique (shop_id, name)
);

create table shop_role_permissions (
  role_id        uuid not null references roles(id) on delete cascade,
  permission_id  uuid not null references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- Staff accounts. id mirrors auth.users(id) — one Supabase Auth user per staff member.
create table users (
  id          uuid primary key references auth.users(id) on delete restrict,
  shop_id     uuid not null references shops(id) on delete restrict,
  branch_id   uuid references branches(id) on delete set null,
  role_id     uuid references roles(id) on delete restrict,
  full_name   text not null,
  phone       text,
  email       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CUSTOMERS
-- ---------------------------------------------------------------------------
create table customers (
  id              uuid primary key default gen_random_uuid(),
  shop_id         uuid not null references shops(id) on delete restrict,
  branch_id       uuid references branches(id) on delete set null,
  full_name       text not null,
  national_id     text,                 -- CNIC / ID card number
  phone           text not null,
  secondary_phone text,
  address         text,
  photo_url       text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table customer_documents (
  id           uuid primary key default gen_random_uuid(),
  shop_id      uuid not null references shops(id) on delete restrict,
  customer_id  uuid not null references customers(id) on delete cascade,
  doc_type     text not null,           -- e.g. 'cnic_front', 'cnic_back', 'utility_bill'
  file_url     text not null,
  uploaded_by  uuid references users(id) on delete set null,
  uploaded_at  timestamptz not null default now()
);

create table witnesses (
  id                  uuid primary key default gen_random_uuid(),
  shop_id             uuid not null references shops(id) on delete restrict,
  contract_id         uuid,             -- fk added after contracts table exists (below)
  full_name           text not null,
  national_id         text,
  phone               text,
  address             text,
  relation_to_customer text,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- DEVICES
-- ---------------------------------------------------------------------------
create table devices (
  id             uuid primary key default gen_random_uuid(),
  shop_id        uuid not null references shops(id) on delete restrict,
  branch_id      uuid references branches(id) on delete set null,
  brand          text not null,
  model          text not null,
  color          text,
  storage        text,
  condition      text default 'New',       -- 'New' / 'Used'
  purchase_cost  numeric(14,2) not null default 0,
  retail_price   numeric(14,2) not null default 0,
  status         device_status not null default 'in_stock',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table device_imeis (
  id          uuid primary key default gen_random_uuid(),
  device_id   uuid not null references devices(id) on delete cascade,
  imei        text not null,
  status      imei_status not null default 'active',
  created_at  timestamptz not null default now()
);

-- Block duplicate ACTIVE imeis while still allowing the same imei to appear
-- historically once retired (status != 'active').
create unique index uq_device_imeis_active on device_imeis(imei) where status = 'active';

create table device_metadata (
  id          uuid primary key default gen_random_uuid(),
  device_id   uuid not null references devices(id) on delete cascade,
  meta_key    text not null,
  meta_value  text,
  unique (device_id, meta_key)
);

-- ---------------------------------------------------------------------------
-- CONTRACTS / INSTALLMENT PLANS / INSTALLMENTS
-- Financial chain: never cascade-delete once a contract exists.
-- ---------------------------------------------------------------------------
create table contracts (
  id               uuid primary key default gen_random_uuid(),
  shop_id          uuid not null references shops(id) on delete restrict,
  branch_id        uuid references branches(id) on delete set null,
  customer_id      uuid not null references customers(id) on delete restrict,
  device_id        uuid not null references devices(id) on delete restrict,
  sales_agent_id   uuid references users(id) on delete set null,
  contract_number  text not null unique,
  total_amount     numeric(14,2) not null,
  down_payment     numeric(14,2) not null default 0,
  financed_amount  numeric(14,2) not null,
  start_date       date not null default current_date,
  status           contract_status not null default 'active',
  voided_at        timestamptz,
  voided_by        uuid references users(id) on delete set null,
  void_reason      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table witnesses
  add constraint fk_witnesses_contract foreign key (contract_id) references contracts(id) on delete restrict;

create table installment_plans (
  id                    uuid primary key default gen_random_uuid(),
  contract_id           uuid not null references contracts(id) on delete restrict,
  number_of_installments int not null check (number_of_installments > 0),
  frequency             installment_frequency not null default 'monthly',
  installment_amount    numeric(14,2) not null,
  created_at            timestamptz not null default now()
);

create table installments (
  id                   uuid primary key default gen_random_uuid(),
  installment_plan_id  uuid not null references installment_plans(id) on delete restrict,
  contract_id          uuid not null references contracts(id) on delete restrict,
  installment_no       int not null,
  due_date             date not null,
  amount_due           numeric(14,2) not null,
  amount_paid          numeric(14,2) not null default 0,
  status               installment_status not null default 'pending',
  voided_at            timestamptz,
  voided_by            uuid references users(id) on delete set null,
  void_reason          text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (installment_plan_id, installment_no),
  constraint chk_installment_paid_not_over_due
    check (status = 'waived' or amount_paid <= amount_due)
);

-- ---------------------------------------------------------------------------
-- PAYMENTS
-- ---------------------------------------------------------------------------
create table payments (
  id             uuid primary key default gen_random_uuid(),
  shop_id        uuid not null references shops(id) on delete restrict,
  contract_id    uuid not null references contracts(id) on delete restrict,
  installment_id uuid references installments(id) on delete set null,
  customer_id    uuid not null references customers(id) on delete restrict,
  amount         numeric(14,2) not null check (amount > 0),
  method         payment_method not null default 'cash',
  received_by    uuid references users(id) on delete set null,
  paid_at        timestamptz not null default now(),
  voided_at      timestamptz,
  voided_by      uuid references users(id) on delete set null,
  void_reason    text,
  created_at     timestamptz not null default now()
);

create table payment_receipts (
  id               uuid primary key default gen_random_uuid(),
  payment_id       uuid not null references payments(id) on delete cascade,
  receipt_number   text not null unique,
  file_url         text,
  issued_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- DEVICE TRACKING: pairing, status history, locations (high write volume →
-- partitioned by month), events
-- ---------------------------------------------------------------------------
create table device_pairs (
  id          uuid primary key default gen_random_uuid(),
  device_id   uuid not null references devices(id) on delete cascade,
  contract_id uuid not null references contracts(id) on delete restrict,
  paired_at   timestamptz not null default now(),
  unpaired_at timestamptz,
  is_active   boolean not null default true
);

create table device_status_logs (
  id          uuid primary key default gen_random_uuid(),
  device_id   uuid not null references devices(id) on delete cascade,
  old_status  device_status,
  new_status  device_status not null,
  changed_by  uuid references users(id) on delete set null,
  changed_at  timestamptz not null default now(),
  note        text
);

-- Partitioned by month on recorded_at. Create a new partition every month
-- (via cron/pg_cron or a scheduled job) — two starter partitions included.
create table device_locations (
  id           bigserial,
  device_id    uuid not null references devices(id) on delete cascade,
  latitude     numeric(9,6) not null,
  longitude    numeric(9,6) not null,
  accuracy_m   numeric(8,2),
  recorded_at  timestamptz not null default now(),
  primary key (id, recorded_at)
) partition by range (recorded_at);

create table device_locations_2026_01 partition of device_locations
  for values from ('2026-01-01') to ('2026-02-01');
create table device_locations_2026_02 partition of device_locations
  for values from ('2026-02-01') to ('2026-03-01');
-- Add a new "device_locations_YYYY_MM" partition each month before it starts.

create table device_events (
  id          uuid primary key default gen_random_uuid(),
  device_id   uuid not null references devices(id) on delete cascade,
  event_type  device_event_type not null,
  event_at    timestamptz not null default now(),
  metadata    jsonb
);

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
create table notification_templates (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid references shops(id) on delete restrict,  -- null = global template
  code        text not null,
  channel     notification_channel not null,
  subject     text,
  body_template text not null,
  created_at  timestamptz not null default now()
);

create table notifications (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references shops(id) on delete restrict,
  user_id     uuid references users(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  title       text not null,
  body        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create table notification_logs (
  id              uuid primary key default gen_random_uuid(),
  notification_id uuid references notifications(id) on delete set null,
  template_id     uuid references notification_templates(id) on delete set null,
  recipient       text not null,
  channel         notification_channel not null,
  status          notification_status not null default 'pending',
  sent_at         timestamptz,
  error_message   text,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- AUDIT LOGS & SETTINGS
-- ---------------------------------------------------------------------------
create table audit_logs (
  id           uuid primary key default gen_random_uuid(),
  shop_id      uuid references shops(id) on delete restrict,
  user_id      uuid references users(id) on delete set null,
  action       text not null,          -- e.g. 'contract.void', 'payment.create'
  entity_table text not null,
  entity_id    uuid,
  old_data     jsonb,
  new_data     jsonb,
  created_at   timestamptz not null default now()
);

create table settings (
  shop_id     uuid not null references shops(id) on delete cascade,
  key         text not null,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (shop_id, key)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index idx_branches_shop on branches(shop_id);
create index idx_users_shop on users(shop_id);
create index idx_customers_shop on customers(shop_id);
create index idx_devices_shop on devices(shop_id);
create index idx_device_imeis_device on device_imeis(device_id);
create index idx_contracts_shop on contracts(shop_id);
create index idx_contracts_customer on contracts(customer_id);
create index idx_installments_contract on installments(contract_id);
create index idx_installments_status on installments(status);
create index idx_payments_contract on payments(contract_id);
create index idx_device_locations_device on device_locations(device_id, recorded_at desc);
create index idx_device_events_device on device_events(device_id, event_at desc);
create index idx_audit_logs_entity on audit_logs(entity_table, entity_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Backend must SET LOCAL app.current_shop_id = '<uuid>' inside every request
-- transaction (via a service-layer wrapper) — never accept shop_id from the
-- client. Service-role key bypasses RLS entirely and is reserved for a
-- dedicated admin/ module with its own audit trail.
-- ============================================================================
alter table shops enable row level security;
alter table branches enable row level security;
alter table roles enable row level security;
alter table permissions enable row level security;
alter table shop_role_permissions enable row level security;
alter table users enable row level security;
alter table customers enable row level security;
alter table customer_documents enable row level security;
alter table witnesses enable row level security;
alter table devices enable row level security;
alter table device_imeis enable row level security;
alter table device_metadata enable row level security;
alter table contracts enable row level security;
alter table installment_plans enable row level security;
alter table installments enable row level security;
alter table payments enable row level security;
alter table payment_receipts enable row level security;
alter table device_pairs enable row level security;
alter table device_status_logs enable row level security;
alter table device_locations enable row level security;
alter table device_events enable row level security;
alter table notifications enable row level security;
alter table notification_templates enable row level security;
alter table notification_logs enable row level security;
alter table audit_logs enable row level security;
alter table settings enable row level security;

-- Tables with a direct shop_id column get the standard tenant policy.
-- (shops itself is handled separately below since its tenant key is `id`, not `shop_id`.)
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'branches','roles','users','customers','customer_documents',
      'witnesses','devices','contracts','payments','notifications',
      'audit_logs','settings'
    ])
  loop
    execute format(
      'create policy "tenant_isolation_%1$s" on %1$s for all to authenticated using (shop_id = current_setting(''app.current_shop_id'')::uuid) with check (shop_id = current_setting(''app.current_shop_id'')::uuid);',
      t
    );
  end loop;
end $$;

-- shops itself: shop_id IS id.
create policy "tenant_isolation_shops" on shops
  for all to authenticated
  using (id = current_setting('app.current_shop_id')::uuid)
  with check (id = current_setting('app.current_shop_id')::uuid);

-- Tables one join away from shop_id: scope through their parent.
create policy "tenant_isolation_device_imeis" on device_imeis for all to authenticated
  using (device_id in (select id from devices where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_device_metadata" on device_metadata for all to authenticated
  using (device_id in (select id from devices where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_installment_plans" on installment_plans for all to authenticated
  using (contract_id in (select id from contracts where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_installments" on installments for all to authenticated
  using (contract_id in (select id from contracts where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_payment_receipts" on payment_receipts for all to authenticated
  using (payment_id in (select id from payments where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_device_pairs" on device_pairs for all to authenticated
  using (device_id in (select id from devices where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_device_status_logs" on device_status_logs for all to authenticated
  using (device_id in (select id from devices where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_device_locations" on device_locations for all to authenticated
  using (device_id in (select id from devices where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_device_events" on device_events for all to authenticated
  using (device_id in (select id from devices where shop_id = current_setting('app.current_shop_id')::uuid));
create policy "tenant_isolation_notification_logs" on notification_logs for all to authenticated
  using (true);  -- linked via notification_id/template_id, both already tenant-scoped upstream
create policy "tenant_isolation_shop_role_permissions" on shop_role_permissions for all to authenticated
  using (role_id in (select id from roles where shop_id = current_setting('app.current_shop_id')::uuid));

-- Global reference tables: readable by any authenticated user, not tenant-scoped.
create policy "permissions_read_all" on permissions for select to authenticated using (true);
create policy "notification_templates_read" on notification_templates for select to authenticated
  using (shop_id is null or shop_id = current_setting('app.current_shop_id')::uuid);
