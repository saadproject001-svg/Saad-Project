import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Layers, FilePlus, Search, SlidersHorizontal } from "lucide-react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import Pagination from "../components/Pagination";
import { lowStockKpis, lowStockItems } from "../data/mockData";

export default function LowStockAlert() {
  const [page, setPage] = useState(1);
  const critical = lowStockItems.filter((i) => i.severity === "critical").length;
  const warning = lowStockItems.filter((i) => i.severity === "warning").length;

  return (
    <Layout title="Inventory Overview">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider text-slate-400 uppercase mb-2">Inventory / Alerts</div>
            <h2 className="text-xl font-bold tracking-tight">Low Stock Alert</h2>
            <p className="text-sm text-slate-500 mt-1">Review products below their reorder point and replenish before availability is impacted.</p>
          </div>
          <div className="flex gap-3">
            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 flex items-center gap-2 hover:border-indigo-300">
              <Download className="w-4 h-4" />Export
            </button>
            <button className="h-10 px-4 rounded-lg bg-[#6366ed] text-white text-sm font-medium flex items-center gap-2 hover:bg-indigo-600">
              <Layers className="w-4 h-4" />Bulk Reorder
            </button>
            <button className="h-10 px-4 rounded-lg bg-[#10192d] text-white text-sm font-medium flex items-center gap-2 hover:bg-slate-800">
              <FilePlus className="w-4 h-4" />Create PO
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {lowStockKpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <div className="bg-white rounded-xl p-4 shadow-[0_3px_12px_rgba(30,41,59,.07)] mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-[330px]">
              <Search className="absolute left-3 top-2.5 w-[18px] h-[18px] text-slate-400" />
              <input className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#f8f9fb] text-sm outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Search product or SKU..." />
            </div>
            <select className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Home Appliances</option>
            </select>
            <select className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white">
              <option>All Warehouses</option>
              <option>Main Distribution Center</option>
              <option>East Coast Warehouse</option>
              <option>European Warehouse</option>
            </select>
            <select className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white">
              <option>All Suppliers</option>
              <option>Global Logistics Co.</option>
              <option>Prime Parts Inc.</option>
              <option>TechSource International</option>
            </select>
            <button className="ml-auto h-10 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 flex items-center gap-2 hover:border-indigo-300">
              <SlidersHorizontal className="w-4 h-4" />Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-[0_3px_12px_rgba(30,41,59,.07)]">
          <div className="p-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-sm">Products Requiring Restock</h3>
              <p className="text-xs text-slate-400 mt-1">{lowStockItems.length} products need attention across 5 warehouses</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-red-400" />Critical {critical}</span>
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-amber-400" />Warning {warning}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[1250px]">
              <thead className="bg-slate-50 text-[10px] tracking-wider text-slate-400">
                <tr>
                  <th className="text-left px-6 py-4"><input type="checkbox" /></th>
                  <th className="text-left">PRODUCT</th>
                  <th className="text-left">SKU</th>
                  <th className="text-left">CATEGORY</th>
                  <th className="text-left">WAREHOUSE</th>
                  <th className="text-left">CURRENT STOCK</th>
                  <th className="text-left">REORDER POINT</th>
                  <th className="text-left">SHORTFALL</th>
                  <th className="text-left">RECOMMENDED ORDER</th>
                  <th className="text-left">UNIT COST</th>
                  <th className="text-left">LEAD TIME</th>
                  <th className="text-left">SUPPLIER</th>
                  <th className="text-left">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, i) => {
                  const tone = item.severity === "critical" ? "text-red-500" : "text-amber-600";
                  return (
                    <motion.tr
                      key={item.sku}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className={`hover:bg-slate-50 ${i < lowStockItems.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <td className="px-6 py-4"><input type="checkbox" /></td>
                      <td className="font-semibold">{item.name}</td>
                      <td className="text-slate-400">{item.sku}</td>
                      <td>{item.category}</td>
                      <td>{item.warehouse}</td>
                      <td className={`font-semibold ${tone}`}>{item.stock}</td>
                      <td>{item.reorderPoint}</td>
                      <td className={`font-semibold ${tone}`}>{item.shortfall}</td>
                      <td className="font-semibold">{item.recommended}</td>
                      <td>${item.unitCost.toFixed(2)}</td>
                      <td>{item.leadTime}</td>
                      <td>{item.supplier}</td>
                      <td><button className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100">Reorder</button></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-400">Showing 1–{lowStockItems.length} of 24 products</span>
            <Pagination page={page} totalPages={3} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
