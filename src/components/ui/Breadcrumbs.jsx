import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-ink-mute">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <Icon name="chevronRight" className="h-3 w-3" />}
            {item.to ? (
              <Link to={item.to} className="hover:text-ink hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
