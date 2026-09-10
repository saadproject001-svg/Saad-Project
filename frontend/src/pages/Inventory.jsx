import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Upload,
  Download,
  ScanLine,
  Search,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  Eye,
  Edit3,
  MoreHorizontal,
  Smartphone,
  Laptop,
  Armchair,
  Router,
  Monitor,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import FulfillmentBadge from "../components/FulfillmentBadge";
import { products, inventoryKpis } from "../data/mockData";

const ICONS = { Smartphone, Laptop, Armchair, Router, Monitor };
const ICON_BG = {
  Electronics: "bg-accent/15 text-accent",
  Furniture: "bg-warning/15 text-warning",
  "Home Appliances": "bg-danger/15 text-danger",
};
const TONE_TEXT = {
  emerald: "text-success",
  rose: "text-danger",
  amber: "text-warning",
  indigo: "text-accent",
  slate: "text-neu-muted",
};

export default function Inventory() {
  usePageTitle("Inventory Overview");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [search]);

  return (
      <div className="p-5 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="min-w-0 max-w-xl">
            <div className="text-xs uppercase tracking-wider text-neu-muted mb-1">Operations / Catalog</div>
            <h2 className="text-xl font-bold tracking-tight text-neu-text">Inventory</h2>
            <p className="text-sm text-neu-muted mt-1">Manage products, stock levels, warehouse locations and valuation.</p>
          </div>
          <div className="flex flex-wrap shrink-0 gap-2">
            <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />Add Product
            </button>
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <Upload className="w-4 h-4" />Import
            </button>
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <Download className="w-4 h-4" />Export
            </button>
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <ScanLine className="w-4 h-4" />Scan Barcode
            </button>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
          {inventoryKpis.map((k, i) =>
            k.label === "Low Stock" ? (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to="/inventory/alerts"
                  className="block neu-card neu-card-hover rounded-2xl p-4"
                >
                  <div className="text-[10px] uppercase tracking-wider text-neu-muted leading-tight min-h-[24px] flex items-center">{k.label}</div>
                  <div className="text-2xl font-bold mt-2 text-neu-text">{k.value}</div>
                  <div className={`text-xs mt-1 ${TONE_TEXT[k.tone]}`}>{k.delta}</div>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="neu-card neu-card-hover rounded-2xl p-4"
              >
                <div className="text-[10px] uppercase tracking-wider text-neu-muted leading-tight min-h-[24px] flex items-center">{k.label}</div>
                <div className="text-2xl font-bold mt-2 text-neu-text">{k.value}</div>
                <div className={`text-xs mt-1 ${TONE_TEXT[k.tone]}`}>{k.delta}</div>
              </motion.div>
            )
          )}
        </section>

        <section className="neu-card rounded-2xl p-4 md:p-5 mb-5">
          <div className="flex flex-col xl:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="neu-input h-10 w-full sm:max-w-sm rounded-xl flex items-center px-3 gap-2 text-sm text-neu-muted">
                <Search className="w-[18px] h-[18px]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full placeholder:text-neu-muted text-neu-text"
                  placeholder="Search products, SKU or ID..."
                />
              </div>
              <button className="neu-btn h-10 px-3 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />Filters
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neu-muted">Showing</span>
              <select className="neu-input h-10 rounded-xl px-3 text-sm text-neu-text outline-none">
                <option>25 rows</option>
                <option>50 rows</option>
                <option>100 rows</option>
              </select>
              <button className="neu-btn h-10 px-3 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
                <Layers className="w-4 h-4" />Bulk actions<ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="rounded-full neu-soft text-neu-muted px-3 py-1.5 text-xs flex items-center">Category: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
            <span className="rounded-full neu-soft text-neu-muted px-3 py-1.5 text-xs flex items-center">Warehouse: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
            <span className="rounded-full neu-soft text-neu-muted px-3 py-1.5 text-xs flex items-center">Fulfillment: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
            <span className="rounded-full neu-soft text-neu-muted px-3 py-1.5 text-xs flex items-center">Status: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
          </div>
        </section>

        <section className="neu-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-neu-text">Product inventory</h3>
              <p className="text-xs text-neu-muted mt-1">{products.length} products shown across active warehouses</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neu-muted">
              <span><i className="inline-block w-2 h-2 rounded-full bg-success mr-1" />Optimal</span>
              <span><i className="inline-block w-2 h-2 rounded-full bg-warning mr-1" />Low</span>
              <span><i className="inline-block w-2 h-2 rounded-full bg-danger mr-1" />Out</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-neu-muted">
                <tr>
                  <th className="text-left px-5 py-4"><input type="checkbox" className="accent-[#2FAE72]" /></th>
                  <th className="text-left">Product</th>
                  <th className="text-left">SKU</th>
                  <th className="text-left">Product ID</th>
                  <th className="text-left">Category</th>
                  <th className="text-left">Fulfillment</th>
                  <th className="text-left">Warehouse</th>
                  <th className="text-left">Location</th>
                  <th className="text-right">Stock</th>
                  <th className="text-right">Reserved</th>
                  <th className="text-right">Available</th>
                  <th className="text-right">Reorder Point</th>
                  <th className="text-right">Unit Cost</th>
                  <th className="text-right">Total Value</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Last Updated</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false} mode="popLayout">
                  {filtered.map((p, i) => {
                    const Icon = ICONS[p.icon] || Smartphone;
                    return (
                      <motion.tr
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        className="hover:bg-black/[0.03] transition-colors"
                      >
                        <td className="px-5 py-4"><input type="checkbox" className="accent-[#2FAE72]" /></td>
                        <td className="font-semibold">
                          <Link to={`/inventory/${p.id}`} className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${ICON_BG[p.category] || "bg-accent/15 text-accent"}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-neu-text">{p.name}</span>
                          </Link>
                        </td>
                        <td className="text-neu-muted">{p.productId}</td>
                        <td className="text-neu-muted">#{p.sku}</td>
                        <td className="text-neu-text">{p.category}</td>
                        <td><FulfillmentBadge type={p.fulfillmentType} /></td>
                        <td className="text-neu-text">{p.warehouse}</td>
                        <td className="text-neu-muted">{p.location}</td>
                        <td className="text-right font-semibold text-neu-text">{p.stock.toLocaleString()}</td>
                        <td className="text-right text-neu-text">{p.reserved.toLocaleString()}</td>
                        <td className="text-right font-semibold text-neu-text">{p.available.toLocaleString()}</td>
                        <td className="text-right text-neu-text">{p.reorderPoint.toLocaleString()}</td>
                        <td className="text-right text-neu-text">${p.unitCost.toLocaleString()}</td>
                        <td className="text-right font-semibold text-neu-text">${p.totalValue.toLocaleString()}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td className="text-neu-muted">{p.lastUpdated}</td>
                        <td className="text-right">
                          <div className="flex justify-end">
                            <Link to={`/inventory/${p.id}`} className="p-2 text-neu-muted hover:text-accent"><Eye className="w-4 h-4" /></Link>
                            <button className="p-2 text-neu-muted hover:text-accent"><Edit3 className="w-4 h-4" /></button>
                            <button className="p-2 text-neu-muted hover:text-neu-text"><MoreHorizontal className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neu-muted">
            <span>Showing <b className="text-neu-text">1–{filtered.length}</b> of <b className="text-neu-text">2,486</b> products</span>
            <Pagination page={page} totalPages={498} onPageChange={setPage} />
          </div>
        </section>
      </div>
  );
}
