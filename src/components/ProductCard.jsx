import { motion } from "framer-motion";
import ProductThumb from "./ProductThumb";
import StatusBadge from "./StatusBadge";

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-4 shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow"
    >
      <div className="flex items-start gap-3">
        <ProductThumb seed={product.seed || product.name} size={56} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm leading-snug">{product.name}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{product.sku}</div>
        </div>
        {product.status && <StatusBadge status={product.status} className="shrink-0" />}
      </div>
      {product.stats && (
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          {product.stats.map((s) => (
            <div key={s.label}>
              <div className="text-slate-400">{s.label}</div>
              <div className="font-semibold mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
