-- Run this ONLY if shop_financing_schema.sql failed partway through.
-- Drops whatever partial objects it may have created, then you can re-run
-- the corrected shop_financing_schema.sql from scratch.
drop table if exists settings, audit_logs, notification_logs, notifications,
  notification_templates, device_events, device_locations, device_locations_2026_01,
  device_locations_2026_02, device_status_logs, device_pairs, payment_receipts, payments,
  installments, installment_plans, witnesses, contracts, device_metadata, device_imeis,
  devices, customer_documents, customers, users, shop_role_permissions, role_permissions,
  roles, permissions, branches, shops cascade;

drop type if exists notification_status, notification_channel, device_event_type,
  payment_method, installment_status, installment_frequency, contract_status,
  imei_status, device_status cascade;
