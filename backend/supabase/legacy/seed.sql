-- ============================================================================
-- Inventory Insights Pro — seed data
-- Run AFTER schema.sql, in the Supabase SQL Editor.
-- Mirrors the current mock data in src/data/mockData.js so the app has
-- real rows to read as soon as it's wired to Supabase.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into categories (name) values
  ('Electronics'), ('Furniture'), ('Home Appliances'), ('Apparel'), ('Accessories');

-- ---------------------------------------------------------------------------
-- Suppliers
-- ---------------------------------------------------------------------------
insert into suppliers (supplier_code, name, contact_name, email, phone, country, lead_time_days, rating, purchase_value, outstanding, status, last_order_at) values
  ('SUP-1028', 'Global Logistics Co.',    'John Smith',      'john@global.com',            '+1-555-0101', 'USA',       14, 4.8, 1200000, 45000, 'Active',  '2024-01-15'),
  ('SUP-1016', 'Prime Parts Inc.',        'Sarah Johnson',   'sarah@primeparts.com',        '+1-555-0102', 'Canada',    10, 4.6,  680000, 32000, 'Active',  '2024-01-12'),
  ('SUP-0994', 'Direct Supply Ltd.',      'Mike Chen',       'mike@directsupply.co.uk',     '+44-20-7946', 'UK',        16, 4.4,  420000, 18000, 'Active',  '2024-01-08'),
  ('SUP-1041', 'TechSource International','Alex Rodriguez',  'alex@techsource.de',          '+49-89-1234', 'Germany',   12, 4.7,  950000, 68000, 'Pending', '2024-01-14'),
  ('SUP-0972', 'Alpha Distribution',      'Lisa Wong',       'lisa@alphadist.sg',            '+65-6789-0123','Singapore',18, 4.3,  320000, 12000, 'Active',  '2024-01-10');

-- ---------------------------------------------------------------------------
-- Warehouses
-- ---------------------------------------------------------------------------
insert into warehouses (name, city, country, type, status, capacity_sqft, used_capacity_pct) values
  ('Main Distribution Center', 'Chicago',    'United States', 'Self-Managed', 'Active',      420000, 86),
  ('East Coast Warehouse',     'Newark',     'United States', 'Amazon FBA',   'Near Full',   260000, 94),
  ('West Coast Warehouse',     'Los Angeles','United States', 'Self-Managed', 'Active',      300000, 72),
  ('European Warehouse',       'Rotterdam',  'Netherlands',   'Amazon FBA',   'Active',      180000, 68),
  ('Asia Distribution Center', 'Singapore',  'Singapore',     'Self-Managed', 'Maintenance', 100000, 61);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
insert into products (sku, product_code, name, icon, category_id, brand, supplier_id, reorder_point, unit_cost, selling_price, fulfillment_type, barcode, unit, description) values
  ('SKU-9021', 'PP15-GX-256',  'ProPhone 15 GenX',   'Smartphone', (select id from categories where name='Electronics'),      'TechCorp',   (select id from suppliers where supplier_code='SUP-1028'), 400, 799.00, 899.00, 'FBA', '891234567890', 'Each', 'Premium flagship smartphone with cutting-edge technology, advanced camera capabilities, and all-day performance for modern enterprise teams.'),
  ('SKU-7721', 'ZBA13-I7-512', 'ZenBook Air 13',     'Laptop',     (select id from categories where name='Electronics'),      'TechCorp',   (select id from suppliers where supplier_code='SUP-1028'), 250, 1099.00, 1299.00, 'FBM', null, 'Each', null),
  ('SKU-4412', 'EOC-BLK-ERG',  'Ergo Office Chair',  'Armchair',   (select id from categories where name='Furniture'),        'OfficeForm', (select id from suppliers where supplier_code='SUP-1016'), 500, 249.00, 399.00, 'FBA', null, 'Each', null),
  ('SKU-3488', 'SHH-2ND-GEN',  'Smart Home Hub',     'Router',     (select id from categories where name='Home Appliances'),  'NestWorks',  (select id from suppliers where supplier_code='SUP-1041'), 180, 129.00, 199.00, 'SFP', null, 'Each', null),
  ('SKU-6034', 'LDM27-4K-IPS', 'LED Monitor 27 Pro', 'Monitor',    (select id from categories where name='Electronics'),      'ViewTech',   (select id from suppliers where supplier_code='SUP-1028'), 600, 319.00, 449.00, 'FBA', null, 'Each', null);

-- FBA fees for the FBA products
insert into product_fba_fees (product_id, referral, fulfillment, storage, long_term) values
  ((select id from products where sku='SKU-9021'), 134.85, 8.26, 0.83, 0),
  ((select id from products where sku='SKU-4412'), 37.35, 12.40, 1.10, 0),
  ((select id from products where sku='SKU-6034'), 47.85, 9.75, 1.25, 2.10);

-- Specs for the flagship product
insert into product_specs (product_id, label, value, sort_order) values
  ((select id from products where sku='SKU-9021'), 'Display', '6.7-inch OLED', 1),
  ((select id from products where sku='SKU-9021'), 'Processor', 'T9 Pro Chip', 2),
  ((select id from products where sku='SKU-9021'), 'RAM', '12 GB', 3),
  ((select id from products where sku='SKU-9021'), 'Storage', '512 GB', 4),
  ((select id from products where sku='SKU-9021'), 'Battery', '4,800 mAh', 5),
  ((select id from products where sku='SKU-9021'), 'Camera', '48 MP Pro System', 6);

-- ---------------------------------------------------------------------------
-- Warehouse stock distribution
-- ---------------------------------------------------------------------------
insert into warehouse_stock (product_id, warehouse_id, location, stock, reserved) values
  ((select id from products where sku='SKU-9021'), (select id from warehouses where name='Main Distribution Center'), 'A01-R04-S02', 520, 110),
  ((select id from products where sku='SKU-9021'), (select id from warehouses where name='East Coast Warehouse'),     'B02-R01-S06', 310, 64),
  ((select id from products where sku='SKU-9021'), (select id from warehouses where name='West Coast Warehouse'),     'C01-R08-S03', 240, 52),
  ((select id from products where sku='SKU-9021'), (select id from warehouses where name='European Warehouse'),      'EU-04-R02-S01', 170, 34),

  ((select id from products where sku='SKU-7721'), (select id from warehouses where name='West Coast Warehouse'),     'B02-R01-S08', 890, 74),
  ((select id from products where sku='SKU-4412'), (select id from warehouses where name='East Coast Warehouse'),     'C04-R02-S01', 452, 96),
  ((select id from products where sku='SKU-3488'), (select id from warehouses where name='European Warehouse'),      'D01-R06-B03', 0, 0),
  ((select id from products where sku='SKU-6034'), (select id from warehouses where name='Asia Distribution Center'), 'E03-R04-S02', 2840, 220);

-- ---------------------------------------------------------------------------
-- Orders + line items + delivery timeline
-- ---------------------------------------------------------------------------
insert into orders (order_number, type, party_name, party_ref, order_date, warehouse_id, payment_status, fulfillment_status, delivery_date, priority, assigned_to, carrier, tracking_number, total) values
  ('#PO-10482', 'Purchase', 'Global Logistics Co.',      'SUP-2041',           '2024-06-18', (select id from warehouses where name='Main Distribution Center'), 'Paid',    'Processing', '2024-06-27', 'High',   'J. Carter', 'FedEx',            '7712 4490 2210',      48620),
  ('#SO-78314', 'Sales',    'Northstar Retail Group',    'CUS-8842',           '2024-06-17', (select id from warehouses where name='East Coast Warehouse'),     'Paid',    'Shipped',    '2024-06-21', 'Normal', 'M. Rivera', 'UPS',              '1Z999AA10123456784', 12840),
  ('#PO-10481', 'Purchase', 'Prime Parts Inc.',          'SUP-1108',           '2024-06-16', (select id from warehouses where name='West Coast Warehouse'),     'Pending', 'Pending',    '2024-06-29', 'Urgent', 'J. Carter', 'DHL',              '3305 9988 4471',     26450),
  ('#SO-78313', 'Sales',    'Apex Office Systems',       'CUS-6290',           '2024-06-15', (select id from warehouses where name='Main Distribution Center'), 'Failed',  'On Hold',    null,         'Normal', 'R. Singh',  'USPS',             '9400 1000 0000 0000 0000 00', 8920),
  ('#TR-00291', 'Transfer', 'Warehouse Transfer',        'Internal movement',  '2024-06-14', null,                                                              'N/A',     'In Transit', '2024-06-23', 'Normal', 'L. Morgan', 'Amazon Logistics', 'TBA123456789000',    18740);

insert into order_delivery_steps (order_id, label, step_date, done, sort_order) values
  ((select id from orders where order_number='#PO-10482'), 'Label Created', '2024-06-18', true,  1),
  ((select id from orders where order_number='#PO-10482'), 'Picked Up',     '2024-06-19', true,  2),
  ((select id from orders where order_number='#PO-10482'), 'In Transit',    '2024-06-22', false, 3),
  ((select id from orders where order_number='#PO-10482'), 'Delivered',     '2024-06-27', false, 4),

  ((select id from orders where order_number='#SO-78314'), 'Label Created', '2024-06-17', true,  1),
  ((select id from orders where order_number='#SO-78314'), 'Picked Up',     '2024-06-17', true,  2),
  ((select id from orders where order_number='#SO-78314'), 'In Transit',    '2024-06-19', true,  3),
  ((select id from orders where order_number='#SO-78314'), 'Delivered',     '2024-06-21', false, 4);

-- ---------------------------------------------------------------------------
-- Carrier performance
-- ---------------------------------------------------------------------------
insert into carrier_performance (carrier_name, on_time_pct, avg_days, shipments) values
  ('FedEx', 96, 3.2, 842),
  ('UPS', 94, 3.6, 615),
  ('DHL', 91, 4.1, 328),
  ('USPS', 88, 4.8, 402),
  ('Amazon Logistics', 97, 2.4, 1120);

-- ---------------------------------------------------------------------------
-- Refunds
-- ---------------------------------------------------------------------------
insert into refunds (order_id, product_id, reason, amount, status, created_at) values
  (null, (select id from products where sku='SKU-9021'), 'Damaged in transit',   899.00, 'Refunded',  '2024-06-12'),
  (null, (select id from products where sku='SKU-4412'), 'Wrong item received',  399.00, 'Refunded',  '2024-06-10'),
  (null, (select id from products where sku='SKU-7721'), 'Changed mind',        1299.00, 'Processing','2024-06-08'),
  (null, (select id from products where sku='SKU-6034'), 'Defective unit',       449.00, 'Refunded',  '2024-06-05'),
  (null, (select id from products where sku='SKU-3488'), 'Not as described',     199.00, 'Rejected',  '2024-06-01');

-- ---------------------------------------------------------------------------
-- Product profitability (current period snapshot)
-- ---------------------------------------------------------------------------
insert into product_profit_stats (product_id, period_start, period_end, units_sold, revenue, amazon_fees, ad_spend, net_profit, margin_pct) values
  ((select id from products where sku='SKU-9021'), '2024-06-01', '2024-06-30', 62,  55738,  8360, 6200,  9850, 17.7),
  ((select id from products where sku='SKU-7721'), '2024-06-01', '2024-06-30', 38,  49362,  6410, 5100, 11200, 22.7),
  ((select id from products where sku='SKU-4412'), '2024-06-01', '2024-06-30', 145, 57855,  7230, 4800,  8940, 15.5),
  ((select id from products where sku='SKU-3488'), '2024-06-01', '2024-06-30', 0,       0,     0, 1200, -1200,  0.0),
  ((select id from products where sku='SKU-6034'), '2024-06-01', '2024-06-30', 52,  23348,  3760, 3850,  4290, 18.4);

insert into ad_stats (period_start, period_end, acos, tacos, spend, sales) values
  ('2024-06-01', '2024-06-30', 18.4, 9.2, 21150, 114900);

insert into cash_flow_snapshots (snapshot_date, current_balance, projected_30d) values
  ('2024-06-18', 142600, 168900);

-- ---------------------------------------------------------------------------
-- Roles & permissions (matches the Settings > Permissions matrix)
-- ---------------------------------------------------------------------------
insert into role_permissions (role, module, can_access)
select r.role::user_role, m.module, true
from (values ('Administrator')) as r(role)
cross join (values ('Dashboard'),('Inventory'),('Suppliers'),('Orders'),('Warehouse'),('Reports'),('Settings')) as m(module);

insert into role_permissions (role, module, can_access) values
  ('Manager', 'Dashboard', true), ('Manager', 'Inventory', true), ('Manager', 'Suppliers', true),
  ('Manager', 'Orders', true), ('Manager', 'Warehouse', true), ('Manager', 'Reports', true), ('Manager', 'Settings', false),

  ('Inventory Manager', 'Dashboard', true), ('Inventory Manager', 'Inventory', true), ('Inventory Manager', 'Suppliers', true),
  ('Inventory Manager', 'Orders', false), ('Inventory Manager', 'Warehouse', true), ('Inventory Manager', 'Reports', true), ('Inventory Manager', 'Settings', false),

  ('Warehouse Manager', 'Dashboard', true), ('Warehouse Manager', 'Inventory', true), ('Warehouse Manager', 'Suppliers', false),
  ('Warehouse Manager', 'Orders', false), ('Warehouse Manager', 'Warehouse', true), ('Warehouse Manager', 'Reports', false), ('Warehouse Manager', 'Settings', false);

-- ---------------------------------------------------------------------------
-- App settings (notification toggles etc.)
-- ---------------------------------------------------------------------------
insert into app_settings (key, value) values
  ('notifications', '{
    "low_stock_alerts": true,
    "out_of_stock_alerts": true,
    "reorder_required": true,
    "purchase_order_approval": true,
    "order_received": false,
    "shipment_delayed": true,
    "stock_transfer": false,
    "supplier_issue": true,
    "warehouse_capacity_warning": true
  }'::jsonb),
  ('company', '{
    "name": "Inventory Insights Pro",
    "currency": "USD",
    "timezone": "America/Chicago",
    "auto_approve_purchase_orders": true
  }'::jsonb);

-- NOTE: `profiles` rows are created automatically by the on_auth_user_created
-- trigger whenever someone signs up through Supabase Auth — do not seed them
-- manually here. After your first user signs up, promote them with:
--   update profiles set role = 'Administrator' where id = '<their auth uid>';
