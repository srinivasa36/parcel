import { useEffect, useState } from "react";
import { PRICE_PRESETS } from "../../config/site";
import { cx } from "../../utils/cx";
import Icon from "../ui/Icon";

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-line py-6 first:pt-0 last:border-0">
      <legend className="mb-3 text-sm font-bold">{title}</legend>
      {children}
    </fieldset>
  );
}

const RATING_OPTIONS = [4.5, 4, 3];

export default function FilterPanel({
  categories,
  filters,
  onChange,
  onClear,
  hasFilters,
  showTitle = true,
}) {
  const [minInput, setMinInput] = useState(filters.min);
  const [maxInput, setMaxInput] = useState(filters.max);

  useEffect(() => {
    setMinInput(filters.min);
    setMaxInput(filters.max);
  }, [filters.min, filters.max]);

  const applyPrice = () => onChange({ min: minInput, max: maxInput });
  const rangeInput =
    "h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between lg:mb-5">
        {showTitle ? <h2 className="heading">Filters</h2> : <span />}
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-sm font-semibold text-accent hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Group title="Category">
        <ul className="no-scrollbar max-h-64 space-y-0.5 overflow-y-auto pr-1">
          {[
            { slug: "", name: "All categories", count: null },
            ...categories,
          ].map((c) => (
            <li key={c.slug || "all"}>
              <button
                onClick={() => onChange({ category: c.slug, q: "" })}
                aria-pressed={filters.category === c.slug}
                className={cx(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                  filters.category === c.slug
                    ? "bg-ink font-semibold text-white"
                    : "text-ink-soft hover:bg-mist",
                )}
              >
                <span>{c.name}</span>
                {c.count !== null && (
                  <span
                    className={cx(
                      "text-xs",
                      filters.category === c.slug
                        ? "text-white/70"
                        : "text-ink-mute",
                    )}
                  >
                    {c.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Price">
        <div className="mb-3 flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              filters.min === String(preset.min) &&
              filters.max === String(preset.max);
            return (
              <button
                key={preset.label}
                onClick={() =>
                  onChange(
                    active
                      ? { min: "", max: "" }
                      : { min: String(preset.min), max: String(preset.max) },
                  )
                }
                aria-pressed={active}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-[13px] font-medium transition",
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className={rangeInput}
          />
          <span className="text-ink-mute">to</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            className={rangeInput}
          />
        </div>
      </Group>

      <Group title="Customer rating">
        <div className="space-y-1">
          {RATING_OPTIONS.map((value) => (
            <button
              key={value}
              onClick={() =>
                onChange({
                  rating: filters.rating === String(value) ? "" : String(value),
                })
              }
              aria-pressed={filters.rating === String(value)}
              className={cx(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                filters.rating === String(value)
                  ? "bg-ink font-semibold text-white"
                  : "text-ink-soft hover:bg-mist",
              )}
            >
              <Icon
                name="star"
                filled
                strokeWidth={0}
                className="h-4 w-4 text-star"
              />
              {value} & up
            </button>
          ))}
        </div>
      </Group>

      <Group title="Availability">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={filters.stock === "1"}
            onChange={(e) => onChange({ stock: e.target.checked ? "1" : "" })}
            className="h-4.5 w-4.5 accent-accent"
          />
          In stock only
        </label>
      </Group>
    </div>
  );
}
