import { createContext, useCallback, useContext, useMemo } from 'react';
import usePersistedField from '../hooks/usePersistedField';
import { useCatalog } from './CatalogContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

const mergeIds = (remote, local) => [...new Set([...remote, ...local])];

export function WishlistProvider({ children }) {
  const { byId } = useCatalog();
  const toast = useToast();
  const [ids, update] = usePersistedField('wishlist', { merge: mergeIds });

  const idSet = useMemo(() => new Set(ids), [ids]);
  const items = useMemo(() => ids.map((id) => byId.get(id)).filter(Boolean), [ids, byId]);
  const has = useCallback((id) => idSet.has(id), [idSet]);

  const toggle = useCallback(
    (id) => {
      const saved = idSet.has(id);
      update((list) => (saved ? list.filter((x) => x !== id) : [...list, id]));
      toast.info(saved ? 'Removed from wishlist' : 'Saved to wishlist');
    },
    [idSet, update, toast],
  );

  const value = useMemo(() => ({ items, count: ids.length, has, toggle }), [items, ids.length, has, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
