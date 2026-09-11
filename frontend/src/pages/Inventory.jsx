import { useState } from "react";
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
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { listProducts, getInventoryKpis } from "../lib/endpoints";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import FulfillmentBadge from "../components/FulfillmentBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const ICON_BG = {
  Electronics: "bg-accent/15 text-accent",
  "Home & Kitchen": "bg-warning/15 text-warning",
  "Sports & Outdoors": "bg-success/15 text-success",
  Beauty: "bg-danger/15 text-danger",
};

export default function Inventory() {
  usePageTitle("Inventory Overview");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { data: kpis } = useApi(getInventoryKpis, []);
  const {
    data: productsPage,
    loading,
    error,
    refetch,
  } = useApi(() => listProducts({ page, pageSize, q: search || undefined }), [page, pageSize, search]);

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

        {kpis && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {kpis.map((k, i) => (
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
              </motion.div>
            ))}
          </section>
        )}

        <section className="neu-card rounded-2xl p-4 md:p-5 mb-5">
          <div className="flex flex-col xl:flex-row gap-3 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="neu-input h-10 w-full sm:max-w-sm rounded-xl flex items-center px-3 gap-2 text-sm text-neu-muted">
                <Search className="w-[18px] h-[18px]" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent outline-none w-full placeholder:text-neu-muted text-neu-text"
                  placeholder="Search products or SKU..."
                />
              </div>
              <button className="neu-btn h-10 px-3 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />Filters
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neu-muted">Showing</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="neu-input h-10 rounded-xl px-3 text-sm text-neu-text outline-none"
              >
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
              <button className="neu-btn h-10 px-3 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
                <Layers className="w-4 h-4" />Bulk actions<ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="neu-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-neu-text">Product inventory</h3>
              <p className="text-xs text-neu-muted mt-1">{productsPage?.total ?? 0} products across active warehouses</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neu-muted">
              <span><i className="inline-block w-2 h-2 rounded-full bg-success mr-1" />Optimal</span>
              <span><i className="inline-block w-2 h-2 rounded-full bg-warning mr-1" />Low</span>
              <span><i className="inline-block w-2 h-2 rounded-full bg-danger mr-1" />Out</span>
            </div>
          </div>

          {loading && <LoadingState label="Loading products..." />}
          {error && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && productsPage && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px] text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-neu-muted">
                    <tr>
                      <th className="text-left px-5 py-4"><input type="checkbox" className="accent-[#2FAE72]" /></th>
                      <th className="text-left">Product</th>
                      <th className="text-left">SKU</th>
                      <th className="text-left">Category</th>
                      <th className="text-left">Fulfillment</th>
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
                      {productsPage.items.map((p, i) => (
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
                              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${ICON_BG[p.category] || "bg-accent/15 text-accent"}`}>
                                {p.icon || "📦"}
                              </span>
                              <span className="text-neu-text">{p.name}</span>
                            </Link>
                          </td>
                          <td className="text-neu-muted">#{p.sku}</td>
                          <td className="text-neu-text">{p.category ?? "—"}</td>
                          <td><FulfillmentBadge type={p.fulfillment_type} /></td>
                          <td className="text-right font-semibold text-neu-text">{p.stock.toLocaleString()}</td>
                          <td className="text-right text-neu-text">{p.reserved.toLocaleString()}</td>
                          <td className="text-right font-semibold text-neu-text">{p.available.toLocaleString()}</td>
                          <td className="text-right text-neu-text">{p.reorder_point.toLocaleString()}</td>
                          <td className="text-right text-neu-text">${Number(p.unit_cost).toLocaleString()}</td>
                          <td className="text-right font-semibold text-neu-text">${Number(p.total_value).toLocaleString()}</td>
                          <td><StatusBadge status={p.status} /></td>
                          <td className="text-neu-muted">{new Date(p.updated_at).toLocaleDateString()}</td>
                          <td className="text-right">
                            <div className="flex justify-end">
                              <Link to={`/inventory/${p.id}`} className="p-2 text-neu-muted hover:text-accent"><Eye className="w-4 h-4" /></Link>
                              <button className="p-2 text-neu-muted hover:text-accent"><Edit3 className="w-4 h-4" /></button>
                              <button className="p-2 text-neu-muted hover:text-neu-text"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neu-muted">
                <span>
                  Showing <b className="text-neu-text">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, productsPage.total)}</b> of{" "}
                  <b className="text-neu-text">{productsPage.total}</b> products
                </span>
                <Pagination page={page} totalPages={productsPage.total_pages} onPageChange={setPage} />
              </div>
            </>
          )}
        </section>
      </div>
  );
}
