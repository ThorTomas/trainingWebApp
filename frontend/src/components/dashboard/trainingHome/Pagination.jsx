import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, pageCount, setPage }) {
  if (!pageCount || isNaN(pageCount) || pageCount <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < pageCount - 3) pages.push("...");
      pages.push(pageCount);
    }
    return pages;
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button
        className="pagination-btn"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft size={20} />
      </button>
      {getPages().map((p, idx) =>
        p === "..." ? (
          <button
            key={`ellipsis-${idx}`}
            className="pagination-btn"
            disabled
            tabIndex={-1}
            aria-hidden="true"
            style={{ pointerEvents: "none" }}
          >
            …
          </button>
        ) : (
          <button
            key={p}
            className={`pagination-btn${page === p ? " active" : ""}`}
            onClick={() => setPage(p)}
          >
            {p-1}
          </button>
        )
      )}
      <button
        className="pagination-btn"
        onClick={() => setPage(page + 1)}
        disabled={page === pageCount}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}