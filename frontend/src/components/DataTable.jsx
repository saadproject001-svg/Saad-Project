import { motion } from "framer-motion";

export default function DataTable({ columns, rows, keyField = "id", emptyLabel = "No records found." }) {
  return (
    <div className="neu-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[720px]">
          <thead className="text-[10px] tracking-wider text-neu-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-left px-5 py-4 whitespace-nowrap">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row[keyField] ?? i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="hover:bg-black/[0.03] transition-colors"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-4 align-middle whitespace-nowrap">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="text-center text-xs text-neu-muted py-14">{emptyLabel}</div>
        )}
      </div>
    </div>
  );
}
