import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page = 1, totalPages = 1, onPageChange = () => {} }) {
  const pages = [1, 2, 3].filter((p) => p <= totalPages);
  const showLast = totalPages > 3;

  const pageBtn = (p) =>
    `w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center ${
      p === page ? "bg-[#6366ed] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 flex items-center justify-center"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={pageBtn(p)}>
          {p}
        </button>
      ))}
      {showLast && (
        <>
          <span className="px-1 text-slate-400">...</span>
          <button onClick={() => onPageChange(totalPages)} className={pageBtn(totalPages)}>
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
