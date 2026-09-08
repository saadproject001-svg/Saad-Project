import { motion } from "framer-motion";

function Toggle({ checked }) {
  return (
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-shadow neu-pressed-sm`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`h-5 w-5 rounded-full neu-soft ${checked ? "bg-accent" : "bg-neu-bg"}`}
        style={{ marginLeft: checked ? 22 : 2 }}
      />
    </span>
  );
}

export default function SettingsForm({ groups }) {
  return (
    <div className="space-y-6">
      {groups.map((group, gi) => (
        <motion.section
          key={group.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: gi * 0.08, ease: "easeOut" }}
          className="neu-card rounded-2xl overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-5">
            <div className="font-semibold text-sm text-neu-text">{group.title}</div>
            {group.description && <div className="text-xs text-neu-muted mt-1">{group.description}</div>}
          </div>
          <div>
            {group.fields.map((f, i) => (
              <div
                key={f.label}
                className="px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-neu-text">{f.label}</div>
                  {f.description && <div className="text-xs text-neu-muted mt-1">{f.description}</div>}
                </div>
                {f.type === "toggle" && <Toggle checked={f.value} />}
                {f.type === "input" && (
                  <input
                    defaultValue={f.value}
                    className="neu-input h-10 w-full sm:w-64 shrink-0 rounded-xl px-3 text-sm text-neu-text outline-none"
                  />
                )}
                {f.type === "select" && (
                  <select className="neu-input h-10 w-full sm:w-64 shrink-0 rounded-xl px-3 text-sm text-neu-text outline-none">
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}
                {f.type === "button" && (
                  <button className="neu-btn-accent h-10 px-4 rounded-xl text-white text-sm font-semibold shrink-0">
                    {f.value}
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
