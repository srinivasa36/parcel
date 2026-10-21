import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCatalog } from '../api/catalog';
import { buildCategories } from '../utils/catalog';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [state, setState] = useState({ products: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchCatalog()
      .then((products) => !cancelled && setState({ products, loading: false, error: null }))
      .catch((err) => !cancelled && setState({ products: [], loading: false, error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const value = useMemo(
    () => ({
      ...state,
      ready: !state.loading && !state.error,
      categories: buildCategories(state.products),
      byId: new Map(state.products.map((p) => [p.id, p])),
      reload: () => setAttempt((n) => n + 1),
    }),
    [state],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);
