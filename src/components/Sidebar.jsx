import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  ChevronDown,
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
  X,
} from "lucide-react";
import { currentUser } from "../data/mockData";
import { sellerboardNav } from "../data/sellerboardData";

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
  "h-11 px-4 rounded-xl flex items-center gap-3 text-sm text-slate-300 hover:bg-[#1b2740] transition-colors";

function NavPill({ to, end, icon: Icon, label, indent = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `relative h-10 ${indent ? "pl-11 pr-4" : "px-4"} rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${
          isActive ? "text-white" : "text-slate-300 hover:bg-[#1b2740]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebarActivePill"
              className="absolute inset-0 bg-[#6366ed] rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          {Icon && <Icon className="w-5 h-5 relative z-10 shrink-0" />}
          <span className="relative z-10 truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function NavGroup({ group, isOpen, onToggle, isActiveGroup, onNavigate }) {
  const Icon = GROUP_ICONS[group.icon];

  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full h-10 px-4 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${
          isActiveGroup && !isOpen ? "text-white bg-[#1b2740]" : "text-slate-300 hover:bg-[#1b2740]"
        }`}
      >
        {Icon && <Icon className="w-5 h-5 shrink-0" />}
        <span className="flex-1 text-left truncate">{group.label}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1 space-y-1">
              {group.items.map((item) => {
                const isParent = group.items.some(
                  (other) => other.to !== item.to && other.to.startsWith(`${item.to}/`)
                );
                return (
                  <NavPill key={item.to} to={item.to} end={isParent} label={item.label} indent onClick={onNavigate} />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const activeGroupKey = sellerboardNav.find((g) => g.items.some((it) => it.to === location.pathname))?.key;
  const [openGroups, setOpenGroups] = useState(() => new Set(activeGroupKey ? [activeGroupKey] : []));

  useEffect(() => {
    if (activeGroupKey) {
      setOpenGroups((prev) => (prev.has(activeGroupKey) ? prev : new Set(prev).add(activeGroupKey)));
    }
  }, [activeGroupKey]);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

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
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[268px] shrink-0 bg-[#10192d] text-white px-4 py-6 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
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
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-[#cbd0ff] shrink-0"
              src={currentUser.avatar}
              alt="Profile"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{currentUser.name}</div>
              <div className="text-xs text-slate-400 truncate">{currentUser.role}</div>
            </div>
          </motion.div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1b2740]"
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

        <div className="h-px bg-white/10 my-4 mx-2" />

        <nav className="space-y-1 pb-2">
          {sellerboardNav.map((group, i) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
            >
              <NavGroup
                group={group}
                isOpen={openGroups.has(group.key)}
                onToggle={() => toggleGroup(group.key)}
                isActiveGroup={group.key === activeGroupKey}
                onNavigate={onClose}
              />
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-4">
          <NavPill to="/settings" icon={Settings} label="Settings" onClick={onClose} />
          <a href="#profile" className={utilityLinkClass}>
            <UserCircle className="w-5 h-5" />
            User profile
          </a>
          <a href="#logout" className={utilityLinkClass}>
            <LogOut className="w-5 h-5" />
            Logout
          </a>
        </div>
      </aside>
    </>
  );
}
