import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { getDashboardSummary } from "../lib/endpoints";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const PALETTE = ["bg-accent", "bg-accent-2", "bg-success", "bg-warning", "bg-danger", "bg-neu-muted"];
const paletteColor = (i) => PALETTE[i % PALETTE.length];

export default function Dashboard() {
  usePageTitle("Inventory Overview");
  const { data, loading, error, refetch } = useApi(getDashboardSummary, []);

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingState label="Loading dashboard..." /></div>;
  if (error) return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={refetch} /></div>;

  const {
    kpis,
    stock_by_category: stockByCategory,
    stock_by_warehouse: stockByWarehouse,
    quantity_by_supplier: quantityBySupplier,
    fulfillment_mix: fulfillmentMix,
    order_type_mix: orderTypeMix,
    monthly_order_volume: monthlyOrderVolume,
    top_products: topProducts,
  } = data;

  const maxMonthly = Math.max(1, ...monthlyOrderVolume.map((m) => m.value));
  const topWarehousePct = stockByWarehouse[0]?.pct ?? 0;
  const totalUnits = stockByCategory.reduce((sum, c) => sum + c.value, 0);

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {kpis.map((kpi, i) => (
            <StatCard key={kpi.label} {...kpi} index={i} />
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="neu-card rounded-2xl p-6 lg:col-span-4 h-[397px]">
            <div className="font-semibold text-sm text-neu-text">Order Volume Trend</div>
            <div className="text-xs text-neu-muted mt-1">Orders placed per month (last 6 months)</div>
            <div className="h-[275px] flex items-end gap-2 mt-5 px-2">
              {monthlyOrderVolume.map((m, i) => (
                <motion.div
                  key={m.label}
                  className="w-7 rounded-t bg-accent"
                  style={{ opacity: 0.4 + (0.6 * (i + 1)) / monthlyOrderVolume.length }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.value / maxMonthly) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-neu-muted mt-3">
              {monthlyOrderVolume.map((m) => (
                <span key={m.label}>{m.label}</span>
              ))}
            </div>
          </div>

          <div className="neu-card rounded-2xl p-6 lg:col-span-4 h-[397px]">
            <div className="font-semibold text-sm text-neu-text">Quantity by Warehouse</div>
            <div className="flex justify-center mt-12 relative">
              <svg viewBox="0 0 160 160" className="w-44 h-44">
                <circle cx="80" cy="80" r="57" className="fill-none stroke-[14] stroke-neu-dark/30 -rotate-90 origin-center" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="57"
                  strokeDasharray="358 358"
                  className="fill-none stroke-[14] stroke-accent -rotate-90 origin-center"
                  initial={{ strokeDasharray: "0 358" }}
                  animate={{ strokeDasharray: `${(topWarehousePct / 100) * 358} 358` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                />
              </svg>
              <div className="absolute top-16 text-center">
                <div className="text-2xl font-bold text-neu-text">{totalUnits.toLocaleString()}</div>
                <div className="text-[10px] text-neu-muted">UNITS</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neu-muted mt-7">
              {stockByWarehouse.slice(0, 3).map((w, i) => (
                <span key={w.name}>
                  <i className={`inline-block w-2 h-2 rounded-full mr-2 ${paletteColor(i)}`} />
                  {w.name} ({w.pct}%)
                </span>
              ))}
            </div>
          </div>

          <div className="neu-card rounded-2xl p-6 lg:col-span-4 h-[397px] overflow-y-auto">
            <div className="font-semibold text-sm mb-6 text-neu-text">Quantity by Category</div>
            <div className="space-y-5 text-xs">
              {stockByCategory.map((c, i) => (
                <div key={c.name}>
                  <div className="flex justify-between mb-1 text-neu-text">
                    <span>{c.name}</span>
                    <b>{c.value.toLocaleString()}</b>
                  </div>
                  <div className="h-2 neu-track rounded-full overflow-hidden">
                    <motion.div
                      className="h-2 bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.pct}%` }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="neu-card rounded-2xl lg:col-span-8 overflow-hidden">
            <div className="p-6 flex justify-between">
              <div className="font-semibold text-sm text-neu-text">Top Products by Stock</div>
              <Link to="/inventory" className="text-xs text-accent font-semibold">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] tracking-wider text-neu-muted">
                  <tr>
                    <th className="text-left px-6 py-4">SKU</th>
                    <th className="text-left">ITEM</th>
                    <th className="text-left">CATEGORY</th>
                    <th className="text-left">IN STOCK</th>
                    <th className="text-left">STATUS</th>
                    <th className="text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <motion.tr
                      key={p.sku}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="hover:bg-black/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 text-neu-muted">#{p.sku}</td>
                      <td className="font-semibold text-neu-text">{p.name}</td>
                      <td>{p.category ?? "—"}</td>
                      <td className="font-semibold text-neu-text">{p.stock.toLocaleString()}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td className="text-neu-muted"><ExternalLink className="w-4 h-4" /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="neu-card rounded-2xl p-6">
              <div className="font-semibold text-sm mb-6 text-neu-text">Quantity by Supplier</div>
              <div className="space-y-4 text-[11px]">
                {quantityBySupplier.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-neu-text">
                      <span>{s.name}</span>
                      <span className="text-neu-muted">{s.value.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 neu-track mt-1 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-1.5 rounded-full ${paletteColor(i)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="neu-card rounded-2xl p-6">
              <div className="font-semibold text-sm mb-5 text-neu-text">Order Mix</div>
              <div className="space-y-2 text-[11px] text-neu-text">
                {orderTypeMix.map((s, i) => (
                  <div key={s.name} className="flex justify-between">
                    <span><i className={`inline-block w-2 h-2 rounded-full mr-2 ${paletteColor(i)}`} />{s.name}</span>
                    <b>{s.pct}%</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="neu-card rounded-2xl p-6">
              <div className="font-semibold text-sm mb-6 text-neu-text">Fulfillment Mix</div>
              <div className="space-y-4 text-[11px]">
                {fulfillmentMix.map((f, i) => (
                  <div key={f.name}>
                    <div className="flex justify-between text-neu-text">
                      <span>{f.name}</span>
                      <span className="text-neu-muted">{f.pct}%</span>
                    </div>
                    <div className="h-1.5 neu-track mt-1 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-1.5 rounded-full ${paletteColor(i)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${f.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
