import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Pencil, Copy, Archive, Trash2, CheckCircle, Plus, FileText, Download } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { getProduct } from "../lib/endpoints";
import StatusBadge from "../components/StatusBadge";
import FulfillmentBadge from "../components/FulfillmentBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const TABS = ["Overview", "Stock", "Transactions", "Purchase History", "Sales History", "Suppliers", "Warehouses", "Activity"];

export default function ProductDetails() {
  usePageTitle("Inventory Overview");
  const { productId } = useParams();
  const [tab, setTab] = useState("Overview");
  const { data: product, loading, error, refetch } = useApi(() => getProduct(productId), [productId]);

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingState label="Loading product..." /></div>;
  if (error) return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={refetch} label="Couldn't load this product." /></div>;
  if (!product) return null;

  const availablePct = product.stock ? Math.round((product.available / product.stock) * 100) : 0;
  const reservedPct = product.stock ? Math.round((product.reserved / product.stock) * 100) : 0;

  return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-2 text-xs text-neu-muted mb-5">
          <Link to="/" className="hover:text-accent">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/inventory" className="hover:text-accent">Inventory</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neu-text">Product Details</span>
        </div>

        <section className="neu-card rounded-2xl p-6 flex flex-col lg:flex-row gap-7 mb-6">
          <div className="w-full lg:w-[220px] h-[220px] shrink-0 rounded-2xl neu-pressed flex items-center justify-center text-7xl">
            {product.icon || "📦"}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold tracking-tight text-neu-text">{product.name}</h2>
                <StatusBadge status={product.status} className="px-2.5" />
                <FulfillmentBadge type={product.fulfillment_type} className="px-2.5" />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neu-muted">
                <span><b className="text-neu-muted font-medium">SKU</b> #{product.sku}</span>
                {product.barcode && <span><b className="text-neu-muted font-medium">Barcode</b> {product.barcode}</span>}
                <span><b className="text-neu-muted font-medium">Category</b> {product.category ?? "—"}</span>
              </div>
              {product.description && <p className="text-sm text-neu-muted mt-6 max-w-2xl">{product.description}</p>}
            </div>
            <div className="flex flex-wrap gap-2 mt-7">
              <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
                <Pencil className="w-4 h-4" />Edit Product
              </button>
              <button className="neu-btn h-10 px-4 rounded-xl text-neu-muted hover:text-neu-text text-sm font-medium flex items-center gap-2">
                <Copy className="w-4 h-4" />Duplicate
              </button>
              <button className="neu-btn h-10 px-4 rounded-xl text-neu-muted hover:text-neu-text text-sm font-medium flex items-center gap-2">
                <Archive className="w-4 h-4" />Archive
              </button>
              <button className="neu-btn h-10 px-4 rounded-xl text-danger text-sm font-medium flex items-center gap-2">
                <Trash2 className="w-4 h-4" />Delete
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -4 }} className="neu-card neu-card-hover rounded-2xl p-5">
            <div className="text-xs tracking-wider text-neu-muted">CURRENT STOCK</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl text-neu-text">{product.stock.toLocaleString()}</b><span className="text-xs text-neu-muted">units</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.06 }} whileHover={{ y: -4 }} className="neu-card neu-card-hover rounded-2xl p-5">
            <div className="text-xs tracking-wider text-neu-muted">AVAILABLE STOCK</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl text-neu-text">{product.available.toLocaleString()}</b><span className="text-xs text-success font-semibold">{availablePct}%</span></div>
            <div className="h-1.5 neu-track rounded-full mt-4 overflow-hidden">
              <motion.div className="h-1.5 bg-success rounded-full" initial={{ width: 0 }} animate={{ width: `${availablePct}%` }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.12 }} whileHover={{ y: -4 }} className="neu-card neu-card-hover rounded-2xl p-5">
            <div className="text-xs tracking-wider text-neu-muted">RESERVED STOCK</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl text-neu-text">{product.reserved.toLocaleString()}</b><span className="text-xs text-warning font-semibold">{reservedPct}%</span></div>
            <div className="h-1.5 neu-track rounded-full mt-4 overflow-hidden">
              <motion.div className="h-1.5 bg-warning rounded-full" initial={{ width: 0 }} animate={{ width: `${reservedPct}%` }} transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.18 }} whileHover={{ y: -4 }} className="neu-card neu-card-hover rounded-2xl p-5">
            <div className="text-xs tracking-wider text-neu-muted">REORDER POINT</div>
            <div className="flex items-end justify-between mt-2"><b className="text-2xl text-neu-text">{product.reorder_point.toLocaleString()}</b><span className="text-xs text-neu-muted">units</span></div>
            <div className={`flex items-center gap-2 mt-4 text-xs ${product.available > product.reorder_point ? "text-success" : "text-warning"}`}>
              <CheckCircle className="w-3.5 h-3.5" />{product.available > product.reorder_point ? "Above threshold" : "At or below threshold"}
            </div>
          </motion.div>
        </section>

        <div className="neu-card rounded-2xl mb-6 overflow-x-auto">
          <nav className="flex min-w-max px-5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-4 text-xs whitespace-nowrap ${
                  tab === t ? "text-accent font-semibold" : "text-neu-muted hover:text-accent font-medium"
                }`}
              >
                {t}
                {tab === t && (
                  <motion.span
                    layoutId="productTabUnderline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="neu-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-neu-text">Pricing &amp; Margin</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div><div className="text-xs text-neu-muted mb-1">UNIT COST</div><div className="text-lg font-semibold text-neu-text">${Number(product.unit_cost).toFixed(2)}</div></div>
                <div><div className="text-xs text-neu-muted mb-1">SELLING PRICE</div><div className="text-lg font-semibold text-neu-text">${Number(product.selling_price).toFixed(2)}</div></div>
                <div><div className="text-xs text-neu-muted mb-1">MARGIN</div><div className={`text-lg font-semibold ${(product.margin_pct ?? 0) >= 0 ? "text-success" : "text-danger"}`}>{product.margin_pct != null ? `${product.margin_pct}%` : "—"}</div></div>
              </div>
              <div className="h-1.5 neu-track rounded-full mt-6 overflow-hidden">
                <motion.div className="h-1.5 bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, product.margin_pct ?? 0))}%` }} transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }} />
              </div>
            </div>

            <div className="neu-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-neu-text">Product Information</h3>
                <button className="text-xs text-accent font-semibold">Edit details</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-sm">
                <div><div className="text-xs text-neu-muted mb-1">CATEGORY</div><div className="font-medium text-neu-text">{product.category ?? "—"}</div></div>
                <div><div className="text-xs text-neu-muted mb-1">BRAND</div><div className="font-medium text-neu-text">{product.brand ?? "—"}</div></div>
                <div><div className="text-xs text-neu-muted mb-1">SUPPLIER</div><div className="font-medium text-neu-text">{product.primary_supplier ?? "—"}</div></div>
                <div><div className="text-xs text-neu-muted mb-1">UNIT</div><div className="font-medium text-neu-text">{product.unit || "Each"}</div></div>
                <div><div className="text-xs text-neu-muted mb-1">TOTAL INVENTORY VALUE</div><div className="font-semibold text-accent">${Number(product.total_value).toLocaleString()}</div></div>
                <div><div className="text-xs text-neu-muted mb-1">LAST UPDATED</div><div className="font-medium text-neu-text">{new Date(product.updated_at).toLocaleString()}</div></div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            {product.specs.length > 0 && (
              <div className="neu-card rounded-2xl p-6">
                <h3 className="text-sm font-semibold mb-4 text-neu-text">Specifications</h3>
                <div className="space-y-3 text-sm">
                  {product.specs.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }} className="flex justify-between">
                      <span className="text-neu-muted">{s.label}</span>
                      <b className="font-medium text-neu-text">{s.value}</b>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {product.fulfillment_type === "FBA" && product.fba_fees && (
              <div className="neu-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neu-text">Amazon FBA Fees</h3>
                  <span className="rounded-full bg-warning/15 text-warning px-2.5 py-1 text-[10px] font-semibold">Per unit</span>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Referral fee", value: product.fba_fees.referral },
                    { label: "Fulfillment fee", value: product.fba_fees.fulfillment },
                    { label: "Storage fee (monthly)", value: product.fba_fees.storage },
                    { label: "Long-term storage", value: product.fba_fees.long_term },
                  ].map((f, i) => (
                    <motion.div key={f.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }} className="flex justify-between">
                      <span className="text-neu-muted">{f.label}</span>
                      <b className="font-medium text-neu-text">${Number(f.value).toFixed(2)}</b>
                    </motion.div>
                  ))}
                  <div className="flex justify-between pt-1">
                    <span className="text-neu-text font-semibold">Total FBA fees</span>
                    <b className="text-warning font-semibold">${Number(product.fba_fees.total).toFixed(2)}</b>
                  </div>
                </div>
              </div>
            )}

            <div className="neu-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neu-text">Notes &amp; Attachments</h3>
                <button className="text-accent hover:opacity-80"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="rounded-xl neu-pressed-sm p-3 text-xs text-neu-muted leading-relaxed mb-4">
                Keep original packaging intact for all outbound shipments. This product requires serial number capture during dispatch.
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl neu-soft">
                <div className="w-9 h-9 rounded-xl bg-danger/15 text-danger flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-neu-text">{product.name.replace(/\s+/g, "_")}_specs.pdf</div>
                  <div className="text-[10px] text-neu-muted mt-1">Attachments aren&apos;t wired up to storage yet</div>
                </div>
                <button className="text-neu-muted hover:text-accent"><Download className="w-4 h-4" /></button>
              </div>
            </div>

            {product.warehouse_distribution.length > 0 && (
              <div className="neu-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-neu-text">Warehouse Distribution</h3>
                  <Link to="/warehouse" className="text-xs text-accent font-semibold">View all</Link>
                </div>
                <div className="space-y-4 text-xs">
                  {product.warehouse_distribution.map((w, i) => (
                    <div key={w.warehouse_id}>
                      <div className="flex justify-between mb-1 text-neu-text"><span>{w.warehouse_name}</span><b>{w.stock}</b></div>
                      <div className="h-2 neu-track rounded-full overflow-hidden">
                        <motion.div
                          className="h-2 bg-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${product.stock ? Math.round((w.stock / product.stock) * 100) : 0}%` }}
                          transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                        />
                      </div>
                      {w.location_code && <div className="text-[10px] text-neu-muted mt-1">{w.location_code}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {product.warehouse_distribution.length > 0 && (
          <section id="stock" className="neu-card rounded-2xl mt-6 overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neu-text">Stock by Warehouse</h3>
                <p className="text-xs text-neu-muted mt-1">Live inventory availability across all storage locations</p>
              </div>
              <button className="neu-btn-accent h-9 px-3 rounded-xl text-white text-xs font-semibold flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />Add warehouse
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] tracking-wider text-neu-muted">
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
                  {product.warehouse_distribution.map((w, i) => (
                    <motion.tr
                      key={w.warehouse_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                      className="hover:bg-black/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-neu-text">{w.warehouse_name}</td>
                      <td className="text-neu-text">{w.location_code ?? "—"}</td>
                      <td className="font-semibold text-neu-text">{w.stock}</td>
                      <td className="text-neu-text">{w.reserved}</td>
                      <td className="font-semibold text-neu-text">{w.available}</td>
                      <td><StatusBadge status={w.status} /></td>
                      <td><button className="text-neu-muted hover:text-accent"><ChevronRight className="w-4 h-4" /></button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
  );
}
