import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page = 1, totalPages = 1, onPageChange = () => {} }) {
  const pages = [1, 2, 3].filter((p) => p <= totalPages);
  const showLast = totalPages > 3;

  const pageBtn = (p) =>
    `w-8 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-shadow ${
      p === page ? "neu-pressed-sm text-accent" : "neu-soft text-neu-muted hover:text-neu-text"
    }`;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="neu-icon-btn w-8 h-8 rounded-xl text-neu-muted hover:text-neu-text flex items-center justify-center"
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
          <span className="px-1 text-neu-muted">...</span>
          <button onClick={() => onPageChange(totalPages)} className={pageBtn(totalPages)}>
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="neu-icon-btn w-8 h-8 rounded-xl text-neu-muted hover:text-neu-text flex items-center justify-center"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
