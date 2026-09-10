import { motion } from "framer-motion";
import { Download, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  profitKpis,
  productProfitability,
  advertisingStats,
  refunds,
  cashFlowProjection,
  storageFeeAlert,
} from "../data/mockData";

export default function Analytics() {
  usePageTitle("Inventory Overview");
  const spendPct = Math.round((advertisingStats.spend / advertisingStats.sales) * 100);

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider text-neu-muted uppercase">Business performance</div>
            <h2 className="text-xl font-bold tracking-tight mt-1 text-neu-text">Profit &amp; Performance Analytics</h2>
            <p className="text-sm text-neu-muted mt-1">Profit, advertising, refunds and cash flow across your Amazon business.</p>
          </div>
          <button className="neu-btn h-10 px-4 rounded-xl text-xs font-semibold text-neu-muted hover:text-neu-text flex items-center gap-2">
            <Download className="w-4 h-4" />Export report
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl neu-raised p-4 mb-6 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-neu-text">Storage fee alert</div>
            <p className="text-xs text-neu-muted mt-1">{storageFeeAlert.message}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-warning">{storageFeeAlert.amount}</div>
            <div className="text-[10px] text-warning">Due {storageFeeAlert.dueDate}</div>
          </div>
        </motion.div>

        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-6">
          {profitKpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="neu-card rounded-2xl p-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-neu-text">Cash Flow Projection</h3>
                <p className="text-xs text-neu-muted mt-1">Next 30 days, based on current sales velocity</p>
              </div>
            </div>
            <div className="flex items-center gap-5 mb-5">
              <div>
                <div className="text-2xl font-bold text-neu-text">{cashFlowProjection.currentBalance}</div>
                <div className="text-xs text-neu-muted">Current balance</div>
              </div>
              <div className="text-xs text-success bg-success/15 px-2 py-1 rounded-full">
                {cashFlowProjection.deltaPct} → {cashFlowProjection.projected30d} projected
              </div>
            </div>
            <div className="h-48 relative">
              <svg viewBox="0 0 700 190" preserveAspectRatio="none" className="absolute inset-0 w-full h-[190px]">
                <defs>
                  <linearGradient id="cashFlowArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4CAF7D" stopOpacity=".18" />
                    <stop offset="100%" stopColor="#4CAF7D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  fill="url(#cashFlowArea)"
                  d={`${cashFlowProjection.path} L700 190 L0 190 Z`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                />
                <motion.path
                  fill="none"
                  stroke="#4CAF7D"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={cashFlowProjection.path}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute left-0 right-0 bottom-0 flex justify-between text-[10px] text-neu-muted">
                <span>Today</span><span>+10d</span><span>+20d</span><span>+30d</span>
              </div>
            </div>
          </div>

          <div className="neu-card rounded-2xl p-6 lg:col-span-5">
            <h3 className="text-sm font-semibold mb-5 text-neu-text">Advertising Performance</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-neu-muted flex items-center gap-1">ACOS <TrendingDown className="w-3 h-3 text-success" /></div>
                <div className="text-2xl font-bold mt-1 text-neu-text">{advertisingStats.acos}%</div>
              </div>
              <div>
                <div className="text-xs text-neu-muted flex items-center gap-1">TACOS <TrendingUp className="w-3 h-3 text-success" /></div>
                <div className="text-2xl font-bold mt-1 text-neu-text">{advertisingStats.tacos}%</div>
              </div>
            </div>
            <div className="space-y-4 text-[11px] text-neu-text">
              <div>
                <div className="flex justify-between mb-1"><span>Ad Spend</span><b>${advertisingStats.spend.toLocaleString()}</b></div>
                <div className="h-2 neu-track rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 bg-danger rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${spendPct}%` }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span>Attributed Sales</span><b>${advertisingStats.sales.toLocaleString()}</b></div>
                <div className="h-2 neu-track rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 bg-success rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="neu-card rounded-2xl overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-neu-text">Profit by Product</h3>
            <p className="text-xs text-neu-muted mt-1">Revenue, fees and net margin across your catalog</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr>
                  <th className="text-left px-6 py-4">PRODUCT</th>
                  <th className="text-right">UNITS SOLD</th>
                  <th className="text-right">REVENUE</th>
                  <th className="text-right">AMAZON FEES</th>
                  <th className="text-right">AD SPEND</th>
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
                    <td className="text-right text-neu-text">{p.unitsSold.toLocaleString()}</td>
                    <td className="text-right font-semibold text-neu-text">${p.revenue.toLocaleString()}</td>
                    <td className="text-right text-neu-muted">${p.amazonFees.toLocaleString()}</td>
                    <td className="text-right text-neu-muted">${p.adSpend.toLocaleString()}</td>
                    <td className={`text-right font-semibold ${p.netProfit < 0 ? "text-danger" : "text-success"}`}>
                      {p.netProfit < 0 ? "-" : ""}${Math.abs(p.netProfit).toLocaleString()}
                    </td>
                    <td className="text-right pr-6 font-semibold text-neu-text">{p.marginPct}%</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="neu-card rounded-2xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-neu-text">Refunds &amp; Returns</h3>
            <p className="text-xs text-neu-muted mt-1">Recent return activity and reasons</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr>
                  <th className="text-left px-6 py-4">ORDER</th>
                  <th className="text-left">PRODUCT</th>
                  <th className="text-left">REASON</th>
                  <th className="text-left">AMOUNT</th>
                  <th className="text-left">DATE</th>
                  <th className="text-left">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((r, i) => (
                  <motion.tr
                    key={r.orderId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="hover:bg-black/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-neu-text">{r.orderId}</td>
                    <td className="text-neu-text">{r.product}</td>
                    <td className="text-neu-muted">{r.reason}</td>
                    <td className="font-semibold text-neu-text">{r.amount}</td>
                    <td className="text-neu-muted">{r.date}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
  );
}
