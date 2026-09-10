import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Building2,
  Users,
  ShieldCheck,
  Bell,
  Archive,
  ShoppingCart,
  Warehouse,
  Image,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import StatusBadge from "../components/StatusBadge";
import { workspaceUsers, permissionMatrix } from "../data/mockData";

const NAV_SECTIONS = [
  {
    title: "Configuration",
    items: [
      { key: "general", label: "General", icon: Building2 },
      { key: "users", label: "Users & Roles", icon: Users },
      { key: "permissions", label: "Permissions", icon: ShieldCheck },
      { key: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Operations",
    items: [
      { key: "inventory", label: "Inventory", icon: Archive },
      { key: "orders", label: "Orders", icon: ShoppingCart },
      { key: "warehouse", label: "Warehouse", icon: Warehouse },
    ],
  },
];

const NOTIFICATIONS = [
  { label: "Low stock alerts", checked: true },
  { label: "Out of stock alerts", checked: true },
  { label: "Reorder required", checked: true },
  { label: "Purchase order approval", checked: true },
  { label: "Order received", checked: false },
  { label: "Shipment delayed", checked: true },
  { label: "Stock transfer", checked: false },
  { label: "Supplier issue", checked: true },
  { label: "Warehouse capacity warning", checked: true },
];

export default function Settings() {
  usePageTitle("Inventory Overview");
  const [activeSection, setActiveSection] = useState("general");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [autoApprove, setAutoApprove] = useState(true);

  const toggleNotification = (label) =>
    setNotifications((prev) => prev.map((n) => (n.label === label ? { ...n, checked: !n.checked } : n)));

  return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1280px]">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs tracking-wider uppercase text-neu-muted mb-2">Workspace administration</div>
            <h2 className="text-xl font-bold tracking-tight text-neu-text">Settings</h2>
            <p className="text-sm text-neu-muted mt-1">Manage your company, team access, workflows and inventory preferences.</p>
          </div>
          <div className="flex gap-3">
            <button className="neu-btn h-10 px-4 rounded-xl text-sm font-medium text-neu-muted hover:text-neu-text">Discard changes</button>
            <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-sm font-semibold flex items-center gap-2">
              <Save className="w-4 h-4" />Save changes
            </button>
          </div>
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          <aside className="w-full lg:w-[220px] shrink-0 neu-card rounded-2xl p-3">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <div className="px-3 py-3 text-[10px] uppercase tracking-wider text-neu-muted">{section.title}</div>
                {section.items.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`relative w-full h-10 rounded-xl text-left px-3 text-sm flex items-center gap-3 ${
                      activeSection === key ? "text-accent font-semibold" : "text-neu-muted hover:text-neu-text"
                    }`}
                  >
                    {activeSection === key && (
                      <motion.span
                        layoutId="settingsNavPill"
                        className="absolute inset-0 neu-pressed-sm rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
                {section.title === "Configuration" && <div className="h-px bg-neu-dark/20 my-3" />}
              </div>
            ))}
          </aside>

          <div className="flex-1 space-y-6 w-full">
            <section className="neu-card rounded-2xl">
              <div className="p-6 flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-sm text-neu-text">General settings</h3>
                  <p className="text-xs text-neu-muted mt-1">Basic information used across your inventory workspace.</p>
                </div>
                <span className="text-xs text-success bg-success/15 rounded-full px-2 py-1">All changes saved</span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="text-xs font-medium text-neu-muted">
                  Company name
                  <input defaultValue="Inventory Insights Pro" className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text" />
                </label>
                <label className="text-xs font-medium text-neu-muted">
                  Company logo
                  <div className="neu-pressed-sm mt-2 h-10 rounded-xl flex items-center px-3 gap-2 text-xs text-neu-muted">
                    <span className="w-6 h-6 rounded-lg neu-soft flex items-center justify-center text-accent"><Image className="w-3.5 h-3.5" /></span>
                    Upload logo <span className="text-neu-muted">PNG, JPG up to 2MB</span>
                  </div>
                </label>
                <label className="text-xs font-medium text-neu-muted md:col-span-2">
                  Business address
                  <input defaultValue="240 Market Street, San Francisco, CA 94105" className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text" />
                </label>
                <label className="text-xs font-medium text-neu-muted">
                  Currency
                  <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                    <option>USD — US Dollar</option>
                    <option>EUR — Euro</option>
                    <option>GBP — Pound Sterling</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-neu-muted">
                  Timezone
                  <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                    <option>(GMT-08:00) Pacific Time</option>
                    <option>(GMT-05:00) Eastern Time</option>
                    <option>(GMT+00:00) London</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-neu-muted">
                  Date format
                  <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                    <option>MMM DD, YYYY — Jan 24, 2024</option>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="neu-card rounded-2xl overflow-hidden">
              <div className="p-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-sm text-neu-text">Users &amp; roles</h3>
                  <p className="text-xs text-neu-muted mt-1">Control who can access your workspace.</p>
                </div>
                <button className="neu-btn-accent h-9 px-3 rounded-xl text-white text-xs font-semibold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />Add user
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-[10px] tracking-wider text-neu-muted">
                    <tr><th className="text-left px-6 py-4">USER</th><th className="text-left">EMAIL</th><th className="text-left">ROLE</th><th className="text-left">STATUS</th><th className="text-left">LAST LOGIN</th><th className="text-left">ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {workspaceUsers.map((u, i) => (
                      <motion.tr
                        key={u.email}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.07 }}
                        className="hover:bg-black/[0.03] transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-3"><img src={u.avatar} className="w-8 h-8 rounded-full neu-soft p-0.5" alt="" /><span className="font-semibold text-neu-text">{u.name}</span></td>
                        <td className="text-neu-muted">{u.email}</td>
                        <td className="text-neu-text">{u.role}</td>
                        <td><StatusBadge status={u.status} className="px-2 py-1" /></td>
                        <td className="text-neu-muted">{u.lastLogin}</td>
                        <td>
                          <button className="text-neu-muted mr-3 hover:text-accent"><Edit3 className="w-4 h-4" /></button>
                          <button className="text-neu-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="neu-card rounded-2xl overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-sm text-neu-text">Permissions control</h3>
                <p className="text-xs text-neu-muted mt-1">Configure module access for each role.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-[10px] tracking-wider text-neu-muted">
                    <tr>
                      <th className="text-left px-6 py-4">ROLE</th>
                      {permissionMatrix.modules.map((m) => (
                        <th key={m}>{m.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionMatrix.roles.map((r, i) => (
                      <tr key={r.role} className="text-neu-text">
                        <td className="px-6 py-3 font-semibold">{r.role}</td>
                        {r.access.map((granted, j) => (
                          <td key={j} className="text-center"><input type="checkbox" defaultChecked={granted} readOnly className="accent-[#2FAE72]" /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 text-xs text-accent font-medium flex items-center gap-1 cursor-pointer">
                + Show all roles <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="neu-card rounded-2xl p-6">
                <h3 className="font-semibold text-sm text-neu-text">Notifications preferences</h3>
                <p className="text-xs text-neu-muted mt-1 mb-5">Choose which operational events your team receives.</p>
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <label key={n.label} className="flex justify-between items-center text-sm cursor-pointer text-neu-text">
                      {n.label}
                      <input
                        type="checkbox"
                        checked={n.checked}
                        onChange={() => toggleNotification(n.label)}
                        className="appearance-none w-9 h-5 rounded-full neu-pressed-sm relative cursor-pointer transition-colors checked:[&::before]:bg-accent before:content-[''] before:absolute before:w-4 before:h-4 before:bg-neu-bg before:rounded-full before:top-0.5 before:left-0.5 before:shadow-[2px_2px_4px_#A3B1C6,-2px_-2px_4px_#FFFFFF] before:transition-transform checked:before:translate-x-4"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="neu-card rounded-2xl p-6">
                  <h3 className="font-semibold text-sm text-neu-text">Inventory settings</h3>
                  <p className="text-xs text-neu-muted mt-1 mb-5">Set defaults for stock control and valuation.</p>
                  <div className="space-y-4">
                    <label className="block text-xs font-medium text-neu-muted">
                      Default reorder point
                      <input defaultValue="100" className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text" />
                    </label>
                    <label className="block text-xs font-medium text-neu-muted">
                      Stock valuation method
                      <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                        <option>Weighted Average</option>
                        <option>FIFO</option>
                        <option>LIFO</option>
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs font-medium text-neu-muted">
                        Units
                        <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                          <option>Pieces</option>
                          <option>Cases</option>
                          <option>Kilograms</option>
                        </select>
                      </label>
                      <label className="text-xs font-medium text-neu-muted">
                        Default warehouse
                        <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                          <option>Main Distribution Center</option>
                          <option>East Coast Warehouse</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="neu-card rounded-2xl p-6">
                  <h3 className="font-semibold text-sm text-neu-text">Order &amp; warehouse settings</h3>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <label className="text-xs font-medium text-neu-muted">
                      Order numbering prefix
                      <input defaultValue="PO-" className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text" />
                    </label>
                    <label className="text-xs font-medium text-neu-muted">
                      Auto-approve under
                      <input defaultValue="$1,000" className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text" />
                    </label>
                    <label className="text-xs font-medium text-neu-muted">
                      Payment terms
                      <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                        <option>Net 30</option>
                        <option>Net 60</option>
                        <option>Net 90</option>
                      </select>
                    </label>
                    <label className="text-xs font-medium text-neu-muted">
                      Location structure
                      <select className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text">
                        <option>Zone / Aisle / Rack / Bin</option>
                        <option>Custom structure</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-5 pt-4 flex justify-between items-center">
                    <span className="text-xs text-neu-muted">Enable automatic transfer approvals</span>
                    <input
                      type="checkbox"
                      checked={autoApprove}
                      onChange={() => setAutoApprove((v) => !v)}
                      className="appearance-none w-9 h-5 rounded-full neu-pressed-sm relative cursor-pointer transition-colors checked:[&::before]:bg-accent before:content-[''] before:absolute before:w-4 before:h-4 before:bg-neu-bg before:rounded-full before:top-0.5 before:left-0.5 before:shadow-[2px_2px_4px_#A3B1C6,-2px_-2px_4px_#FFFFFF] before:transition-transform checked:before:translate-x-4"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
  );
}
