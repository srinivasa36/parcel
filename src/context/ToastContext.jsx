import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cx } from "../utils/cx";

const ToastContext = createContext(null);

const TONES = {
  success: "bg-ink text-white",
  error: "bg-sale text-white",
  info: "bg-ink text-white",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(
    (id) => setToasts((list) => list.filter((t) => t.id !== id)),
    [],
  );

  const push = useCallback(
    (type, message) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => remove(id), 3200);
    },
    [remove],
  );

  const toast = useMemo(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-60 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cx(
              "pointer-events-auto rounded-full px-5 py-2.5 text-sm font-medium shadow-lg",
              TONES[t.type],
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
