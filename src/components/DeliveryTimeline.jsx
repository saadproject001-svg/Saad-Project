import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function DeliveryTimeline({ steps = [] }) {
  return (
    <div className="flex items-start w-full max-w-2xl py-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                step.done ? "bg-indigo-500" : "bg-slate-200"
              }`}
            >
              {step.done && <Check className="w-4 h-4" />}
            </motion.div>
            <div className="text-center">
              <div className={`text-[11px] font-semibold whitespace-nowrap ${step.done ? "text-slate-700" : "text-slate-400"}`}>
                {step.label}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{step.date}</div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-slate-100 -mt-6 overflow-hidden">
              <motion.div
                className="h-0.5 bg-indigo-400"
                initial={{ width: 0 }}
                animate={{ width: step.done ? "100%" : "0%" }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.15, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
