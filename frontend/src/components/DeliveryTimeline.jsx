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
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                step.done ? "bg-accent text-white neu-soft" : "neu-pressed-sm text-neu-muted"
              }`}
            >
              {step.done && <Check className="w-4 h-4" />}
            </motion.div>
            <div className="text-center">
              <div className={`text-[11px] font-semibold whitespace-nowrap ${step.done ? "text-neu-text" : "text-neu-muted"}`}>
                {step.label}
              </div>
              <div className="text-[10px] text-neu-muted mt-0.5">{step.date}</div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="neu-track flex-1 h-0.5 rounded -mt-6 overflow-hidden">
              <motion.div
                className="h-0.5 bg-accent"
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
