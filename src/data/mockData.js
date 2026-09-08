// Mock data for the Inventory Insights Pro dashboard.
// In a real app this would come from an API.

export const currentUser = {
  name: "Alex Sterling",
  role: "Admin Account",
  avatar: "https://i.pravatar.cc/80?img=47",
};

export const kpiOverview = [
  { label: "TOTAL STOCK QUANTITY", value: "124,592", delta: "+5.2%", trend: "up", spark: "M0 30 C15 8 24 39 38 29 S55 1 67 8 S79 43 91 26 S108 5 140 15" },
  { label: "TOTAL STOCK VALUE", value: "$4.2M", delta: "-1.8%", trend: "down", spark: "M0 18 C30 30 51 4 70 10 S76 40 88 28 S110 21 140 29" },
  { label: "AVG LEAD TIME", value: "14 Days", delta: "-2d", trend: "down", bar: 66 },
  { label: "STOCK OUT RATE", value: "2.4%", delta: "-0.5%", trend: "down", spark: "M0 10 L28 18 L55 14 L82 30 L108 22 L140 35" },
  { label: "BELOW REORDER %", value: "12%", delta: "+1.2%", trend: "up", spark: "M0 29 C25 13 48 19 68 22 S111 40 140 10" },
];

export const stockByCategory = [
  { name: "Electronics", value: 42400, pct: 80 },
  { name: "Furniture", value: 28150, pct: 55 },
  { name: "Home Appliances", value: 19200, pct: 35 },
  { name: "Apparel", value: 15600, pct: 25 },
];

export const quantityBySupplier = [
  { name: "Global Logistics Co.", value: 12400, pct: 85, color: "bg-accent" },
  { name: "Prime Parts Inc.", value: 9100, pct: 65, color: "bg-accent/60" },
  { name: "Direct Supply Ltd.", value: 4200, pct: 38, color: "bg-accent/25" },
];

export const stockMovementType = [
  { name: "Incoming", pct: 62, color: "bg-accent" },
  { name: "Outgoing", pct: 28, color: "bg-accent-2" },
  { name: "Internal", pct: 10, color: "bg-neu-dark/40" },
];

export const topProducts = [
  { sku: "SKU-9021", name: "ProPhone 15 GenX", category: "Electronics", stock: 1240, status: "Optimal" },
  { sku: "SKU-4412", name: "Ergo Office Chair", category: "Furniture", stock: 452, status: "Low Stock" },
  { sku: "SKU-7721", name: "ZenBook Air 13", category: "Electronics", stock: 890, status: "Optimal" },
];

export const products = [
  {
    id: "prophone-15-genx",
    sku: "SKU-9021",
    productId: "PP15-GX-256",
    name: "ProPhone 15 GenX",
    icon: "Smartphone",
    category: "Electronics",
    brand: "TechCorp",
    supplier: "Global Logistics Co.",
    warehouse: "Main Distribution",
    location: "A01-R03-B12",
    stock: 1240,
    reserved: 120,
    available: 1120,
    reorderPoint: 400,
    unitCost: 799,
    sellingPrice: 899,
    totalValue: 990760,
    status: "Optimal",
    lastUpdated: "Today, 09:42",
    fulfillmentType: "FBA",
    fbaFees: { referral: 134.85, fulfillment: 8.26, storage: 0.83, longTerm: 0 },
    barcode: "891234567890",
    unit: "Each",
    description:
      "Premium flagship smartphone with cutting-edge technology, advanced camera capabilities, and all-day performance for modern enterprise teams.",
    specs: [
      { label: "Display", value: "6.7-inch OLED" },
      { label: "Processor", value: "T9 Pro Chip" },
      { label: "RAM", value: "12 GB" },
      { label: "Storage", value: "512 GB" },
      { label: "Battery", value: "4,800 mAh" },
      { label: "Camera", value: "48 MP Pro System" },
    ],
    warehouseDistribution: [
      { warehouse: "Main Distribution Center", location: "A01 · R04 · S02", stock: 520, reserved: 110, available: 410, status: "Optimal", pct: 42 },
      { warehouse: "East Coast Warehouse", location: "B02 · R01 · S06", stock: 310, reserved: 64, available: 246, status: "Optimal", pct: 25 },
      { warehouse: "West Coast Warehouse", location: "C01 · R08 · S03", stock: 240, reserved: 52, available: 188, status: "Monitor", pct: 19 },
      { warehouse: "European Warehouse", location: "EU-04 · R02 · S01", stock: 170, reserved: 34, available: 136, status: "Optimal", pct: 14 },
    ],
  },
  {
    id: "zenbook-air-13",
    sku: "SKU-7721",
    productId: "ZBA13-I7-512",
    name: "ZenBook Air 13",
    icon: "Laptop",
    category: "Electronics",
    brand: "TechCorp",
    supplier: "Global Logistics Co.",
    warehouse: "West Coast WH",
    location: "B02-R01-S08",
    stock: 890,
    reserved: 74,
    available: 816,
    reorderPoint: 250,
    unitCost: 1099,
    sellingPrice: 1299,
    totalValue: 978110,
    status: "Optimal",
    lastUpdated: "Yesterday, 16:18",
    fulfillmentType: "FBM",
  },
  {
    id: "ergo-office-chair",
    sku: "SKU-4412",
    productId: "EOC-BLK-ERG",
    name: "Ergo Office Chair",
    icon: "Armchair",
    category: "Furniture",
    brand: "OfficeForm",
    supplier: "Prime Parts Inc.",
    warehouse: "East Coast WH",
    location: "C04-R02-S01",
    stock: 452,
    reserved: 96,
    available: 356,
    reorderPoint: 500,
    unitCost: 249,
    sellingPrice: 399,
    totalValue: 112548,
    status: "Low Stock",
    lastUpdated: "Today, 08:16",
    fulfillmentType: "FBA",
    fbaFees: { referral: 37.35, fulfillment: 12.4, storage: 1.1, longTerm: 0 },
  },
  {
    id: "smart-home-hub",
    sku: "SKU-3488",
    productId: "SHH-2ND-GEN",
    name: "Smart Home Hub",
    icon: "Router",
    category: "Home Appliances",
    brand: "NestWorks",
    supplier: "TechSource International",
    warehouse: "European WH",
    location: "D01-R06-B03",
    stock: 0,
    reserved: 0,
    available: 0,
    reorderPoint: 180,
    unitCost: 129,
    sellingPrice: 199,
    totalValue: 0,
    status: "Out of Stock",
    lastUpdated: "May 28, 2024",
    fulfillmentType: "SFP",
  },
  {
    id: "led-monitor-27-pro",
    sku: "SKU-6034",
    productId: "LDM27-4K-IPS",
    name: "LED Monitor 27 Pro",
    icon: "Monitor",
    category: "Electronics",
    brand: "ViewTech",
    supplier: "Global Logistics Co.",
    warehouse: "Asia Distribution",
    location: "E03-R04-S02",
    stock: 2840,
    reserved: 220,
    available: 2620,
    reorderPoint: 600,
    unitCost: 319,
    sellingPrice: 449,
    totalValue: 905960,
    status: "Overstock",
    lastUpdated: "Jun 02, 2024",
    fulfillmentType: "FBA",
    fbaFees: { referral: 47.85, fulfillment: 9.75, storage: 1.25, longTerm: 2.1 },
  },
];

export const inventoryKpis = [
  { label: "Total Products", value: "2,486", delta: "+8.4% this month", tone: "emerald" },
  { label: "Total Units", value: "124,592", delta: "+5.2% vs last month", tone: "emerald" },
  { label: "Inventory Value", value: "$4.2M", delta: "-1.8% vs last month", tone: "rose" },
  { label: "Low Stock", value: "184", delta: "7.4% of products", tone: "amber" },
  { label: "Out of Stock", value: "32", delta: "Needs attention", tone: "rose" },
  { label: "Overstock", value: "96", delta: "3.9% of products", tone: "indigo" },
  { label: "Reserved Stock", value: "18,420", delta: "14.8% of units", tone: "slate" },
];

export const lowStockKpis = [
  { label: "PRODUCTS BELOW REORDER", value: "24", delta: "+4 this week", tone: "rose", bar: 42, note: "12% of catalog" },
  { label: "TOTAL ITEMS TO ORDER", value: "3,840", delta: "+8.6%", tone: "emerald", spark: "M0 30 C20 22 27 26 42 18 S62 8 76 17 S104 25 140 8" },
  { label: "ESTIMATED SPEND", value: "$186,420", delta: "Due this month", tone: "amber", bar: 68, note: "68% planned" },
];

export const lowStockItems = [
  { name: "ProPhone 15 GenX", sku: "SKU-9021", category: "Electronics", warehouse: "Main Distribution", stock: 42, reorderPoint: 180, shortfall: 138, recommended: 240, unitCost: 699.0, leadTime: "12 days", supplier: "Global Logistics Co.", severity: "critical" },
  { name: "Ergo Office Chair", sku: "SKU-4412", category: "Furniture", warehouse: "East Coast Warehouse", stock: 74, reorderPoint: 120, shortfall: 46, recommended: 96, unitCost: 184.5, leadTime: "18 days", supplier: "Prime Parts Inc.", severity: "warning" },
  { name: "Smart Home Hub", sku: "SKU-5630", category: "Home Appliances", warehouse: "European Warehouse", stock: 18, reorderPoint: 90, shortfall: 72, recommended: 120, unitCost: 86.25, leadTime: "21 days", supplier: "TechSource International", severity: "critical" },
  { name: "Wireless Keyboard", sku: "SKU-3308", category: "Accessories", warehouse: "West Coast Warehouse", stock: 96, reorderPoint: 160, shortfall: 64, recommended: 120, unitCost: 42.8, leadTime: "9 days", supplier: "Direct Supply Ltd.", severity: "warning" },
  { name: "LED Monitor 27", sku: "SKU-6804", category: "Electronics", warehouse: "Main Distribution", stock: 31, reorderPoint: 75, shortfall: 44, recommended: 72, unitCost: 214.0, leadTime: "14 days", supplier: "Global Logistics Co.", severity: "warning" },
];

export const supplierKpis = [
  { label: "TOTAL SUPPLIERS", value: "45", note: "suppliers", spark: "M0 24 C22 17 29 23 45 13 S72 19 87 9 S112 14 140 5" },
  { label: "ACTIVE SUPPLIERS", value: "38", delta: "+84%", tone: "emerald", bar: 84 },
  { label: "PENDING SUPPLIERS", value: "5", delta: "-12%", tone: "amber", bar: 28 },
  { label: "TOTAL PURCHASE VALUE", value: "$2.8M", delta: "+3.2%", tone: "emerald", spark: "M0 23 C20 23 30 11 48 17 S75 24 92 10 S119 14 140 5" },
  { label: "OUTSTANDING PAYMENTS", value: "$284K", delta: "-2.1%", tone: "emerald", spark: "M0 8 C25 15 34 8 54 16 S78 14 96 23 S122 17 140 25" },
  { label: "AVERAGE LEAD TIME", value: "12 Days", delta: "-1d", tone: "emerald", bar: 67 },
];

export const suppliers = [
  { id: "SUP-1028", name: "Global Logistics Co.", icon: "Truck", iconBg: "bg-accent/15 text-accent", contact: "John Smith", email: "john@global.com", phone: "+1-555-0101", country: "USA", products: 156, orders: 28, purchaseValue: "$1.2M", outstanding: "$45K", leadTime: "14 days", rating: 4.8, lastOrder: "Jan 15, 2024", status: "Active" },
  { id: "SUP-1016", name: "Prime Parts Inc.", icon: "Boxes", iconBg: "bg-accent-2/15 text-accent-2", contact: "Sarah Johnson", email: "sarah@primeparts.com", phone: "+1-555-0102", country: "Canada", products: 98, orders: 15, purchaseValue: "$680K", outstanding: "$32K", leadTime: "10 days", rating: 4.6, lastOrder: "Jan 12, 2024", status: "Active" },
  { id: "SUP-0994", name: "Direct Supply Ltd.", icon: "Package", iconBg: "bg-neu-dark/15 text-neu-muted", contact: "Mike Chen", email: "mike@directsupply.co.uk", phone: "+44-20-7946", country: "UK", products: 76, orders: 12, purchaseValue: "$420K", outstanding: "$18K", leadTime: "16 days", rating: 4.4, lastOrder: "Jan 08, 2024", status: "Active" },
  { id: "SUP-1041", name: "TechSource International", icon: "Cpu", iconBg: "bg-warning/15 text-warning", contact: "Alex Rodriguez", email: "alex@techsource.de", phone: "+49-89-1234", country: "Germany", products: 143, orders: 31, purchaseValue: "$950K", outstanding: "$68K", leadTime: "12 days", rating: 4.7, lastOrder: "Jan 14, 2024", status: "Pending" },
  { id: "SUP-0972", name: "Alpha Distribution", icon: "Globe2", iconBg: "bg-success/15 text-success", contact: "Lisa Wong", email: "lisa@alphadist.sg", phone: "+65-6789-0123", country: "Singapore", products: 87, orders: 9, purchaseValue: "$320K", outstanding: "$12K", leadTime: "18 days", rating: 4.3, lastOrder: "Jan 10, 2024", status: "Active" },
];

export const warehouseKpis = [
  { label: "TOTAL WAREHOUSES", value: "5", delta: "+1", tone: "emerald", note: "Across 4 regions" },
  { label: "ACTIVE WAREHOUSES", value: "4", delta: "80%", tone: "emerald", bar: 80 },
  { label: "TOTAL CAPACITY", value: "1.26M", note: "sq ft", extra: "+8.4% from last quarter" },
  { label: "USED CAPACITY", value: "78.4%", delta: "Watch", tone: "amber", bar: 78 },
  { label: "AVAILABLE CAPACITY", value: "272k", note: "sq ft", extra: "21.6% network space" },
  { label: "UTILIZATION %", value: "78.4%", delta: "+3.2%", tone: "rose", spark: "M0 28 C22 10 39 25 57 18 S88 31 105 15 S125 12 140 8" },
  { label: "PRODUCTS STORED", value: "12,842", delta: "+6.7%", tone: "emerald", extra: "124,592 units total" },
  { label: "PENDING TRANSFERS", value: "18", delta: "7 urgent", tone: "amber", extra: "Awaiting warehouse approval" },
];

export const warehouses = [
  { name: "Main Distribution Center", city: "Chicago, United States", status: "Active", capacityPct: 86, products: "42,280 products", value: "$1.84M", type: "Self-Managed" },
  { name: "East Coast Warehouse", city: "Newark, United States", status: "Near Full", capacityPct: 94, products: "28,640 products", value: "$982k", type: "Amazon FBA" },
  { name: "West Coast Warehouse", city: "Los Angeles, United States", status: "Active", capacityPct: 72, products: "21,905 products", value: "$728k", type: "Self-Managed" },
  { name: "European Warehouse", city: "Rotterdam, Netherlands", status: "Active", capacityPct: 68, products: "18,412 products", value: "$416k", type: "Amazon FBA" },
  { name: "Asia Distribution Center", city: "Singapore", status: "Maintenance", capacityPct: 61, products: "13,355 products", value: "$264k", type: "Self-Managed" },
];

export const fulfillmentSplit = [
  { name: "FBA", pct: 58, color: "bg-accent" },
  { name: "FBM", pct: 30, color: "bg-accent-2" },
  { name: "SFP", pct: 12, color: "bg-accent/40" },
];

export const incomingShipments = [
  { id: "#IN-48291", supplier: "Global Logistics Co.", warehouse: "Main DC", eta: "Today", qty: 2480, carrier: "FedEx" },
  { id: "#IN-48287", supplier: "Prime Parts Inc.", warehouse: "East Coast", eta: "Jun 18", qty: 1250, carrier: "DHL" },
  { id: "#IN-48264", supplier: "TechSource Intl.", warehouse: "European", eta: "Jun 21", qty: 860, carrier: "UPS" },
];

export const outgoingShipments = [
  { id: "#SO-10482", destination: "New York", qty: 340, status: "Packed", carrier: "Amazon Logistics" },
  { id: "#SO-10476", destination: "Toronto", qty: 185, status: "Shipped", carrier: "UPS" },
  { id: "#SO-10461", destination: "Berlin", qty: 92, status: "Preparing", carrier: "USPS" },
];

export const pendingTransfers = [
  { id: "#TR-20841", source: "Main Distribution Center", destination: "East Coast Warehouse", items: "12 products / 640 units", requested: "Jun 14, 2024", status: "Requested", action: "Review" },
  { id: "#TR-20835", source: "European Warehouse", destination: "Main Distribution Center", items: "8 products / 280 units", requested: "Jun 13, 2024", status: "In Transit", action: "Track" },
  { id: "#TR-20821", source: "West Coast Warehouse", destination: "Asia Distribution Center", items: "5 products / 120 units", requested: "Jun 12, 2024", status: "Approved", action: "View" },
];

export const orderKpis = [
  { label: "TOTAL ORDERS", value: "2,486", delta: "+8.4%", tone: "emerald", spark: "M0 23 C18 12 25 25 42 15 S61 4 76 14 S98 22 120 5" },
  { label: "PENDING", value: "184", delta: "+12", tone: "amber", bar: 42 },
  { label: "PROCESSING", value: "236", delta: "+5.1%", tone: "emerald", bar: 58 },
  { label: "SHIPPED", value: "1,024", delta: "+9.8%", tone: "emerald", bar: 78 },
  { label: "DELIVERED", value: "892", delta: "+6.3%", tone: "emerald", bar: 87 },
  { label: "CANCELLED", value: "36", delta: "-2.1%", tone: "rose", bar: 18 },
  { label: "RETURNED", value: "114", delta: "+1.4%", tone: "amber", bar: 28 },
  { label: "TOTAL VALUE", value: "$1.84M", delta: "+4.6%", tone: "emerald", spark: "M0 21 C16 24 27 9 43 16 S64 26 78 10 S101 16 120 4" },
];

export const orders = [
  {
    id: "#PO-10482", type: "Purchase", party: "Global Logistics Co.", partyId: "SUP-2041", date: "Jun 18, 2024", items: 24, warehouse: "Main Distribution Center", total: "$48,620", payment: "Paid", fulfillment: "Processing", delivery: "Jun 27, 2024", priority: "High", assigned: "J. Carter",
    carrier: "FedEx", trackingNumber: "7712 4490 2210",
    deliverySteps: [
      { label: "Label Created", date: "Jun 18, 2024", done: true },
      { label: "Picked Up", date: "Jun 19, 2024", done: true },
      { label: "In Transit", date: "Jun 22, 2024", done: false },
      { label: "Delivered", date: "Jun 27, 2024", done: false },
    ],
  },
  {
    id: "#SO-78314", type: "Sales", party: "Northstar Retail Group", partyId: "CUS-8842", date: "Jun 17, 2024", items: 8, warehouse: "East Coast Warehouse", total: "$12,840", payment: "Paid", fulfillment: "Shipped", delivery: "Jun 21, 2024", priority: "Normal", assigned: "M. Rivera",
    carrier: "UPS", trackingNumber: "1Z999AA10123456784",
    deliverySteps: [
      { label: "Label Created", date: "Jun 17, 2024", done: true },
      { label: "Picked Up", date: "Jun 17, 2024", done: true },
      { label: "In Transit", date: "Jun 19, 2024", done: true },
      { label: "Delivered", date: "Jun 21, 2024", done: false },
    ],
  },
  {
    id: "#PO-10481", type: "Purchase", party: "Prime Parts Inc.", partyId: "SUP-1108", date: "Jun 16, 2024", items: 16, warehouse: "West Coast Warehouse", total: "$26,450", payment: "Pending", fulfillment: "Pending", delivery: "Jun 29, 2024", priority: "Urgent", assigned: "J. Carter",
    carrier: "DHL", trackingNumber: "3305 9988 4471",
    deliverySteps: [
      { label: "Label Created", date: "Jun 16, 2024", done: true },
      { label: "Picked Up", date: "Jun 18, 2024", done: false },
      { label: "In Transit", date: "—", done: false },
      { label: "Delivered", date: "Jun 29, 2024", done: false },
    ],
  },
  {
    id: "#SO-78313", type: "Sales", party: "Apex Office Systems", partyId: "CUS-6290", date: "Jun 15, 2024", items: 12, warehouse: "Main Distribution Center", total: "$8,920", payment: "Failed", fulfillment: "On Hold", delivery: "—", priority: "Normal", assigned: "R. Singh",
    carrier: "USPS", trackingNumber: "9400 1000 0000 0000 0000 00",
    deliverySteps: [
      { label: "Label Created", date: "Jun 15, 2024", done: true },
      { label: "Picked Up", date: "—", done: false },
      { label: "In Transit", date: "—", done: false },
      { label: "Delivered", date: "—", done: false },
    ],
  },
  {
    id: "#TR-00291", type: "Transfer", party: "Warehouse Transfer", partyId: "Internal movement", date: "Jun 14, 2024", items: 6, warehouse: "East Coast → Europe", total: "$18,740", payment: "N/A", fulfillment: "In Transit", delivery: "Jun 23, 2024", priority: "Normal", assigned: "L. Morgan",
    carrier: "Amazon Logistics", trackingNumber: "TBA123456789000",
    deliverySteps: [
      { label: "Label Created", date: "Jun 14, 2024", done: true },
      { label: "Picked Up", date: "Jun 14, 2024", done: true },
      { label: "In Transit", date: "Jun 16, 2024", done: true },
      { label: "Delivered", date: "Jun 23, 2024", done: false },
    ],
  },
];

export const carrierPerformance = [
  { name: "FedEx", onTimePct: 96, avgDays: 3.2, shipments: 842 },
  { name: "UPS", onTimePct: 94, avgDays: 3.6, shipments: 615 },
  { name: "DHL", onTimePct: 91, avgDays: 4.1, shipments: 328 },
  { name: "USPS", onTimePct: 88, avgDays: 4.8, shipments: 402 },
  { name: "Amazon Logistics", onTimePct: 97, avgDays: 2.4, shipments: 1120 },
];

export const workspaceUsers = [
  { name: "Alex Sterling", avatar: "https://i.pravatar.cc/60?img=47", email: "alex@inventoryinsights.com", role: "Administrator", status: "Active", lastLogin: "Today, 09:42 AM" },
  { name: "Maya Chen", avatar: "https://i.pravatar.cc/60?img=12", email: "maya@inventoryinsights.com", role: "Inventory Manager", status: "Active", lastLogin: "Yesterday, 04:18 PM" },
  { name: "Jordan Blake", avatar: "https://i.pravatar.cc/60?img=32", email: "jordan@inventoryinsights.com", role: "Warehouse Manager", status: "Inactive", lastLogin: "Jun 18, 2024" },
];

export const profitKpis = [
  { label: "REVENUE", value: "$186,420", delta: "+12.4%", tone: "emerald", spark: "M0 30 C20 22 30 26 45 15 S65 4 80 14 S105 25 140 6" },
  { label: "COGS", value: "$74,230", delta: "+6.1%", tone: "amber", spark: "M0 20 C22 26 34 12 50 18 S72 8 88 20 S112 14 140 24" },
  { label: "AMAZON FEES", value: "$38,960", delta: "+3.8%", tone: "amber", spark: "M0 24 C24 18 36 22 52 14 S78 20 94 10 S118 18 140 12" },
  { label: "AD SPEND", value: "$21,150", delta: "-4.2%", tone: "emerald", spark: "M0 12 C20 20 32 8 48 16 S70 26 86 14 S112 22 140 30" },
  { label: "NET PROFIT", value: "$52,080", delta: "+18.6%", tone: "emerald", spark: "M0 32 C24 20 36 24 54 10 S80 2 96 12 S120 6 140 4" },
  { label: "PROFIT MARGIN", value: "27.9%", delta: "+2.1pt", tone: "emerald", bar: 28 },
];

export const productProfitability = [
  { name: "ProPhone 15 GenX", sku: "SKU-9021", unitsSold: 62, revenue: 55738, amazonFees: 8360, adSpend: 6200, netProfit: 9850, marginPct: 17.7 },
  { name: "ZenBook Air 13", sku: "SKU-7721", unitsSold: 38, revenue: 49362, amazonFees: 6410, adSpend: 5100, netProfit: 11200, marginPct: 22.7 },
  { name: "Ergo Office Chair", sku: "SKU-4412", unitsSold: 145, revenue: 57855, amazonFees: 7230, adSpend: 4800, netProfit: 8940, marginPct: 15.5 },
  { name: "Smart Home Hub", sku: "SKU-3488", unitsSold: 0, revenue: 0, amazonFees: 0, adSpend: 1200, netProfit: -1200, marginPct: 0 },
  { name: "LED Monitor 27 Pro", sku: "SKU-6034", unitsSold: 52, revenue: 23348, amazonFees: 3760, adSpend: 3850, netProfit: 4290, marginPct: 18.4 },
];

export const advertisingStats = { acos: 18.4, tacos: 9.2, spend: 21150, sales: 114900 };

export const refunds = [
  { orderId: "#RET-3021", product: "ProPhone 15 GenX", reason: "Damaged in transit", amount: "$899.00", date: "Jun 12, 2024", status: "Refunded" },
  { orderId: "#RET-3018", product: "Ergo Office Chair", reason: "Wrong item received", amount: "$399.00", date: "Jun 10, 2024", status: "Refunded" },
  { orderId: "#RET-3014", product: "ZenBook Air 13", reason: "Changed mind", amount: "$1,299.00", date: "Jun 08, 2024", status: "Processing" },
  { orderId: "#RET-3009", product: "LED Monitor 27 Pro", reason: "Defective unit", amount: "$449.00", date: "Jun 05, 2024", status: "Refunded" },
  { orderId: "#RET-3002", product: "Smart Home Hub", reason: "Not as described", amount: "$199.00", date: "Jun 01, 2024", status: "Rejected" },
];

export const cashFlowProjection = {
  currentBalance: "$142,600",
  projected30d: "$168,900",
  deltaPct: "+18.4%",
  path: "M0 150 C60 140 90 120 150 110 S220 90 280 70 S350 95 410 60 S480 40 545 55 S620 20 700 15",
};

export const storageFeeAlert = {
  message: "Long-term storage fees apply to 3 FBA products exceeding 365 days in an Amazon fulfillment center.",
  amount: "$1,240",
  dueDate: "Jul 15, 2024",
};

export const permissionMatrix = {
  modules: ["Dashboard", "Inventory", "Suppliers", "Orders", "Warehouse", "Reports", "Settings"],
  roles: [
    { role: "Administrator", access: [true, true, true, true, true, true, true] },
    { role: "Manager", access: [true, true, true, true, true, true, false] },
    { role: "Inventory Manager", access: [true, true, true, false, true, true, false] },
    { role: "Warehouse Manager", access: [true, true, false, false, true, false, false] },
  ],
};
