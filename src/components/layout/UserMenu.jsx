import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const name = user.displayName || user.email;
  const itemClass = 'block w-full px-4 py-2.5 text-left text-sm hover:bg-mist';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-dark transition hover:bg-accent hover:text-white"
      >
        {name.charAt(0).toUpperCase()}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-xl">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.displayName || 'Your account'}</p>
            <p className="caption truncate">{user.email}</p>
          </div>
          <Link to="/orders" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>My orders</Link>
          <Link to="/wishlist" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>Wishlist</Link>
          <button role="menuitem" className={`${itemClass} border-t border-line`} onClick={() => { setOpen(false); logout(); }}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
