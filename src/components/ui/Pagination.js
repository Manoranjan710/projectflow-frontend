export default function Pagination({ page, totalPages, onPageChange }) {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safePage = Math.min(Math.max(1, Number(page) || 1), safeTotalPages);

  const canPrev = safePage > 1;
  const canNext = safePage < safeTotalPages;

  const go = (nextPage) => onPageChange?.(nextPage);

  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  const start = Math.max(1, Math.min(safePage - half, safeTotalPages - windowSize + 1));
  const end = Math.min(safeTotalPages, start + windowSize - 1);

  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="text-sm text-slate-600">
        Page <span className="font-medium text-slate-900">{safePage}</span> of{" "}
        <span className="font-medium text-slate-900">{safeTotalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(1)}
          disabled={!canPrev}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          First
        </button>
        <button
          type="button"
          onClick={() => go(safePage - 1)}
          disabled={!canPrev}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Prev
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              className={
                p === safePage
                  ? "rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                  : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
              }
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(safePage + 1)}
          disabled={!canNext}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => go(safeTotalPages)}
          disabled={!canNext}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
}

