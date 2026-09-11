import { Fragment } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Warehouse as WarehouseIcon } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { getWarehouseSummary } from "../lib/endpoints";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import CarrierBadge from "../components/CarrierBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const capacityBarColor = (pct) => {
  if (pct == null) return "bg-neu-muted";
  if (pct >= 90) return "bg-warning";
  return "bg-accent";
};

export default function Warehouse() {
  usePageTitle("Inventory Overview");
  const { data, loading, error, refetch } = useApi(getWarehouseSummary, []);

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingState label="Loading warehouses..." /></div>;
  if (error) return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={refetch} /></div>;

  const { warehouses, incoming_shipments: incoming, outgoing_shipments: outgoing, pending_transfers: transfers } = data;

  const totalValue = warehouses.reduce((sum, w) => sum + w.total_value, 0);
  const capacities = warehouses.map((w) => w.capacity_used_pct).filter((v) => v != null);
  const avgCapacity = capacities.length ? Math.round(capacities.reduce((a, b) => a + b, 0) / capacities.length) : 0;
  const kpis = [
    { label: "Total Warehouses", value: String(warehouses.length) },
    { label: "Total Stock Value", value: `$${totalValue.toLocaleString()}` },
    { label: "Avg. Capacity Used", value: `${avgCapacity}%` },
    { label: "Active Warehouses", value: String(warehouses.filter((w) => w.status === "Active").length) },
  ];
  const byCapacity = [...warehouses].sort((a, b) => (b.capacity_used_pct ?? 0) - (a.capacity_used_pct ?? 0));

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
          {kpis.map((k, i) => (
            <StatCard key={k.label} {...k} index={i} />
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="neu-card rounded-2xl p-6 lg:col-span-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-sm text-neu-text">Capacity used by warehouse</div>
                <div className="text-xs text-neu-muted mt-1">Occupied capacity across the network</div>
              </div>
            </div>
            <div className="h-48 flex items-end gap-5 mt-6 px-3">
              {byCapacity.map((w, i) => (
                <div key={w.id} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full rounded-t bg-accent"
                    initial={{ height: 0 }}
                    animate={{ height: `${w.capacity_used_pct ?? 0}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                    style={{ maxHeight: "160px" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-neu-muted mt-3">
              {byCapacity.map((w) => <span key={w.id} className="truncate max-w-[70px]">{w.name}</span>)}
            </div>
          </div>

          <div className="neu-card rounded-2xl p-6 lg:col-span-4">
            <div className="font-semibold text-sm text-neu-text">Network capacity</div>
            <div className="flex items-center justify-center relative mt-4">
              <svg viewBox="0 0 160 160" className="w-40 h-40">
                <circle cx="80" cy="80" r="57" className="fill-none stroke-[14] stroke-neu-dark/30 -rotate-90 origin-center" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="57"
                  className="fill-none stroke-[14] stroke-accent -rotate-90 origin-center"
                  initial={{ strokeDasharray: "0 358" }}
                  animate={{ strokeDasharray: `${(avgCapacity / 100) * 358} 358` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-2xl font-bold text-neu-text">{avgCapacity}%</div>
                <div className="text-[10px] text-neu-muted">UTILIZED</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-[11px] text-neu-muted mt-4">
              {byCapacity.slice(0, 4).map((w) => (
                <Fragment key={w.id}>
                  <span><i className="inline-block w-2 h-2 rounded-full bg-accent mr-2" />{w.name}</span>
                  <b className="text-right text-neu-text">{w.capacity_used_pct ?? 0}%</b>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="neu-card rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <div>
              <div className="font-semibold text-sm text-neu-text">Warehouse network</div>
              <div className="text-xs text-neu-muted mt-1">Capacity and inventory overview by location</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {warehouses.map((w, i) => (
              <motion.div
                key={w.id}
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
                <div className="text-xs text-neu-muted mt-1.5">{w.city ?? "—"}</div>
                <div className="flex justify-between text-[11px] mt-5 mb-2"><span className="text-neu-muted">Capacity</span><b className="text-neu-text">{w.capacity_used_pct ?? "—"}{w.capacity_used_pct != null ? "%" : ""}</b></div>
                <div className="h-2 neu-track rounded-full overflow-hidden">
                  <motion.div
                    className={`h-2 rounded-full ${capacityBarColor(w.capacity_used_pct)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${w.capacity_used_pct ?? 0}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-neu-muted mt-3"><span>{w.product_count} products</span><span>${w.total_value.toLocaleString()}</span></div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="neu-card rounded-2xl overflow-hidden lg:col-span-7">
            <div className="p-6 flex justify-between">
              <div className="font-semibold text-sm text-neu-text">Incoming shipments</div>
            </div>
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">ORDER</th><th className="text-left">SUPPLIER</th><th className="text-left">CARRIER</th><th className="text-left">WAREHOUSE</th><th className="text-left">ETA</th><th className="text-left">QTY</th></tr>
              </thead>
              <tbody>
                {incoming.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }} className="hover:bg-black/[0.03] transition-colors">
                    <td className="px-6 py-4 font-semibold text-neu-text">{s.order_number}</td>
                    <td className="text-neu-text">{s.counterparty_or_destination}</td>
                    <td><CarrierBadge carrier={s.carrier} /></td>
                    <td className="text-neu-text">{s.warehouse_name ?? "—"}</td>
                    <td className="text-neu-muted">{s.eta ?? "—"}</td>
                    <td className="font-semibold text-neu-text">{s.quantity.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="neu-card rounded-2xl overflow-hidden lg:col-span-5">
            <div className="p-6 flex justify-between">
              <div className="font-semibold text-sm text-neu-text">Outgoing shipments</div>
            </div>
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">ORDER</th><th className="text-left">DESTINATION</th><th className="text-left">CARRIER</th><th className="text-left">QTY</th><th className="text-left">STATUS</th></tr>
              </thead>
              <tbody>
                {outgoing.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }} className="hover:bg-black/[0.03] transition-colors">
                    <td className="px-6 py-4 font-semibold text-neu-text">{s.order_number}</td>
                    <td className="text-neu-text">{s.counterparty_or_destination}</td>
                    <td><CarrierBadge carrier={s.carrier} /></td>
                    <td className="text-neu-text">{s.quantity}</td>
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
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">TRANSFER</th><th className="text-left">DESTINATION</th><th className="text-left">ITEMS</th><th className="text-left">STATUS</th></tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }} className="hover:bg-black/[0.03] transition-colors">
                    <td className="px-6 py-4 font-semibold text-neu-text">{t.order_number}</td>
                    <td className="text-neu-text">{t.warehouse_name ?? t.counterparty_or_destination}</td>
                    <td className="text-neu-text">{t.quantity}</td>
                    <td><StatusBadge status={t.status} className="px-2 py-1" /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
  );
}
