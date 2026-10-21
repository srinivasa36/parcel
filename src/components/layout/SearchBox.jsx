import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useCatalog } from '../../context/CatalogContext';
import { searchProducts } from '../../utils/catalog';
import { formatCurrency, slugToTitle } from '../../utils/format';

export default function SearchBox({ className = '', onDone }) {
  const { products } = useCatalog();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const trimmed = query.trim();
  const suggestions = useMemo(() => (trimmed.length >= 2 ? searchProducts(products, trimmed).slice(0, 6) : []), [products, trimmed]);

  useEffect(() => {
    const onPointerDown = (e) => wrapperRef.current && !wrapperRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const finish = () => {
    setOpen(false);
    setQuery('');
    onDone?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trimmed) return;
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    finish();
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-mute" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          placeholder="Search for products, brands and more"
          aria-label="Search products"
          autoComplete="off"
          className="h-11 w-full rounded-full border border-transparent bg-mist pl-12 pr-4 text-[15px] outline-none transition placeholder:text-ink-mute focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
        />
      </form>

      {open && trimmed.length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
          {suggestions.length > 0 ? (
            <>
              <ul>
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.id}`} onClick={finish} className="flex items-center gap-3 px-4 py-2.5 hover:bg-mist">
                      <img src={p.thumbnail} alt="" className="h-11 w-11 shrink-0 rounded-lg bg-mist object-contain" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{p.title}</span>
                        <span className="caption">{slugToTitle(p.category)}</span>
                      </span>
                      <span className="price text-sm">{formatCurrency(p.finalPrice)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={handleSubmit} className="w-full border-t border-line px-4 py-3 text-left text-sm font-semibold text-accent hover:bg-mist">
                See all results for “{trimmed}”
              </button>
            </>
          ) : (
            <p className="px-4 py-5 text-sm text-ink-soft">No matches for “{trimmed}”. Try a broader term.</p>
          )}
        </div>
      )}
    </div>
  );
}
