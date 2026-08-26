import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  kpiOverview,
  stockByCategory,
  quantityBySupplier,
  stockMovementType,
  topProducts,
  fulfillmentSplit,
} from "../data/mockData";

const quarterBars = [37, 56, 46, 75, 91, 66, 80];
const quarterLabels = ["Q1 23", "Q2 23", "Q3 23", "Q4 23", "Q1 24", "Q2 24", "Q3 24"];
const barShades = ["bg-indigo-100", "bg-indigo-200", "bg-indigo-200", "bg-indigo-300", "bg-indigo-400", "bg-indigo-300", "bg-indigo-400"];

export default function Dashboard() {
  return (
    <Layout title="Inventory Overview">
      <div className="p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
          {kpiOverview.map((kpi, i) => (
            <StatCard key={kpi.label} {...kpi} index={i} />
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 lg:col-span-4 h-[397px] shadow-[0_3px_12px_rgba(30,41,59,.07)]">
            <div className="font-semibold text-sm">Stock Quantity Trends</div>
            <div className="text-xs text-slate-400 mt-1">By Year, Quarter, Month (2023-2025)</div>
            <div className="h-[275px] flex items-end gap-2 mt-5 px-2 border-b border-slate-100">
              {quarterBars.map((h, i) => (
                <motion.div
                  key={i}
                  className={`w-7 rounded-t ${barShades[i]}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-3">
              {quarterLabels.map((q) => (
                <span key={q}>{q}</span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 lg:col-span-4 h-[397px] shadow-[0_3px_12px_rgba(30,41,59,.07)]">
            <div className="font-semibold text-sm">Quantity by Region &amp; Warehouse</div>
            <div className="flex justify-center mt-12 relative">
              <svg viewBox="0 0 160 160" className="w-44 h-44">
                <circle cx="80" cy="80" r="57" className="fill-none stroke-[14] stroke-[#cbd5fb] -rotate-90 origin-center" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="57"
                  strokeDasharray="358 358"
                  className="fill-none stroke-[14] stroke-indigo-500 -rotate-90 origin-center"
                  initial={{ strokeDasharray: "0 358" }}
                  animate={{ strokeDasharray: "161 358" }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                />
              </svg>
              <div className="absolute top-16 text-center">
                <div className="text-2xl font-bold">124k</div>
                <div className="text-[10px] text-slate-400">UNITS</div>
              </div>
            </div>
            <div className="flex gap-8 text-xs text-slate-500 mt-7">
              <span><i className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2" />North America<br /><span className="ml-4">(45%)</span></span>
              <span><i className="inline-block w-2 h-2 rounded-full bg-indigo-300 mr-2" />Europe (30%)</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 lg:col-span-4 h-[397px] shadow-[0_3px_12px_rgba(30,41,59,.07)]">
            <div className="font-semibold text-sm mb-6">Quantity by Category</div>
            <div className="space-y-5 text-xs">
              {stockByCategory.map((c, i) => (
                <div key={c.name}>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>{c.name}</span>
                    <b>{c.value.toLocaleString()}</b>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden">
                    <motion.div
                      className="h-2 bg-indigo-500 rounded"
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
          <div className="bg-white rounded-xl lg:col-span-8 overflow-hidden shadow-[0_3px_12px_rgba(30,41,59,.07)]">
            <div className="p-6 flex justify-between">
              <div className="font-semibold text-sm">Product Details by KPI Measure</div>
              <Link to="/inventory" className="text-xs text-indigo-600 font-semibold">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[10px] tracking-wider text-slate-400">
                  <tr>
                    <th className="text-left px-6 py-4">PRODUCT ID</th>
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
                      className={i < topProducts.length - 1 ? "border-b border-slate-100" : ""}
                    >
                      <td className="px-6 py-4 text-slate-400">#{p.sku}</td>
                      <td className="font-semibold">{p.name}</td>
                      <td>{p.category}</td>
                      <td className="font-semibold">{p.stock.toLocaleString()}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td className="text-slate-400"><ExternalLink className="w-4 h-4" /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
              <div className="font-semibold text-sm mb-6">Quantity by Supplier</div>
              <div className="space-y-4 text-[11px]">
                {quantityBySupplier.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="text-slate-400">{s.value.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 mt-1 rounded overflow-hidden">
                      <motion.div
                        className={`h-1.5 rounded ${s.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
              <div className="font-semibold text-sm mb-5">Stock Movement Type</div>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="fill-none stroke-[14] stroke-indigo-400 -rotate-90 origin-center"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">100%</span>
                </div>
                <div className="space-y-2 text-[11px] w-full">
                  {stockMovementType.map((s) => (
                    <div key={s.name} className="flex justify-between">
                      <span><i className={`inline-block w-2 h-2 rounded-full mr-2 ${s.color}`} />{s.name}</span>
                      <b>{s.pct}%</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
              <div className="font-semibold text-sm mb-6">Fulfillment Mix</div>
              <div className="space-y-4 text-[11px]">
                {fulfillmentSplit.map((f, i) => (
                  <div key={f.name}>
                    <div className="flex justify-between">
                      <span>{f.name}</span>
                      <span className="text-slate-400">{f.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 mt-1 rounded overflow-hidden">
                      <motion.div
                        className={`h-1.5 rounded ${f.color}`}
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
    </Layout>
  );
}
