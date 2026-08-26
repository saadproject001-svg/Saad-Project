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
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import FulfillmentBadge from "../components/FulfillmentBadge";
import { products, inventoryKpis } from "../data/mockData";

const ICONS = { Smartphone, Laptop, Armchair, Router, Monitor };
const ICON_BG = {
  Electronics: "bg-indigo-50 text-indigo-500",
  Furniture: "bg-amber-50 text-amber-600",
  "Home Appliances": "bg-rose-50 text-rose-500",
};
const TONE_TEXT = {
  emerald: "text-emerald-600",
  rose: "text-rose-500",
  amber: "text-amber-600",
  indigo: "text-indigo-600",
  slate: "text-slate-500",
};

export default function Inventory() {
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
    <Layout title="Inventory Overview">
      <div className="p-5 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Operations / Catalog</div>
            <h2 className="text-xl font-bold tracking-tight">Inventory</h2>
            <p className="text-sm text-slate-500 mt-1">Manage products, stock levels, warehouse locations and valuation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="h-10 px-4 rounded-lg bg-[#6366ed] text-white text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700">
              <Plus className="w-4 h-4" />Add Product
            </button>
            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
              <Upload className="w-4 h-4" />Import
            </button>
            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
              <Download className="w-4 h-4" />Export
            </button>
            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
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
                  className="block bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow p-4"
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">{k.label}</div>
                  <div className="text-2xl font-bold mt-2">{k.value}</div>
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
                className="bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow p-4"
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{k.label}</div>
                <div className="text-2xl font-bold mt-2">{k.value}</div>
                <div className={`text-xs mt-1 ${TONE_TEXT[k.tone]}`}>{k.delta}</div>
              </motion.div>
            )
          )}
        </section>

        <section className="bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] p-4 md:p-5 mb-5">
          <div className="flex flex-col xl:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="h-10 w-full sm:max-w-sm bg-[#f8f9fb] rounded-lg flex items-center px-3 gap-2 text-sm text-slate-500">
                <Search className="w-[18px] h-[18px]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full placeholder:text-slate-400"
                  placeholder="Search products, SKU or ID..."
                />
              </div>
              <button className="h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2 bg-white">
                <SlidersHorizontal className="w-4 h-4" />Filters
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">Showing</span>
              <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none">
                <option>25 rows</option>
                <option>50 rows</option>
                <option>100 rows</option>
              </select>
              <button className="h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4" />Bulk actions<ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="rounded-full bg-slate-50 text-slate-600 px-3 py-1.5 text-xs flex items-center">Category: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
            <span className="rounded-full bg-slate-50 text-slate-600 px-3 py-1.5 text-xs flex items-center">Warehouse: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
            <span className="rounded-full bg-slate-50 text-slate-600 px-3 py-1.5 text-xs flex items-center">Fulfillment: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
            <span className="rounded-full bg-slate-50 text-slate-600 px-3 py-1.5 text-xs flex items-center">Status: All <ChevronDown className="w-3.5 h-3.5 ml-1" /></span>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold">Product inventory</h3>
              <p className="text-xs text-slate-400 mt-1">{products.length} products shown across active warehouses</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span><i className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />Optimal</span>
              <span><i className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1" />Low</span>
              <span><i className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1" />Out</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="text-left px-5 py-4"><input type="checkbox" className="accent-indigo-600" /></th>
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
                        className={`hover:bg-slate-50 ${i < filtered.length - 1 ? "border-b border-slate-100" : ""}`}
                      >
                        <td className="px-5 py-4"><input type="checkbox" className="accent-indigo-600" /></td>
                        <td className="font-semibold">
                          <Link to={`/inventory/${p.id}`} className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${ICON_BG[p.category] || "bg-indigo-50 text-indigo-500"}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <span>{p.name}</span>
                          </Link>
                        </td>
                        <td className="text-slate-500">{p.productId}</td>
                        <td className="text-slate-400">#{p.sku}</td>
                        <td>{p.category}</td>
                        <td><FulfillmentBadge type={p.fulfillmentType} /></td>
                        <td>{p.warehouse}</td>
                        <td className="text-slate-500">{p.location}</td>
                        <td className="text-right font-semibold">{p.stock.toLocaleString()}</td>
                        <td className="text-right">{p.reserved.toLocaleString()}</td>
                        <td className="text-right font-semibold">{p.available.toLocaleString()}</td>
                        <td className="text-right">{p.reorderPoint.toLocaleString()}</td>
                        <td className="text-right">${p.unitCost.toLocaleString()}</td>
                        <td className="text-right font-semibold">${p.totalValue.toLocaleString()}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td className="text-slate-500">{p.lastUpdated}</td>
                        <td className="text-right">
                          <div className="flex justify-end">
                            <Link to={`/inventory/${p.id}`} className="p-2 text-slate-400 hover:text-indigo-600"><Eye className="w-4 h-4" /></Link>
                            <button className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                            <button className="p-2 text-slate-400 hover:text-slate-700"><MoreHorizontal className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Showing <b className="text-[#253044]">1–{filtered.length}</b> of <b className="text-[#253044]">2,486</b> products</span>
            <Pagination page={page} totalPages={498} onPageChange={setPage} />
          </div>
        </section>
      </div>
    </Layout>
  );
}
