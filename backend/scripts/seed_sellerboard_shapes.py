"""Structural metadata for all 61 Sellerboard routes, translated once from
frontend/src/data/sellerboardData.js's per-route config objects (kpi labels,
chart titles, table column key/header/type triples, product-card stat labels,
settings groups/fields) — NOT the literal mock values in that file, which
BACKEND_READINESS_REPORT.md flags as fake/decorative. Called by
scripts/seed_demo_platform.py, which generates realistic-but-randomized values
for every field defined here and writes real rows to the
sellerboard_page_meta/... tables (migration 0004) for each seeded organization.

Every one of these 61 pages is presentation-only placeholder content — no real
Amazon/eBay/Walmart/Shopify/QuickBooks integration exists or is in scope (see
the project plan) — so values are generated from plausible ranges/pools per
field "kind", not derived from any real business calculation.
"""

import random
from dataclasses import dataclass, field
from datetime import date, timedelta

CARRIERS = ["FedEx", "UPS", "DHL", "USPS", "Amazon Logistics"]
STATUS_DEFAULT = ["Active", "Pending", "Resolved", "Open"]


@dataclass(frozen=True)
class Col:
    key: str
    header: str
    col_type: str | None = None  # status | bold | muted | thumb | avatar
    kind: str = "text"  # how to generate a value: product|money|percent|int|date|status|code|carrier|choice|person|text
    choices: tuple[str, ...] | None = None


def col(key, header, col_type=None, kind="text", choices=None):
    return Col(key, header, col_type, kind, tuple(choices) if choices else None)


@dataclass
class PageSpec:
    badge: str
    title: str
    subtitle: str
    variant: str | None = None
    kpi_labels: tuple[str, ...] | None = None
    has_chart: bool = False
    chart_title: str | None = None
    table_title: str | None = None
    table_columns: tuple[Col, ...] | None = None
    product_stat_labels: tuple[str, ...] | None = None
    settings_groups: tuple[dict, ...] | None = None


# ---------------------------------------------------------------------------
# Reusable table shapes (used verbatim, or as a base, by several routes)
# ---------------------------------------------------------------------------

PROFITABILITY_TABLE = (
    col("name", "PRODUCT", "thumb", "product"),
    col("unitsSold", "UNITS SOLD", None, "int"),
    col("revenue", "REVENUE", "bold", "money"),
    col("netProfit", "NET PROFIT", "bold", "money"),
    col("marginPct", "MARGIN", None, "percent"),
)

CHANNEL_LISTINGS_TABLE = (
    col("name", "LISTING", "thumb", "product"),
    col("unitsSold", "UNITS SOLD", None, "int"),
    col("revenue", "REVENUE", "bold", "money"),
    col("netProfit", "NET PROFIT", "bold", "money"),
)

LTV_TABLE = (
    col("customer", "CUSTOMER", "bold", "person"),
    col("orders", "ORDERS", None, "int"),
    col("firstOrder", "FIRST ORDER", None, "date"),
    col("totalSpent", "TOTAL SPENT", "bold", "money"),
    col("status", "TIER", "status", "status", ("VIP", "Active", "N/A")),
)

SHIPPING_COSTS_TABLE = (
    col("orderId", "ORDER", "muted", "code"),
    col("name", "PRODUCT", "thumb", "product"),
    col("carrier", "CARRIER", None, "carrier"),
    col("shipCost", "SHIP COST", "bold", "money"),
    col("date", "DATE", None, "date"),
)

CHANNEL_ORDERS_TABLE = (
    col("orderId", "ORDER", "muted", "code"),
    col("buyer", "BUYER", None, "person"),
    col("name", "PRODUCT", "thumb", "product"),
    col("total", "TOTAL", "bold", "money"),
    col("date", "DATE", None, "date"),
    col("status", "STATUS", "status", "status", ("Shipped", "In Transit", "Delivered", "Preparing")),
)

CHANNEL_EXPENSES_TABLE = (
    col("expense", "EXPENSE", "bold", "text"),
    col("category", "CATEGORY", None, "choice", ("Platform", "Advertising", "Payments", "Software", "Fulfillment")),
    col("monthlyCost", "MONTHLY COST", "bold", "money"),
    col("status", "STATUS", "status", "status", ("Active",)),
)

CHANNEL_REPORTS_TABLE = (
    col("report", "REPORT", "bold", "choice", ("Profit & Loss", "Sales by Channel", "Performance Report", "Inventory Report")),
    col("period", "PERIOD", None, "choice", ("Monthly", "Weekly", "Quarterly")),
    col("lastRun", "LAST RUN", None, "date"),
    col("status", "STATUS", "status", "status", ("Scheduled", "Draft")),
    col("format", "FORMAT", "muted", "choice", ("PDF", "CSV")),
)

_PROFIT_PRODUCT_STATS = ("Revenue", "Net Profit", "Margin", "Units Sold")


# ---------------------------------------------------------------------------
# The 33 unique (non-channel) routes
# ---------------------------------------------------------------------------

UNIQUE_PAGE_SPECS: dict[str, PageSpec] = {
    "/profit": PageSpec(
        badge="Amazon · All Marketplaces", title="Profit Dashboard",
        subtitle="Real-time revenue, fees, ad spend and net profit across every SKU.",
        kpi_labels=("REVENUE", "COGS", "AMAZON FEES", "AD SPEND", "NET PROFIT", "PROFIT MARGIN"),
        has_chart=True, chart_title="Net Profit Trend (7 days)",
        table_title="Product Profitability", table_columns=PROFITABILITY_TABLE,
    ),
    "/profit/products": PageSpec(
        badge="Profit · Products", title="Product Profitability",
        subtitle="Per-SKU revenue, fees, ad spend and margin for the current period.",
        variant="products", product_stat_labels=_PROFIT_PRODUCT_STATS,
    ),
    "/profit/shipping-costs": PageSpec(
        badge="Profit · Logistics", title="Shipping Costs",
        subtitle="Outbound freight and per-unit shipping cost by order and carrier.",
        table_columns=SHIPPING_COSTS_TABLE + (col("weight", "WEIGHT", None, "choice", ("0.6 lb", "1.2 lb", "3.1 lb", "8.4 lb", "24 lb")),),
    ),
    "/profit/indirect-expenses": PageSpec(
        badge="Profit · Overhead", title="Indirect Expenses",
        subtitle="Fixed monthly costs not tied to a specific unit sold.",
        kpi_labels=("TOTAL MONTHLY", "LARGEST LINE ITEM", "% OF REVENUE"),
        table_columns=(
            col("expense", "EXPENSE", "bold", "choice", ("Office Rent", "Accounting Software", "Virtual Assistant", "Business Insurance", "Self-Storage Unit")),
            col("category", "CATEGORY", None, "choice", ("Facilities", "Software", "Labor", "Insurance")),
            col("vendor", "VENDOR", None, "text"),
            col("monthlyCost", "MONTHLY COST", "bold", "money"),
            col("status", "STATUS", "status", "status", ("Active",)),
        ),
    ),
    "/profit/variable-expenses": PageSpec(
        badge="Profit · Per-Unit Costs", title="Variable Expenses",
        subtitle="Costs that scale with units sold — packaging, prep and inbound freight.",
        table_columns=(
            col("expense", "EXPENSE", "bold", "choice", ("Poly Mailer Packaging", "Prep Center Fee", "Inbound Freight", "FNSKU Labeling", "Bundling Labor")),
            col("name", "LINKED PRODUCT", "thumb", "product"),
            col("unitCost", "COST / UNIT", None, "money"),
            col("monthlyTotal", "MONTHLY TOTAL", "bold", "money"),
            col("category", "CATEGORY", None, "choice", ("Packaging", "Prep & Labeling", "Freight", "Labor")),
        ),
    ),
    "/profit/search-terms": PageSpec(
        badge="Profit · PPC", title="Search Terms",
        subtitle="Customer search term performance across all sponsored campaigns.",
        kpi_labels=("SEARCH TERMS TRACKED", "AVG CTR", "AVG ACOS", "WASTED SPEND"),
        table_columns=(
            col("term", "SEARCH TERM", "bold", "choice", ("wireless earbuds pro", "cheap phone charger", "ergonomic office chair", "27 inch 4k monitor", "gaming monitor cheap")),
            col("campaign", "CAMPAIGN", None, "text"),
            col("impressions", "IMPR.", None, "int"),
            col("clicks", "CLICKS", None, "int"),
            col("spend", "SPEND", None, "money"),
            col("sales", "SALES", None, "money"),
            col("acos", "ACOS", None, "percent"),
            col("status", "STATUS", "status", "status", ("Efficient", "Watch", "Wasteful")),
        ),
    ),
    "/profit/ltv": PageSpec(
        badge="Profit · Customers", title="Customer Lifetime Value",
        subtitle="How much each customer is worth over their full relationship with you.",
        kpi_labels=("AVG LTV (365d)", "REPEAT PURCHASE RATE", "AVG ORDER VALUE", "REPEAT CUSTOMERS"),
        has_chart=True, chart_title="Average LTV by Cohort Month",
        table_title="Top Customers by LTV", table_columns=LTV_TABLE,
    ),
    "/profit/cashflow": PageSpec(
        badge="Profit · Forecast", title="Cashflow",
        subtitle="Projected balance based on pending payouts, bills and reorders.",
        kpi_labels=("CURRENT BALANCE", "PROJECTED (30d)", "PENDING PAYOUTS", "UPCOMING BILLS"),
        has_chart=True, chart_title="30-Day Cashflow Projection",
        table_title="Upcoming Payables & Receivables",
        table_columns=(
            col("item", "ITEM", "bold", "choice", ("Amazon Payout — Bi-weekly", "Supplier PO Payment", "Office Rent", "Supplier PO Payment")),
            col("type", "TYPE", "status", "status", ("Scheduled", "Pending")),
            col("dueDate", "DUE DATE", None, "date"),
            col("amount", "AMOUNT", "bold", "money"),
        ),
    ),
    "/profit/reports": PageSpec(
        badge="Profit · Reports", title="Reports",
        subtitle="Generate and schedule financial reports for accounting and tax filing.",
        table_columns=(
            col("report", "REPORT", "bold", "choice", ("Profit & Loss Statement", "Inventory Valuation", "Tax Summary", "Advertising Performance", "Cashflow Forecast")),
            col("type", "TYPE", None, "choice", ("Financial", "Inventory", "Tax", "PPC")),
            col("period", "PERIOD", None, "choice", ("Monthly", "Weekly", "Quarterly")),
            col("lastRun", "LAST RUN", None, "date"),
            col("status", "STATUS", "status", "status", ("Scheduled", "Draft")),
            col("format", "FORMAT", "muted", "choice", ("PDF", "CSV")),
        ),
    ),
    "/ppc": PageSpec(
        badge="PPC · All Campaigns", title="PPC Dashboard",
        subtitle="Sponsored Products, Brands and Display performance in one view.",
        kpi_labels=("AD SPEND", "AD SALES", "ACOS", "TACOS", "ROAS", "IMPRESSIONS"),
        has_chart=True, chart_title="Ad Spend vs Sales (7 days)",
        table_title="Top Campaigns",
        table_columns=(
            col("campaign", "CAMPAIGN", "bold", "text"),
            col("type", "TYPE", None, "choice", ("Sponsored Products", "Sponsored Brands", "Sponsored Display")),
            col("spend", "SPEND", None, "money"),
            col("sales", "SALES", None, "money"),
            col("acos", "ACOS", None, "percent"),
            col("status", "STATUS", "status", "status", ("Active", "Paused")),
        ),
    ),
    "/ppc/recommendations": PageSpec(
        badge="PPC · Optimization", title="Recommendations",
        subtitle="Automated bid, keyword and budget suggestions based on 30-day performance.",
        table_columns=(
            col("type", "TYPE", "bold", "choice", ("Increase Bid", "Decrease Bid", "Add Negative", "New Keyword", "Raise Budget")),
            col("target", "TARGET", None, "text"),
            col("campaign", "CAMPAIGN", None, "text"),
            col("current", "CURRENT", None, "money"),
            col("suggested", "SUGGESTED", None, "money"),
            col("status", "IMPACT", "status", "status", ("Recommended", "Open")),
        ),
    ),
    "/ppc/automation-log": PageSpec(
        badge="PPC · Automation", title="Automation Log",
        subtitle="History of every automated bid, budget and keyword change applied by your rules.",
        table_columns=(
            col("timestamp", "TIMESTAMP", "muted", "date"),
            col("campaign", "CAMPAIGN", None, "text"),
            col("action", "ACTION", "bold", "choice", ("Bid Increased", "Bid Decreased", "Keyword Paused", "Budget Increased", "Negative Added")),
            col("before", "BEFORE", None, "money"),
            col("after", "AFTER", None, "money"),
            col("reason", "REASON", None, "choice", ("ACOS below target", "ACOS above target", "Wasted spend", "Budget capped")),
        ),
    ),
    "/ppc/amazon-attribution": PageSpec(
        badge="PPC · Attribution", title="Amazon Attribution",
        subtitle="External traffic (social, search, email) driving Amazon detail page views and sales.",
        table_columns=(
            col("source", "SOURCE", "bold", "choice", ("Facebook Ads", "Google Ads", "TikTok Ads", "Email Newsletter", "Influencer Links")),
            col("clicks", "CLICKS", None, "int"),
            col("dpv", "DETAIL PAGE VIEWS", None, "int"),
            col("sales", "SALES", None, "money"),
            col("roas", "ROAS", None, "multiplier"),
            col("status", "STATUS", "status", "status", ("Efficient", "Watch", "Wasteful")),
        ),
    ),
    "/inventory-tools/planner": PageSpec(
        badge="Inventory · Replenishment", title="Inventory Planner",
        subtitle="Days of stock remaining and recommended reorder quantities per SKU.",
        table_columns=(
            col("name", "PRODUCT", "thumb", "product"),
            col("currentStock", "CURRENT STOCK", None, "int"),
            col("avgDailySales", "AVG DAILY SALES", None, "int"),
            col("daysLeft", "DAYS OF STOCK LEFT", None, "int"),
            col("recommendedReorder", "RECOMMENDED REORDER", "bold", "int"),
            col("status", "STATUS", "status", "status", ("On Track", "Reorder Now", "Overstocked")),
        ),
    ),
    "/inventory-tools/purchase-orders": PageSpec(
        badge="Inventory · Procurement", title="Purchase Orders",
        subtitle="Track purchase orders from creation through delivery.",
        table_columns=(
            col("poId", "PO ID", "muted", "code"),
            col("supplier", "SUPPLIER", "bold", "supplier"),
            col("items", "ITEMS", None, "int"),
            col("totalCost", "TOTAL COST", "bold", "money"),
            col("orderDate", "ORDER DATE", None, "date"),
            col("eta", "EXPECTED ARRIVAL", None, "date"),
            col("status", "STATUS", "status", "status", ("Processing", "Pending", "Shipped", "Delivered")),
        ),
    ),
    "/inventory-tools/reseller-workflow": PageSpec(
        badge="Inventory · Brand Protection", title="Reseller Workflow",
        subtitle="Track unauthorized resellers and MAP pricing compliance across marketplaces.",
        table_columns=(
            col("seller", "SELLER", "bold", "choice", ("DealHub Direct", "BargainOutlet22", "QuickResell Co.", "ClearanceKingUS")),
            col("name", "PRODUCT", "thumb", "product"),
            col("listingPrice", "LISTING PRICE", None, "money"),
            col("mapPrice", "MAP PRICE", None, "money"),
            col("lastChecked", "LAST CHECKED", None, "date"),
            col("status", "STATUS", "status", "status", ("Compliant", "Violation")),
        ),
    ),
    "/inventory-tools/fba-shipments": PageSpec(
        badge="Inventory · FBA", title="FBA Shipments",
        subtitle="Inbound shipment plans to Amazon fulfillment centers.",
        table_columns=(
            col("shipmentId", "SHIPMENT ID", "muted", "code"),
            col("destinationFC", "DESTINATION FC", None, "choice", ("ONT8 - San Bernardino, CA", "MDW2 - Joliet, IL", "ABE8 - Breinigsville, PA", "SMF3 - Tracy, CA")),
            col("products", "PRODUCTS", None, "int"),
            col("units", "UNITS", "bold", "int"),
            col("carrier", "CARRIER", None, "carrier"),
            col("eta", "ETA", None, "date"),
            col("status", "STATUS", "status", "status", ("In Transit", "Preparing", "Delivered")),
        ),
    ),
    "/autoresponder/campaigns": PageSpec(
        badge="Autoresponder · Email", title="Campaigns",
        subtitle="Automated post-purchase email sequences and review requests.",
        kpi_labels=("ACTIVE CAMPAIGNS", "EMAILS SENT (30D)", "AVG OPEN RATE", "AVG CLICK RATE"),
        table_columns=(
            col("campaign", "CAMPAIGN", "bold", "choice", ("Order Confirmation", "Delivery Follow-up", "Review Request", "Win-Back Offer", "New Product Launch")),
            col("trigger", "TRIGGER", None, "choice", ("Order Placed", "5 Days After Delivery", "10 Days After Delivery", "60 Days No Purchase", "Manual")),
            col("emailsSent", "EMAILS SENT", None, "int"),
            col("openRate", "OPEN RATE", None, "percent"),
            col("clickRate", "CLICK RATE", None, "percent"),
            col("status", "STATUS", "status", "status", ("Active", "Paused", "Draft")),
        ),
    ),
    "/autoresponder/products": PageSpec(
        badge="Autoresponder · Products", title="Autoresponder Products",
        subtitle="Review-request performance for each enrolled product.",
        variant="products", product_stat_labels=("Requests Sent", "5-Star Reviews", "Response Rate", "Feedback Score"),
    ),
    "/autoresponder/orders": PageSpec(
        badge="Autoresponder · Orders", title="Autoresponder Orders",
        subtitle="Email sequence progress for individual orders.",
        table_columns=(
            col("orderId", "ORDER", "muted", "code"),
            col("name", "PRODUCT", "thumb", "product"),
            col("customer", "CUSTOMER", None, "person"),
            col("sequenceStep", "SEQUENCE STEP", None, "choice", ("1 of 3", "2 of 3", "3 of 3", "0 of 3")),
            col("nextEmail", "NEXT EMAIL", None, "date"),
            col("status", "STATUS", "status", "status", ("Scheduled", "Sent", "Disabled")),
        ),
    ),
    "/money-back/lost-damaged": PageSpec(
        badge="Money Back · Claims", title="Lost & Damaged",
        subtitle="Units lost or damaged in Amazon fulfillment centers, pending reimbursement.",
        kpi_labels=("OPEN CASES", "ESTIMATED VALUE", "REIMBURSED (30D)"),
        table_columns=(
            col("caseId", "CASE ID", "muted", "code"),
            col("name", "PRODUCT", "thumb", "product"),
            col("warehouse", "WAREHOUSE", None, "choice", ("ONT8", "MDW2", "ABE8", "SMF3")),
            col("units", "UNITS", None, "int"),
            col("estimatedValue", "ESTIMATED VALUE", "bold", "money"),
            col("filedDate", "FILED DATE", None, "date"),
            col("status", "STATUS", "status", "status", ("Investigating", "Open", "Reimbursed", "Denied")),
        ),
    ),
    "/money-back/returns": PageSpec(
        badge="Money Back · Returns", title="Returns",
        subtitle="Customer returns and refund status by order.",
        table_columns=(
            col("orderId", "ORDER", "muted", "code"),
            col("product", "PRODUCT", "bold", "product"),
            col("reason", "REASON", None, "choice", ("Damaged in transit", "Wrong item received", "Changed mind", "Defective unit", "Not as described")),
            col("amount", "AMOUNT", "bold", "money"),
            col("date", "DATE", None, "date"),
            col("status", "STATUS", "status", "status", ("Reimbursed", "Processing", "Denied")),
        ),
    ),
    "/money-back/fba-fee-changes": PageSpec(
        badge="Money Back · Fee Audits", title="FBA Fee Changes",
        subtitle="Detected Amazon fee changes that may qualify for reimbursement.",
        table_columns=(
            col("name", "PRODUCT", "thumb", "product"),
            col("feeType", "FEE TYPE", None, "choice", ("Fulfillment Fee", "Storage Fee", "Referral Fee", "Long-Term Storage")),
            col("previousFee", "PREVIOUS FEE", None, "money"),
            col("newFee", "NEW FEE", None, "money"),
            col("changeDate", "CHANGE DATE", None, "date"),
            col("impact", "MONTHLY IMPACT", "bold", "money"),
        ),
    ),
    "/money-back/reimbursement-gap": PageSpec(
        badge="Money Back · Recovery", title="Reimbursement Gap",
        subtitle="Cases where units are owed but no reimbursement has been issued yet.",
        kpi_labels=("UNITS OWED", "ESTIMATED GAP VALUE", "AVG DAYS OPEN"),
        table_columns=(
            col("caseType", "CASE TYPE", "bold", "choice", ("Warehouse Lost", "Customer Returned, Not Refunded", "Inbound Shipment Shortage", "Destroyed Without Approval")),
            col("name", "PRODUCT", "thumb", "product"),
            col("unitsOwed", "UNITS OWED", None, "int"),
            col("estimatedValue", "ESTIMATED VALUE", "bold", "money"),
            col("daysOpen", "DAYS OPEN", None, "int"),
            col("status", "STATUS", "status", "status", ("Open", "Investigating")),
        ),
    ),
    "/alerts": PageSpec(
        badge="Alerts · Overview", title="Alerts Dashboard",
        subtitle="Real-time notifications across inventory, pricing, listings and reimbursements.",
        kpi_labels=("CRITICAL ALERTS", "WARNING ALERTS", "INFO ALERTS", "RESOLVED THIS WEEK"),
        table_title="Recent Alerts",
        table_columns=(
            col("timestamp", "TIME", "muted", "date"),
            col("type", "SEVERITY", "status", "status", ("Critical", "Warning", "Info")),
            col("message", "MESSAGE", "bold", "choice", ("Buy Box lost", "Stock below reorder point", "New review posted (5★)", "Listing price changed by competitor", "ACOS spiked above 40%")),
            col("name", "PRODUCT", "thumb", "product"),
            col("status", "STATUS", "status", "status", ("Open", "Resolved")),
        ),
    ),
    "/alerts/settings": PageSpec(
        badge="Alerts · Configuration", title="Alert Settings",
        subtitle="Choose which events trigger a notification and where they're delivered.",
        variant="settings",
        settings_groups=(
            {"title": "Stock Alerts", "description": "Get notified before you run out of inventory.", "fields": (
                {"label": "Low stock threshold alert", "description": "Notify when stock falls below reorder point", "type": "toggle"},
                {"label": "Out of stock alert", "description": "Notify immediately when a SKU hits zero", "type": "toggle"},
                {"label": "Reorder lead time buffer", "type": "input", "value": "14 days"},
            )},
            {"title": "Price & Buy Box Alerts", "description": "Stay ahead of pricing changes and Buy Box loss.", "fields": (
                {"label": "Buy Box lost", "type": "toggle"},
                {"label": "Competitor price change", "type": "toggle"},
            )},
            {"title": "Review Alerts", "description": "Track review velocity and negative feedback.", "fields": (
                {"label": "Negative review posted (1-2★)", "type": "toggle"},
                {"label": "Review velocity drop", "type": "toggle"},
            )},
            {"title": "Notification Channels", "fields": (
                {"label": "Email notifications", "type": "toggle"},
                {"label": "SMS notifications", "type": "toggle"},
                {"label": "Slack notifications", "type": "toggle"},
            )},
        ),
    ),
    "/quickbooks/settlements": PageSpec(
        badge="QuickBooks · Sync", title="Settlements",
        subtitle="Amazon and eBay settlement periods synced to your QuickBooks ledger.",
        table_columns=(
            col("settlementId", "SETTLEMENT ID", "muted", "code"),
            col("period", "PERIOD", None, "text"),
            col("grossSales", "GROSS SALES", None, "money"),
            col("fees", "FEES", None, "money"),
            col("netDeposit", "NET DEPOSIT", "bold", "money"),
            col("depositDate", "DEPOSIT DATE", None, "date"),
            col("status", "STATUS", "status", "status", ("Posted", "Pending")),
        ),
    ),
    "/quickbooks/config": PageSpec(
        badge="QuickBooks · Setup", title="Configuration of QB Accounts",
        subtitle="Map sellerboard categories to the correct QuickBooks chart of accounts.",
        variant="settings",
        settings_groups=(
            {"title": "Account Mapping", "description": "Choose which QuickBooks account each transaction type posts to.", "fields": (
                {"label": "Sales Income Account", "type": "select", "value": "Sales", "options": ["Sales", "Amazon Sales", "Other Income"]},
                {"label": "Cost of Goods Sold Account", "type": "select", "value": "COGS", "options": ["COGS", "Inventory Asset", "Other Expense"]},
                {"label": "Amazon & eBay Fees Account", "type": "select", "value": "Selling Fees", "options": ["Selling Fees", "Bank Charges", "Other Expense"]},
                {"label": "Advertising Spend Account", "type": "select", "value": "Advertising", "options": ["Advertising", "Marketing", "Other Expense"]},
            )},
            {"title": "Sync Settings", "fields": (
                {"label": "Auto-sync settlements", "description": "Automatically post new settlements as they close", "type": "toggle"},
                {"label": "Sync frequency", "type": "select", "value": "Daily", "options": ["Daily", "Weekly", "Manual"]},
                {"label": "Include sales tax in sync", "type": "toggle"},
            )},
        ),
    ),
    "/account/general": PageSpec(
        badge="Settings · General", title="General Settings",
        subtitle="Company profile, timezone, currency and marketplace defaults.",
        variant="settings",
        settings_groups=(
            {"title": "Company Profile", "fields": (
                {"label": "Company Name", "type": "input"},
                {"label": "Support Email", "type": "input"},
            )},
            {"title": "Regional Settings", "fields": (
                {"label": "Timezone", "type": "select", "value": "America/Chicago", "options": ["America/Chicago", "America/New_York", "America/Los_Angeles", "UTC"]},
                {"label": "Default Currency", "type": "select", "value": "USD", "options": ["USD", "EUR", "GBP", "CAD"]},
                {"label": "Primary Marketplace", "type": "select", "value": "Amazon.com", "options": ["Amazon.com", "Amazon.co.uk", "eBay.com"]},
                {"label": "Fiscal Year Start", "type": "select", "value": "January", "options": ["January", "April", "July", "October"]},
            )},
        ),
    ),
    "/account/users": PageSpec(
        badge="Settings · Team", title="Users",
        subtitle="Manage teammates and their access to this workspace.",
        table_columns=(
            col("name", "NAME", "avatar", "person"),
            col("email", "EMAIL", "muted", "text"),
            col("role", "ROLE", None, "choice", ("Administrator", "Inventory Manager", "Warehouse Manager", "Member")),
            col("lastLogin", "LAST LOGIN", None, "date"),
            col("status", "STATUS", "status", "status", ("Active", "Inactive")),
        ),
    ),
    "/account/automation": PageSpec(
        badge="Settings · Automation", title="Automation",
        subtitle="Rules that run automatically across inventory, PPC and reimbursements.",
        variant="settings",
        settings_groups=(
            {"title": "Inventory Automation", "fields": (
                {"label": "Auto-create purchase orders", "description": "When stock drops below reorder point", "type": "toggle"},
                {"label": "Auto-request FBA removal for slow movers", "type": "toggle"},
            )},
            {"title": "PPC Automation", "fields": (
                {"label": "Auto-adjust bids to target ACOS", "type": "toggle"},
                {"label": "Auto-pause zero-conversion keywords", "type": "toggle"},
            )},
            {"title": "Reimbursements", "fields": (
                {"label": "Auto-file lost & damaged claims", "type": "toggle"},
                {"label": "Auto-respond to negative reviews", "type": "toggle"},
            )},
        ),
    ),
    "/account/tell-a-friend": PageSpec(
        badge="Settings · Referral", title="Tell a Friend",
        subtitle="Share your referral link and earn credit when a friend signs up.",
        variant="settings",
        settings_groups=(
            {"title": "Your Referral Link", "description": "Copy and share this link — you'll earn $50 credit per signup.", "fields": (
                {"label": "Referral URL", "type": "input"},
                {"label": "Copy link", "type": "button", "value": "Copy Link"},
            )},
            {"title": "Referral Stats", "fields": (
                {"label": "Invites Sent", "type": "input"},
                {"label": "Signed Up", "type": "input"},
                {"label": "Credit Earned", "type": "input"},
            )},
        ),
    ),
    "/account/billing": PageSpec(
        badge="Settings · Billing", title="Billing",
        subtitle="Manage your subscription plan, payment method and invoice history.",
        kpi_labels=("CURRENT PLAN", "NEXT INVOICE", "PAYMENT METHOD", "SEATS USED"),
        table_title="Invoice History",
        table_columns=(
            col("invoiceId", "INVOICE", "muted", "code"),
            col("date", "DATE", None, "date"),
            col("amount", "AMOUNT", "bold", "money"),
            col("status", "STATUS", "status", "status", ("Paid",)),
        ),
    ),
}


# ---------------------------------------------------------------------------
# The 4 channel groups (eBay/Walmart/Amazon/Shopify) — 7 near-identical routes
# each in the original mock, generated here from one template.
# ---------------------------------------------------------------------------

CHANNELS = (
    {"prefix": "/ebay", "name": "eBay", "fee_label": "EBAY FEES", "extra_stat": "Watchers"},
    {"prefix": "/walmart", "name": "Walmart", "fee_label": "WALMART FEES", "extra_stat": "Buy Box %"},
    {"prefix": "/amazon", "name": "Amazon", "fee_label": "AMAZON FEES", "extra_stat": "Buy Box %"},
    {"prefix": "/shopify", "name": "Shopify", "fee_label": "SHOPIFY FEES", "extra_stat": "Conversion Rate"},
)


def _channel_specs(channel: dict) -> dict[str, PageSpec]:
    prefix, name = channel["prefix"], channel["name"]
    return {
        prefix: PageSpec(
            badge=f"{name} · Marketplace", title=f"{name} Dashboard",
            subtitle=f"Revenue, fees and net profit for your {name} storefront.",
            kpi_labels=("REVENUE", channel["fee_label"], "SHIPPING COST", "NET PROFIT", "ORDERS", "PRODUCTS", "AVG ORDER VALUE"),
            has_chart=True, chart_title=f"{name} Revenue (7 days)",
            table_title=f"Top {name} Listings", table_columns=CHANNEL_LISTINGS_TABLE,
        ),
        f"{prefix}/ltv": PageSpec(
            badge=f"{name} · Customers", title=f"{name} Customer LTV",
            subtitle=f"Lifetime value of buyers who purchase through {name}.",
            kpi_labels=("AVG LTV (365d)", "REPEAT PURCHASE RATE", "AVG ORDER VALUE"),
            table_title=f"Top {name} Customers by LTV", table_columns=LTV_TABLE,
        ),
        f"{prefix}/products": PageSpec(
            badge=f"{name} · Products", title=f"{name} Products",
            subtitle=f"Listing performance and profitability for each SKU sold on {name}.",
            variant="products", product_stat_labels=("Revenue", "Net Profit", "Units Sold", channel["extra_stat"]),
        ),
        f"{prefix}/shipping-costs": PageSpec(
            badge=f"{name} · Logistics", title=f"{name} Shipping Costs",
            subtitle=f"Per-order shipping cost across {name}'s supported carriers.",
            table_columns=SHIPPING_COSTS_TABLE,
        ),
        f"{prefix}/orders": PageSpec(
            badge=f"{name} · Orders", title=f"{name} Orders",
            subtitle=f"All orders placed through your {name} storefront.",
            table_columns=CHANNEL_ORDERS_TABLE,
        ),
        f"{prefix}/expenses": PageSpec(
            badge=f"{name} · Expenses", title=f"{name} Expenses",
            subtitle=f"Subscription, fees and other {name}-specific costs.",
            table_columns=CHANNEL_EXPENSES_TABLE,
        ),
        f"{prefix}/reports": PageSpec(
            badge=f"{name} · Reports", title=f"{name} Reports",
            subtitle=f"Generate financial and performance reports for {name}.",
            table_columns=CHANNEL_REPORTS_TABLE,
        ),
    }


def all_page_specs() -> dict[str, PageSpec]:
    specs = dict(UNIQUE_PAGE_SPECS)
    for channel in CHANNELS:
        specs.update(_channel_specs(channel))
    return specs


# ---------------------------------------------------------------------------
# Value generation
# ---------------------------------------------------------------------------


@dataclass
class GenContext:
    rng: random.Random
    product_names: list[str] = field(default_factory=list)
    product_skus: list[str] = field(default_factory=list)
    supplier_names: list[str] = field(default_factory=list)
    person_names: list[str] = field(default_factory=lambda: [
        "A. Rivera", "J. Kim", "M. Chen", "R. Douglas", "S. Patel", "T. Osei", "L. Novak", "C. Bennett",
    ])

    def product(self) -> tuple[str, str]:
        if self.product_names:
            i = self.rng.randrange(len(self.product_names))
            return self.product_names[i], (self.product_skus[i] if i < len(self.product_skus) else "")
        return "Sample Product", "SKU-0000"

    def supplier(self) -> str:
        if self.supplier_names:
            return self.rng.choice(self.supplier_names)
        return "General Supply Co."

    def person(self) -> str:
        return self.rng.choice(self.person_names)


def _gen_date(ctx: GenContext) -> str:
    d = date.today() - timedelta(days=ctx.rng.randint(0, 180))
    return d.strftime("%b %d, %Y")


def _gen_money(ctx: GenContext, small: bool = False) -> str:
    amount = ctx.rng.uniform(5, 400) if small else ctx.rng.uniform(50, 60000)
    return f"${amount:,.2f}"


def _gen_percent(ctx: GenContext) -> str:
    return f"{ctx.rng.uniform(0.5, 45):.1f}%"


def _gen_cell(ctx: GenContext, c: Col) -> object:
    if c.kind == "product":
        name, _sku = ctx.product()
        return name
    if c.kind == "supplier":
        return ctx.supplier()
    if c.kind == "person":
        return ctx.person()
    if c.kind == "money":
        return _gen_money(ctx)
    if c.kind == "percent":
        return _gen_percent(ctx)
    if c.kind == "multiplier":
        return f"{ctx.rng.uniform(1, 9):.1f}x"
    if c.kind == "int":
        return ctx.rng.randint(0, 2400)
    if c.kind == "date":
        return _gen_date(ctx)
    if c.kind == "status":
        options = c.choices or tuple(STATUS_DEFAULT)
        return ctx.rng.choice(options)
    if c.kind == "code":
        return f"#{ctx.rng.randint(1000, 99999)}"
    if c.kind == "carrier":
        return ctx.rng.choice(CARRIERS)
    if c.kind == "choice":
        return ctx.rng.choice(c.choices or ("—",))
    return "—"


def gen_kpi_value(ctx: GenContext, label: str) -> tuple[str, str | None, str | None]:
    """Returns (value, delta, tone) for a KPI card, inferring shape from label text."""
    upper = label.upper()
    tone = ctx.rng.choice(("emerald", "amber", "rose", "indigo"))
    delta = f"{ctx.rng.choice(('+', '-'))}{ctx.rng.uniform(0.5, 18):.1f}%"
    if any(w in upper for w in ("ACOS", "TACOS", "MARGIN", "RATE", "%", "CTR")):
        return _gen_percent(ctx), delta, tone
    if "ROAS" in upper:
        return f"{ctx.rng.uniform(1, 9):.2f}x", delta, tone
    if any(w in upper for w in ("REVENUE", "SALES", "SPEND", "COST", "FEE", "VALUE", "BALANCE", "PAYOUT", "BILLS", "GAP")):
        return _gen_money(ctx), delta, tone
    if "PLAN" in upper:
        return ctx.rng.choice(("Starter", "Pro", "Growth")), None, None
    if "PAYMENT METHOD" in upper:
        return f"Visa •••• {ctx.rng.randint(1000, 9999)}", None, None
    if "SEATS" in upper:
        return f"{ctx.rng.randint(2, 5)} / 5", None, None
    if "INVOICE" in upper:
        return _gen_date(ctx), None, None
    if any(w in upper for w in ("CASES", "ALERTS", "CAMPAIGNS", "TERMS", "CUSTOMERS", "OWED", "DAYS")):
        return str(ctx.rng.randint(1, 60)), delta, tone
    return str(ctx.rng.randint(100, 5000)), delta, tone


def gen_kpis(ctx: GenContext, labels: tuple[str, ...]) -> list[dict]:
    out = []
    for label in labels:
        value, delta, tone = gen_kpi_value(ctx, label)
        out.append({"label": label, "value": value, "delta": delta, "tone": tone, "bar": ctx.rng.randint(10, 95) if ctx.rng.random() < 0.2 else None, "note": None})
    return out


def gen_chart(ctx: GenContext, title: str) -> dict:
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    data = [round(ctx.rng.uniform(20, 100), 1) for _ in labels]
    return {"title": title, "labels": labels, "data": data}


def gen_table_rows(ctx: GenContext, columns: tuple[Col, ...], count: int = 5) -> list[dict]:
    rows = []
    for _ in range(count):
        row = {}
        for c in columns:
            row[c.key] = _gen_cell(ctx, c)
        rows.append(row)
    return rows


def gen_product_cards(ctx: GenContext, stat_labels: tuple[str, ...], count: int = 5) -> list[dict]:
    cards = []
    statuses = ("Optimal", "Low Stock", "Overstock", "Out of Stock")
    for i in range(min(count, max(len(ctx.product_names), count))):
        name, sku = (ctx.product_names[i], ctx.product_skus[i]) if i < len(ctx.product_names) else (f"Sample Product {i}", f"SKU-{9000+i}")
        stats = []
        for label in stat_labels:
            if "%" in label or "Rate" in label or "Margin" in label:
                stats.append({"label": label, "value": _gen_percent(ctx)})
            elif "Revenue" in label or "Profit" in label:
                stats.append({"label": label, "value": _gen_money(ctx)})
            elif "Score" in label:
                stats.append({"label": label, "value": f"{ctx.rng.uniform(3.5, 5):.1f}"})
            else:
                stats.append({"label": label, "value": str(ctx.rng.randint(0, 600))})
        cards.append({"name": name, "sku": sku, "status": ctx.rng.choice(statuses), "stats": stats})
    return cards


def gen_settings_field(ctx: GenContext, field_spec: dict) -> dict:
    field_type = field_spec["type"]
    if "value" in field_spec:
        value = field_spec["value"]
    elif field_type == "toggle":
        value = "true" if ctx.rng.random() < 0.6 else "false"
    elif field_type == "select" and field_spec.get("options"):
        value = ctx.rng.choice(field_spec["options"])
    elif field_type == "button":
        value = field_spec.get("label", "")
    else:
        value = ""
    if field_type == "toggle":
        value = "true" if value in (True, "true") else "false"
    return {
        "label": field_spec["label"],
        "description": field_spec.get("description"),
        "field_type": field_type,
        "value": str(value) if value is not None else None,
        "options": field_spec.get("options"),
    }


def build_page_rows(ctx: GenContext, route_path: str, spec: PageSpec) -> dict:
    """Returns a dict of ready-to-insert row data for one route, consumed by
    scripts/seed_demo_platform.py (which owns the actual DB session/ORM inserts,
    since RLS requires the caller's already-open, org-scoped transaction)."""
    result = {
        "meta": {
            "route_path": route_path, "badge": spec.badge, "title": spec.title, "subtitle": spec.subtitle,
            "variant": spec.variant, "table_title": spec.table_title,
        },
        "kpis": gen_kpis(ctx, spec.kpi_labels) if spec.kpi_labels else [],
        "chart": gen_chart(ctx, spec.chart_title) if spec.has_chart else None,
        "columns": [{"key": c.key, "header": c.header, "col_type": c.col_type} for c in (spec.table_columns or [])],
        "rows": gen_table_rows(ctx, spec.table_columns) if spec.table_columns else [],
        "products": gen_product_cards(ctx, spec.product_stat_labels) if spec.product_stat_labels else [],
        "settings_groups": [],
    }
    if spec.settings_groups:
        for group in spec.settings_groups:
            result["settings_groups"].append(
                {
                    "title": group["title"],
                    "description": group.get("description"),
                    "fields": [gen_settings_field(ctx, f) for f in group["fields"]],
                }
            )
    return result
