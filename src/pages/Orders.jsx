import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Download,
  Plus,
  Search,
  Eye,
  MoreHorizontal,
  CheckCircle,
  RefreshCw,
  MapPin,
  Flag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import CarrierBadge from "../components/CarrierBadge";
import DeliveryTimeline from "../components/DeliveryTimeline";
import Pagination from "../components/Pagination";
import { orders, orderKpis, carrierPerformance } from "../data/mockData";

const TABS = [
  { key: "all", label: "All Orders", count: 2486 },
  { key: "purchase", label: "Purchase Orders", count: 682 },
  { key: "sales", label: "Sales Orders", count: 1492 },
  { key: "returns", label: "Returns" },
  { key: "transfers", label: "Transfers" },
];

const TYPE_STYLE = {
  Purchase: "bg-accent/15 text-accent",
  Sales: "bg-neu-dark/15 text-neu-muted",
  Transfer: "bg-accent-2/15 text-accent-2",
};

const priorityStyle = (p) => {
  if (p === "High" || p === "Urgent") return "text-danger font-semibold flex items-center gap-1";
  return "text-neu-muted";
};

const rowAction = (o) => {
  if (o.fulfillment === "Pending") return { icon: CheckCircle, hover: "hover:text-success" };
  if (o.payment === "Failed") return { icon: RefreshCw, hover: "hover:text-accent" };
  if (o.type === "Transfer") return { icon: MapPin, hover: "hover:text-accent" };
  return { icon: MoreHorizontal, hover: "hover:text-accent" };
};

export default function Orders() {
  usePageTitle("Inventory Overview");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = orders.filter((o) => {
    if (activeTab === "all") return true;
    if (activeTab === "purchase") return o.type === "Purchase";
    if (activeTab === "sales") return o.type === "Sales";
    if (activeTab === "transfers") return o.type === "Transfer";
    return true;
  });

  return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-neu-muted mb-1">Operations / Orders</div>
            <h2 className="text-xl font-bold tracking-tight text-neu-text">Orders Management</h2>
            <p className="text-sm text-neu-muted mt-1">Track purchasing, sales, transfers and returns across your network.</p>
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

        <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
          {orderKpis.map((k, i) => (
            <StatCard key={k.label} {...k} size="sm" index={i} />
          ))}
        </section>

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
                <span className="text-[11px] font-semibold text-success">{c.onTimePct}% on-time</span>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="neu-card rounded-2xl overflow-hidden">
          <div className="px-6 pt-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-6 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`relative pb-4 text-sm whitespace-nowrap ${
                      activeTab === t.key ? "text-accent font-semibold" : "text-neu-muted hover:text-accent"
                    }`}
                  >
                    {t.label}
                    {t.count && (
                      <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === t.key ? "bg-accent/15" : "bg-neu-dark/15"}`}>
                        {t.count}
                      </span>
                    )}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1550px] text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr>
                  <th className="text-left px-6 py-4">ORDER ID</th>
                  <th className="text-left px-3 py-4">ORDER TYPE</th>
                  <th className="text-left px-3 py-4">CUSTOMER / SUPPLIER</th>
                  <th className="text-left px-3 py-4">CARRIER</th>
                  <th className="text-left px-3 py-4">DATE</th>
                  <th className="text-left px-3 py-4">ITEMS</th>
                  <th className="text-left px-3 py-4">WAREHOUSE</th>
                  <th className="text-left px-3 py-4">TOTAL</th>
                  <th className="text-left px-3 py-4">PAYMENT</th>
                  <th className="text-left px-3 py-4">FULFILLMENT</th>
                  <th className="text-left px-3 py-4">DELIVERY DATE</th>
                  <th className="text-left px-3 py-4">PRIORITY</th>
                  <th className="text-left px-3 py-4">ASSIGNED TO</th>
                  <th className="text-left px-3 py-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false} mode="popLayout">
                  {filtered.flatMap((o, i) => {
                    const { icon: ActionIcon, hover } = rowAction(o);
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
                        <td className="px-6 py-4 font-semibold text-accent">{o.id}</td>
                        <td className="px-3 py-4"><span className={`rounded-full px-2 py-1 text-[10px] ${TYPE_STYLE[o.type]}`}>{o.type}</span></td>
                        <td className="px-3 py-4">
                          <div className="font-semibold text-neu-text">{o.party}</div>
                          <div className="text-neu-muted mt-1">{o.partyId}</div>
                        </td>
                        <td className="px-3 py-4">
                          <CarrierBadge carrier={o.carrier} />
                          {o.trackingNumber && <div className="text-neu-muted mt-1 font-mono text-[10px]">{o.trackingNumber}</div>}
                        </td>
                        <td className="px-3 py-4 text-neu-text">{o.date}</td>
                        <td className="px-3 py-4 text-neu-text">{o.items}</td>
                        <td className="px-3 py-4 text-neu-text">{o.warehouse}</td>
                        <td className="px-3 py-4 font-semibold text-neu-text">{o.total}</td>
                        <td className="px-3 py-4"><StatusBadge status={o.payment} className="px-2 py-1" /></td>
                        <td className="px-3 py-4"><StatusBadge status={o.fulfillment} className="px-2 py-1" /></td>
                        <td className="px-3 py-4 text-neu-text">{o.delivery}</td>
                        <td className="px-3 py-4">
                          <span className={priorityStyle(o.priority)}>
                            {o.priority === "High" && <Flag className="w-3 h-3" />}
                            {o.priority}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-neu-text">{o.assigned}</td>
                        <td className="px-3 py-4">
                          <div className="flex gap-3 text-neu-muted">
                            {o.deliverySteps && (
                              <button onClick={() => setExpandedId(isExpanded ? null : o.id)}>
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 hover:text-accent" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 hover:text-accent" />
                                )}
                              </button>
                            )}
                            <button><Eye className="w-4 h-4 hover:text-accent" /></button>
                            <button><ActionIcon className={`w-4 h-4 ${hover}`} /></button>
                          </div>
                        </td>
                      </motion.tr>,
                    ];
                    if (isExpanded) {
                      rows.push(
                        <motion.tr
                          key={`${o.id}-expanded`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td colSpan={14} className="px-6 py-4">
                            <DeliveryTimeline steps={o.deliverySteps} />
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
            <span>Showing <b className="text-neu-text">1–{filtered.length}</b> of 2,486 orders</span>
            <Pagination page={page} totalPages={498} onPageChange={setPage} />
          </div>
        </div>
      </div>
  );
}
