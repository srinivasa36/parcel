import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import usePersistedField from "../hooks/usePersistedField";
import { MAX_QTY } from "../config/site";
import { calcTotals, findCoupon } from "../utils/pricing";
import { useCatalog } from "./CatalogContext";
import { useUI } from "./UIContext";

const CartContext = createContext(null);
const COUPON_KEY = "parcel_coupon";

const mergeCarts = (remote, local) => {
  const map = new Map(remote.map((i) => [i.id, { ...i }]));
  local.forEach((item) => {
    const current = map.get(item.id);
    map.set(
      item.id,
      current
        ? {
            ...current,
            quantity: Math.min(current.quantity + item.quantity, MAX_QTY),
          }
        : item,
    );
  });
  return [...map.values()];
};

export function CartProvider({ children }) {
  const { byId, ready } = useCatalog();
  const { openCart } = useUI();
  const [items, update] = usePersistedField("cart", { merge: mergeCarts });
  const [couponCode, setCouponCode] = useState(() =>
    localStorage.getItem(COUPON_KEY),
  );

  const lines = useMemo(
    () =>
      items
        .map((i) =>
          byId.has(i.id) ? { ...byId.get(i.id), quantity: i.quantity } : null,
        )
        .filter(Boolean),
    [items, byId],
  );
  const totals = useMemo(
    () => calcTotals(lines, { couponCode }),
    [lines, couponCode],
  );

  const clamp = useCallback(
    (id, qty) =>
      Math.max(1, Math.min(qty, byId.get(id)?.stock ?? MAX_QTY, MAX_QTY)),
    [byId],
  );

  const addItem = useCallback(
    (id, quantity = 1, { openDrawer = true } = {}) => {
      update((list) => {
        const existing = list.find((i) => i.id === id);
        return existing
          ? list.map((i) =>
              i.id === id
                ? { ...i, quantity: clamp(id, i.quantity + quantity) }
                : i,
            )
          : [...list, { id, quantity: clamp(id, quantity) }];
      });
      if (openDrawer) openCart();
    },
    [update, clamp, openCart],
  );

  const setQuantity = useCallback(
    (id, quantity) =>
      update((list) =>
        list.map((i) =>
          i.id === id ? { ...i, quantity: clamp(id, quantity) } : i,
        ),
      ),
    [update, clamp],
  );
  const removeItem = useCallback(
    (id) => update((list) => list.filter((i) => i.id !== id)),
    [update],
  );

  const removeCoupon = useCallback(() => {
    localStorage.removeItem(COUPON_KEY);
    setCouponCode(null);
  }, []);

  const clearCart = useCallback(() => {
    update([]);
    removeCoupon();
  }, [update, removeCoupon]);

  const applyCoupon = useCallback((code) => {
    const coupon = findCoupon(code);
    if (!coupon) return { ok: false, message: "That code isn’t valid." };
    localStorage.setItem(COUPON_KEY, coupon.code);
    setCouponCode(coupon.code);
    return { ok: true, message: `${coupon.code} applied: ${coupon.label}.` };
  }, []);

  const value = useMemo(
    () => ({
      lines,
      totals,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      loading: !ready && items.length > 0,
      couponCode,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      lines,
      totals,
      items,
      ready,
      couponCode,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
