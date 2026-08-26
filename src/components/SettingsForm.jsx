import { motion } from "framer-motion";

function Toggle({ checked }) {
  return (
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[#6366ed]" : "bg-slate-200"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="h-5 w-5 rounded-full bg-white shadow"
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
          className="bg-white rounded-xl shadow-[0_3px_12px_rgba(30,41,59,.07)] overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-5 border-b border-slate-100">
            <div className="font-semibold text-sm">{group.title}</div>
            {group.description && <div className="text-xs text-slate-400 mt-1">{group.description}</div>}
          </div>
          <div>
            {group.fields.map((f, i) => (
              <div
                key={f.label}
                className={`px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 ${
                  i < group.fields.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium">{f.label}</div>
                  {f.description && <div className="text-xs text-slate-400 mt-1">{f.description}</div>}
                </div>
                {f.type === "toggle" && <Toggle checked={f.value} />}
                {f.type === "input" && (
                  <input
                    defaultValue={f.value}
                    className="h-10 w-full sm:w-64 shrink-0 rounded-lg border border-slate-200 bg-[#f8f9fb] px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                )}
                {f.type === "select" && (
                  <select className="h-10 w-full sm:w-64 shrink-0 rounded-lg border border-slate-200 bg-[#f8f9fb] px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100">
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}
                {f.type === "button" && (
                  <button className="h-10 px-4 rounded-lg bg-[#6366ed] text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 shrink-0">
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
