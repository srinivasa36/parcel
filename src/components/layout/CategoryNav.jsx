import { NavLink, useLocation } from 'react-router-dom';
import { FEATURED_CATEGORIES } from '../../config/site';
import { useCatalog } from '../../context/CatalogContext';
import { slugToTitle } from '../../utils/format';
import { cx } from '../../utils/cx';

export default function CategoryNav() {
  const { categories } = useCatalog();
  const { search } = useLocation();
  const active = new URLSearchParams(search).get('category');

  const names = new Map(categories.map((c) => [c.slug, c.name]));
  const link = 'whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors';

  return (
    <nav aria-label="Categories" className="no-scrollbar -mx-1 hidden gap-7 overflow-x-auto px-1 md:flex">
      <NavLink to="/shop" end className={({ isActive }) => cx(link, isActive && !active ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink')}>
        All products
      </NavLink>
      {FEATURED_CATEGORIES.map((slug) => (
        <NavLink
          key={slug}
          to={`/shop?category=${slug}`}
          className={cx(link, active === slug ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink')}
        >
          {names.get(slug) || slugToTitle(slug)}
        </NavLink>
      ))}
      <NavLink to="/shop?sort=discount-desc" className={cx(link, 'ml-auto font-semibold text-sale', 'border-transparent')}>
        Deals
      </NavLink>
    </nav>
  );
}
