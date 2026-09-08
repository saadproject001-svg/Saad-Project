import { motion } from "framer-motion";
import Sparkline from "./Sparkline";

const TONE_BADGE = {
  emerald: "text-success bg-success/15",
  rose: "text-danger bg-danger/15",
  amber: "text-warning bg-warning/15",
  indigo: "text-accent bg-accent/15",
  slate: "text-neu-muted bg-neu-dark/15",
};

const TONE_BAR = {
  emerald: "bg-success",
  rose: "bg-danger",
  amber: "bg-warning",
  indigo: "bg-accent",
  slate: "bg-neu-muted",
};

const TONE_STROKE = {
  emerald: "stroke-success",
  rose: "stroke-danger",
  amber: "stroke-warning",
  indigo: "stroke-accent",
  slate: "stroke-neu-muted",
};

export default function StatCard({ label, value, delta, tone = "indigo", spark, bar, note, extra, size = "md", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`neu-card neu-card-hover rounded-2xl overflow-hidden ${size === "sm" ? "p-4" : "p-5"}`}
    >
      <div className="text-[10px] md:text-xs tracking-wider text-neu-muted uppercase">{label}</div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
        <b className={`text-neu-text ${size === "sm" ? "text-xl" : "text-2xl"}`}>{value}</b>
        {delta && (
          <span className={`text-[10px] md:text-xs font-semibold px-1.5 py-1 rounded-full whitespace-nowrap ${TONE_BADGE[tone]}`}>
            {delta}
          </span>
        )}
        {note && !delta && <span className="text-xs text-neu-muted whitespace-nowrap">{note}</span>}
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
          <div className="neu-track h-1.5 flex-1 rounded-full overflow-hidden">
            <motion.div
              className={`h-1.5 rounded-full ${TONE_BAR[tone]}`}
              initial={{ width: 0 }}
              animate={{ width: `${bar}%` }}
              transition={{ duration: 0.7, delay: index * 0.06 + 0.15, ease: "easeOut" }}
            />
          </div>
          {note && delta && <span className="text-[10px] text-neu-muted whitespace-nowrap">{note}</span>}
        </div>
      )}

      {extra && <div className="text-xs text-neu-muted mt-3">{extra}</div>}
    </motion.div>
  );
}
