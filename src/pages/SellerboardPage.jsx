import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import usePageTitle from "../hooks/usePageTitle";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import ProductThumb from "../components/ProductThumb";
import ProductCard from "../components/ProductCard";
import SettingsForm from "../components/SettingsForm";
import { BarChart } from "../components/MiniChart";
import { sellerboardPages } from "../data/sellerboardData";

function buildColumns(columns) {
  return columns.map((c) => {
    if (c.type === "status") {
      return { ...c, render: (row) => <StatusBadge status={row[c.key]} /> };
    }
    if (c.type === "bold") {
      return { ...c, render: (row) => <span className="font-semibold text-slate-700">{row[c.key]}</span> };
    }
    if (c.type === "muted") {
      return { ...c, render: (row) => <span className="text-slate-400">{row[c.key]}</span> };
    }
    if (c.type === "thumb") {
      return {
        ...c,
        render: (row) => (
          <div className="flex items-center gap-3">
            <ProductThumb seed={row.sku || row[c.key]} size={36} />
            <div className="min-w-0">
              <div className="font-semibold truncate">{row[c.key]}</div>
              {row.sku && <div className="text-[10px] text-slate-400">{row.sku}</div>}
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
            <img src={row.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-semibold">{row[c.key]}</span>
          </div>
        ),
      };
    }
    return c;
  });
}

export default function SellerboardPage() {
  const { pathname } = useLocation();
  const config = sellerboardPages[pathname];
  usePageTitle(config ? config.title : "Not Found");

  if (!config) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-sm text-slate-500">No page configured for this route yet.</div>
    );
  }

  const { badge, title, subtitle, kpis, chart, variant, table, tableTitle, products, settings } = config;

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7"
        >
          {badge && <div className="text-xs tracking-wider text-slate-400 uppercase mb-2">{badge}</div>}
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{subtitle}</p>}
        </motion.div>

        {kpis && (
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-6">
            {kpis.map((k, i) => (
              <StatCard key={k.label} {...k} index={i} />
            ))}
          </section>
        )}

        {chart && (
          <section className="bg-white rounded-xl p-6 mb-6 shadow-[0_3px_12px_rgba(30,41,59,.07)]">
            <div className="font-semibold text-sm mb-1">{chart.title}</div>
            <div className="mt-5">
              <BarChart data={chart.data} labels={chart.labels} />
            </div>
          </section>
        )}

        {variant === "settings" && <SettingsForm groups={settings} />}

        {variant === "products" && (
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.sku} product={p} index={i} />
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
