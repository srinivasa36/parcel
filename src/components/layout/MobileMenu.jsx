import { Link } from 'react-router-dom';
import Drawer from '../ui/Drawer';
import { FEATURED_CATEGORIES } from '../../config/site';
import { useAuth } from '../../context/AuthContext';
import { useCatalog } from '../../context/CatalogContext';
import { useUI } from '../../context/UIContext';
import { slugToTitle } from '../../utils/format';

export default function MobileMenu() {
  const { menuOpen, closeMenu } = useUI();
  const { isAuthenticated, user, logout } = useAuth();
  const { categories } = useCatalog();
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  const row = 'block px-5 py-3 text-[17px] font-medium hover:bg-mist';

  return (
    <Drawer open={menuOpen} onClose={closeMenu} side="left" title="Menu" widthClass="max-w-[22rem]">
      <nav className="py-2">
        <Link to="/shop" className={row}>All products</Link>
        <Link to="/shop?sort=discount-desc" className={`${row} text-sale`}>Deals</Link>
        <p className="caption px-5 pb-1 pt-5 font-semibold">Shop by category</p>
        {FEATURED_CATEGORIES.map((slug) => (
          <Link key={slug} to={`/shop?category=${slug}`} className={row}>
            {names.get(slug) || slugToTitle(slug)}
          </Link>
        ))}
        <div className="mt-4 border-t border-line pt-2">
          <Link to="/wishlist" className={row}>Wishlist</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" className={row}>My orders</Link>
              <button className={`${row} w-full text-left`} onClick={() => { closeMenu(); logout(); }}>
                Sign out ({user.displayName || user.email})
              </button>
            </>
          ) : (
            <Link to="/login" className={row}>Sign in</Link>
          )}
        </div>
      </nav>
    </Drawer>
  );
}
