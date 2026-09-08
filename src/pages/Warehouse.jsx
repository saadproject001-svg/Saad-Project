import { motion } from "framer-motion";
import { Download, Plus, Warehouse as WarehouseIcon } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import CarrierBadge from "../components/CarrierBadge";
import {
  warehouseKpis,
  warehouses,
  incomingShipments,
  outgoingShipments,
  pendingTransfers,
} from "../data/mockData";

const utilBars = [43, 51, 57, 62, 66, 70, 74, 78, 82];
const utilLabels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const utilShades = ["bg-accent/20", "bg-accent/30", "bg-accent/30", "bg-accent/45", "bg-accent/45", "bg-accent/65", "bg-accent/65", "bg-accent", "bg-accent"];

const capacityBarColor = (status) => {
  if (status === "Near Full") return "bg-warning";
  if (status === "Maintenance") return "bg-neu-muted";
  return "bg-accent";
};

export default function Warehouse() {
  usePageTitle("Inventory Overview");
  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider text-neu-muted uppercase">Network operations</div>
            <h2 className="text-xl font-bold tracking-tight mt-1 text-neu-text">Warehouse Distribution</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="neu-btn h-10 px-4 rounded-xl text-xs font-semibold text-neu-muted hover:text-neu-text flex items-center gap-2">
              <Download className="w-4 h-4" />Export report
            </button>
            <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-xs font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />Add warehouse
            </button>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          {warehouseKpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="neu-card rounded-2xl p-6 lg:col-span-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-sm text-neu-text">Warehouse utilization trends</div>
                <div className="text-xs text-neu-muted mt-1">Occupied capacity across the network</div>
              </div>
              <select className="neu-input text-xs rounded-xl px-3 py-2 text-neu-text">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
              </select>
            </div>
            <div className="h-48 flex items-end gap-5 mt-6 px-3">
              {utilBars.map((h, i) => (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-t ${utilShades[i]}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-neu-muted mt-3">
              {utilLabels.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>

          <div className="neu-card rounded-2xl p-6 lg:col-span-4">
            <div className="font-semibold text-sm text-neu-text">Capacity by region</div>
            <div className="flex items-center justify-center relative mt-4">
              <svg viewBox="0 0 160 160" className="w-40 h-40">
                <circle cx="80" cy="80" r="57" className="fill-none stroke-[14] stroke-neu-dark/30 -rotate-90 origin-center" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="57"
                  className="fill-none stroke-[14] stroke-accent -rotate-90 origin-center"
                  initial={{ strokeDasharray: "0 358" }}
                  animate={{ strokeDasharray: "280 358" }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-2xl font-bold text-neu-text">78%</div>
                <div className="text-[10px] text-neu-muted">UTILIZED</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-[11px] text-neu-muted mt-2">
              <span><i className="inline-block w-2 h-2 rounded-full bg-accent mr-2" />North America</span><b className="text-right text-neu-text">48%</b>
              <span><i className="inline-block w-2 h-2 rounded-full bg-accent/50 mr-2" />Europe</span><b className="text-right text-neu-text">22%</b>
              <span><i className="inline-block w-2 h-2 rounded-full bg-accent/25 mr-2" />Asia Pacific</span><b className="text-right text-neu-text">18%</b>
            </div>
          </div>
        </section>

        <section className="neu-card rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <div>
              <div className="font-semibold text-sm text-neu-text">Warehouse network</div>
              <div className="text-xs text-neu-muted mt-1">Capacity and inventory overview by location</div>
            </div>
            <button className="text-xs text-accent font-semibold">View all warehouses</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {warehouses.map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                className="neu-raised rounded-2xl p-4 transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center"><WarehouseIcon className="w-5 h-5" /></div>
                  <StatusBadge status={w.status} className="px-2 py-1" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="font-semibold text-sm text-neu-text">{w.name}</span>
                </div>
                <span
                  className={`inline-block mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    w.type === "Amazon FBA" ? "bg-warning/15 text-warning" : "bg-neu-dark/15 text-neu-muted"
                  }`}
                >
                  {w.type}
                </span>
                <div className="text-xs text-neu-muted mt-1.5">{w.city}</div>
                <div className="flex justify-between text-[11px] mt-5 mb-2"><span className="text-neu-muted">Capacity</span><b className="text-neu-text">{w.capacityPct}%</b></div>
                <div className="h-2 neu-track rounded-full overflow-hidden">
                  <motion.div
                    className={`h-2 rounded-full ${capacityBarColor(w.status)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${w.capacityPct}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-neu-muted mt-3"><span>{w.products}</span><span>{w.value}</span></div>
                <button className="neu-btn w-full mt-4 h-8 rounded-xl text-[11px] font-semibold text-neu-muted hover:text-neu-text">View details</button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="neu-card rounded-2xl overflow-hidden lg:col-span-7">
            <div className="p-6 flex justify-between">
              <div className="font-semibold text-sm text-neu-text">Incoming shipments</div>
              <button className="text-xs text-accent font-semibold">View all</button>
            </div>
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">SHIPMENT</th><th className="text-left">SUPPLIER</th><th className="text-left">CARRIER</th><th className="text-left">WAREHOUSE</th><th className="text-left">ETA</th><th className="text-left">QTY</th></tr>
              </thead>
              <tbody>
                {incomingShipments.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="hover:bg-black/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-neu-text">{s.id}</td>
                    <td className="text-neu-text">{s.supplier}</td>
                    <td><CarrierBadge carrier={s.carrier} /></td>
                    <td className="text-neu-text">{s.warehouse}</td>
                    <td className="text-neu-muted">{s.eta}</td>
                    <td className="font-semibold text-neu-text">{s.qty.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="neu-card rounded-2xl overflow-hidden lg:col-span-5">
            <div className="p-6 flex justify-between">
              <div className="font-semibold text-sm text-neu-text">Outgoing shipments</div>
              <button className="text-xs text-accent font-semibold">View all</button>
            </div>
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">ORDER</th><th className="text-left">DESTINATION</th><th className="text-left">CARRIER</th><th className="text-left">QTY</th><th className="text-left">STATUS</th></tr>
              </thead>
              <tbody>
                {outgoingShipments.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="hover:bg-black/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-neu-text">{s.id}</td>
                    <td className="text-neu-text">{s.destination}</td>
                    <td><CarrierBadge carrier={s.carrier} /></td>
                    <td className="text-neu-text">{s.qty}</td>
                    <td><StatusBadge status={s.status} className="px-2 py-1" /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="neu-card rounded-2xl overflow-hidden">
          <div className="p-6 flex justify-between items-center flex-wrap gap-3">
            <div>
              <div className="font-semibold text-sm text-neu-text">Pending transfers</div>
              <div className="text-xs text-neu-muted mt-1">Inventory movement awaiting approval or receipt</div>
            </div>
            <button className="neu-btn h-9 px-4 rounded-xl text-xs font-semibold text-neu-muted hover:text-neu-text">Manage transfers</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">TRANSFER ID</th><th className="text-left">SOURCE WAREHOUSE</th><th className="text-left">DESTINATION</th><th className="text-left">ITEMS</th><th className="text-left">REQUESTED</th><th className="text-left">STATUS</th><th className="text-left">ACTION</th></tr>
              </thead>
              <tbody>
                {pendingTransfers.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="hover:bg-black/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-neu-text">{t.id}</td>
                    <td className="text-neu-text">{t.source}</td>
                    <td className="text-neu-text">{t.destination}</td>
                    <td className="text-neu-text">{t.items}</td>
                    <td className="text-neu-muted">{t.requested}</td>
                    <td><StatusBadge status={t.status} className="px-2 py-1" /></td>
                    <td><button className="text-accent font-semibold">{t.action}</button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
  );
}
