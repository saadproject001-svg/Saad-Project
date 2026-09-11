import { NavLink, Outlet, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const TABS = [
  { to: "/admin", label: "Organizations", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/activity", label: "Activity" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen text-neu-text">
      <header className="border-b border-neu-dark/20 bg-neu-bg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider text-neu-muted">Platform Administration</div>
              <div className="text-sm font-semibold">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="neu-btn h-9 px-3 rounded-xl text-xs font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />Back to app
            </Link>
            <button onClick={signOut} className="neu-btn h-9 px-3 rounded-xl text-xs font-medium text-neu-muted hover:text-neu-text flex items-center gap-2">
              <LogOut className="w-4 h-4" />Sign out
            </button>
          </div>
        </div>
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `relative pb-3 text-sm whitespace-nowrap ${isActive ? "text-accent font-semibold" : "text-neu-muted hover:text-accent"}`
              }
            >
              {({ isActive }) => (
                <>
                  {tab.label}
                  <span className={`absolute left-0 right-0 -bottom-px h-0.5 ${isActive ? "bg-accent" : "bg-transparent"}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
