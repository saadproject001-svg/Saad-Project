import { motion } from "framer-motion";
import { Plus, Upload, Download, SlidersHorizontal, Search, ListFilter, Globe2, Columns3, Eye, Pencil, Mail } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { listSuppliers } from "../lib/endpoints";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const ICON_BG = ["bg-accent/15 text-accent", "bg-warning/15 text-warning", "bg-success/15 text-success", "bg-danger/15 text-danger"];

export default function Suppliers() {
  usePageTitle("Inventory Overview");
  const { data: suppliers, loading, error, refetch } = useApi(listSuppliers, []);

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingState label="Loading suppliers..." /></div>;
  if (error) return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={refetch} /></div>;

  const totalPurchaseValue = suppliers.reduce((sum, s) => sum + Number(s.purchase_value), 0);
  const avgLeadTime = suppliers.length ? Math.round(suppliers.reduce((sum, s) => sum + s.lead_time_days, 0) / suppliers.length) : 0;
  const active = suppliers.filter((s) => s.status === "Active").length;
  const kpis = [
    { label: "Total Suppliers", value: String(suppliers.length) },
    { label: "Active Suppliers", value: String(active) },
    { label: "Total Purchase Value", value: `$${totalPurchaseValue.toLocaleString()}` },
    { label: "Avg. Lead Time", value: `${avgLeadTime} days` },
  ];

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider text-neu-muted uppercase mb-2">Procurement network</div>
            <h2 className="text-2xl font-bold tracking-tight text-neu-text">Supplier Management</h2>
            <p className="text-sm text-neu-muted mt-1">Monitor supplier relationships, purchasing activity, and delivery performance.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />Add Supplier
            </button>
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <Upload className="w-4 h-4" />Import Suppliers
            </button>
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <Download className="w-4 h-4" />Export
            </button>
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />Filter
            </button>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          {kpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <section className="neu-card rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neu-muted" />
                <input className="neu-input w-64 h-9 rounded-xl pl-9 pr-3 text-xs text-neu-text outline-none" placeholder="Search suppliers..." />
              </div>
              <button className="neu-btn h-9 px-3 rounded-xl text-xs text-neu-muted hover:text-neu-text flex items-center gap-2">
                <ListFilter className="w-4 h-4" />All statuses
              </button>
              <button className="neu-btn h-9 px-3 rounded-xl text-xs text-neu-muted hover:text-neu-text flex items-center gap-2">
                <Globe2 className="w-4 h-4" />All countries
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-neu-muted">
              <span>{suppliers.length} suppliers</span>
              <button className="text-neu-muted hover:text-neu-text"><Columns3 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[1150px]">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr>
                  <th className="text-left px-5 py-4 w-10"><input type="checkbox" className="accent-[#2FAE72]" /></th>
                  <th className="text-left py-4">SUPPLIER NAME</th>
                  <th className="text-left">CONTACT PERSON</th>
                  <th className="text-left">EMAIL</th>
                  <th className="text-left">PHONE</th>
                  <th className="text-left">COUNTRY</th>
                  <th className="text-left">PRODUCTS</th>
                  <th className="text-left">ORDERS</th>
                  <th className="text-left">PURCHASE VALUE</th>
                  <th className="text-left">LEAD TIME</th>
                  <th className="text-left">RATING</th>
                  <th className="text-left">STATUS</th>
                  <th className="text-left pr-5">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="hover:bg-black/[0.03] transition-colors"
                  >
                    <td className="px-5 py-5"><input type="checkbox" className="accent-[#2FAE72]" /></td>
                    <td className="font-semibold">
                      <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.1 }} className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${ICON_BG[i % ICON_BG.length]}`}>
                          {s.icon || "🚚"}
                        </motion.div>
                        <span className="text-neu-text">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-neu-text">{s.contact_name ?? "—"}</td>
                    <td className="text-neu-muted">{s.email ?? "—"}</td>
                    <td className="text-neu-muted">{s.phone ?? "—"}</td>
                    <td className="text-neu-text">{s.country ?? "—"}</td>
                    <td className="font-semibold text-neu-text">{s.product_count}</td>
                    <td className="text-neu-text">{s.order_count}</td>
                    <td className="font-semibold text-neu-text">${Number(s.purchase_value).toLocaleString()}</td>
                    <td className="text-neu-text">{s.lead_time_days}d</td>
                    <td><span className="text-warning">★</span> <b className="text-neu-text">{s.rating}</b></td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="pr-5">
                      <div className="flex items-center gap-3 text-neu-muted">
                        <button className="hover:text-accent"><Eye className="w-4 h-4" /></button>
                        <button className="hover:text-accent"><Pencil className="w-4 h-4" /></button>
                        <button className="hover:text-accent"><Mail className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 text-xs text-neu-muted">
            Showing <b className="text-neu-text">{suppliers.length}</b> of <b className="text-neu-text">{suppliers.length}</b> suppliers
          </div>
        </section>
      </div>
  );
}
