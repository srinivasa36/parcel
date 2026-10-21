import Icon from "./Icon";
import { cx } from "../../utils/cx";

export default function Rating({
  value = 0,
  count,
  compact = false,
  className = "",
}) {
  if (compact) {
    return (
      <span
        className={cx(
          "inline-flex items-center gap-1 text-[13px] font-medium text-ink-soft",
          className,
        )}
        aria-label={`Rated ${value.toFixed(1)} out of 5`}
      >
        <Icon
          name="star"
          filled
          strokeWidth={0}
          className="h-3.5 w-3.5 text-star"
        />
        {value.toFixed(1)}
      </span>
    );
  }
  const rounded = Math.round(value);
  return (
    <span
      className={cx("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
    >
      <span className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Icon
            key={s}
            name="star"
            filled
            strokeWidth={0}
            className={cx("h-4 w-4", s <= rounded ? "text-star" : "text-line")}
          />
        ))}
      </span>
      <span className="text-sm font-medium text-ink-soft">
        {value.toFixed(1)}
      </span>
      {count !== undefined && <span className="caption">({count})</span>}
    </span>
  );
}
