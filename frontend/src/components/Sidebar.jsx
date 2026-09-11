import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Archive,
  UsersRound,
  ShoppingCart,
  Warehouse,
  TrendingUp,
  Settings,
  UserCircle,
  LogOut,
  Megaphone,
  Boxes,
  Mail,
  RotateCcw,
  Bell,
  Tag,
  Link2,
  SlidersHorizontal,
  Store,
  Package,
  ShoppingBag,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { sellerboardNav } from "../data/sellerboardData";

function initialsOf(user) {
  const source = user?.full_name || user?.email || "?";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const GROUP_ICONS = {
  TrendingUp,
  Megaphone,
  Boxes,
  Mail,
  RotateCcw,
  Bell,
  Tag,
  Link2,
  SlidersHorizontal,
  Store,
  Package,
  ShoppingBag,
};

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/inventory", label: "Inventory", icon: Archive },
  { to: "/suppliers", label: "Suppliers", icon: UsersRound },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/warehouse", label: "Warehouse", icon: Warehouse },
  { to: "/analytics", label: "Analytics", icon: TrendingUp },
];

const utilityLinkClass =
  "neu-nav-item h-11 px-4 rounded-xl flex items-center gap-3 text-sm text-neu-muted hover:text-neu-text transition-colors";

function NavPill({ to, end, icon: Icon, label, indent = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `neu-nav-item relative h-10 ${indent ? "pl-11 pr-4" : "px-4"} rounded-xl flex items-center gap-3 text-sm font-medium ${
          isActive ? "neu-nav-item-active" : "text-neu-muted hover:text-neu-text"
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user, signOut } = useAuth();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[268px] shrink-0 bg-neu-bg text-neu-text px-4 py-6 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto lg:sticky lg:top-0 lg:h-screen`}
      >
        <div className="flex items-center justify-between gap-3 mb-7 px-2">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 min-w-0"
          >
            {user?.avatar_url ? (
              <img
                className="w-10 h-10 rounded-full object-cover shrink-0 neu-soft p-0.5"
                src={user.avatar_url}
                alt="Profile"
              />
            ) : (
              <div className="w-10 h-10 rounded-full shrink-0 neu-soft flex items-center justify-center text-sm font-semibold text-neu-text">
                {initialsOf(user)}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate text-neu-text">{user?.full_name || user?.email}</div>
              <div className="text-xs text-neu-muted truncate">{user?.email}</div>
            </div>
          </motion.div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="neu-icon-btn lg:hidden shrink-0 p-1.5 rounded-full text-neu-muted hover:text-neu-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon, end }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <NavPill to={to} end={end} icon={icon} label={label} onClick={onClose} />
            </motion.div>
          ))}
        </nav>

        <div className="h-px bg-neu-dark/20 my-4 mx-2" />

        <nav className="space-y-1 pb-2">
          {sellerboardNav.map((group, i) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
            >
              <NavPill
                to={group.items[0].to}
                icon={GROUP_ICONS[group.icon]}
                label={group.label}
                onClick={onClose}
              />
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-4">
          {user?.is_platform_admin && (
            <NavPill to="/admin" icon={ShieldCheck} label="Platform Admin" onClick={onClose} />
          )}
          <NavPill to="/settings" icon={Settings} label="Settings" onClick={onClose} />
          <a href="#profile" className={utilityLinkClass}>
            <UserCircle className="w-5 h-5" />
            User profile
          </a>
          <button onClick={signOut} className={`${utilityLinkClass} w-full text-left`}>
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
