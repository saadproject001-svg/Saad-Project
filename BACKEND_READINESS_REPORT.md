# Backend Readiness Report

**Scope:** Pre-implementation discovery only. No backend code, migrations, or API scaffolding in this document. Stack is already decided (FastAPI + Supabase Postgres + Railway) and is not re-litigated here.

**Important note on inputs:** The task brief assumes a `FRONTEND_AUDIT.md` already exists in this repo describing prior findings (9 core pages + 61 Sellerboard pages, component duplication, 5 incompatible Product shapes). **That file does not exist anywhere in this repository** (confirmed via full-tree search). This report was therefore produced by an independent, from-scratch scan of the actual frontend source (`frontend/src/`), not a re-summary of a pre-existing document. Where the brief's assumptions turned out to be accurate, that's noted; where the real codebase differs (e.g., there are 6 Product shapes, not 5), that's called out explicitly.

---

## 1. Executive Summary

- The frontend is **100% static mock data** — zero `fetch`/`axios`/`supabase-js` calls exist anywhere in `src/`. Every number on every page is a hardcoded literal. This is a from-scratch backend build, not an integration.
- There is **no authentication, no session, no route guards, and no tenancy concept**. `App.jsx` mounts every route — including `/settings` and `/account/*` — with zero protection. A `currentUser` object and a read-only `permissionMatrix` exist purely as UI decoration; nothing enforces them.
- **Product data exists in 6 incompatible shapes** (not 5, as assumed), plus ~40 more one-off "product-like" row shapes scattered across the 61 Sellerboard page configs. None share an ID scheme beyond an inconsistently-present `sku` string.
- The 61 "Sellerboard" pages are **genuinely one generic component** (`SellerboardPage.jsx`) driven entirely by a per-route config object in `sellerboardData.js` — this is good news: it means the frontend already treats each page's data as a de facto API response contract, which will simplify backend endpoint design.
- **Every dollar amount, date, and percentage in the app is a pre-formatted string or a decorative literal**, not a computed value — e.g., a `money()` currency formatter is defined but never called; margins/percentages are typed in by hand rather than derived from cost/revenue fields.
- **Status enums are informal and unvalidated**: a single `StatusBadge` component maps 50 arbitrary hardcoded strings to colors, with silent fallback to gray for anything unrecognized — meaning backend status values must match frontend string literals exactly (including case) or they'll render wrong with no error.
- **Pagination and row counts are entirely fake** — e.g., `Inventory.jsx` claims `totalPages={498}` while only 5 mock products exist. These numbers must not be treated as evidence of real data volume expectations.
- Six third-party platforms are referenced purely as **display labels** (Amazon, eBay, Walmart, Shopify, QuickBooks, plus generic carriers) — none has any SDK, OAuth flow, or API client wired up. WooCommerce, mentioned in the task brief, is not referenced anywhere in the code.
- The gap between "what the UI implies exists" (multi-tenant SaaS, real integrations, computed financials, RBAC) and "what actually exists" (a single static React bundle with no backend) is total — this is a green-field backend build guided by a well-organized but entirely fictional UI contract.

---

## 2. Entity Inventory

All entities below are currently mock-only JS objects/arrays in `frontend/src/data/mockData.js` and `frontend/src/data/sellerboardData.js`. No entity has a formal type/interface (plain JSX/JS, no TypeScript).

### Core entities (`mockData.js`)

| Entity | Lines | Fields |
|---|---|---|
| `currentUser` | 4-8 | `name, role, avatar` |
| `kpiOverview` | 10-16 | `label, value, delta, trend, spark?, bar?` |
| `stockByCategory` | 18-23 | `name, value, pct` |
| `quantityBySupplier` | 25-29 | `name, value, pct, color` |
| `stockMovementType` | 31-35 | `name, pct, color` |
| `topProducts` | 37-41 | `sku, name, category, stock, status` |
| `products` (canonical/rich) | 43-175 | see §3 |
| `inventoryKpis` | 177-185 | `label, value, delta, tone` |
| `lowStockKpis` | 187-191 | `label, value, delta, tone, bar?, spark?, note?` |
| `lowStockItems` | 193-199 | `name, sku, category, warehouse, stock, reorderPoint, shortfall, recommended, unitCost, leadTime, supplier, severity` |
| `supplierKpis` | 201-208 | `label, value, note?, delta?, tone?, spark?, bar?` |
| `suppliers` | 210-216 | `id, name, icon, iconBg, contact, email, phone, country, products, orders, purchaseValue, outstanding, leadTime, rating, lastOrder, status` |
| `warehouseKpis` | 218-227 | `label, value, delta?, tone?, note?, bar?, extra?, spark?` |
| `warehouses` | 229-235 | `name, city, status, capacityPct, products, value, type` |
| `fulfillmentSplit` | 237-241 | `name, pct, color` |
| `incomingShipments` | 243-247 | `id, supplier, warehouse, eta, qty, carrier` |
| `outgoingShipments` | 249-253 | `id, destination, qty, status, carrier` |
| `pendingTransfers` | 255-259 | `id, source, destination, items, requested, status, action` |
| `orderKpis` | 261-270 | `label, value, delta, tone, spark?/bar?` |
| `orders` | 272-323 | `id, type, party, partyId, date, items, warehouse, total, payment, fulfillment, delivery, priority, assigned, carrier, trackingNumber, deliverySteps[]{label,date,done}` |
| `carrierPerformance` | 325-331 | `name, onTimePct, avgDays, shipments` |
| `workspaceUsers` | 333-337 | `name, avatar, email, role, status, lastLogin` |
| `profitKpis` | 339-346 | `label, value, delta, tone, spark?/bar?` |
| `productProfitability` | 348-354 | see §3 |
| `advertisingStats` | 356 | `acos, tacos, spend, sales` (singleton) |
| `refunds` | 358-364 | `orderId, product, reason, amount, date, status` |
| `cashFlowProjection` | 366-371 | `currentBalance, projected30d, deltaPct, path` (singleton) |
| `storageFeeAlert` | 373-377 | `message, amount, dueDate` (singleton) |
| `permissionMatrix` | 379-387 | `{modules:[...], roles:[{role, access:[bool]}]}` |

### Entities embedded per-route inside `sellerboardData.js` (not separately named exports — each of the 61 route configs defines its own row shape inline)

| Entity | Example route / lines | Fields |
|---|---|---|
| PPC campaigns | `/ppc` · 419-425 | `campaign, type, spend, sales, acos, status` |
| PPC recommendations | `/ppc/recommendations` · 442-448 | `type, target, campaign, current, suggested, status` |
| PPC automation log | `/ppc/automation-log` · 465-471 | `timestamp, campaign, action, before, after, reason` |
| Amazon attribution | `/ppc/amazon-attribution` · 488-494 | `source, clicks, dpv, sales, roas, status` |
| Purchase orders | `/inventory-tools/purchase-orders` · 536-541 | `poId, supplier, items, totalCost, orderDate, eta, status` |
| Reseller/MAP compliance | `/inventory-tools/reseller-workflow` · 558-563 | `seller, name, sku, listingPrice, mapPrice, lastChecked, status` |
| FBA shipments | `/inventory-tools/fba-shipments` · 581-586 | `shipmentId, destinationFC, products, units, carrier, eta, status` |
| Autoresponder campaigns | `/autoresponder/campaigns` · 610-616 | `campaign, trigger, emailsSent, openRate, clickRate, status` |
| Autoresponder orders | `/autoresponder/orders` · 646-651 | `orderId, name, sku, customer, sequenceStep, nextEmail, status` |
| Lost & damaged cases | `/money-back/lost-damaged` · 675-680 | `caseId, name, sku, warehouse, units, estimatedValue, filedDate, status` |
| Returns | `/money-back/returns` · 697-704 | `orderId, product, reason, amount, date, status` |
| FBA fee changes | `/money-back/fba-fee-changes` · 720-725 | `name, sku, feeType, previousFee, newFee, changeDate, impact` |
| Reimbursement gap cases | `/money-back/reimbursement-gap` · 747-752 | `caseType, name, sku, unitsOwed, estimatedValue, daysOpen, status` |
| Alerts | `/alerts` · 776-783 | `timestamp, type(severity), message, name, sku, status` |
| Alert settings | `/alerts/settings` · 791-826 | `title, description, fields[]{label, description?, type, value, options?}` |
| Per-channel customers/LTV | e.g. `/profit/ltv` · 334-340 | `customer, orders, firstOrder, totalSpent, status(tier)` |
| Per-channel orders | e.g. `/ebay/orders` · 933-938 | `orderId, buyer, name, sku, total, date, status` |
| Per-channel expenses | e.g. `/ebay/expenses` · 953-958 | `expense, category, monthlyCost, status` |
| Indirect/variable expenses | 251-256, 274-279 | `expense, category, vendor?, monthlyCost/monthlyTotal, status?` |
| Search terms (PPC) | 305-309 | `term, campaign, impressions, clicks, spend, sales, acos, status` |
| Reports (per-module) | e.g. 386-390 | `report, type?, period, lastRun, status, format` |
| QuickBooks settlements | `/quickbooks/settlements` · 1454-1456 | `settlementId, period, grossSales, fees, netDeposit, depositDate, status` |
| QuickBooks config | `/quickbooks/config` | account-mapping selects, sync toggles |
| Account users (duplicate of `workspaceUsers`) | `/account/users` · 1527-1529 | `name, avatar, email, role, lastLogin, status` |
| Billing/invoices | `/account/billing` · 1593-1610 | KPIs + `invoiceId, date, amount, status` |
| Nav/route config | `sellerboardNav`, 4-150 | `key, label, icon, items:[{to,label}]` — 12 groups, 61 leaf routes |

**Duplication flag:** `workspaceUsers` (mockData.js:333-337) and the `/account/users` table (sellerboardData.js:1527-1529) are two independently hand-typed lists representing the same concept (workspace users) with near-identical fields — they will drift unless unified under one backend `users` table.

---

## 3. Product Entity Reconciliation

Six distinct shapes were found (the task brief assumed 5 — the sixth is the sellerboard `variant: "products"` family, which itself splits into 6 sibling variants sharing only an envelope).

| # | Shape | Location | Fields | Used by |
|---|---|---|---|---|
| A | Canonical/rich | `mockData.js:43-175` (`products`) | `id, sku, productId, name, icon, category, brand, supplier, warehouse, location, stock, reserved, available, reorderPoint, unitCost, sellingPrice, totalValue, status, lastUpdated, fulfillmentType, fbaFees{referral,fulfillment,storage,longTerm}, barcode, unit, description, specs[], warehouseDistribution[]` | `Inventory.jsx`, `ProductDetails.jsx` |
| B | KPI summary | `mockData.js:37-41` (`topProducts`) | `sku, name, category, stock, status` | `Dashboard.jsx` |
| C | Profitability | `mockData.js:348-354` (`productProfitability`) | `name, sku, unitsSold, revenue, amazonFees, adSpend, netProfit, marginPct` | `Analytics.jsx` |
| D | Sellerboard product-card (6 sibling variants) | `sellerboardData.js` — `/profit/products` (196-208), `/autoresponder/products` (620-631), `/ebay/products` (886-897), `/walmart/products` (1040-1052), `/amazon/products` (1192-1204), `/shopify/products` (1344-1356) | Shared envelope `{name, sku, status, stats[]{label,value}}`; `stats` content differs per channel (e.g. eBay adds "Watchers", Walmart/Amazon add "Buy Box %", Shopify adds "Conversion Rate") | `ProductCard.jsx` (generic renderer) |
| E | Dead/unused catalog | `sellerboardData.js:152-158` (`CATALOG` const) | `name, sku` | Nowhere — defined but never referenced; leftover scaffolding |
| F | Ad hoc table-row shapes | 40+ one-off variants across sellerboard table configs, e.g. inventory planner rows (513-518: adds `currentStock, avgDailySales, daysLeft, recommendedReorder`), reseller-workflow rows (559-563: adds `seller, listingPrice, mapPrice, lastChecked`) | Varies per table | Rendered generically by `DataTable` via column config, not a shared product type |

Additionally, **even within shape A itself**, only 1 of 5 mock records has the full field set (`ProPhone 15 GenX`, lines 44-84) — the other 4 omit `barcode`, `description`, `specs`, and `warehouseDistribution` entirely, and `ProductDetails.jsx` guards every optional section with a truthiness check (`product.specs && ...`, `product.fbaFees && ...`). This is real-world evidence that the canonical shape must model these as **nullable/optional relations**, not required columns.

### Proposed canonical Product entity (discovery-level only — no schema/DDL here)

A single source-of-truth Product should carry:
- **Identity**: a real UUID/PK, plus `sku` (unique, required) and `product_id`/external identifier (optional, currently called `productId` in shape A) — today's only cross-shape join key is the human-readable `sku` string, and even that is inconsistently cased/formatted (`"SKU-9021"` vs plain `"ProPhone 15 GenX"` name-as-key in shape D rows).
- **Core catalog fields** (shape A): name, category, brand, description, barcode, unit, icon/image reference.
- **Pricing/cost fields** (shapes A + C): unit cost, selling price — from which `totalValue`, `marginPct`, `netProfit` etc. should be **derived**, not stored as independent hand-typed numbers as they are today.
- **Inventory/stock fields** (shape A): stock, reserved, available, reorder point, status, per-warehouse distribution — this is really a **separate `inventory_by_location` child entity**, not flat product columns, since shape A's `warehouseDistribution[]` is already relational in spirit.
- **Fulfillment metadata** (shape A): fulfillment type (FBA/FBM/SFP) + FBA-fee-specific sub-object — this is Amazon-channel-specific and should live in a **channel-listing child entity**, not the base product, since eBay/Walmart/Shopify variants (shape D) have entirely different per-channel fee/stat fields.
- **Channel performance stats** (shape D): revenue, units sold, net profit, and channel-specific extras (Buy Box %, Watchers, Conversion Rate) — these vary per marketplace and per time period, so they belong in a **product_channel_metrics** time-series/fact table, not the product record itself.

**Adapter impact:**
- **Can consume a normalized canonical Product directly with minimal change**: `Inventory.jsx`, `ProductDetails.jsx` (already gracefully handle optional fields).
- **Needs mapping/adapter logic**: `Dashboard.jsx` (shape B is a thin projection — trivial view), `Analytics.jsx` (shape C requires joining product + a metrics fact table and computing `marginPct`), `ProductCard.jsx`/`SellerboardPage.jsx` (shape D requires a per-channel stats projection with a dynamic `stats[]` array — this is the highest-effort adapter since the "shape" of `stats` differs by which nav section is rendering it).

---

## 4. Hidden Business Rules Found

- **Status enum, undeclared and unvalidated**: `components/StatusBadge.jsx:1-52` hardcodes 50 exact-match strings (`Optimal, Active, Approved, Paid, Delivered, Refunded, Shipped, Packed, In Transit, Processing, Pending, Requested, Preparing, Low Stock, Monitor, Near Full, Watch, Overstock, Out of Stock, Failed, Cancelled, Rejected, On Hold, Inactive, Maintenance, N/A, Resolved, Reimbursed, Enabled, Connected, Sent, Open, Scheduled, Investigating, Denied, Disabled, Draft, Efficient, Wasteful, Recommended, VIP, Reorder Now, On Track, Overstocked, Compliant, Violation, Critical, Warning, Info, Posted`), silently falling back to gray for anything unrecognized. Backend status values must match these strings byte-for-byte (case-sensitive) or existing UI will silently degrade with no error surfaced.
- **Separate ad hoc enums outside StatusBadge**: order `type` (`Purchase/Sales/Transfer`, styled via a local object in `Orders.jsx:33-37`) and `priority` (`High/Urgent/Normal`, via a string-comparison function in `Orders.jsx:39-42`) and low-stock `severity` (`critical/warning`, `mockData.js:194-198`) are each their own undeclared enum, disconnected from `StatusBadge`'s list.
- **Currency is hardcoded everywhere, no locale/formatting layer**: the `$` sign is a literal character baked into ~34 occurrences in `mockData.js` and ~220 in `sellerboardData.js`. A `money()` formatter helper exists (`sellerboardData.js:160`) but is **never called** — dead code. A "Default Currency" selector exists in Settings UI (`Settings.jsx:134-138`, and again at `sellerboardData.js:1506` for `/account/general`) but is a static, non-functional `<select>` with no state wiring.
- **Percentages/margins are hand-typed, not derived**: `marginPct: 17.7` (`mockData.js:349`) and similar fields throughout are typed literals, not computed from cost/revenue. The two places that *do* compute inline are: `ProductDetails.jsx:30-31` (`availablePct`/`reservedPct` = available or reserved ÷ stock × 100) and `Analytics.jsx:17` (`spendPct` = ad spend ÷ ad sales × 100, an ACOS-style ratio). Any real backend must decide whether margin/ACOS fields are computed server-side or client-side — the current mock data is inconsistent on this point.
- **FBA fee total computed inline**: `ProductDetails.jsx:278` sums `referral + fulfillment + storage + longTerm` at render time — this arithmetic must be preserved or replicated server-side.
- **Dates are free-text strings with no real date type**: no `Date` objects, no ISO 8601, no timezone handling anywhere — dates are literals like `"Jun 18, 2024"`, `"Today, 09:42"`, `"Yesterday, 16:18"`. A "Date format" selector in Settings (`Settings.jsx:150-154`) is purely cosmetic. Backend must decide the real date representation; frontend currently has no parsing logic to consume ISO dates.
- **Pagination totals are decorative and disconnected from data**: `Inventory.jsx:239` claims `totalPages={498}` against 5 mock products; `Orders.jsx:245` claims `498` against 5 orders; `Suppliers.jsx:149` claims `9` against 5 suppliers; `LowStockAlert.jsx:134` claims `3` pages while its own label says "24 products" against 5 mock rows. None of these numbers should be treated as real volume signals when sizing the backend.
- **`ProductCard.jsx:15` references `product.seed`**, a field that is never set on any real data object — dead/unused prop fallback.

---

## 5. Sellerboard Pages Breakdown (generic vs custom)

**All 61 are generic.** Verified via `App.jsx:13,15,31-33` (flattens `sellerboardNav` into 61 routes, all mapped to a single `<SellerboardPage />` element) and `SellerboardPage.jsx:53-64` (looks up `sellerboardPages[pathname]`; renders a static "not configured" fallback if missing, proving there is no per-route code path). Route count and config-object count both verified at exactly 61 (1:1 match) across 12 nav groups: Profit (9), PPC (4), Inventory Tools (4), Autoresponder (3), Money Back (4), Alerts (2), eBay (7), Walmart (7), Amazon (7), Shopify (7), QuickBooks (2), Account Settings (5).

`SellerboardPage.jsx` renders one of four interchangeable content blocks per config: KPI grid (`kpis`), bar chart (`chart`), a product-card grid (`variant: "products"`), a settings form (`variant: "settings"`), or a generic `DataTable` (`table`) with column "types" (`status`, `bold`, `muted`, `thumb`, `avatar`) mapped to renderers in `buildColumns()`.

**Implication for backend design:** each `sellerboardPages[path]` config object is, in effect, an already-designed API response contract. Backend endpoint shapes can largely mirror these configs rather than being invented from scratch — this significantly de-risks the "61 pages" problem, since it is really "1 page type + N data payloads," not 61 distinct feature builds.

The 9 non-sellerboard pages (`Dashboard`, `Inventory`, `ProductDetails`, `LowStockAlert`, `Suppliers`, `Orders`, `Warehouse`, `Analytics`, `Settings`) are genuinely bespoke, hand-written components and are NOT part of this generic system — they need individually designed endpoints.

---

## 6. Frontend→Backend Gap List

- **No authentication whatsoever**: no login page, no protected routes, no session/token concept. `App.jsx` mounts all routes unconditionally. Backend must introduce the entire auth layer from zero; frontend has nothing to build on top of.
- **No tenancy model**: the app assumes a single hardcoded company (`"Inventory Insights Pro LLC"`, referenced in `Settings.jsx:119` and `sellerboardData.js:1498`). There is no `org_id`/`tenant_id`/`workspace_id` concept anywhere in the frontend to hint at multi-tenant boundaries — this must be designed fresh, informed only by the product vision, not by any existing frontend assumption.
- **No real RBAC enforcement**: `permissionMatrix` (`mockData.js:379-387`) is rendered as read-only checkboxes (`Settings.jsx:204-225`, `readOnly` on line 219) — it's a mockup of what a permissions UI *could* look like, not a spec for how permissions actually gate anything. No route or component anywhere checks it.
- **`currentUser` is disconnected from `workspaceUsers`/`/account/users`**: three separate, non-unified "who is a user" data sources exist (`currentUser` singleton, `workspaceUsers` array, and a near-duplicate array embedded in the `/account/users` sellerboard config) — backend must pick one canonical `users` model and the frontend integration will need to consolidate these call sites.
- **No product ID scheme that survives across shapes**: `sku` is the closest thing to a durable identifier, but it's used inconsistently — sometimes as an actual field (`sku: "SKU-9021"`), sometimes only the product `name` is used as a lookup key (sellerboard table rows), and shape A's own `id` field (`"prophone-15-genx"`, a slug) is never cross-referenced by any other shape.
- **No real integration wiring for any external platform**: Amazon, eBay, Walmart, Shopify, and QuickBooks are referenced purely as static labels/nav groups — no OAuth, no webhook receivers, no SDK usage exists to build on. This is a 100% net-new integration effort per platform, not a "wire up the existing calls" effort.
- **No computed-value contract for financial/percentage fields**: it's undecided (and inconsistent in the mock data itself) whether fields like `marginPct`, `totalValue`, ACOS, or FBA-fee totals should be computed by the backend and served as fields, or computed client-side from raw inputs. This needs an explicit decision before schema design (Prompt 2).
- **No pagination/volume contract**: since all pagination totals in the frontend are fake/decorative, there is no real signal for expected data volumes per page — this must come from product requirements, not from mimicking the current mock numbers.
- **No notification/alerts backend**: `/alerts` and `/alerts/settings` model a notification system entirely as static mock rows and non-functional toggles — there is no delivery mechanism (email/SMS/Slack) wired to anything.
- **No file/document storage concept**: `ProductDetails.jsx:285-301` renders a static "attachments" UI (a hardcoded PDF filename) with no upload flow — if document storage matters to the vision, it's undesigned even at the mock level.

---

## 7. Integration Surfaces Detected in UI

All referenced as **display labels only** — no SDKs, API clients, or OAuth flows exist for any of them (confirmed by an empty `fetch`/`axios`/`supabase`/`process.env` grep across all of `src/`).

| Platform/Service | Evidence |
|---|---|
| **Amazon** (general, FBA/FBM/SFP fulfillment, Buy Box, Sponsored Products/Brands/Display, Amazon Logistics, Amazon Attribution) | Nav group `sellerboardData.js:101-114` (7 routes); `fulfillmentType` field `mockData.js:64,105,127,150,172`; `FulfillmentBadge.jsx:1-15`; FBA fee panel `ProductDetails.jsx:251-283`; storage fee alert `mockData.js:373-377`; PPC nav group `sellerboardData.js:21-31`; Amazon Attribution page `sellerboardData.js:475-496` |
| **eBay** | Nav group `sellerboardData.js:73-86` (7 routes) |
| **Walmart** | Nav group `sellerboardData.js:87-100` (7 routes); "Walmart Fulfillment Services", "Spark Delivery", "Walmart Connect" ads `sellerboardData.js:1067-1109` |
| **Shopify** | Nav group `sellerboardData.js:115-128` (7 routes); "Shopify Plan (Advanced)", "Shopify Payments Fee" `sellerboardData.js:1411-1412` |
| **QuickBooks** | Nav group `sellerboardData.js:129-137` (2 routes: settlements, config); chart-of-accounts mapping settings `sellerboardData.js:1467-1486` |
| **WooCommerce** | **Not referenced anywhere** in the codebase — mentioned in the task brief and product vision but has zero footprint in the current frontend. Treat as a fully greenfield integration with no existing UI contract to reconcile against. |
| **Carriers** (FedEx, UPS, DHL, USPS, Amazon Logistics) | `mockData.js:244-330`; `CarrierBadge.jsx:1-20` (unrecognized carriers fall back to a generic icon) |
| **Autoresponder** (generic email/review-automation, not a named vendor) | Nav group `sellerboardData.js:43-52` |
| **Reimbursement/"Money Back" tooling** (concept modeled after Amazon-reimbursement SaaS like GETIDA) | Nav group `sellerboardData.js:53-63` |

**Conclusion:** the product is explicitly modeled as a Sellerboard-style multi-marketplace analytics aggregator, but implements zero real integrations today. Every integration is a net-new backend build (auth flow, sync jobs, data normalization), not a "connect the existing wiring" task.

---

## 8. Risk Flags

- **Silent status-string mismatch is the highest-leverage risk to fix now.** Because `StatusBadge` silently falls back to gray for unrecognized strings (no error, no warning), a backend that returns even slightly different casing/wording than the 50 hardcoded values will produce a UI that *looks* fine but is silently wrong. This should become a real backend enum with a documented, versioned contract before any page is wired up — retrofitting it later means auditing every status-producing endpoint.
- **The financial-computation contract (client vs. server) is undecided and inconsistent in the mock data itself.** Some percentages are computed inline (`availablePct`, `spendPct`, FBA-fee sum), others are hand-typed literals (`marginPct`, most dollar totals). If this isn't settled explicitly in Prompt 2, different frontend pages will end up expecting different computation ownership, which is expensive to unwind once real money calculations are live.
- **Currency/locale is entirely unimplemented despite a Settings UI implying it works.** The currency selector already exists cosmetically in two places (`Settings.jsx`, `/account/general`) with no backing logic. If launch requires multi-currency at all, this needs real design now — bolting `Intl.NumberFormat` onto ~250 hardcoded `$` literals later is a large, error-prone refactor.
- **No shared Product ID scheme is the single biggest structural risk for the omnichannel vision.** Every one of the 6+ product shapes uses `sku` (or worse, product *name*) as its only cross-reference key, and even `sku` formatting is inconsistent. Multi-marketplace listings (the core of the long-term vision) will not reconcile correctly across Amazon/eBay/Walmart/Shopify without a real canonical product ID established at the schema level from day one — retrofitting this after channel integrations exist means a painful ID-migration project.
- **Zero tenancy/auth in the frontend means the backend must design multi-tenancy blind**, with no UI signal about how workspace boundaries, invitations, or seat management should work. Cheaper to nail this down explicitly before writing any RLS/authorization code than to guess and rebuild.
- **61 "pages" are cheap to build (1 renderer + N JSON payloads) but expensive to get wrong at the data-modeling layer** — since every one of those JSON payloads implies a slightly different join/aggregation across the real schema (per-channel product stats, per-channel expenses, per-channel LTV, etc.), the temptation will be to special-case backend endpoints per page instead of building general-purpose, composable query endpoints. Decide the endpoint-design philosophy (generic query API vs. bespoke per-page endpoints) before Prompt 2's schema work, since it changes what "done" looks like for the MVP.
- **Fake pagination/volume numbers could mislead capacity/index planning** if taken at face value — don't size database indexes or pagination strategy off the `totalPages={498}`-style literals; get real volume expectations from the product owner instead.

---

## 9. Recommended Build Order for Backend (high-level — detail comes in Prompt 2)

1. **Foundations**: tenancy model, auth (Supabase Auth + FastAPI JWT verification), and a real RBAC enforcement layer — nothing else can be built safely without these, since the frontend currently assumes none of it.
2. **Canonical Product + core catalog/inventory schema**: establish the single source-of-truth Product ID and reconcile the 6 existing shapes against it, plus warehouses/locations as first-class relations (not flat columns).
3. **Core operational entities**: suppliers, orders (purchase/sales/transfer unified under one polymorphic or shared model), and the shipment/carrier tracking data that currently backs `Orders.jsx`/`Warehouse.jsx`.
4. **Generic Sellerboard data API**: since all 61 pages share one renderer and one config shape, build a small number of composable endpoints (KPIs, chart series, table rows, product-card stats) that can serve any of the 61 payload shapes, rather than one bespoke endpoint per page.
5. **Financial computation layer**: decide and implement server-side computation for margins, ACOS/TACOS, FBA-fee totals, and currency formatting — resolving the inconsistency flagged in §8 before any channel-specific numbers go live.
6. **External integrations** (Amazon, eBay, Walmart, Shopify, QuickBooks): build one at a time, each as a net-new sync/OAuth pipeline, prioritized by whichever channel the business actually needs first — none of the current UI gives a technical head start here.
