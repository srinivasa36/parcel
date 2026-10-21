import Icon from "./Icon";
import { cx } from "../../utils/cx";

function getPageRange(page, total) {
  const pages = [...new Set([1, total, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  return pages.flatMap((p, i) =>
    i > 0 && p - pages[i - 1] > 1 ? ["…", p] : [p],
  );
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition";

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-1.5"
    >
      <button
        className={cx(
          base,
          "hover:bg-mist disabled:opacity-30 disabled:hover:bg-transparent",
        )}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevronLeft" className="h-4 w-4" />
      </button>
      {getPageRange(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-ink-mute">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cx(
              base,
              item === page ? "bg-ink text-white" : "text-ink hover:bg-mist",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        className={cx(
          base,
          "hover:bg-mist disabled:opacity-30 disabled:hover:bg-transparent",
        )}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <Icon name="chevronRight" className="h-4 w-4" />
      </button>
    </nav>
  );
}
