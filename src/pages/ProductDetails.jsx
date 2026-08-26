import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Pencil,
  Copy,
  Archive,
  Trash2,
  CheckCircle,
  Plus,
  FileText,
  Download,
} from "lucide-react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import FulfillmentBadge from "../components/FulfillmentBadge";
import { products } from "../data/mockData";

const TABS = ["Overview", "Stock", "Transactions", "Purchase History", "Sales History", "Suppliers", "Warehouses", "Activity"];

export default function ProductDetails() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);
  const [tab, setTab] = useState("Overview");

  if (!product) return <Navigate to="/inventory" replace />;

  const availablePct = product.stock ? Math.round((product.available / product.stock) * 100) : 0;
  const reservedPct = product.stock ? Math.round((product.reserved / product.stock) * 100) : 0;

  return (
    <Layout title="Inventory Overview">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
          <Link to="/" className="hover:text-indigo-600">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/inventory" className="hover:text-indigo-600">Inventory</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600">Product Details</span>
        </div>

        <section className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)] flex flex-col lg:flex-row gap-7 mb-6">
          <div className="w-full lg:w-[220px] h-[220px] shrink-0 rounded-xl bg-[#f4f6fb] flex items-center justify-center border border-slate-100">
            <div className="w-36 h-44 rounded-[22px] bg-gradient-to-br from-indigo-200 via-indigo-400 to-indigo-600 shadow-lg relative">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900/80 border-4 border-slate-300/60" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-1 rounded bg-white/50" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
                <StatusBadge status={product.status} className="px-2.5" />
                <FulfillmentBadge type={product.fulfillmentType} className="px-2.5" />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <span><b className="text-slate-400 font-medium">SKU</b> #{product.sku}</span>
                {product.barcode && <span><b className="text-slate-400 font-medium">Barcode</b> {product.barcode}</span>}
                <span><b className="text-slate-400 font-medium">Category</b> {product.category}</span>
              </div>
              {product.description && <p className="text-sm text-slate-500 mt-6 max-w-2xl">{product.description}</p>}
            </div>
            <div className="flex flex-wrap gap-2 mt-7">
              <button className="h-10 px-4 rounded-lg bg-[#6366ed] text-white text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700">
                <Pencil className="w-4 h-4" />Edit Product
              </button>
              <button className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
                <Copy className="w-4 h-4" />Duplicate
              </button>
              <button className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
                <Archive className="w-4 h-4" />Archive
              </button>
              <button className="h-10 px-4 rounded-lg border border-rose-100 text-rose-500 text-sm font-medium flex items-center gap-2 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />Delete
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-5 shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow"
          >
            <div className="text-xs tracking-wider text-slate-500">CURRENT STOCK</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl">{product.stock.toLocaleString()}</b><span className="text-xs text-slate-400">units</span></div>
            <div className="h-1.5 bg-slate-100 rounded mt-4 overflow-hidden">
              <motion.div className="h-1.5 bg-indigo-500 rounded" initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-5 shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow"
          >
            <div className="text-xs tracking-wider text-slate-500">AVAILABLE STOCK</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl">{product.available.toLocaleString()}</b><span className="text-xs text-emerald-600 font-semibold">{availablePct}%</span></div>
            <div className="h-1.5 bg-slate-100 rounded mt-4 overflow-hidden">
              <motion.div className="h-1.5 bg-emerald-500 rounded" initial={{ width: 0 }} animate={{ width: `${availablePct}%` }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-5 shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow"
          >
            <div className="text-xs tracking-wider text-slate-500">RESERVED STOCK</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl">{product.reserved.toLocaleString()}</b><span className="text-xs text-amber-600 font-semibold">{reservedPct}%</span></div>
            <div className="h-1.5 bg-slate-100 rounded mt-4 overflow-hidden">
              <motion.div className="h-1.5 bg-amber-400 rounded" initial={{ width: 0 }} animate={{ width: `${reservedPct}%` }} transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-5 shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow"
          >
            <div className="text-xs tracking-wider text-slate-500">REORDER POINT</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl">{product.reorderPoint.toLocaleString()}</b><span className="text-xs text-slate-400">units</span></div>
            <div className="flex items-center gap-2 mt-4 text-xs text-emerald-600"><CheckCircle className="w-3.5 h-3.5" />Above threshold</div>
          </motion.div>
        </section>

        <div className="bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] mb-6 overflow-x-auto">
          <nav className="flex min-w-max px-5 border-b border-slate-100">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-4 text-xs whitespace-nowrap ${
                  tab === t ? "text-indigo-600 font-semibold" : "text-slate-500 hover:text-indigo-600 font-medium"
                }`}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="productTabUnderline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-indigo-500"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold">Stock Movement</h3>
                <select className="h-8 rounded-lg border border-slate-200 px-3 text-xs text-slate-500 bg-white">
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="flex items-center gap-5 mb-5">
                <div>
                  <div className="text-2xl font-bold">+1,860</div>
                  <div className="text-xs text-slate-400">Net movement</div>
                </div>
                <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+8.4% vs prior period</div>
              </div>
              <div className="h-56 relative">
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-300">
                  <span>2,000</span><span>1,500</span><span>1,000</span><span>500</span><span>0</span>
                </div>
                <svg viewBox="0 0 700 190" preserveAspectRatio="none" className="absolute left-9 right-0 top-0 w-[calc(100%-36px)] h-[190px]">
                  <defs>
                    <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6366ed" stopOpacity=".18" />
                      <stop offset="100%" stopColor="#6366ed" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    fill="url(#area)"
                    d="M0 143 C70 125 95 145 155 100 S225 118 280 72 S350 90 410 55 S490 80 545 33 S630 47 700 20 L700 190 L0 190 Z"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  />
                  <motion.path
                    fill="none"
                    stroke="#6366ed"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M0 143 C70 125 95 145 155 100 S225 118 280 72 S350 90 410 55 S490 80 545 33 S630 47 700 20"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                  />
                  <circle cx="700" cy="20" r="5" fill="#6366ed" />
                </svg>
                <div className="absolute left-9 right-0 bottom-0 flex justify-between text-[10px] text-slate-400">
                  <span>Month 1</span><span>Month 2</span><span>Month 3</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold">Product Information</h3>
                <button className="text-xs text-indigo-600 font-semibold">Edit details</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-sm">
                <div><div className="text-xs text-slate-400 mb-1">CATEGORY</div><div className="font-medium">{product.category}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">BRAND</div><div className="font-medium">{product.brand}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">SUPPLIER</div><div className="font-medium">{product.supplier}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">UNIT</div><div className="font-medium">{product.unit || "Each"}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">UNIT COST</div><div className="font-medium">${product.unitCost.toFixed(2)}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">SELLING PRICE</div><div className="font-medium">${product.sellingPrice.toFixed(2)}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">TOTAL INVENTORY VALUE</div><div className="font-semibold text-indigo-600">${product.totalValue.toLocaleString()}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">LAST UPDATED</div><div className="font-medium">{product.lastUpdated}</div></div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            {product.specs && (
              <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
                <h3 className="text-sm font-semibold mb-4">Specifications</h3>
                <div className="space-y-3 text-sm">
                  {product.specs.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className={`flex justify-between ${i < product.specs.length - 1 ? "border-b border-slate-100 pb-3" : ""}`}
                    >
                      <span className="text-slate-500">{s.label}</span>
                      <b className="font-medium">{s.value}</b>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {product.fulfillmentType === "FBA" && product.fbaFees && (
              <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Amazon FBA Fees</h3>
                  <span className="rounded-full bg-orange-50 text-orange-600 px-2.5 py-1 text-[10px] font-semibold">Per unit</span>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Referral fee", value: product.fbaFees.referral },
                    { label: "Fulfillment fee", value: product.fbaFees.fulfillment },
                    { label: "Storage fee (monthly)", value: product.fbaFees.storage },
                    { label: "Long-term storage", value: product.fbaFees.longTerm },
                  ].map((f, i) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="flex justify-between border-b border-slate-100 pb-3"
                    >
                      <span className="text-slate-500">{f.label}</span>
                      <b className="font-medium">${f.value.toFixed(2)}</b>
                    </motion.div>
                  ))}
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600 font-semibold">Total FBA fees</span>
                    <b className="text-orange-600 font-semibold">
                      ${(product.fbaFees.referral + product.fbaFees.fulfillment + product.fbaFees.storage + product.fbaFees.longTerm).toFixed(2)}
                    </b>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Notes &amp; Attachments</h3>
                <button className="text-indigo-600 hover:text-indigo-700"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="rounded-lg bg-[#f8f9fb] p-3 text-xs text-slate-500 leading-relaxed mb-4">
                Keep original packaging intact for all outbound shipments. This product requires serial number capture during dispatch.
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold">{product.name.replace(/\s+/g, "_")}_specs.pdf</div>
                  <div className="text-[10px] text-slate-400 mt-1">2.4 MB · Added Jun 12, 2024</div>
                </div>
                <button className="text-slate-400 hover:text-indigo-600"><Download className="w-4 h-4" /></button>
              </div>
            </div>

            {product.warehouseDistribution && (
              <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold">Warehouse Distribution</h3>
                  <Link to="/warehouse" className="text-xs text-indigo-600 font-semibold">View all</Link>
                </div>
                <div className="space-y-4 text-xs">
                  {product.warehouseDistribution.map((w, i) => (
                    <div key={w.warehouse}>
                      <div className="flex justify-between mb-1"><span>{w.warehouse}</span><b>{w.stock}</b></div>
                      <div className="h-2 bg-slate-100 rounded overflow-hidden">
                        <motion.div
                          className="h-2 bg-indigo-400 rounded"
                          initial={{ width: 0 }}
                          animate={{ width: `${w.pct}%` }}
                          transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{w.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {product.warehouseDistribution && (
          <section id="stock" className="bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] mt-6 overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Stock by Warehouse</h3>
                <p className="text-xs text-slate-400 mt-1">Live inventory availability across all storage locations</p>
              </div>
              <button className="h-9 px-3 rounded-lg bg-[#6366ed] text-white text-xs font-semibold flex items-center gap-2 hover:bg-indigo-700">
                <Plus className="w-3.5 h-3.5" />Add warehouse
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[10px] tracking-wider text-slate-400">
                  <tr>
                    <th className="text-left px-6 py-4">WAREHOUSE</th>
                    <th className="text-left">LOCATION</th>
                    <th className="text-left">STOCK</th>
                    <th className="text-left">RESERVED</th>
                    <th className="text-left">AVAILABLE</th>
                    <th className="text-left">STATUS</th>
                    <th className="text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {product.warehouseDistribution.map((w, i) => (
                    <motion.tr
                      key={w.warehouse}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                      className={`hover:bg-slate-50 ${i < product.warehouseDistribution.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <td className="px-6 py-4 font-semibold">{w.warehouse}</td>
                      <td>{w.location}</td>
                      <td className="font-semibold">{w.stock}</td>
                      <td>{w.reserved}</td>
                      <td className="font-semibold">{w.available}</td>
                      <td><StatusBadge status={w.status} /></td>
                      <td><button className="text-slate-400 hover:text-indigo-600"><ChevronRight className="w-4 h-4" /></button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
