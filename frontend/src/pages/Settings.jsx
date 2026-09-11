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
  Trash2,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { listTeam, listRoles, inviteTeamMember, removeTeamMember } from "../lib/endpoints";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

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
];

const toggleClass =
  "appearance-none w-9 h-5 rounded-full neu-pressed-sm relative cursor-pointer transition-colors checked:[&::before]:bg-accent before:content-[''] before:absolute before:w-4 before:h-4 before:bg-neu-bg before:rounded-full before:top-0.5 before:left-0.5 before:shadow-[2px_2px_4px_#A3B1C6,-2px_-2px_4px_#FFFFFF] before:transition-transform checked:before:translate-x-4";

function initialsOf(user) {
  const source = user?.full_name || user?.email || "?";
  return source.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

export default function Settings() {
  usePageTitle("Inventory Overview");
  const { organizations, activeOrgId } = useAuth();
  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const [activeSection, setActiveSection] = useState("general");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [autoApprove, setAutoApprove] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  const { data: team, loading: teamLoading, error: teamError, refetch: refetchTeam } = useApi(listTeam, []);
  const { data: roles, loading: rolesLoading, error: rolesError } = useApi(listRoles, []);

  const toggleNotification = (label) =>
    setNotifications((prev) => prev.map((n) => (n.label === label ? { ...n, checked: !n.checked } : n)));

  async function handleInvite(e) {
    e.preventDefault();
    setInviteError(null);
    try {
      await inviteTeamMember({ email: inviteEmail, role: inviteRole });
      setInviteEmail("");
      setShowInvite(false);
      refetchTeam();
    } catch (err) {
      setInviteError(err.message || "Could not send invite.");
    }
  }

  async function handleRemove(membershipId) {
    if (!window.confirm("Remove this team member?")) return;
    await removeTeamMember(membershipId);
    refetchTeam();
  }

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
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="text-xs font-medium text-neu-muted">
                  Company name
                  <input readOnly value={activeOrg?.name ?? ""} className="neu-input mt-2 w-full h-10 rounded-xl px-3 text-sm text-neu-text" />
                </label>
                <label className="text-xs font-medium text-neu-muted">
                  Company logo
                  <div className="neu-pressed-sm mt-2 h-10 rounded-xl flex items-center px-3 gap-2 text-xs text-neu-muted">
                    <span className="w-6 h-6 rounded-lg neu-soft flex items-center justify-center text-accent"><Image className="w-3.5 h-3.5" /></span>
                    Upload logo <span className="text-neu-muted">PNG, JPG up to 2MB</span>
                  </div>
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
              </div>
              <p className="px-6 pb-5 text-[11px] text-neu-muted">Currency, timezone and logo aren&apos;t wired up to persistence yet.</p>
            </section>

            <section className="neu-card rounded-2xl overflow-hidden">
              <div className="p-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-sm text-neu-text">Users &amp; roles</h3>
                  <p className="text-xs text-neu-muted mt-1">Control who can access your workspace.</p>
                </div>
                <button onClick={() => setShowInvite((v) => !v)} className="neu-btn-accent h-9 px-3 rounded-xl text-white text-xs font-semibold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />Invite user
                </button>
              </div>

              {showInvite && (
                <form onSubmit={handleInvite} className="px-6 pb-4 flex flex-wrap items-end gap-3">
                  <label className="text-xs font-medium text-neu-muted">
                    Email
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="neu-input mt-2 h-10 rounded-xl px-3 text-sm text-neu-text block"
                      placeholder="teammate@company.com"
                    />
                  </label>
                  <label className="text-xs font-medium text-neu-muted">
                    Role
                    <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="neu-input mt-2 h-10 rounded-xl px-3 text-sm text-neu-text block">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </label>
                  <button type="submit" className="neu-btn-accent h-10 px-4 rounded-xl text-white text-xs font-semibold">Send invite</button>
                  {inviteError && <span className="text-xs text-danger">{inviteError}</span>}
                </form>
              )}

              {teamLoading && <LoadingState label="Loading team..." />}
              {teamError && <ErrorState error={teamError} onRetry={refetchTeam} />}
              {!teamLoading && !teamError && team && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-[10px] tracking-wider text-neu-muted">
                      <tr><th className="text-left px-6 py-4">USER</th><th className="text-left">EMAIL</th><th className="text-left">ROLE</th><th className="text-left">STATUS</th><th className="text-left">LAST LOGIN</th><th className="text-left">ACTIONS</th></tr>
                    </thead>
                    <tbody>
                      {team.map((m, i) => (
                        <motion.tr
                          key={m.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.07 }}
                          className="hover:bg-black/[0.03] transition-colors"
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            {m.user.avatar_url ? (
                              <img src={m.user.avatar_url} className="w-8 h-8 rounded-full neu-soft p-0.5" alt="" />
                            ) : (
                              <span className="w-8 h-8 rounded-full neu-soft flex items-center justify-center text-[10px] font-semibold text-neu-text">{initialsOf(m.user)}</span>
                            )}
                            <span className="font-semibold text-neu-text">{m.user.full_name || m.user.email}</span>
                          </td>
                          <td className="text-neu-muted">{m.user.email}</td>
                          <td className="text-neu-text capitalize">{m.role.name}</td>
                          <td><StatusBadge status={m.status === "active" ? "Active" : m.status === "invited" ? "Pending" : "Inactive"} className="px-2 py-1" /></td>
                          <td className="text-neu-muted">{m.user.last_login_at ? new Date(m.user.last_login_at).toLocaleDateString() : "Never"}</td>
                          <td>
                            <button onClick={() => handleRemove(m.id)} className="text-neu-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="neu-card rounded-2xl overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-sm text-neu-text">Permissions control</h3>
                <p className="text-xs text-neu-muted mt-1">Real per-org roles and their granted permissions.</p>
              </div>
              {rolesLoading && <LoadingState label="Loading roles..." />}
              {rolesError && <ErrorState error={rolesError} />}
              {!rolesLoading && !rolesError && roles && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-[10px] tracking-wider text-neu-muted">
                      <tr><th className="text-left px-6 py-4">ROLE</th><th className="text-left">PERMISSIONS</th></tr>
                    </thead>
                    <tbody>
                      {roles.map((r) => (
                        <tr key={r.id} className="text-neu-text">
                          <td className="px-6 py-3 font-semibold capitalize align-top">{r.name}</td>
                          <td className="py-3 text-neu-muted">
                            <div className="flex flex-wrap gap-1.5">
                              {r.permissions.length === 0 ? (
                                <span>No permissions</span>
                              ) : (
                                r.permissions.map((p) => (
                                  <span key={p} className="rounded-full bg-neu-dark/15 px-2 py-0.5 text-[10px]">{p}</span>
                                ))
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="neu-card rounded-2xl p-6">
                <h3 className="font-semibold text-sm text-neu-text">Notifications preferences</h3>
                <p className="text-xs text-neu-muted mt-1 mb-5">Choose which operational events your team receives.</p>
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <label key={n.label} className="flex justify-between items-center text-sm cursor-pointer text-neu-text">
                      {n.label}
                      <input type="checkbox" checked={n.checked} onChange={() => toggleNotification(n.label)} className={toggleClass} />
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
                  </div>
                  <div className="mt-5 pt-4 flex justify-between items-center">
                    <span className="text-xs text-neu-muted">Enable automatic transfer approvals</span>
                    <input type="checkbox" checked={autoApprove} onChange={() => setAutoApprove((v) => !v)} className={toggleClass} />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
  );
}
