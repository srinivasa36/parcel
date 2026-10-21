import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const value = useMemo(
    () => ({ cartOpen, openCart, closeCart, menuOpen, openMenu, closeMenu }),
    [cartOpen, openCart, closeCart, menuOpen, openMenu, closeMenu],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => useContext(UIContext);
