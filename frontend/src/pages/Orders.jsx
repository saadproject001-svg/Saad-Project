import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Download, Plus, Search, Eye, MoreHorizontal, Flag, ChevronDown, ChevronRight } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { listOrders, getOrderKpis, getCarrierPerformance } from "../lib/endpoints";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import CarrierBadge from "../components/CarrierBadge";
import DeliveryTimeline from "../components/DeliveryTimeline";
import Pagination from "../components/Pagination";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const TABS = [
  { key: "all", label: "All Orders", type: undefined },
  { key: "purchase", label: "Purchase Orders", type: "Purchase" },
  { key: "sales", label: "Sales Orders", type: "Sales" },
  { key: "transfers", label: "Transfers", type: "Transfer" },
];

const TYPE_STYLE = {
  Purchase: "bg-accent/15 text-accent",
  Sales: "bg-neu-dark/15 text-neu-muted",
  Transfer: "bg-accent-2/15 text-accent-2",
};

const priorityStyle = (p) => (p === "High" || p === "Urgent" ? "text-danger font-semibold flex items-center gap-1" : "text-neu-muted");

export default function Orders() {
  usePageTitle("Inventory Overview");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const activeType = TABS.find((t) => t.key === activeTab)?.type;
  const { data: kpis } = useApi(getOrderKpis, []);
  const { data: carrierPerformance } = useApi(getCarrierPerformance, []);
  const {
    data: ordersPage,
    loading,
    error,
    refetch,
  } = useApi(() => listOrders({ page, pageSize: 20, type: activeType }), [page, activeType]);

  return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-neu-muted mb-1">Operations / Orders</div>
            <h2 className="text-xl font-bold tracking-tight text-neu-text">Orders Management</h2>
            <p className="text-sm text-neu-muted mt-1">Track purchasing, sales and transfers across your network.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />Filter
            </button>
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <Download className="w-4 h-4" />Export
            </button>
            <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />Create Order
            </button>
          </div>
        </div>

        {kpis && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {kpis.map((k, i) => (
              <StatCard key={k.label} {...k} size="sm" index={i} />
            ))}
          </section>
        )}

        {carrierPerformance && carrierPerformance.length > 0 && (
          <section className="neu-card rounded-2xl p-4 mb-6">
            <div className="text-xs font-semibold text-neu-muted mb-3">Deliveries by carrier</div>
            <div className="flex flex-wrap gap-3">
              {carrierPerformance.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-center gap-2 rounded-xl neu-soft px-3 py-2"
                >
                  <CarrierBadge carrier={c.name} />
                  <span className="text-[11px] text-neu-muted">{c.shipments} shipments</span>
                  <span className="text-[11px] font-semibold text-success">{c.on_time_pct}% on-time</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <div className="neu-card rounded-2xl overflow-hidden">
          <div className="px-6 pt-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-6 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setActiveTab(t.key);
                      setPage(1);
                    }}
                    className={`relative pb-4 text-sm whitespace-nowrap ${
                      activeTab === t.key ? "text-accent font-semibold" : "text-neu-muted hover:text-accent"
                    }`}
                  >
                    {t.label}
                    {activeTab === t.key ? (
                      <motion.span
                        layoutId="ordersTabUnderline"
                        className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    ) : (
                      <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-transparent" />
                    )}
                  </button>
                ))}
              </div>
              <div className="neu-input mb-4 lg:mb-0 lg:w-64 shrink-0 rounded-xl flex items-center h-9 px-3 gap-2">
                <Search className="w-4 h-4 text-neu-muted shrink-0" />
                <input type="search" placeholder="Search orders..." className="w-full bg-transparent text-xs outline-none text-neu-text placeholder:text-neu-muted" />
              </div>
            </div>
          </div>

          {loading && <LoadingState label="Loading orders..." />}
          {error && <ErrorState error={error} onRetry={refetch} />}

          {!loading && !error && ordersPage && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1350px] text-xs">
                  <thead className="text-[10px] tracking-wider text-neu-muted">
                    <tr>
                      <th className="text-left px-6 py-4">ORDER #</th>
                      <th className="text-left px-3 py-4">TYPE</th>
                      <th className="text-left px-3 py-4">CUSTOMER / SUPPLIER</th>
                      <th className="text-left px-3 py-4">CARRIER</th>
                      <th className="text-left px-3 py-4">DATE</th>
                      <th className="text-left px-3 py-4">ITEMS</th>
                      <th className="text-left px-3 py-4">WAREHOUSE</th>
                      <th className="text-left px-3 py-4">TOTAL</th>
                      <th className="text-left px-3 py-4">PAYMENT</th>
                      <th className="text-left px-3 py-4">FULFILLMENT</th>
                      <th className="text-left px-3 py-4">PRIORITY</th>
                      <th className="text-left px-3 py-4">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false} mode="popLayout">
                      {ordersPage.items.flatMap((o, i) => {
                        const isExpanded = expandedId === o.id;
                        const rows = [
                          <motion.tr
                            key={o.id}
                            layout
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.05 }}
                            className="hover:bg-black/[0.03] transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold text-accent">{o.order_number}</td>
                            <td className="px-3 py-4"><span className={`rounded-full px-2 py-1 text-[10px] ${TYPE_STYLE[o.type]}`}>{o.type}</span></td>
                            <td className="px-3 py-4 font-semibold text-neu-text">{o.counterparty_name ?? "—"}</td>
                            <td className="px-3 py-4">
                              <CarrierBadge carrier={o.carrier} />
                              {o.tracking_number && <div className="text-neu-muted mt-1 font-mono text-[10px]">{o.tracking_number}</div>}
                            </td>
                            <td className="px-3 py-4 text-neu-text">{o.order_date}</td>
                            <td className="px-3 py-4 text-neu-text">{o.items.length}</td>
                            <td className="px-3 py-4 text-neu-text">{o.warehouse_name ?? "—"}</td>
                            <td className="px-3 py-4 font-semibold text-neu-text">${Number(o.total_amount).toLocaleString()}</td>
                            <td className="px-3 py-4">{o.payment_status ? <StatusBadge status={o.payment_status} className="px-2 py-1" /> : "—"}</td>
                            <td className="px-3 py-4"><StatusBadge status={o.fulfillment_status} className="px-2 py-1" /></td>
                            <td className="px-3 py-4">
                              <span className={priorityStyle(o.priority)}>
                                {o.priority === "High" && <Flag className="w-3 h-3" />}
                                {o.priority}
                              </span>
                            </td>
                            <td className="px-3 py-4">
                              <div className="flex gap-3 text-neu-muted">
                                {o.delivery_steps.length > 0 && (
                                  <button onClick={() => setExpandedId(isExpanded ? null : o.id)}>
                                    {isExpanded ? <ChevronDown className="w-4 h-4 hover:text-accent" /> : <ChevronRight className="w-4 h-4 hover:text-accent" />}
                                  </button>
                                )}
                                <button><Eye className="w-4 h-4 hover:text-accent" /></button>
                                <button><MoreHorizontal className="w-4 h-4 hover:text-accent" /></button>
                              </div>
                            </td>
                          </motion.tr>,
                        ];
                        if (isExpanded) {
                          rows.push(
                            <motion.tr key={`${o.id}-expanded`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <td colSpan={12} className="px-6 py-4">
                                <DeliveryTimeline steps={o.delivery_steps} />
                              </td>
                            </motion.tr>
                          );
                        }
                        return rows;
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neu-muted">
                <span>
                  Showing <b className="text-neu-text">{ordersPage.items.length}</b> of <b className="text-neu-text">{ordersPage.total}</b> orders
                </span>
                <Pagination page={page} totalPages={ordersPage.total_pages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
  );
}
