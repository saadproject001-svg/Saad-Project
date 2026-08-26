// Data + configuration for the sellerboard-style nav groups and their pages.
// Every page is rendered by <SellerboardPage /> from the config keyed by route path below.

export const sellerboardNav = [
  {
    key: "profit",
    label: "Profit",
    icon: "TrendingUp",
    items: [
      { to: "/profit", label: "Dashboard" },
      { to: "/profit/products", label: "Products" },
      { to: "/profit/shipping-costs", label: "Shipping Costs" },
      { to: "/profit/indirect-expenses", label: "Indirect Expenses" },
      { to: "/profit/variable-expenses", label: "Variable Expenses" },
      { to: "/profit/search-terms", label: "Search Terms" },
      { to: "/profit/ltv", label: "LTV" },
      { to: "/profit/cashflow", label: "Cashflow" },
      { to: "/profit/reports", label: "Reports" },
    ],
  },
  {
    key: "ppc",
    label: "PPC",
    icon: "Megaphone",
    items: [
      { to: "/ppc", label: "Dashboard" },
      { to: "/ppc/recommendations", label: "Recommendations" },
      { to: "/ppc/automation-log", label: "Automation Log" },
      { to: "/ppc/amazon-attribution", label: "Amazon Attribution" },
    ],
  },
  {
    key: "inventory-tools",
    label: "Inventory",
    icon: "Boxes",
    items: [
      { to: "/inventory-tools/planner", label: "Planner" },
      { to: "/inventory-tools/purchase-orders", label: "Purchase Orders" },
      { to: "/inventory-tools/reseller-workflow", label: "Reseller Workflow" },
      { to: "/inventory-tools/fba-shipments", label: "FBA Shipments" },
      { to: "/suppliers", label: "Suppliers" },
    ],
  },
  {
    key: "autoresponder",
    label: "Autoresponder",
    icon: "Mail",
    items: [
      { to: "/autoresponder/campaigns", label: "Campaigns" },
      { to: "/autoresponder/products", label: "Products" },
      { to: "/autoresponder/orders", label: "Orders" },
    ],
  },
  {
    key: "money-back",
    label: "Money Back",
    icon: "RotateCcw",
    items: [
      { to: "/money-back/lost-damaged", label: "Lost & Damaged" },
      { to: "/money-back/returns", label: "Returns" },
      { to: "/money-back/fba-fee-changes", label: "FBA Fee Changes" },
      { to: "/money-back/reimbursement-gap", label: "Reimbursement Gap" },
    ],
  },
  {
    key: "alerts",
    label: "Alerts",
    icon: "Bell",
    items: [
      { to: "/alerts", label: "Dashboard" },
      { to: "/alerts/settings", label: "Settings" },
    ],
  },
  {
    key: "ebay",
    label: "eBay",
    icon: "Tag",
    items: [
      { to: "/ebay", label: "Dashboard" },
      { to: "/ebay/ltv", label: "LTV" },
      { to: "/ebay/products", label: "Products" },
      { to: "/ebay/shipping-costs", label: "Shipping costs" },
      { to: "/ebay/orders", label: "Orders" },
      { to: "/ebay/expenses", label: "Expenses" },
      { to: "/ebay/reports", label: "Reports" },
    ],
  },
  {
    key: "walmart",
    label: "Walmart",
    icon: "Store",
    items: [
      { to: "/walmart", label: "Dashboard" },
      { to: "/walmart/ltv", label: "LTV" },
      { to: "/walmart/products", label: "Products" },
      { to: "/walmart/shipping-costs", label: "Shipping costs" },
      { to: "/walmart/orders", label: "Orders" },
      { to: "/walmart/expenses", label: "Expenses" },
      { to: "/walmart/reports", label: "Reports" },
    ],
  },
  {
    key: "amazon",
    label: "Amazon",
    icon: "Package",
    items: [
      { to: "/amazon", label: "Dashboard" },
      { to: "/amazon/ltv", label: "LTV" },
      { to: "/amazon/products", label: "Products" },
      { to: "/amazon/shipping-costs", label: "Shipping costs" },
      { to: "/amazon/orders", label: "Orders" },
      { to: "/amazon/expenses", label: "Expenses" },
      { to: "/amazon/reports", label: "Reports" },
    ],
  },
  {
    key: "shopify",
    label: "Shopify",
    icon: "ShoppingBag",
    items: [
      { to: "/shopify", label: "Dashboard" },
      { to: "/shopify/ltv", label: "LTV" },
      { to: "/shopify/products", label: "Products" },
      { to: "/shopify/shipping-costs", label: "Shipping costs" },
      { to: "/shopify/orders", label: "Orders" },
      { to: "/shopify/expenses", label: "Expenses" },
      { to: "/shopify/reports", label: "Reports" },
    ],
  },
  {
    key: "quickbooks",
    label: "QuickBooks",
    icon: "Link2",
    items: [
      { to: "/quickbooks/settlements", label: "Settlements" },
      { to: "/quickbooks/config", label: "Configuration of QB accounts" },
    ],
  },
  {
    key: "account-settings",
    label: "Settings",
    icon: "SlidersHorizontal",
    items: [
      { to: "/account/general", label: "General" },
      { to: "/account/users", label: "Users" },
      { to: "/account/automation", label: "Automation" },
      { to: "/account/tell-a-friend", label: "Tell a friend" },
      { to: "/account/billing", label: "Billing" },
    ],
  },
];

const CATALOG = [
  { name: "ProPhone 15 GenX", sku: "SKU-9021" },
  { name: "ZenBook Air 13", sku: "SKU-7721" },
  { name: "Ergo Office Chair", sku: "SKU-4412" },
  { name: "Smart Home Hub", sku: "SKU-3488" },
  { name: "LED Monitor 27 Pro", sku: "SKU-6034" },
];

const money = (n) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export const sellerboardPages = {
  // ───────────────────────── PROFIT ─────────────────────────
  "/profit": {
    badge: "Amazon · All Marketplaces",
    title: "Profit Dashboard",
    subtitle: "Real-time revenue, fees, ad spend and net profit across every SKU.",
    kpis: [
      { label: "REVENUE", value: "$186,420", delta: "+12.4%", tone: "emerald" },
      { label: "COGS", value: "$74,230", delta: "+6.1%", tone: "amber" },
      { label: "AMAZON FEES", value: "$38,960", delta: "+3.8%", tone: "amber" },
      { label: "AD SPEND", value: "$21,150", delta: "-4.2%", tone: "emerald" },
      { label: "NET PROFIT", value: "$52,080", delta: "+18.6%", tone: "emerald" },
      { label: "PROFIT MARGIN", value: "27.9%", delta: "+2.1pt", tone: "emerald", bar: 28 },
    ],
    chart: { data: [45, 62, 50, 74, 85, 66, 92], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], title: "Net Profit Trend (7 days)" },
    tableTitle: "Product Profitability",
    table: {
      columns: [
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "unitsSold", header: "UNITS SOLD" },
        { key: "revenue", header: "REVENUE", type: "bold" },
        { key: "netProfit", header: "NET PROFIT", type: "bold" },
        { key: "marginPct", header: "MARGIN" },
      ],
      rows: [
        { name: "ProPhone 15 GenX", sku: "SKU-9021", unitsSold: 62, revenue: "$55,738", netProfit: "$9,850", marginPct: "17.7%" },
        { name: "ZenBook Air 13", sku: "SKU-7721", unitsSold: 38, revenue: "$49,362", netProfit: "$11,200", marginPct: "22.7%" },
        { name: "Ergo Office Chair", sku: "SKU-4412", unitsSold: 145, revenue: "$57,855", netProfit: "$8,940", marginPct: "15.5%" },
        { name: "LED Monitor 27 Pro", sku: "SKU-6034", unitsSold: 52, revenue: "$23,348", netProfit: "$4,290", marginPct: "18.4%" },
        { name: "Smart Home Hub", sku: "SKU-3488", unitsSold: 0, revenue: "$0", netProfit: "-$1,200", marginPct: "0%" },
      ],
    },
  },

  "/profit/products": {
    badge: "Profit · Products",
    title: "Product Profitability",
    subtitle: "Per-SKU revenue, fees, ad spend and margin for the current period.",
    variant: "products",
    products: [
      { name: "ProPhone 15 GenX", sku: "SKU-9021", status: "Optimal", stats: [{ label: "Revenue", value: "$55,738" }, { label: "Net Profit", value: "$9,850" }, { label: "Margin", value: "17.7%" }, { label: "Units Sold", value: "62" }] },
      { name: "ZenBook Air 13", sku: "SKU-7721", status: "Optimal", stats: [{ label: "Revenue", value: "$49,362" }, { label: "Net Profit", value: "$11,200" }, { label: "Margin", value: "22.7%" }, { label: "Units Sold", value: "38" }] },
      { name: "Ergo Office Chair", sku: "SKU-4412", status: "Low Stock", stats: [{ label: "Revenue", value: "$57,855" }, { label: "Net Profit", value: "$8,940" }, { label: "Margin", value: "15.5%" }, { label: "Units Sold", value: "145" }] },
      { name: "LED Monitor 27 Pro", sku: "SKU-6034", status: "Overstock", stats: [{ label: "Revenue", value: "$23,348" }, { label: "Net Profit", value: "$4,290" }, { label: "Margin", value: "18.4%" }, { label: "Units Sold", value: "52" }] },
      { name: "Smart Home Hub", sku: "SKU-3488", status: "Out of Stock", stats: [{ label: "Revenue", value: "$0" }, { label: "Net Profit", value: "-$1,200" }, { label: "Margin", value: "0%" }, { label: "Units Sold", value: "0" }] },
    ],
  },

  "/profit/shipping-costs": {
    badge: "Profit · Logistics",
    title: "Shipping Costs",
    subtitle: "Outbound freight and per-unit shipping cost by order and carrier.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "carrier", header: "CARRIER" },
        { key: "weight", header: "WEIGHT" },
        { key: "shipCost", header: "SHIP COST", type: "bold" },
        { key: "date", header: "DATE" },
      ],
      rows: [
        { orderId: "#SO-78314", name: "ProPhone 15 GenX", sku: "SKU-9021", carrier: "UPS", weight: "0.6 lb", shipCost: "$4.20", date: "Jun 17, 2024" },
        { orderId: "#SO-78313", name: "ZenBook Air 13", sku: "SKU-7721", carrier: "FedEx", weight: "3.1 lb", shipCost: "$9.85", date: "Jun 16, 2024" },
        { orderId: "#SO-78309", name: "Ergo Office Chair", sku: "SKU-4412", carrier: "Amazon Logistics", weight: "24 lb", shipCost: "$18.40", date: "Jun 15, 2024" },
        { orderId: "#SO-78301", name: "LED Monitor 27 Pro", sku: "SKU-6034", carrier: "DHL", weight: "8.4 lb", shipCost: "$12.10", date: "Jun 14, 2024" },
        { orderId: "#SO-78290", name: "Smart Home Hub", sku: "SKU-3488", carrier: "USPS", weight: "1.2 lb", shipCost: "$5.60", date: "Jun 12, 2024" },
      ],
    },
  },

  "/profit/indirect-expenses": {
    badge: "Profit · Overhead",
    title: "Indirect Expenses",
    subtitle: "Fixed monthly costs not tied to a specific unit sold.",
    kpis: [
      { label: "TOTAL MONTHLY", value: "$6,840", delta: "+2.1%", tone: "amber" },
      { label: "LARGEST LINE ITEM", value: "Office Rent", note: "$2,400/mo" },
      { label: "% OF REVENUE", value: "3.7%", delta: "-0.4pt", tone: "emerald" },
    ],
    table: {
      columns: [
        { key: "expense", header: "EXPENSE", type: "bold" },
        { key: "category", header: "CATEGORY" },
        { key: "vendor", header: "VENDOR" },
        { key: "monthlyCost", header: "MONTHLY COST", type: "bold" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { expense: "Office Rent", category: "Facilities", vendor: "Meridian Properties", monthlyCost: "$2,400", status: "Active" },
        { expense: "Accounting Software", category: "Software", vendor: "QuickBooks Online", monthlyCost: "$180", status: "Active" },
        { expense: "Virtual Assistant", category: "Labor", vendor: "Freelancer", monthlyCost: "$1,600", status: "Active" },
        { expense: "Business Insurance", category: "Insurance", vendor: "NEXT Insurance", monthlyCost: "$310", status: "Active" },
        { expense: "Self-Storage Unit", category: "Facilities", vendor: "Public Storage", monthlyCost: "$220", status: "Active" },
        { expense: "Seller Tools Subscription", category: "Software", vendor: "sellerboard", monthlyCost: "$130", status: "Active" },
      ],
    },
  },

  "/profit/variable-expenses": {
    badge: "Profit · Per-Unit Costs",
    title: "Variable Expenses",
    subtitle: "Costs that scale with units sold — packaging, prep and inbound freight.",
    table: {
      columns: [
        { key: "expense", header: "EXPENSE", type: "bold" },
        { key: "name", header: "LINKED PRODUCT", type: "thumb" },
        { key: "unitCost", header: "COST / UNIT" },
        { key: "monthlyTotal", header: "MONTHLY TOTAL", type: "bold" },
        { key: "category", header: "CATEGORY" },
      ],
      rows: [
        { expense: "Poly Mailer Packaging", name: "ZenBook Air 13", sku: "ZenBook Air 13", unitCost: "$0.85", monthlyTotal: "$323", category: "Packaging" },
        { expense: "Prep Center Fee", name: "Ergo Office Chair", sku: "Ergo Office Chair", unitCost: "$3.20", monthlyTotal: "$464", category: "Prep & Labeling" },
        { expense: "Inbound Freight", name: "LED Monitor 27 Pro", sku: "LED Monitor 27 Pro", unitCost: "$1.40", monthlyTotal: "$728", category: "Freight" },
        { expense: "FNSKU Labeling", name: "ProPhone 15 GenX", sku: "ProPhone 15 GenX", unitCost: "$0.25", monthlyTotal: "$155", category: "Prep & Labeling" },
        { expense: "Bundling Labor", name: "Smart Home Hub", sku: "Smart Home Hub", unitCost: "$1.10", monthlyTotal: "$0", category: "Labor" },
      ],
    },
  },

  "/profit/search-terms": {
    badge: "Profit · PPC",
    title: "Search Terms",
    subtitle: "Customer search term performance across all sponsored campaigns.",
    kpis: [
      { label: "SEARCH TERMS TRACKED", value: "1,284", delta: "+64", tone: "emerald" },
      { label: "AVG CTR", value: "0.42%", delta: "+0.03pt", tone: "emerald" },
      { label: "AVG ACOS", value: "18.4%", delta: "-1.2pt", tone: "emerald" },
      { label: "WASTED SPEND", value: "$1,860", delta: "18 terms", tone: "rose" },
    ],
    table: {
      columns: [
        { key: "term", header: "SEARCH TERM", type: "bold" },
        { key: "campaign", header: "CAMPAIGN" },
        { key: "impressions", header: "IMPR." },
        { key: "clicks", header: "CLICKS" },
        { key: "spend", header: "SPEND" },
        { key: "sales", header: "SALES" },
        { key: "acos", header: "ACOS" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { term: "wireless earbuds pro", campaign: "ProPhone - Auto", impressions: "24,180", clicks: 312, spend: "$186.40", sales: "$1,240.00", acos: "15.0%", status: "Efficient" },
        { term: "cheap phone charger", campaign: "ProPhone - Broad", impressions: "8,420", clicks: 96, spend: "$74.20", sales: "$0.00", acos: "—", status: "Wasteful" },
        { term: "ergonomic office chair", campaign: "Ergo Chair - Exact", impressions: "15,660", clicks: 284, spend: "$298.60", sales: "$1,995.00", acos: "15.0%", status: "Efficient" },
        { term: "27 inch 4k monitor", campaign: "LED Monitor - Auto", impressions: "11,200", clicks: 140, spend: "$168.00", sales: "$898.00", acos: "18.7%", status: "Watch" },
        { term: "gaming monitor cheap", campaign: "LED Monitor - Broad", impressions: "6,940", clicks: 58, spend: "$52.10", sales: "$0.00", acos: "—", status: "Wasteful" },
      ],
    },
  },

  "/profit/ltv": {
    badge: "Profit · Customers",
    title: "Customer Lifetime Value",
    subtitle: "How much each customer is worth over their full relationship with you.",
    kpis: [
      { label: "AVG LTV (365d)", value: "$284", delta: "+8.1%", tone: "emerald" },
      { label: "REPEAT PURCHASE RATE", value: "22.6%", delta: "+1.4pt", tone: "emerald", bar: 23 },
      { label: "AVG ORDER VALUE", value: "$74.20", delta: "+3.2%", tone: "emerald" },
      { label: "REPEAT CUSTOMERS", value: "1,842", delta: "+126", tone: "emerald" },
    ],
    chart: { data: [30, 42, 38, 55, 62, 58, 70], labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], title: "Average LTV by Cohort Month" },
    tableTitle: "Top Customers by LTV",
    table: {
      columns: [
        { key: "customer", header: "CUSTOMER", type: "bold" },
        { key: "orders", header: "ORDERS" },
        { key: "firstOrder", header: "FIRST ORDER" },
        { key: "totalSpent", header: "TOTAL SPENT", type: "bold" },
        { key: "status", header: "TIER", type: "status" },
      ],
      rows: [
        { customer: "Northstar Retail Group", orders: 14, firstOrder: "Feb 03, 2023", totalSpent: "$3,240", status: "VIP" },
        { customer: "Apex Office Systems", orders: 9, firstOrder: "May 21, 2023", totalSpent: "$1,890", status: "VIP" },
        { customer: "J. Alvarez", orders: 4, firstOrder: "Nov 12, 2023", totalSpent: "$612", status: "Active" },
        { customer: "M. Chen", orders: 2, firstOrder: "Mar 08, 2024", totalSpent: "$248", status: "Active" },
        { customer: "R. Douglas", orders: 1, firstOrder: "Jun 10, 2024", totalSpent: "$89", status: "N/A" },
      ],
    },
  },

  "/profit/cashflow": {
    badge: "Profit · Forecast",
    title: "Cashflow",
    subtitle: "Projected balance based on pending payouts, bills and reorders.",
    kpis: [
      { label: "CURRENT BALANCE", value: "$142,600" },
      { label: "PROJECTED (30d)", value: "$168,900", delta: "+18.4%", tone: "emerald" },
      { label: "PENDING PAYOUTS", value: "$38,200", note: "Next: Jun 24" },
      { label: "UPCOMING BILLS", value: "$11,940", note: "Due within 30 days", tone: "amber" },
    ],
    chart: { data: [40, 44, 48, 52, 58, 55, 64, 70, 66, 74, 80, 78], labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"], title: "30-Day Cashflow Projection" },
    tableTitle: "Upcoming Payables & Receivables",
    table: {
      columns: [
        { key: "item", header: "ITEM", type: "bold" },
        { key: "type", header: "TYPE", type: "status" },
        { key: "dueDate", header: "DUE DATE" },
        { key: "amount", header: "AMOUNT", type: "bold" },
      ],
      rows: [
        { item: "Amazon Payout — Bi-weekly", type: "Scheduled", dueDate: "Jun 24, 2024", amount: "+$38,200" },
        { item: "Global Logistics Co. — PO-10482", type: "Pending", dueDate: "Jun 27, 2024", amount: "-$48,620" },
        { item: "Office Rent", type: "Scheduled", dueDate: "Jul 01, 2024", amount: "-$2,400" },
        { item: "Prime Parts Inc. — PO-10481", type: "Pending", dueDate: "Jun 29, 2024", amount: "-$26,450" },
      ],
    },
  },

  "/profit/reports": {
    badge: "Profit · Reports",
    title: "Reports",
    subtitle: "Generate and schedule financial reports for accounting and tax filing.",
    table: {
      columns: [
        { key: "report", header: "REPORT", type: "bold" },
        { key: "type", header: "TYPE" },
        { key: "period", header: "PERIOD" },
        { key: "lastRun", header: "LAST RUN" },
        { key: "status", header: "STATUS", type: "status" },
        { key: "format", header: "FORMAT", type: "muted" },
      ],
      rows: [
        { report: "Profit & Loss Statement", type: "Financial", period: "Monthly", lastRun: "Jun 01, 2024", status: "Scheduled", format: "PDF" },
        { report: "Inventory Valuation", type: "Inventory", period: "Weekly", lastRun: "Jun 17, 2024", status: "Scheduled", format: "CSV" },
        { report: "Tax Summary (Sales Tax)", type: "Tax", period: "Quarterly", lastRun: "Apr 01, 2024", status: "Draft", format: "PDF" },
        { report: "Advertising Performance", type: "PPC", period: "Monthly", lastRun: "Jun 01, 2024", status: "Scheduled", format: "CSV" },
        { report: "Cashflow Forecast", type: "Financial", period: "Monthly", lastRun: "Jun 15, 2024", status: "Draft", format: "PDF" },
      ],
    },
  },

  // ───────────────────────── PPC ─────────────────────────
  "/ppc": {
    badge: "PPC · All Campaigns",
    title: "PPC Dashboard",
    subtitle: "Sponsored Products, Brands and Display performance in one view.",
    kpis: [
      { label: "AD SPEND", value: "$21,150", delta: "-4.2%", tone: "emerald" },
      { label: "AD SALES", value: "$114,900", delta: "+9.6%", tone: "emerald" },
      { label: "ACOS", value: "18.4%", delta: "-1.6pt", tone: "emerald" },
      { label: "TACOS", value: "9.2%", delta: "-0.4pt", tone: "emerald" },
      { label: "ROAS", value: "5.43x", delta: "+0.3x", tone: "emerald" },
      { label: "IMPRESSIONS", value: "2.4M", delta: "+11.2%", tone: "emerald" },
    ],
    chart: { data: [50, 60, 45, 70, 65, 80, 72], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], title: "Ad Spend vs Sales (7 days)" },
    tableTitle: "Top Campaigns",
    table: {
      columns: [
        { key: "campaign", header: "CAMPAIGN", type: "bold" },
        { key: "type", header: "TYPE" },
        { key: "spend", header: "SPEND" },
        { key: "sales", header: "SALES" },
        { key: "acos", header: "ACOS" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { campaign: "ProPhone 15 GenX - Exact", type: "Sponsored Products", spend: "$4,820", sales: "$28,400", acos: "17.0%", status: "Active" },
        { campaign: "ZenBook Air - Auto", type: "Sponsored Products", spend: "$3,140", sales: "$16,900", acos: "18.6%", status: "Active" },
        { campaign: "Ergo Chair - Broad", type: "Sponsored Products", spend: "$2,680", sales: "$9,200", acos: "29.1%", status: "Active" },
        { campaign: "Brand Awareness - Q2", type: "Sponsored Brands", spend: "$1,950", sales: "$11,400", acos: "17.1%", status: "Paused" },
        { campaign: "LED Monitor - Display Retarget", type: "Sponsored Display", spend: "$1,240", sales: "$6,850", acos: "18.1%", status: "Active" },
      ],
    },
  },

  "/ppc/recommendations": {
    badge: "PPC · Optimization",
    title: "Recommendations",
    subtitle: "Automated bid, keyword and budget suggestions based on 30-day performance.",
    table: {
      columns: [
        { key: "type", header: "TYPE", type: "bold" },
        { key: "target", header: "TARGET" },
        { key: "campaign", header: "CAMPAIGN" },
        { key: "current", header: "CURRENT" },
        { key: "suggested", header: "SUGGESTED" },
        { key: "status", header: "IMPACT", type: "status" },
      ],
      rows: [
        { type: "Increase Bid", target: "\"wireless earbuds pro\"", campaign: "ProPhone - Exact", current: "$0.85", suggested: "$1.10", status: "Recommended" },
        { type: "Add Negative", target: "\"cheap phone charger\"", campaign: "ProPhone - Broad", current: "—", suggested: "Negative Exact", status: "Recommended" },
        { type: "Decrease Bid", target: "\"office chair\"", campaign: "Ergo Chair - Broad", current: "$1.40", suggested: "$0.95", status: "Recommended" },
        { type: "New Keyword", target: "\"standing desk chair\"", campaign: "Ergo Chair - Exact", current: "—", suggested: "$0.70 bid", status: "Open" },
        { type: "Raise Budget", target: "Campaign daily budget", campaign: "LED Monitor - Display Retarget", current: "$40/day", suggested: "$65/day", status: "Recommended" },
      ],
    },
  },

  "/ppc/automation-log": {
    badge: "PPC · Automation",
    title: "Automation Log",
    subtitle: "History of every automated bid, budget and keyword change applied by your rules.",
    table: {
      columns: [
        { key: "timestamp", header: "TIMESTAMP", type: "muted" },
        { key: "campaign", header: "CAMPAIGN" },
        { key: "action", header: "ACTION", type: "bold" },
        { key: "before", header: "BEFORE" },
        { key: "after", header: "AFTER" },
        { key: "reason", header: "REASON" },
      ],
      rows: [
        { timestamp: "Today, 06:12 AM", campaign: "ProPhone - Exact", action: "Bid Increased", before: "$0.80", after: "$0.85", reason: "ACOS below target" },
        { timestamp: "Today, 06:12 AM", campaign: "Ergo Chair - Broad", action: "Bid Decreased", before: "$1.55", after: "$1.40", reason: "ACOS above target" },
        { timestamp: "Yesterday, 06:10 AM", campaign: "ZenBook Air - Auto", action: "Keyword Paused", before: "Active", after: "Paused", reason: "0 sales / 200+ clicks" },
        { timestamp: "Yesterday, 06:10 AM", campaign: "LED Monitor - Display Retarget", action: "Budget Increased", before: "$30/day", after: "$40/day", reason: "Budget capped 3 days" },
        { timestamp: "Jun 15, 2024, 06:09 AM", campaign: "ProPhone - Broad", action: "Negative Added", before: "—", after: "\"free phone\"", reason: "Wasted spend, 0 conversions" },
      ],
    },
  },

  "/ppc/amazon-attribution": {
    badge: "PPC · Attribution",
    title: "Amazon Attribution",
    subtitle: "External traffic (social, search, email) driving Amazon detail page views and sales.",
    table: {
      columns: [
        { key: "source", header: "SOURCE", type: "bold" },
        { key: "clicks", header: "CLICKS" },
        { key: "dpv", header: "DETAIL PAGE VIEWS" },
        { key: "sales", header: "SALES" },
        { key: "roas", header: "ROAS" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { source: "Facebook Ads", clicks: "8,420", dpv: "6,180", sales: "$18,400", roas: "6.2x", status: "Efficient" },
        { source: "Google Ads", clicks: "5,140", dpv: "3,920", sales: "$11,200", roas: "4.8x", status: "Efficient" },
        { source: "TikTok Ads", clicks: "3,860", dpv: "2,410", sales: "$4,100", roas: "2.1x", status: "Watch" },
        { source: "Email Newsletter", clicks: "1,920", dpv: "1,640", sales: "$7,800", roas: "9.4x", status: "Efficient" },
        { source: "Influencer Links", clicks: "980", dpv: "710", sales: "$1,240", roas: "1.6x", status: "Wasteful" },
      ],
    },
  },

  // ───────────────────────── INVENTORY TOOLS ─────────────────────────
  "/inventory-tools/planner": {
    badge: "Inventory · Replenishment",
    title: "Inventory Planner",
    subtitle: "Days of stock remaining and recommended reorder quantities per SKU.",
    table: {
      columns: [
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "currentStock", header: "CURRENT STOCK" },
        { key: "avgDailySales", header: "AVG DAILY SALES" },
        { key: "daysLeft", header: "DAYS OF STOCK LEFT" },
        { key: "recommendedReorder", header: "RECOMMENDED REORDER", type: "bold" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { name: "ProPhone 15 GenX", sku: "SKU-9021", currentStock: 1240, avgDailySales: 42, daysLeft: 29, recommendedReorder: 900, status: "On Track" },
        { name: "Ergo Office Chair", sku: "SKU-4412", currentStock: 452, avgDailySales: 24, daysLeft: 19, recommendedReorder: 720, status: "Reorder Now" },
        { name: "Smart Home Hub", sku: "SKU-3488", currentStock: 0, avgDailySales: 12, daysLeft: 0, recommendedReorder: 480, status: "Reorder Now" },
        { name: "LED Monitor 27 Pro", sku: "SKU-6034", currentStock: 2840, avgDailySales: 18, daysLeft: 158, recommendedReorder: 0, status: "Overstocked" },
        { name: "ZenBook Air 13", sku: "SKU-7721", currentStock: 890, avgDailySales: 14, daysLeft: 64, recommendedReorder: 200, status: "On Track" },
      ],
    },
  },

  "/inventory-tools/purchase-orders": {
    badge: "Inventory · Procurement",
    title: "Purchase Orders",
    subtitle: "Track purchase orders from creation through delivery.",
    table: {
      columns: [
        { key: "poId", header: "PO ID", type: "muted" },
        { key: "supplier", header: "SUPPLIER", type: "bold" },
        { key: "items", header: "ITEMS" },
        { key: "totalCost", header: "TOTAL COST", type: "bold" },
        { key: "orderDate", header: "ORDER DATE" },
        { key: "eta", header: "EXPECTED ARRIVAL" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { poId: "#PO-10482", supplier: "Global Logistics Co.", items: 24, totalCost: "$48,620", orderDate: "Jun 18, 2024", eta: "Jun 27, 2024", status: "Processing" },
        { poId: "#PO-10481", supplier: "Prime Parts Inc.", items: 16, totalCost: "$26,450", orderDate: "Jun 16, 2024", eta: "Jun 29, 2024", status: "Pending" },
        { poId: "#PO-10473", supplier: "TechSource International", items: 40, totalCost: "$61,200", orderDate: "Jun 10, 2024", eta: "Jun 24, 2024", status: "Shipped" },
        { poId: "#PO-10460", supplier: "Direct Supply Ltd.", items: 12, totalCost: "$9,840", orderDate: "Jun 02, 2024", eta: "Jun 16, 2024", status: "Delivered" },
      ],
    },
  },

  "/inventory-tools/reseller-workflow": {
    badge: "Inventory · Brand Protection",
    title: "Reseller Workflow",
    subtitle: "Track unauthorized resellers and MAP pricing compliance across marketplaces.",
    table: {
      columns: [
        { key: "seller", header: "SELLER", type: "bold" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "listingPrice", header: "LISTING PRICE" },
        { key: "mapPrice", header: "MAP PRICE" },
        { key: "lastChecked", header: "LAST CHECKED" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { seller: "DealHub Direct", name: "ProPhone 15 GenX", sku: "SKU-9021", listingPrice: "$899.00", mapPrice: "$899.00", lastChecked: "Today, 07:00 AM", status: "Compliant" },
        { seller: "BargainOutlet22", name: "ZenBook Air 13", sku: "SKU-7721", listingPrice: "$1,099.00", mapPrice: "$1,299.00", lastChecked: "Today, 07:00 AM", status: "Violation" },
        { seller: "QuickResell Co.", name: "Ergo Office Chair", sku: "SKU-4412", listingPrice: "$399.00", mapPrice: "$399.00", lastChecked: "Yesterday, 07:00 AM", status: "Compliant" },
        { seller: "ClearanceKingUS", name: "LED Monitor 27 Pro", sku: "SKU-6034", listingPrice: "$379.00", mapPrice: "$449.00", lastChecked: "Yesterday, 07:00 AM", status: "Violation" },
      ],
    },
  },

  "/inventory-tools/fba-shipments": {
    badge: "Inventory · FBA",
    title: "FBA Shipments",
    subtitle: "Inbound shipment plans to Amazon fulfillment centers.",
    table: {
      columns: [
        { key: "shipmentId", header: "SHIPMENT ID", type: "muted" },
        { key: "destinationFC", header: "DESTINATION FC" },
        { key: "products", header: "PRODUCTS" },
        { key: "units", header: "UNITS", type: "bold" },
        { key: "carrier", header: "CARRIER" },
        { key: "eta", header: "ETA" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { shipmentId: "FBA15K8J2M", destinationFC: "ONT8 - San Bernardino, CA", products: 3, units: 900, carrier: "UPS Freight", eta: "Jun 22, 2024", status: "In Transit" },
        { shipmentId: "FBA15K8J1L", destinationFC: "MDW2 - Joliet, IL", products: 2, units: 480, carrier: "FedEx Freight", eta: "Jun 25, 2024", status: "Preparing" },
        { shipmentId: "FBA15K8H9K", destinationFC: "ABE8 - Breinigsville, PA", products: 1, units: 200, carrier: "Amazon Partnered", eta: "Jun 18, 2024", status: "Delivered" },
        { shipmentId: "FBA15K8H7J", destinationFC: "SMF3 - Tracy, CA", products: 4, units: 1120, carrier: "UPS Freight", eta: "Jun 20, 2024", status: "In Transit" },
      ],
    },
  },

  // ───────────────────────── AUTORESPONDER ─────────────────────────
  "/autoresponder/campaigns": {
    badge: "Autoresponder · Email",
    title: "Campaigns",
    subtitle: "Automated post-purchase email sequences and review requests.",
    kpis: [
      { label: "ACTIVE CAMPAIGNS", value: "8", delta: "+2", tone: "emerald" },
      { label: "EMAILS SENT (30D)", value: "4,280", delta: "+11.4%", tone: "emerald" },
      { label: "AVG OPEN RATE", value: "38.6%", delta: "+2.1pt", tone: "emerald", bar: 39 },
      { label: "AVG CLICK RATE", value: "9.2%", delta: "+0.6pt", tone: "emerald", bar: 9 },
    ],
    table: {
      columns: [
        { key: "campaign", header: "CAMPAIGN", type: "bold" },
        { key: "trigger", header: "TRIGGER" },
        { key: "emailsSent", header: "EMAILS SENT" },
        { key: "openRate", header: "OPEN RATE" },
        { key: "clickRate", header: "CLICK RATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { campaign: "Order Confirmation", trigger: "Order Placed", emailsSent: 1240, openRate: "62.4%", clickRate: "8.1%", status: "Active" },
        { campaign: "Delivery Follow-up", trigger: "5 Days After Delivery", emailsSent: 980, openRate: "41.2%", clickRate: "12.4%", status: "Active" },
        { campaign: "Review Request", trigger: "10 Days After Delivery", emailsSent: 860, openRate: "35.8%", clickRate: "14.6%", status: "Active" },
        { campaign: "Win-Back Offer", trigger: "60 Days No Purchase", emailsSent: 620, openRate: "22.1%", clickRate: "4.2%", status: "Paused" },
        { campaign: "New Product Launch", trigger: "Manual", emailsSent: 0, openRate: "—", clickRate: "—", status: "Draft" },
      ],
    },
  },

  "/autoresponder/products": {
    badge: "Autoresponder · Products",
    title: "Autoresponder Products",
    subtitle: "Review-request performance for each enrolled product.",
    variant: "products",
    products: [
      { name: "ProPhone 15 GenX", sku: "SKU-9021", status: "Active", stats: [{ label: "Requests Sent", value: "412" }, { label: "5-Star Reviews", value: "68" }, { label: "Response Rate", value: "24%" }, { label: "Feedback Score", value: "4.8" }] },
      { name: "ZenBook Air 13", sku: "SKU-7721", status: "Active", stats: [{ label: "Requests Sent", value: "298" }, { label: "5-Star Reviews", value: "51" }, { label: "Response Rate", value: "21%" }, { label: "Feedback Score", value: "4.7" }] },
      { name: "Ergo Office Chair", sku: "SKU-4412", status: "Active", stats: [{ label: "Requests Sent", value: "540" }, { label: "5-Star Reviews", value: "88" }, { label: "Response Rate", value: "26%" }, { label: "Feedback Score", value: "4.6" }] },
      { name: "LED Monitor 27 Pro", sku: "SKU-6034", status: "Paused", stats: [{ label: "Requests Sent", value: "180" }, { label: "5-Star Reviews", value: "22" }, { label: "Response Rate", value: "18%" }, { label: "Feedback Score", value: "4.3" }] },
    ],
  },

  "/autoresponder/orders": {
    badge: "Autoresponder · Orders",
    title: "Autoresponder Orders",
    subtitle: "Email sequence progress for individual orders.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "customer", header: "CUSTOMER" },
        { key: "sequenceStep", header: "SEQUENCE STEP" },
        { key: "nextEmail", header: "NEXT EMAIL" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { orderId: "#SO-78314", name: "ProPhone 15 GenX", sku: "SKU-9021", customer: "Northstar Retail Group", sequenceStep: "2 of 3", nextEmail: "Jun 22, 2024", status: "Scheduled" },
        { orderId: "#SO-78313", name: "Ergo Office Chair", sku: "SKU-4412", customer: "Apex Office Systems", sequenceStep: "3 of 3", nextEmail: "—", status: "Sent" },
        { orderId: "#SO-78309", name: "LED Monitor 27 Pro", sku: "SKU-6034", customer: "J. Alvarez", sequenceStep: "1 of 3", nextEmail: "Jun 19, 2024", status: "Scheduled" },
        { orderId: "#SO-78301", name: "ZenBook Air 13", sku: "SKU-7721", customer: "M. Chen", sequenceStep: "0 of 3", nextEmail: "—", status: "Disabled" },
      ],
    },
  },

  // ───────────────────────── MONEY BACK ─────────────────────────
  "/money-back/lost-damaged": {
    badge: "Money Back · Claims",
    title: "Lost & Damaged",
    subtitle: "Units lost or damaged in Amazon fulfillment centers, pending reimbursement.",
    kpis: [
      { label: "OPEN CASES", value: "12", delta: "+3", tone: "amber" },
      { label: "ESTIMATED VALUE", value: "$4,860", delta: "This month", tone: "rose" },
      { label: "REIMBURSED (30D)", value: "$3,120", delta: "+18.4%", tone: "emerald" },
    ],
    table: {
      columns: [
        { key: "caseId", header: "CASE ID", type: "muted" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "warehouse", header: "WAREHOUSE" },
        { key: "units", header: "UNITS" },
        { key: "estimatedValue", header: "ESTIMATED VALUE", type: "bold" },
        { key: "filedDate", header: "FILED DATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { caseId: "#LD-4821", name: "ProPhone 15 GenX", sku: "SKU-9021", warehouse: "ONT8", units: 4, estimatedValue: "$3,196", filedDate: "Jun 14, 2024", status: "Investigating" },
        { caseId: "#LD-4816", name: "LED Monitor 27 Pro", sku: "SKU-6034", warehouse: "MDW2", units: 2, estimatedValue: "$638", filedDate: "Jun 10, 2024", status: "Open" },
        { caseId: "#LD-4802", name: "Smart Home Hub", sku: "SKU-3488", warehouse: "ABE8", units: 6, estimatedValue: "$774", filedDate: "Jun 02, 2024", status: "Reimbursed" },
        { caseId: "#LD-4790", name: "Ergo Office Chair", sku: "SKU-4412", warehouse: "SMF3", units: 1, estimatedValue: "$249", filedDate: "May 28, 2024", status: "Denied" },
      ],
    },
  },

  "/money-back/returns": {
    badge: "Money Back · Returns",
    title: "Returns",
    subtitle: "Customer returns and refund status by order.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "product", header: "PRODUCT", type: "bold" },
        { key: "reason", header: "REASON" },
        { key: "amount", header: "AMOUNT", type: "bold" },
        { key: "date", header: "DATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { orderId: "#RET-3021", product: "ProPhone 15 GenX", reason: "Damaged in transit", amount: "$899.00", date: "Jun 12, 2024", status: "Reimbursed" },
        { orderId: "#RET-3018", product: "Ergo Office Chair", reason: "Wrong item received", amount: "$399.00", date: "Jun 10, 2024", status: "Reimbursed" },
        { orderId: "#RET-3014", product: "ZenBook Air 13", reason: "Changed mind", amount: "$1,299.00", date: "Jun 08, 2024", status: "Processing" },
        { orderId: "#RET-3009", product: "LED Monitor 27 Pro", reason: "Defective unit", amount: "$449.00", date: "Jun 05, 2024", status: "Reimbursed" },
        { orderId: "#RET-3002", product: "Smart Home Hub", reason: "Not as described", amount: "$199.00", date: "Jun 01, 2024", status: "Denied" },
      ],
    },
  },

  "/money-back/fba-fee-changes": {
    badge: "Money Back · Fee Audits",
    title: "FBA Fee Changes",
    subtitle: "Detected Amazon fee changes that may qualify for reimbursement.",
    table: {
      columns: [
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "feeType", header: "FEE TYPE" },
        { key: "previousFee", header: "PREVIOUS FEE" },
        { key: "newFee", header: "NEW FEE" },
        { key: "changeDate", header: "CHANGE DATE" },
        { key: "impact", header: "MONTHLY IMPACT", type: "bold" },
      ],
      rows: [
        { name: "ProPhone 15 GenX", sku: "SKU-9021", feeType: "Fulfillment Fee", previousFee: "$8.26", newFee: "$8.90", changeDate: "Jun 01, 2024", impact: "-$39.68" },
        { name: "Ergo Office Chair", sku: "SKU-4412", feeType: "Storage Fee", previousFee: "$1.10", newFee: "$0.95", changeDate: "Jun 01, 2024", impact: "+$14.50" },
        { name: "LED Monitor 27 Pro", sku: "SKU-6034", feeType: "Referral Fee", previousFee: "$47.85", newFee: "$44.90", changeDate: "May 15, 2024", impact: "+$153.40" },
        { name: "ZenBook Air 13", sku: "SKU-7721", feeType: "Long-Term Storage", previousFee: "$0.00", newFee: "$2.40", changeDate: "May 01, 2024", impact: "-$91.20" },
      ],
    },
  },

  "/money-back/reimbursement-gap": {
    badge: "Money Back · Recovery",
    title: "Reimbursement Gap",
    subtitle: "Cases where units are owed but no reimbursement has been issued yet.",
    kpis: [
      { label: "UNITS OWED", value: "142", delta: "Across 9 cases", tone: "amber" },
      { label: "ESTIMATED GAP VALUE", value: "$8,420", delta: "Unrecovered", tone: "rose" },
      { label: "AVG DAYS OPEN", value: "34", delta: "+6d", tone: "amber" },
    ],
    table: {
      columns: [
        { key: "caseType", header: "CASE TYPE", type: "bold" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "unitsOwed", header: "UNITS OWED" },
        { key: "estimatedValue", header: "ESTIMATED VALUE", type: "bold" },
        { key: "daysOpen", header: "DAYS OPEN" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { caseType: "Warehouse Lost", name: "Smart Home Hub", sku: "SKU-3488", unitsOwed: 6, estimatedValue: "$774", daysOpen: 52, status: "Open" },
        { caseType: "Customer Returned, Not Refunded", name: "ProPhone 15 GenX", sku: "SKU-9021", unitsOwed: 3, estimatedValue: "$2,397", daysOpen: 28, status: "Open" },
        { caseType: "Inbound Shipment Shortage", name: "LED Monitor 27 Pro", sku: "SKU-6034", unitsOwed: 14, estimatedValue: "$4,466", daysOpen: 41, status: "Investigating" },
        { caseType: "Destroyed Without Approval", name: "Ergo Office Chair", sku: "SKU-4412", unitsOwed: 2, estimatedValue: "$498", daysOpen: 19, status: "Investigating" },
      ],
    },
  },

  // ───────────────────────── ALERTS ─────────────────────────
  "/alerts": {
    badge: "Alerts · Overview",
    title: "Alerts Dashboard",
    subtitle: "Real-time notifications across inventory, pricing, listings and reimbursements.",
    kpis: [
      { label: "CRITICAL ALERTS", value: "4", delta: "+1", tone: "rose" },
      { label: "WARNING ALERTS", value: "11", delta: "+3", tone: "amber" },
      { label: "INFO ALERTS", value: "26", delta: "+8", tone: "indigo" },
      { label: "RESOLVED THIS WEEK", value: "38", delta: "+12", tone: "emerald" },
    ],
    tableTitle: "Recent Alerts",
    table: {
      columns: [
        { key: "timestamp", header: "TIME", type: "muted" },
        { key: "type", header: "SEVERITY", type: "status" },
        { key: "message", header: "MESSAGE", type: "bold" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { timestamp: "10 min ago", type: "Critical", message: "Buy Box lost", name: "Smart Home Hub", sku: "SKU-3488", status: "Open" },
        { timestamp: "1 hr ago", type: "Warning", message: "Stock below reorder point", name: "Ergo Office Chair", sku: "SKU-4412", status: "Open" },
        { timestamp: "3 hrs ago", type: "Info", message: "New review posted (5★)", name: "ProPhone 15 GenX", sku: "SKU-9021", status: "Resolved" },
        { timestamp: "Yesterday", type: "Warning", message: "Listing price changed by competitor", name: "LED Monitor 27 Pro", sku: "SKU-6034", status: "Resolved" },
        { timestamp: "Yesterday", type: "Critical", message: "ACOS spiked above 40%", name: "ZenBook Air 13", sku: "SKU-7721", status: "Open" },
      ],
    },
  },

  "/alerts/settings": {
    badge: "Alerts · Configuration",
    title: "Alert Settings",
    subtitle: "Choose which events trigger a notification and where they're delivered.",
    variant: "settings",
    settings: [
      {
        title: "Stock Alerts",
        description: "Get notified before you run out of inventory.",
        fields: [
          { label: "Low stock threshold alert", description: "Notify when stock falls below reorder point", type: "toggle", value: true },
          { label: "Out of stock alert", description: "Notify immediately when a SKU hits zero", type: "toggle", value: true },
          { label: "Reorder lead time buffer", type: "input", value: "14 days" },
        ],
      },
      {
        title: "Price & Buy Box Alerts",
        description: "Stay ahead of pricing changes and Buy Box loss.",
        fields: [
          { label: "Buy Box lost", type: "toggle", value: true },
          { label: "Competitor price change", type: "toggle", value: false },
        ],
      },
      {
        title: "Review Alerts",
        description: "Track review velocity and negative feedback.",
        fields: [
          { label: "Negative review posted (1-2★)", type: "toggle", value: true },
          { label: "Review velocity drop", type: "toggle", value: false },
        ],
      },
      {
        title: "Notification Channels",
        fields: [
          { label: "Email notifications", type: "toggle", value: true },
          { label: "SMS notifications", type: "toggle", value: false },
          { label: "Slack notifications", type: "toggle", value: true },
        ],
      },
    ],
  },

  // ───────────────────────── EBAY ─────────────────────────
  "/ebay": {
    badge: "eBay · All Listings",
    title: "eBay Dashboard",
    subtitle: "Revenue, fees and net profit for your eBay storefront.",
    kpis: [
      { label: "REVENUE", value: "$42,180", delta: "+6.8%", tone: "emerald" },
      { label: "EBAY FEES", value: "$5,480", delta: "+2.1%", tone: "amber" },
      { label: "SHIPPING COST", value: "$3,120", delta: "-1.4%", tone: "emerald" },
      { label: "NET PROFIT", value: "$11,940", delta: "+9.2%", tone: "emerald" },
      { label: "ORDERS", value: "612", delta: "+4.6%", tone: "emerald" },
      { label: "AVG ORDER VALUE", value: "$68.90", delta: "+1.8%", tone: "emerald" },
    ],
    chart: { data: [38, 52, 44, 60, 55, 70, 66], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], title: "eBay Revenue (7 days)" },
    tableTitle: "Top eBay Listings",
    table: {
      columns: [
        { key: "name", header: "LISTING", type: "thumb" },
        { key: "unitsSold", header: "UNITS SOLD" },
        { key: "revenue", header: "REVENUE", type: "bold" },
        { key: "netProfit", header: "NET PROFIT", type: "bold" },
      ],
      rows: [
        { name: "ProPhone 15 GenX", sku: "SKU-9021", unitsSold: 18, revenue: "$16,182", netProfit: "$2,940" },
        { name: "ZenBook Air 13", sku: "SKU-7721", unitsSold: 9, revenue: "$11,691", netProfit: "$2,180" },
        { name: "LED Monitor 27 Pro", sku: "SKU-6034", unitsSold: 22, revenue: "$9,878", netProfit: "$1,760" },
        { name: "Ergo Office Chair", sku: "SKU-4412", unitsSold: 12, revenue: "$4,788", netProfit: "$690" },
      ],
    },
  },

  "/ebay/ltv": {
    badge: "eBay · Customers",
    title: "eBay Customer LTV",
    subtitle: "Lifetime value of buyers who purchase through your eBay storefront.",
    kpis: [
      { label: "AVG LTV (365d)", value: "$196", delta: "+4.2%", tone: "emerald" },
      { label: "REPEAT PURCHASE RATE", value: "14.8%", delta: "+0.6pt", tone: "emerald", bar: 15 },
      { label: "AVG ORDER VALUE", value: "$68.90", delta: "+1.8%", tone: "emerald" },
    ],
    tableTitle: "Top eBay Buyers by LTV",
    table: {
      columns: [
        { key: "customer", header: "BUYER", type: "bold" },
        { key: "orders", header: "ORDERS" },
        { key: "firstOrder", header: "FIRST ORDER" },
        { key: "totalSpent", header: "TOTAL SPENT", type: "bold" },
        { key: "status", header: "TIER", type: "status" },
      ],
      rows: [
        { customer: "eb_collector99", orders: 6, firstOrder: "Jan 14, 2023", totalSpent: "$742", status: "VIP" },
        { customer: "techdeals_mike", orders: 3, firstOrder: "Aug 02, 2023", totalSpent: "$418", status: "Active" },
        { customer: "office_furnish_pro", orders: 2, firstOrder: "Feb 19, 2024", totalSpent: "$298", status: "Active" },
      ],
    },
  },

  "/ebay/products": {
    badge: "eBay · Products",
    title: "eBay Products",
    subtitle: "Listing performance and profitability for each SKU sold on eBay.",
    variant: "products",
    products: [
      { name: "ProPhone 15 GenX", sku: "SKU-9021", status: "Optimal", stats: [{ label: "Revenue", value: "$16,182" }, { label: "Net Profit", value: "$2,940" }, { label: "Units Sold", value: "18" }, { label: "Watchers", value: "142" }] },
      { name: "ZenBook Air 13", sku: "SKU-7721", status: "Optimal", stats: [{ label: "Revenue", value: "$11,691" }, { label: "Net Profit", value: "$2,180" }, { label: "Units Sold", value: "9" }, { label: "Watchers", value: "88" }] },
      { name: "LED Monitor 27 Pro", sku: "SKU-6034", status: "Overstock", stats: [{ label: "Revenue", value: "$9,878" }, { label: "Net Profit", value: "$1,760" }, { label: "Units Sold", value: "22" }, { label: "Watchers", value: "64" }] },
      { name: "Ergo Office Chair", sku: "SKU-4412", status: "Low Stock", stats: [{ label: "Revenue", value: "$4,788" }, { label: "Net Profit", value: "$690" }, { label: "Units Sold", value: "12" }, { label: "Watchers", value: "51" }] },
    ],
  },

  "/ebay/shipping-costs": {
    badge: "eBay · Logistics",
    title: "eBay Shipping Costs",
    subtitle: "Per-order shipping cost across eBay's supported carriers.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "carrier", header: "CARRIER" },
        { key: "shipCost", header: "SHIP COST", type: "bold" },
        { key: "date", header: "DATE" },
      ],
      rows: [
        { orderId: "#EB-9021", name: "ProPhone 15 GenX", sku: "SKU-9021", carrier: "USPS Priority", shipCost: "$6.40", date: "Jun 17, 2024" },
        { orderId: "#EB-9018", name: "LED Monitor 27 Pro", sku: "SKU-6034", carrier: "UPS Ground", shipCost: "$11.20", date: "Jun 16, 2024" },
        { orderId: "#EB-9012", name: "Ergo Office Chair", sku: "SKU-4412", carrier: "FedEx Ground", shipCost: "$19.80", date: "Jun 14, 2024" },
      ],
    },
  },

  "/ebay/orders": {
    badge: "eBay · Orders",
    title: "eBay Orders",
    subtitle: "All orders placed through your eBay storefront.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "buyer", header: "BUYER" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "total", header: "TOTAL", type: "bold" },
        { key: "date", header: "DATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { orderId: "#EB-9021", buyer: "eb_collector99", name: "ProPhone 15 GenX", sku: "SKU-9021", total: "$899.00", date: "Jun 17, 2024", status: "Shipped" },
        { orderId: "#EB-9018", buyer: "techdeals_mike", name: "LED Monitor 27 Pro", sku: "SKU-6034", total: "$449.00", date: "Jun 16, 2024", status: "In Transit" },
        { orderId: "#EB-9012", buyer: "office_furnish_pro", name: "Ergo Office Chair", sku: "SKU-4412", total: "$399.00", date: "Jun 14, 2024", status: "Delivered" },
        { orderId: "#EB-9004", buyer: "gadgetgal", name: "ZenBook Air 13", sku: "SKU-7721", total: "$1,299.00", date: "Jun 11, 2024", status: "Preparing" },
      ],
    },
  },

  "/ebay/expenses": {
    badge: "eBay · Expenses",
    title: "eBay Expenses",
    subtitle: "Store subscription, promoted listings and other eBay-specific costs.",
    table: {
      columns: [
        { key: "expense", header: "EXPENSE", type: "bold" },
        { key: "category", header: "CATEGORY" },
        { key: "monthlyCost", header: "MONTHLY COST", type: "bold" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { expense: "eBay Store Subscription", category: "Platform", monthlyCost: "$27.95", status: "Active" },
        { expense: "Promoted Listings", category: "Advertising", monthlyCost: "$680.00", status: "Active" },
        { expense: "Final Value Fees", category: "Platform", monthlyCost: "$5,480.00", status: "Active" },
        { expense: "Managed Payments Fee", category: "Payments", monthlyCost: "$412.00", status: "Active" },
      ],
    },
  },

  "/ebay/reports": {
    badge: "eBay · Reports",
    title: "eBay Reports",
    subtitle: "Generate financial and listing performance reports for eBay.",
    table: {
      columns: [
        { key: "report", header: "REPORT", type: "bold" },
        { key: "period", header: "PERIOD" },
        { key: "lastRun", header: "LAST RUN" },
        { key: "status", header: "STATUS", type: "status" },
        { key: "format", header: "FORMAT", type: "muted" },
      ],
      rows: [
        { report: "eBay Profit & Loss", period: "Monthly", lastRun: "Jun 01, 2024", status: "Scheduled", format: "PDF" },
        { report: "Listing Performance", period: "Weekly", lastRun: "Jun 17, 2024", status: "Scheduled", format: "CSV" },
        { report: "Promoted Listings ROI", period: "Monthly", lastRun: "Jun 01, 2024", status: "Draft", format: "PDF" },
      ],
    },
  },

  // ───────────────────────── WALMART ─────────────────────────
  "/walmart": {
    badge: "Walmart · Marketplace",
    title: "Walmart Dashboard",
    subtitle: "Revenue, fees and net profit for your Walmart Marketplace storefront.",
    kpis: [
      { label: "REVENUE", value: "$28,940", delta: "+5.4%", tone: "emerald" },
      { label: "WALMART FEES", value: "$4,120", delta: "+1.8%", tone: "amber" },
      { label: "SHIPPING COST", value: "$2,380", delta: "-0.9%", tone: "emerald" },
      { label: "NET PROFIT", value: "$7,860", delta: "+6.1%", tone: "emerald" },
      { label: "ORDERS", value: "418", delta: "+3.2%", tone: "emerald" },
      { label: "AVG ORDER VALUE", value: "$69.20", delta: "+1.1%", tone: "emerald" },
    ],
    chart: { data: [30, 44, 38, 52, 48, 60, 56], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], title: "Walmart Revenue (7 days)" },
    tableTitle: "Top Walmart Listings",
    table: {
      columns: [
        { key: "name", header: "LISTING", type: "thumb" },
        { key: "unitsSold", header: "UNITS SOLD" },
        { key: "revenue", header: "REVENUE", type: "bold" },
        { key: "netProfit", header: "NET PROFIT", type: "bold" },
      ],
      rows: [
        { name: "ProPhone 15 GenX", sku: "SKU-9021", unitsSold: 12, revenue: "$10,788", netProfit: "$1,940" },
        { name: "LED Monitor 27 Pro", sku: "SKU-6034", unitsSold: 16, revenue: "$7,184", netProfit: "$1,280" },
        { name: "Ergo Office Chair", sku: "SKU-4412", unitsSold: 20, revenue: "$7,980", netProfit: "$1,120" },
        { name: "ZenBook Air 13", sku: "SKU-7721", unitsSold: 4, revenue: "$5,196", netProfit: "$960" },
      ],
    },
  },

  "/walmart/ltv": {
    badge: "Walmart · Customers",
    title: "Walmart Customer LTV",
    subtitle: "Lifetime value of buyers who purchase through Walmart Marketplace.",
    kpis: [
      { label: "AVG LTV (365d)", value: "$164", delta: "+2.8%", tone: "emerald" },
      { label: "REPEAT PURCHASE RATE", value: "11.2%", delta: "+0.4pt", tone: "emerald", bar: 11 },
      { label: "AVG ORDER VALUE", value: "$69.20", delta: "+1.1%", tone: "emerald" },
    ],
    tableTitle: "Top Walmart Customers by LTV",
    table: {
      columns: [
        { key: "customer", header: "CUSTOMER", type: "bold" },
        { key: "orders", header: "ORDERS" },
        { key: "firstOrder", header: "FIRST ORDER" },
        { key: "totalSpent", header: "TOTAL SPENT", type: "bold" },
        { key: "status", header: "TIER", type: "status" },
      ],
      rows: [
        { customer: "wm_shopper82", orders: 5, firstOrder: "Mar 11, 2023", totalSpent: "$486", status: "VIP" },
        { customer: "dana.k", orders: 2, firstOrder: "Sep 04, 2023", totalSpent: "$212", status: "Active" },
        { customer: "homeoffice_deals", orders: 2, firstOrder: "Jan 22, 2024", totalSpent: "$178", status: "Active" },
      ],
    },
  },

  "/walmart/products": {
    badge: "Walmart · Products",
    title: "Walmart Products",
    subtitle: "Listing performance and profitability for each SKU sold on Walmart Marketplace.",
    variant: "products",
    products: [
      { name: "ProPhone 15 GenX", sku: "SKU-9021", status: "Optimal", stats: [{ label: "Revenue", value: "$10,788" }, { label: "Net Profit", value: "$1,940" }, { label: "Units Sold", value: "12" }, { label: "Buy Box %", value: "94%" }] },
      { name: "LED Monitor 27 Pro", sku: "SKU-6034", status: "Overstock", stats: [{ label: "Revenue", value: "$7,184" }, { label: "Net Profit", value: "$1,280" }, { label: "Units Sold", value: "16" }, { label: "Buy Box %", value: "88%" }] },
      { name: "Ergo Office Chair", sku: "SKU-4412", status: "Low Stock", stats: [{ label: "Revenue", value: "$7,980" }, { label: "Net Profit", value: "$1,120" }, { label: "Units Sold", value: "20" }, { label: "Buy Box %", value: "91%" }] },
    ],
  },

  "/walmart/shipping-costs": {
    badge: "Walmart · Logistics",
    title: "Walmart Shipping Costs",
    subtitle: "Per-order shipping cost across WFS and carrier-shipped orders.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "carrier", header: "CARRIER" },
        { key: "shipCost", header: "SHIP COST", type: "bold" },
        { key: "date", header: "DATE" },
      ],
      rows: [
        { orderId: "#WM-5510", name: "ProPhone 15 GenX", sku: "SKU-9021", carrier: "Walmart Fulfillment Services", shipCost: "$5.10", date: "Jun 17, 2024" },
        { orderId: "#WM-5504", name: "Ergo Office Chair", sku: "SKU-4412", carrier: "FedEx Ground", shipCost: "$21.40", date: "Jun 15, 2024" },
        { orderId: "#WM-5498", name: "LED Monitor 27 Pro", sku: "SKU-6034", carrier: "Spark Delivery", shipCost: "$9.80", date: "Jun 13, 2024" },
      ],
    },
  },

  "/walmart/orders": {
    badge: "Walmart · Orders",
    title: "Walmart Orders",
    subtitle: "All orders placed through Walmart Marketplace.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "buyer", header: "BUYER" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "total", header: "TOTAL", type: "bold" },
        { key: "date", header: "DATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { orderId: "#WM-5510", buyer: "wm_shopper82", name: "ProPhone 15 GenX", sku: "SKU-9021", total: "$899.00", date: "Jun 17, 2024", status: "Shipped" },
        { orderId: "#WM-5504", buyer: "homeoffice_deals", name: "Ergo Office Chair", sku: "SKU-4412", total: "$399.00", date: "Jun 15, 2024", status: "Delivered" },
        { orderId: "#WM-5498", buyer: "dana.k", name: "LED Monitor 27 Pro", sku: "SKU-6034", total: "$449.00", date: "Jun 13, 2024", status: "In Transit" },
      ],
    },
  },

  "/walmart/expenses": {
    badge: "Walmart · Expenses",
    title: "Walmart Expenses",
    subtitle: "WFS storage, referral fees and other Walmart-specific costs.",
    table: {
      columns: [
        { key: "expense", header: "EXPENSE", type: "bold" },
        { key: "category", header: "CATEGORY" },
        { key: "monthlyCost", header: "MONTHLY COST", type: "bold" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { expense: "Walmart Referral Fees", category: "Platform", monthlyCost: "$4,120.00", status: "Active" },
        { expense: "WFS Storage Fee", category: "Fulfillment", monthlyCost: "$310.00", status: "Active" },
        { expense: "Sponsored Products (Walmart Connect)", category: "Advertising", monthlyCost: "$540.00", status: "Active" },
      ],
    },
  },

  "/walmart/reports": {
    badge: "Walmart · Reports",
    title: "Walmart Reports",
    subtitle: "Generate financial and listing performance reports for Walmart Marketplace.",
    table: {
      columns: [
        { key: "report", header: "REPORT", type: "bold" },
        { key: "period", header: "PERIOD" },
        { key: "lastRun", header: "LAST RUN" },
        { key: "status", header: "STATUS", type: "status" },
        { key: "format", header: "FORMAT", type: "muted" },
      ],
      rows: [
        { report: "Walmart Profit & Loss", period: "Monthly", lastRun: "Jun 01, 2024", status: "Scheduled", format: "PDF" },
        { report: "WFS Inventory Report", period: "Weekly", lastRun: "Jun 17, 2024", status: "Scheduled", format: "CSV" },
        { report: "Walmart Connect ROI", period: "Monthly", lastRun: "Jun 01, 2024", status: "Draft", format: "PDF" },
      ],
    },
  },

  // ───────────────────────── AMAZON ─────────────────────────
  "/amazon": {
    badge: "Amazon · All Marketplaces",
    title: "Amazon Dashboard",
    subtitle: "Revenue, fees and net profit for your Amazon seller account, by channel.",
    kpis: [
      { label: "REVENUE", value: "$186,420", delta: "+12.4%", tone: "emerald" },
      { label: "AMAZON FEES", value: "$38,960", delta: "+3.8%", tone: "amber" },
      { label: "SHIPPING COST", value: "$14,280", delta: "-2.1%", tone: "emerald" },
      { label: "NET PROFIT", value: "$52,080", delta: "+18.6%", tone: "emerald" },
      { label: "ORDERS", value: "2,486", delta: "+8.4%", tone: "emerald" },
      { label: "AVG ORDER VALUE", value: "$75.00", delta: "+2.6%", tone: "emerald" },
    ],
    chart: { data: [45, 62, 50, 74, 85, 66, 92], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], title: "Amazon Revenue (7 days)" },
    tableTitle: "Top Amazon Listings",
    table: {
      columns: [
        { key: "name", header: "LISTING", type: "thumb" },
        { key: "unitsSold", header: "UNITS SOLD" },
        { key: "revenue", header: "REVENUE", type: "bold" },
        { key: "netProfit", header: "NET PROFIT", type: "bold" },
      ],
      rows: [
        { name: "ProPhone 15 GenX", sku: "SKU-9021", unitsSold: 62, revenue: "$55,738", netProfit: "$9,850" },
        { name: "ZenBook Air 13", sku: "SKU-7721", unitsSold: 38, revenue: "$49,362", netProfit: "$11,200" },
        { name: "Ergo Office Chair", sku: "SKU-4412", unitsSold: 145, revenue: "$57,855", netProfit: "$8,940" },
        { name: "LED Monitor 27 Pro", sku: "SKU-6034", unitsSold: 52, revenue: "$23,348", netProfit: "$4,290" },
      ],
    },
  },

  "/amazon/ltv": {
    badge: "Amazon · Customers",
    title: "Amazon Customer LTV",
    subtitle: "Lifetime value of customers who purchase through Amazon.",
    kpis: [
      { label: "AVG LTV (365d)", value: "$284", delta: "+8.1%", tone: "emerald" },
      { label: "REPEAT PURCHASE RATE", value: "22.6%", delta: "+1.4pt", tone: "emerald", bar: 23 },
      { label: "AVG ORDER VALUE", value: "$75.00", delta: "+2.6%", tone: "emerald" },
    ],
    tableTitle: "Top Amazon Customers by LTV",
    table: {
      columns: [
        { key: "customer", header: "CUSTOMER", type: "bold" },
        { key: "orders", header: "ORDERS" },
        { key: "firstOrder", header: "FIRST ORDER" },
        { key: "totalSpent", header: "TOTAL SPENT", type: "bold" },
        { key: "status", header: "TIER", type: "status" },
      ],
      rows: [
        { customer: "Northstar Retail Group", orders: 14, firstOrder: "Feb 03, 2023", totalSpent: "$3,240", status: "VIP" },
        { customer: "Apex Office Systems", orders: 9, firstOrder: "May 21, 2023", totalSpent: "$1,890", status: "VIP" },
        { customer: "J. Alvarez", orders: 4, firstOrder: "Nov 12, 2023", totalSpent: "$612", status: "Active" },
      ],
    },
  },

  "/amazon/products": {
    badge: "Amazon · Products",
    title: "Amazon Products",
    subtitle: "Listing performance and profitability for each SKU sold on Amazon.",
    variant: "products",
    products: [
      { name: "ProPhone 15 GenX", sku: "SKU-9021", status: "Optimal", stats: [{ label: "Revenue", value: "$55,738" }, { label: "Net Profit", value: "$9,850" }, { label: "Units Sold", value: "62" }, { label: "Buy Box %", value: "98%" }] },
      { name: "ZenBook Air 13", sku: "SKU-7721", status: "Optimal", stats: [{ label: "Revenue", value: "$49,362" }, { label: "Net Profit", value: "$11,200" }, { label: "Units Sold", value: "38" }, { label: "Buy Box %", value: "96%" }] },
      { name: "Ergo Office Chair", sku: "SKU-4412", status: "Low Stock", stats: [{ label: "Revenue", value: "$57,855" }, { label: "Net Profit", value: "$8,940" }, { label: "Units Sold", value: "145" }, { label: "Buy Box %", value: "92%" }] },
    ],
  },

  "/amazon/shipping-costs": {
    badge: "Amazon · Logistics",
    title: "Amazon Shipping Costs",
    subtitle: "Outbound freight and per-unit shipping cost by order, FBA and FBM.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "carrier", header: "CARRIER" },
        { key: "shipCost", header: "SHIP COST", type: "bold" },
        { key: "date", header: "DATE" },
      ],
      rows: [
        { orderId: "#SO-78314", name: "ProPhone 15 GenX", sku: "SKU-9021", carrier: "Amazon Logistics", shipCost: "$4.20", date: "Jun 17, 2024" },
        { orderId: "#SO-78313", name: "ZenBook Air 13", sku: "SKU-7721", carrier: "FedEx", shipCost: "$9.85", date: "Jun 16, 2024" },
        { orderId: "#SO-78309", name: "Ergo Office Chair", sku: "SKU-4412", carrier: "Amazon Logistics", shipCost: "$18.40", date: "Jun 15, 2024" },
      ],
    },
  },

  "/amazon/orders": {
    badge: "Amazon · Orders",
    title: "Amazon Orders",
    subtitle: "All orders placed through Amazon, across FBA and FBM.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "buyer", header: "BUYER" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "total", header: "TOTAL", type: "bold" },
        { key: "date", header: "DATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { orderId: "#112-4821093-5566214", buyer: "Northstar Retail Group", name: "ProPhone 15 GenX", sku: "SKU-9021", total: "$899.00", date: "Jun 17, 2024", status: "Shipped" },
        { orderId: "#112-4820881-1120847", buyer: "Apex Office Systems", name: "Ergo Office Chair", sku: "SKU-4412", total: "$399.00", date: "Jun 16, 2024", status: "Delivered" },
        { orderId: "#112-4820512-9983301", buyer: "J. Alvarez", name: "LED Monitor 27 Pro", sku: "SKU-6034", total: "$449.00", date: "Jun 14, 2024", status: "In Transit" },
      ],
    },
  },

  "/amazon/expenses": {
    badge: "Amazon · Expenses",
    title: "Amazon Expenses",
    subtitle: "FBA storage, referral fees and other Amazon-specific costs.",
    table: {
      columns: [
        { key: "expense", header: "EXPENSE", type: "bold" },
        { key: "category", header: "CATEGORY" },
        { key: "monthlyCost", header: "MONTHLY COST", type: "bold" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { expense: "Amazon Referral Fees", category: "Platform", monthlyCost: "$38,960.00", status: "Active" },
        { expense: "FBA Storage Fee", category: "Fulfillment", monthlyCost: "$2,140.00", status: "Active" },
        { expense: "Long-Term Storage Fee", category: "Fulfillment", monthlyCost: "$1,240.00", status: "Active" },
      ],
    },
  },

  "/amazon/reports": {
    badge: "Amazon · Reports",
    title: "Amazon Reports",
    subtitle: "Generate financial and listing performance reports for Amazon.",
    table: {
      columns: [
        { key: "report", header: "REPORT", type: "bold" },
        { key: "period", header: "PERIOD" },
        { key: "lastRun", header: "LAST RUN" },
        { key: "status", header: "STATUS", type: "status" },
        { key: "format", header: "FORMAT", type: "muted" },
      ],
      rows: [
        { report: "Amazon Profit & Loss", period: "Monthly", lastRun: "Jun 01, 2024", status: "Scheduled", format: "PDF" },
        { report: "FBA Inventory Report", period: "Weekly", lastRun: "Jun 17, 2024", status: "Scheduled", format: "CSV" },
        { report: "Advertising Performance", period: "Monthly", lastRun: "Jun 01, 2024", status: "Draft", format: "CSV" },
      ],
    },
  },

  // ───────────────────────── SHOPIFY ─────────────────────────
  "/shopify": {
    badge: "Shopify · Storefront",
    title: "Shopify Dashboard",
    subtitle: "Revenue, fees and net profit for your Shopify direct-to-consumer store.",
    kpis: [
      { label: "REVENUE", value: "$34,620", delta: "+9.6%", tone: "emerald" },
      { label: "SHOPIFY FEES", value: "$1,890", delta: "+1.2%", tone: "amber" },
      { label: "SHIPPING COST", value: "$3,240", delta: "-1.6%", tone: "emerald" },
      { label: "NET PROFIT", value: "$12,480", delta: "+14.2%", tone: "emerald" },
      { label: "ORDERS", value: "486", delta: "+7.1%", tone: "emerald" },
      { label: "AVG ORDER VALUE", value: "$71.20", delta: "+2.4%", tone: "emerald" },
    ],
    chart: { data: [40, 55, 48, 66, 60, 74, 70], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], title: "Shopify Revenue (7 days)" },
    tableTitle: "Top Shopify Products",
    table: {
      columns: [
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "unitsSold", header: "UNITS SOLD" },
        { key: "revenue", header: "REVENUE", type: "bold" },
        { key: "netProfit", header: "NET PROFIT", type: "bold" },
      ],
      rows: [
        { name: "ProPhone 15 GenX", sku: "SKU-9021", unitsSold: 14, revenue: "$12,586", netProfit: "$2,640" },
        { name: "ZenBook Air 13", sku: "SKU-7721", unitsSold: 8, revenue: "$10,392", netProfit: "$2,180" },
        { name: "Ergo Office Chair", sku: "SKU-4412", unitsSold: 22, revenue: "$8,778", netProfit: "$1,460" },
        { name: "LED Monitor 27 Pro", sku: "SKU-6034", unitsSold: 6, revenue: "$2,694", netProfit: "$520" },
      ],
    },
  },

  "/shopify/ltv": {
    badge: "Shopify · Customers",
    title: "Shopify Customer LTV",
    subtitle: "Lifetime value of customers who purchase through your Shopify store.",
    kpis: [
      { label: "AVG LTV (365d)", value: "$312", delta: "+10.4%", tone: "emerald" },
      { label: "REPEAT PURCHASE RATE", value: "28.4%", delta: "+2.2pt", tone: "emerald", bar: 28 },
      { label: "AVG ORDER VALUE", value: "$71.20", delta: "+2.4%", tone: "emerald" },
    ],
    tableTitle: "Top Shopify Customers by LTV",
    table: {
      columns: [
        { key: "customer", header: "CUSTOMER", type: "bold" },
        { key: "orders", header: "ORDERS" },
        { key: "firstOrder", header: "FIRST ORDER" },
        { key: "totalSpent", header: "TOTAL SPENT", type: "bold" },
        { key: "status", header: "TIER", type: "status" },
      ],
      rows: [
        { customer: "Priya Nair", orders: 7, firstOrder: "Apr 18, 2023", totalSpent: "$892", status: "VIP" },
        { customer: "T. Osei", orders: 3, firstOrder: "Oct 02, 2023", totalSpent: "$346", status: "Active" },
        { customer: "casey.b", orders: 2, firstOrder: "Feb 09, 2024", totalSpent: "$198", status: "Active" },
      ],
    },
  },

  "/shopify/products": {
    badge: "Shopify · Products",
    title: "Shopify Products",
    subtitle: "Storefront performance and profitability for each product sold on Shopify.",
    variant: "products",
    products: [
      { name: "ProPhone 15 GenX", sku: "SKU-9021", status: "Optimal", stats: [{ label: "Revenue", value: "$12,586" }, { label: "Net Profit", value: "$2,640" }, { label: "Units Sold", value: "14" }, { label: "Conversion Rate", value: "3.2%" }] },
      { name: "ZenBook Air 13", sku: "SKU-7721", status: "Optimal", stats: [{ label: "Revenue", value: "$10,392" }, { label: "Net Profit", value: "$2,180" }, { label: "Units Sold", value: "8" }, { label: "Conversion Rate", value: "2.8%" }] },
      { name: "Ergo Office Chair", sku: "SKU-4412", status: "Low Stock", stats: [{ label: "Revenue", value: "$8,778" }, { label: "Net Profit", value: "$1,460" }, { label: "Units Sold", value: "22" }, { label: "Conversion Rate", value: "4.1%" }] },
    ],
  },

  "/shopify/shipping-costs": {
    badge: "Shopify · Logistics",
    title: "Shopify Shipping Costs",
    subtitle: "Per-order shipping cost for direct-to-consumer Shopify fulfillment.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "carrier", header: "CARRIER" },
        { key: "shipCost", header: "SHIP COST", type: "bold" },
        { key: "date", header: "DATE" },
      ],
      rows: [
        { orderId: "#SP-2210", name: "ProPhone 15 GenX", sku: "SKU-9021", carrier: "USPS Priority", shipCost: "$5.80", date: "Jun 17, 2024" },
        { orderId: "#SP-2206", name: "Ergo Office Chair", sku: "SKU-4412", carrier: "UPS Ground", shipCost: "$22.10", date: "Jun 15, 2024" },
        { orderId: "#SP-2199", name: "ZenBook Air 13", sku: "SKU-7721", carrier: "FedEx Home Delivery", shipCost: "$11.40", date: "Jun 12, 2024" },
      ],
    },
  },

  "/shopify/orders": {
    badge: "Shopify · Orders",
    title: "Shopify Orders",
    subtitle: "All orders placed through your Shopify storefront.",
    table: {
      columns: [
        { key: "orderId", header: "ORDER", type: "muted" },
        { key: "buyer", header: "BUYER" },
        { key: "name", header: "PRODUCT", type: "thumb" },
        { key: "total", header: "TOTAL", type: "bold" },
        { key: "date", header: "DATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { orderId: "#SP-2210", buyer: "Priya Nair", name: "ProPhone 15 GenX", sku: "SKU-9021", total: "$899.00", date: "Jun 17, 2024", status: "Shipped" },
        { orderId: "#SP-2206", buyer: "casey.b", name: "Ergo Office Chair", sku: "SKU-4412", total: "$399.00", date: "Jun 15, 2024", status: "Delivered" },
        { orderId: "#SP-2199", buyer: "T. Osei", name: "ZenBook Air 13", sku: "SKU-7721", total: "$1,299.00", date: "Jun 12, 2024", status: "Preparing" },
      ],
    },
  },

  "/shopify/expenses": {
    badge: "Shopify · Expenses",
    title: "Shopify Expenses",
    subtitle: "Subscription, app and payment processing costs for your Shopify store.",
    table: {
      columns: [
        { key: "expense", header: "EXPENSE", type: "bold" },
        { key: "category", header: "CATEGORY" },
        { key: "monthlyCost", header: "MONTHLY COST", type: "bold" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { expense: "Shopify Plan (Advanced)", category: "Platform", monthlyCost: "$299.00", status: "Active" },
        { expense: "Shopify Payments Fee", category: "Payments", monthlyCost: "$1,040.00", status: "Active" },
        { expense: "App Subscriptions", category: "Software", monthlyCost: "$180.00", status: "Active" },
      ],
    },
  },

  "/shopify/reports": {
    badge: "Shopify · Reports",
    title: "Shopify Reports",
    subtitle: "Generate financial and sales performance reports for Shopify.",
    table: {
      columns: [
        { key: "report", header: "REPORT", type: "bold" },
        { key: "period", header: "PERIOD" },
        { key: "lastRun", header: "LAST RUN" },
        { key: "status", header: "STATUS", type: "status" },
        { key: "format", header: "FORMAT", type: "muted" },
      ],
      rows: [
        { report: "Shopify Profit & Loss", period: "Monthly", lastRun: "Jun 01, 2024", status: "Scheduled", format: "PDF" },
        { report: "Sales by Channel", period: "Weekly", lastRun: "Jun 17, 2024", status: "Scheduled", format: "CSV" },
        { report: "Discount Code Performance", period: "Monthly", lastRun: "Jun 01, 2024", status: "Draft", format: "CSV" },
      ],
    },
  },

  // ───────────────────────── QUICKBOOKS ─────────────────────────
  "/quickbooks/settlements": {
    badge: "QuickBooks · Sync",
    title: "Settlements",
    subtitle: "Amazon and eBay settlement periods synced to your QuickBooks ledger.",
    table: {
      columns: [
        { key: "settlementId", header: "SETTLEMENT ID", type: "muted" },
        { key: "period", header: "PERIOD" },
        { key: "grossSales", header: "GROSS SALES" },
        { key: "fees", header: "FEES" },
        { key: "netDeposit", header: "NET DEPOSIT", type: "bold" },
        { key: "depositDate", header: "DEPOSIT DATE" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { settlementId: "#STL-20841", period: "Jun 01 – Jun 14, 2024", grossSales: "$96,420", fees: "$19,860", netDeposit: "$76,560", depositDate: "Jun 16, 2024", status: "Posted" },
        { settlementId: "#STL-20812", period: "May 18 – May 31, 2024", grossSales: "$88,940", fees: "$18,120", netDeposit: "$70,820", depositDate: "Jun 02, 2024", status: "Posted" },
        { settlementId: "#STL-20784", period: "May 04 – May 17, 2024", grossSales: "$91,260", fees: "$18,640", netDeposit: "$72,620", depositDate: "May 19, 2024", status: "Pending" },
      ],
    },
  },

  "/quickbooks/config": {
    badge: "QuickBooks · Setup",
    title: "Configuration of QB Accounts",
    subtitle: "Map sellerboard categories to the correct QuickBooks chart of accounts.",
    variant: "settings",
    settings: [
      {
        title: "Account Mapping",
        description: "Choose which QuickBooks account each transaction type posts to.",
        fields: [
          { label: "Sales Income Account", type: "select", value: "Sales", options: ["Sales", "Amazon Sales", "Other Income"] },
          { label: "Cost of Goods Sold Account", type: "select", value: "COGS", options: ["COGS", "Inventory Asset", "Other Expense"] },
          { label: "Amazon & eBay Fees Account", type: "select", value: "Selling Fees", options: ["Selling Fees", "Bank Charges", "Other Expense"] },
          { label: "Advertising Spend Account", type: "select", value: "Advertising", options: ["Advertising", "Marketing", "Other Expense"] },
        ],
      },
      {
        title: "Sync Settings",
        fields: [
          { label: "Auto-sync settlements", description: "Automatically post new settlements as they close", type: "toggle", value: true },
          { label: "Sync frequency", type: "select", value: "Daily", options: ["Daily", "Weekly", "Manual"] },
          { label: "Include sales tax in sync", type: "toggle", value: false },
        ],
      },
    ],
  },

  // ───────────────────────── ACCOUNT SETTINGS ─────────────────────────
  "/account/general": {
    badge: "Settings · General",
    title: "General Settings",
    subtitle: "Company profile, timezone, currency and marketplace defaults.",
    variant: "settings",
    settings: [
      {
        title: "Company Profile",
        fields: [
          { label: "Company Name", type: "input", value: "Inventory Insights Pro LLC" },
          { label: "Support Email", type: "input", value: "support@inventoryinsights.com" },
        ],
      },
      {
        title: "Regional Settings",
        fields: [
          { label: "Timezone", type: "select", value: "America/Chicago", options: ["America/Chicago", "America/New_York", "America/Los_Angeles", "UTC"] },
          { label: "Default Currency", type: "select", value: "USD", options: ["USD", "EUR", "GBP", "CAD"] },
          { label: "Primary Marketplace", type: "select", value: "Amazon.com", options: ["Amazon.com", "Amazon.co.uk", "eBay.com"] },
          { label: "Fiscal Year Start", type: "select", value: "January", options: ["January", "April", "July", "October"] },
        ],
      },
    ],
  },

  "/account/users": {
    badge: "Settings · Team",
    title: "Users",
    subtitle: "Manage teammates and their access to this workspace.",
    table: {
      columns: [
        { key: "name", header: "NAME", type: "avatar" },
        { key: "email", header: "EMAIL", type: "muted" },
        { key: "role", header: "ROLE" },
        { key: "lastLogin", header: "LAST LOGIN" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { name: "Alex Sterling", avatar: "https://i.pravatar.cc/60?img=47", email: "alex@inventoryinsights.com", role: "Administrator", lastLogin: "Today, 09:42 AM", status: "Active" },
        { name: "Maya Chen", avatar: "https://i.pravatar.cc/60?img=12", email: "maya@inventoryinsights.com", role: "Inventory Manager", lastLogin: "Yesterday, 04:18 PM", status: "Active" },
        { name: "Jordan Blake", avatar: "https://i.pravatar.cc/60?img=32", email: "jordan@inventoryinsights.com", role: "Warehouse Manager", lastLogin: "Jun 18, 2024", status: "Inactive" },
      ],
    },
  },

  "/account/automation": {
    badge: "Settings · Automation",
    title: "Automation",
    subtitle: "Rules that run automatically across inventory, PPC and reimbursements.",
    variant: "settings",
    settings: [
      {
        title: "Inventory Automation",
        fields: [
          { label: "Auto-create purchase orders", description: "When stock drops below reorder point", type: "toggle", value: true },
          { label: "Auto-request FBA removal for slow movers", type: "toggle", value: false },
        ],
      },
      {
        title: "PPC Automation",
        fields: [
          { label: "Auto-adjust bids to target ACOS", type: "toggle", value: true },
          { label: "Auto-pause zero-conversion keywords", type: "toggle", value: true },
        ],
      },
      {
        title: "Reimbursements",
        fields: [
          { label: "Auto-file lost & damaged claims", type: "toggle", value: true },
          { label: "Auto-respond to negative reviews", type: "toggle", value: false },
        ],
      },
    ],
  },

  "/account/tell-a-friend": {
    badge: "Settings · Referral",
    title: "Tell a Friend",
    subtitle: "Share your referral link and earn credit when a friend signs up.",
    variant: "settings",
    settings: [
      {
        title: "Your Referral Link",
        description: "Copy and share this link — you'll earn $50 credit per signup.",
        fields: [
          { label: "Referral URL", type: "input", value: "https://app.inventoryinsights.com/r/alex-sterling" },
          { label: "Copy link", type: "button", value: "Copy Link" },
        ],
      },
      {
        title: "Referral Stats",
        fields: [
          { label: "Invites Sent", type: "input", value: "12" },
          { label: "Signed Up", type: "input", value: "5" },
          { label: "Credit Earned", type: "input", value: "$250.00" },
        ],
      },
    ],
  },

  "/account/billing": {
    badge: "Settings · Billing",
    title: "Billing",
    subtitle: "Manage your subscription plan, payment method and invoice history.",
    kpis: [
      { label: "CURRENT PLAN", value: "Pro", note: "$99/month" },
      { label: "NEXT INVOICE", value: "Jul 01, 2024", note: "$99.00" },
      { label: "PAYMENT METHOD", value: "Visa •••• 4242" },
      { label: "SEATS USED", value: "3 / 5" },
    ],
    tableTitle: "Invoice History",
    table: {
      columns: [
        { key: "invoiceId", header: "INVOICE", type: "muted" },
        { key: "date", header: "DATE" },
        { key: "amount", header: "AMOUNT", type: "bold" },
        { key: "status", header: "STATUS", type: "status" },
      ],
      rows: [
        { invoiceId: "#INV-2406", date: "Jun 01, 2024", amount: "$99.00", status: "Paid" },
        { invoiceId: "#INV-2405", date: "May 01, 2024", amount: "$99.00", status: "Paid" },
        { invoiceId: "#INV-2404", date: "Apr 01, 2024", amount: "$99.00", status: "Paid" },
      ],
    },
  },
};
