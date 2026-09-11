// Navigation structure for the Sellerboard-style nav groups — this is routing/UI
// config (route paths, labels, icon names), not business data, so it stays a
// static frontend constant. The actual page CONTENT (kpis/chart/table/products/
// settings) is fetched per-route from the backend — see
// src/pages/SellerboardPage.jsx and src/lib/endpoints.js's getSellerboardPage.

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
