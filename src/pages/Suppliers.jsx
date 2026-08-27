import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Upload,
  Download,
  SlidersHorizontal,
  Search,
  ListFilter,
  Globe2,
  Columns3,
  Truck,
  Boxes,
  Package,
  Cpu,
  Eye,
  Pencil,
  Mail,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import { suppliers, supplierKpis } from "../data/mockData";

const ICONS = { Truck, Boxes, Package, Cpu, Globe2 };

export default function Suppliers() {
  usePageTitle("Inventory Overview");
  const [page, setPage] = useState(1);

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider text-slate-400 uppercase mb-2">Procurement network</div>
            <h2 className="text-2xl font-bold tracking-tight">Supplier Management</h2>
            <p className="text-sm text-slate-500 mt-1">Monitor supplier relationships, purchasing activity, and delivery performance.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="h-10 px-4 rounded-lg bg-[#6366ed] text-white text-sm font-semibold flex items-center gap-2 shadow-sm hover:bg-indigo-700">
              <Plus className="w-4 h-4" />Add Supplier
            </button>
            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
              <Upload className="w-4 h-4" />Import Suppliers
            </button>
            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
              <Download className="w-4 h-4" />Export
            </button>
            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
              <SlidersHorizontal className="w-4 h-4" />Filter
            </button>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-6">
          {supplierKpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <section className="bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input className="w-64 h-9 rounded-lg bg-[#f8f9fb] pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Search suppliers..." />
              </div>
              <button className="h-9 px-3 rounded-lg text-xs text-slate-600 border border-slate-200 flex items-center gap-2">
                <ListFilter className="w-4 h-4" />All statuses
              </button>
              <button className="h-9 px-3 rounded-lg text-xs text-slate-600 border border-slate-200 flex items-center gap-2">
                <Globe2 className="w-4 h-4" />All countries
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{suppliers.length} suppliers</span>
              <button className="text-slate-400 hover:text-slate-700"><Columns3 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[1250px]">
              <thead className="bg-slate-50 text-[10px] tracking-wider text-slate-400">
                <tr>
                  <th className="text-left px-5 py-4 w-10"><input type="checkbox" className="accent-indigo-500" /></th>
                  <th className="text-left py-4">SUPPLIER ID</th>
                  <th className="text-left">SUPPLIER NAME</th>
                  <th className="text-left">CONTACT PERSON</th>
                  <th className="text-left">EMAIL</th>
                  <th className="text-left">PHONE</th>
                  <th className="text-left">COUNTRY</th>
                  <th className="text-left">PRODUCTS</th>
                  <th className="text-left">ORDERS</th>
                  <th className="text-left">PURCHASE VALUE</th>
                  <th className="text-left">OUTSTANDING</th>
                  <th className="text-left">LEAD TIME</th>
                  <th className="text-left">RATING</th>
                  <th className="text-left">LAST ORDER</th>
                  <th className="text-left">STATUS</th>
                  <th className="text-left pr-5">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s, i) => {
                  const Icon = ICONS[s.icon] || Truck;
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className={`hover:bg-indigo-50/30 ${i < suppliers.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <td className="px-5 py-5"><input type="checkbox" className="accent-indigo-500" /></td>
                      <td className="text-slate-400">#{s.id}</td>
                      <td className="font-semibold">
                        <div className="flex items-center gap-3">
                          <motion.div whileHover={{ scale: 1.1 }} className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.iconBg}`}><Icon className="w-4 h-4" /></motion.div>
                          {s.name}
                        </div>
                      </td>
                      <td>{s.contact}</td>
                      <td className="text-slate-500">{s.email}</td>
                      <td className="text-slate-500">{s.phone}</td>
                      <td>{s.country}</td>
                      <td className="font-semibold">{s.products}</td>
                      <td>{s.orders}</td>
                      <td className="font-semibold">{s.purchaseValue}</td>
                      <td>{s.outstanding}</td>
                      <td>{s.leadTime}</td>
                      <td><span className="text-amber-500">★</span> <b>{s.rating}</b></td>
                      <td className="text-slate-500">{s.lastOrder}</td>
                      <td><StatusBadge status={s.status} /></td>
                      <td className="pr-5">
                        <div className="flex items-center gap-3 text-slate-400">
                          <button className="hover:text-indigo-600"><Eye className="w-4 h-4" /></button>
                          <button className="hover:text-indigo-600"><Pencil className="w-4 h-4" /></button>
                          <button className="hover:text-indigo-600"><Mail className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-400">Showing <b className="text-slate-600">1–{suppliers.length}</b> of 45 suppliers</div>
            <Pagination page={page} totalPages={9} onPageChange={setPage} />
          </div>
        </section>
      </div>
  );
}
