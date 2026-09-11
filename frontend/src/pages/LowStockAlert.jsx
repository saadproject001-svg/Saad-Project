import { Download, Layers, FilePlus, Search } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { getLowStockProducts } from "../lib/endpoints";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { motion } from "framer-motion";

export default function LowStockAlert() {
  usePageTitle("Inventory Overview");
  const { data: items, loading, error, refetch } = useApi(getLowStockProducts, []);

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingState label="Loading low stock alerts..." /></div>;
  if (error) return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={refetch} /></div>;

  const critical = items.filter((i) => i.status === "Out of Stock").length;
  const warning = items.filter((i) => i.status === "Low Stock").length;
  const kpis = [
    { label: "Total Alerts", value: String(items.length) },
    { label: "Critical (Out of Stock)", value: String(critical), tone: "rose" },
    { label: "Warning (Low Stock)", value: String(warning), tone: "amber" },
  ];

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider text-neu-muted uppercase mb-2">Inventory / Alerts</div>
            <h2 className="text-xl font-bold tracking-tight text-neu-text">Low Stock Alert</h2>
            <p className="text-sm text-neu-muted mt-1">Review products below their reorder point and replenish before availability is impacted.</p>
          </div>
          <div className="flex gap-3">
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <Download className="w-4 h-4" />Export
            </button>
            <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" />Bulk Reorder
            </button>
            <button className="neu-btn-accent2 h-10 px-4 rounded-xl text-white text-sm font-medium flex items-center gap-2">
              <FilePlus className="w-4 h-4" />Create PO
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {kpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <div className="neu-card rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-[330px]">
              <Search className="absolute left-3 top-2.5 w-[18px] h-[18px] text-neu-muted" />
              <input className="neu-input w-full h-10 pl-10 pr-3 rounded-xl text-sm text-neu-text outline-none" placeholder="Search product or SKU..." />
            </div>
          </div>
        </div>

        <div className="neu-card rounded-2xl overflow-hidden">
          <div className="p-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-sm text-neu-text">Products Requiring Restock</h3>
              <p className="text-xs text-neu-muted mt-1">{items.length} products need attention</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neu-muted">
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-danger" />Critical {critical}</span>
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-warning" />Warning {warning}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[1000px]">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr>
                  <th className="text-left px-6 py-4"><input type="checkbox" /></th>
                  <th className="text-left">PRODUCT</th>
                  <th className="text-left">SKU</th>
                  <th className="text-left">CATEGORY</th>
                  <th className="text-left">CURRENT STOCK</th>
                  <th className="text-left">REORDER POINT</th>
                  <th className="text-left">SHORTFALL</th>
                  <th className="text-left">UNIT COST</th>
                  <th className="text-left">STATUS</th>
                  <th className="text-left">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const shortfall = Math.max(item.reorder_point - item.available, 0);
                  const tone = item.status === "Out of Stock" ? "text-danger" : "text-warning";
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="hover:bg-black/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4"><input type="checkbox" /></td>
                      <td className="font-semibold text-neu-text">{item.name}</td>
                      <td className="text-neu-muted">{item.sku}</td>
                      <td className="text-neu-text">{item.category ?? "—"}</td>
                      <td className={`font-semibold ${tone}`}>{item.stock}</td>
                      <td className="text-neu-text">{item.reorder_point}</td>
                      <td className={`font-semibold ${tone}`}>{shortfall}</td>
                      <td className="text-neu-text">${Number(item.unit_cost).toFixed(2)}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td><button className="neu-soft px-3 py-1.5 rounded-xl text-accent font-semibold">Reorder</button></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
