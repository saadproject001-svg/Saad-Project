import { motion } from "framer-motion";

export function BarChart({ data, labels, className = "bg-indigo-400" }) {
  return (
    <div>
      <div className="h-[200px] flex items-end gap-2 px-1 border-b border-slate-100">
        {data.map((h, i) => (
          <motion.div
            key={i}
            className={`flex-1 rounded-t ${className}`}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
          />
        ))}
      </div>
      {labels && (
        <div className="flex justify-between text-[10px] text-slate-400 mt-3">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function LineChart({ path, height = 160 }) {
  return (
    <svg viewBox={`0 0 700 ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <motion.path
        d={path}
        fill="none"
        strokeWidth="3"
        className="stroke-indigo-500"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}
