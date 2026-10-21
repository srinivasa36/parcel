import { useState } from "react";
import { cx } from "../../utils/cx";

export default function ProductGallery({ images = [], title }) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto lg:max-h-136 lg:w-19 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={cx(
                "h-19 w-19 shrink-0 overflow-hidden rounded-lg bg-mist ring-offset-2 transition",
                i === active
                  ? "ring-2 ring-ink"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-contain p-1.5 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
      <div className="aspect-square flex-1 overflow-hidden rounded-2xl bg-mist">
        {current && (
          <img
            src={current}
            alt={title}
            className="h-full w-full object-contain p-8 mix-blend-multiply"
          />
        )}
      </div>
    </div>
  );
}
