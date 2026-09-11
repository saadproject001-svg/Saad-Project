import { motion } from "framer-motion";
import { Download } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { getAnalyticsSummary } from "../lib/endpoints";
import StatCard from "../components/StatCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function Analytics() {
  usePageTitle("Inventory Overview");
  const { data, loading, error, refetch } = useApi(getAnalyticsSummary, []);

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingState label="Loading analytics..." /></div>;
  if (error) return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={refetch} /></div>;

  const { kpis, product_profitability: productProfitability } = data;

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider text-neu-muted uppercase">Business performance</div>
            <h2 className="text-xl font-bold tracking-tight mt-1 text-neu-text">Profit &amp; Performance Analytics</h2>
            <p className="text-sm text-neu-muted mt-1">Revenue and profitability computed from real sales order history.</p>
          </div>
          <button className="neu-btn h-10 px-4 rounded-xl text-xs font-semibold text-neu-muted hover:text-neu-text flex items-center gap-2">
            <Download className="w-4 h-4" />Export report
          </button>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          {kpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <section className="neu-card rounded-2xl overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-neu-text">Profit by Product</h3>
            <p className="text-xs text-neu-muted mt-1">Revenue and net margin, computed from sales order line items</p>
          </div>
          <div className="overflow-x-auto">
            {productProfitability.length === 0 ? (
              <p className="px-6 pb-6 text-xs text-neu-muted">No sales orders yet — profitability will appear here once orders are recorded.</p>
            ) : (
              <table className="w-full text-xs">
                <thead className="text-[10px] tracking-wider text-neu-muted">
                  <tr>
                    <th className="text-left px-6 py-4">PRODUCT</th>
                    <th className="text-right">UNITS SOLD</th>
                    <th className="text-right">REVENUE</th>
                    <th className="text-right">NET PROFIT</th>
                    <th className="text-right pr-6">MARGIN</th>
                  </tr>
                </thead>
                <tbody>
                  {productProfitability.map((p, i) => (
                    <motion.tr
                      key={p.sku}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="hover:bg-black/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-neu-text">{p.name}</div>
                        <div className="text-neu-muted mt-1">{p.sku}</div>
                      </td>
                      <td className="text-right text-neu-text">{p.units_sold.toLocaleString()}</td>
                      <td className="text-right font-semibold text-neu-text">${Number(p.revenue).toLocaleString()}</td>
                      <td className={`text-right font-semibold ${Number(p.net_profit) < 0 ? "text-danger" : "text-success"}`}>
                        {Number(p.net_profit) < 0 ? "-" : ""}${Math.abs(Number(p.net_profit)).toLocaleString()}
                      </td>
                      <td className="text-right pr-6 font-semibold text-neu-text">{p.margin_pct != null ? `${p.margin_pct}%` : "—"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
  );
}
