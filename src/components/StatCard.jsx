import { motion } from "framer-motion";
import Sparkline from "./Sparkline";

const TONE_BADGE = {
  emerald: "text-emerald-600 bg-emerald-50",
  rose: "text-rose-500 bg-rose-50",
  amber: "text-amber-600 bg-amber-50",
  indigo: "text-indigo-600 bg-indigo-50",
  slate: "text-slate-500 bg-slate-100",
};

const TONE_BAR = {
  emerald: "bg-emerald-500",
  rose: "bg-rose-400",
  amber: "bg-amber-400",
  indigo: "bg-indigo-500",
  slate: "bg-slate-400",
};

const TONE_STROKE = {
  emerald: "stroke-emerald-500",
  rose: "stroke-rose-500",
  amber: "stroke-amber-500",
  indigo: "stroke-indigo-500",
  slate: "stroke-slate-400",
};

export default function StatCard({ label, value, delta, tone = "indigo", spark, bar, note, extra, size = "md", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] hover:shadow-[0_10px_28px_rgba(30,41,59,.14)] transition-shadow ${
        size === "sm" ? "p-4" : "p-5"
      }`}
    >
      <div className="text-[10px] md:text-xs tracking-wider text-slate-500 uppercase">{label}</div>
      <div className="flex items-center gap-2 mt-2">
        <b className={size === "sm" ? "text-xl" : "text-2xl"}>{value}</b>
        {delta && (
          <span className={`text-[10px] md:text-xs font-semibold px-1.5 py-1 rounded whitespace-nowrap ${TONE_BADGE[tone]}`}>
            {delta}
          </span>
        )}
        {note && !delta && <span className="text-xs text-slate-400 whitespace-nowrap">{note}</span>}
      </div>

      {spark && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.06 + 0.15 }}
        >
          <Sparkline d={spark} className={TONE_STROKE[tone]} />
        </motion.div>
      )}

      {typeof bar === "number" && (
        <div className="flex items-center gap-2 mt-4">
          <div className="h-1.5 flex-1 bg-slate-100 rounded overflow-hidden">
            <motion.div
              className={`h-1.5 rounded ${TONE_BAR[tone]}`}
              initial={{ width: 0 }}
              animate={{ width: `${bar}%` }}
              transition={{ duration: 0.7, delay: index * 0.06 + 0.15, ease: "easeOut" }}
            />
          </div>
          {note && delta && <span className="text-[10px] text-slate-400 whitespace-nowrap">{note}</span>}
        </div>
      )}

      {extra && <div className="text-xs text-slate-400 mt-3">{extra}</div>}
    </motion.div>
  );
}
