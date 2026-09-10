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
      className="neu-card neu-card-hover rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <ProductThumb seed={product.seed || product.name} size={56} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm leading-snug text-neu-text">{product.name}</div>
          <div className="text-[11px] text-neu-muted mt-0.5">{product.sku}</div>
        </div>
        {product.status && <StatusBadge status={product.status} className="shrink-0" />}
      </div>
      {product.stats && (
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 text-xs">
          {product.stats.map((s) => (
            <div key={s.label}>
              <div className="text-neu-muted">{s.label}</div>
              <div className="font-semibold mt-0.5 text-neu-text">{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
