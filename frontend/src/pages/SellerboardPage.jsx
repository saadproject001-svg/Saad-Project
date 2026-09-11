import { useLocation, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import usePageTitle from "../hooks/usePageTitle";
import { useApi } from "../hooks/useApi";
import { getSellerboardPage } from "../lib/endpoints";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import ProductThumb from "../components/ProductThumb";
import ProductCard from "../components/ProductCard";
import SettingsForm from "../components/SettingsForm";
import { BarChart } from "../components/MiniChart";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { sellerboardNav } from "../data/sellerboardData";

function buildColumns(columns) {
  return columns.map((c) => {
    if (c.type === "status") {
      return { ...c, render: (row) => <StatusBadge status={row[c.key]} /> };
    }
    if (c.type === "bold") {
      return { ...c, render: (row) => <span className="font-semibold text-neu-text">{row[c.key]}</span> };
    }
    if (c.type === "muted") {
      return { ...c, render: (row) => <span className="text-neu-muted">{row[c.key]}</span> };
    }
    if (c.type === "thumb") {
      return {
        ...c,
        render: (row) => (
          <div className="flex items-center gap-3">
            <ProductThumb seed={row.sku || row[c.key]} size={36} />
            <div className="min-w-0">
              <div className="font-semibold truncate text-neu-text">{row[c.key]}</div>
              {row.sku && <div className="text-[10px] text-neu-muted">{row.sku}</div>}
            </div>
          </div>
        ),
      };
    }
    if (c.type === "avatar") {
      return {
        ...c,
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full neu-soft flex items-center justify-center text-[10px] font-semibold text-neu-text">
              {(row[c.key] || "?").slice(0, 2).toUpperCase()}
            </div>
            <span className="font-semibold text-neu-text">{row[c.key]}</span>
          </div>
        ),
      };
    }
    return c;
  });
}

export default function SellerboardPage() {
  const { pathname } = useLocation();
  const group = sellerboardNav.find((g) => g.items.some((it) => it.to === pathname));
  const { data: config, loading, error, refetch } = useApi(() => getSellerboardPage(pathname), [pathname]);

  usePageTitle(config ? config.title : "Sellerboard");

  if (loading) return <div className="p-4 sm:p-6 lg:p-8"><LoadingState label="Loading page..." /></div>;

  if (error) {
    if (error.status === 404) {
      return <div className="p-4 sm:p-6 lg:p-8 text-sm text-neu-muted">No page configured for this route yet.</div>;
    }
    return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={refetch} /></div>;
  }

  if (!config) return null;

  const { badge, title, subtitle, kpis, chart, variant, table, table_title: tableTitle, products, settings } = config;

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        {group && group.items.length > 1 && (
          <nav className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `neu-nav-item shrink-0 h-9 px-4 rounded-xl flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "neu-nav-item-active" : "text-neu-muted hover:text-neu-text"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7"
        >
          {badge && <div className="text-xs tracking-wider text-neu-muted uppercase mb-2">{badge}</div>}
          <h2 className="text-2xl font-bold tracking-tight text-neu-text">{title}</h2>
          {subtitle && <p className="text-sm text-neu-muted mt-1 max-w-2xl">{subtitle}</p>}
        </motion.div>

        {kpis && kpis.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-6">
            {kpis.map((k, i) => (
              <StatCard key={k.label} {...k} index={i} />
            ))}
          </section>
        )}

        {chart && (
          <section className="neu-card rounded-2xl p-6 mb-6">
            <div className="font-semibold text-sm mb-1 text-neu-text">{chart.title}</div>
            <div className="mt-5">
              <BarChart data={chart.data} labels={chart.labels} />
            </div>
          </section>
        )}

        {variant === "settings" && <SettingsForm groups={settings} />}

        {variant === "products" && (
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.sku || p.name} product={p} index={i} />
            ))}
          </section>
        )}

        {variant !== "settings" && variant !== "products" && table && (
          <section>
            {tableTitle && <div className="font-semibold text-sm mb-3">{tableTitle}</div>}
            <DataTable columns={buildColumns(table.columns)} rows={table.rows} keyField={table.columns[0]?.key} />
          </section>
        )}
      </div>
  );
}
