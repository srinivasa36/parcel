import { useEffect } from "react";
import { cx } from "../../utils/cx";
import Icon from "./Icon";

export default function Drawer({
  open,
  onClose,
  title,
  side = "right",
  widthClass = "max-w-[26rem]",
  footer,
  children,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    const previous = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const closedTransform =
    side === "right" ? "translate-x-full" : "-translate-x-full";

  return (
    <div className={cx("fixed inset-0 z-50", !open && "pointer-events-none")}>
      <div
        onClick={onClose}
        className={cx(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        inert={open ? undefined : ""}
        className={cx(
          "absolute inset-y-0 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          widthClass,
          side === "right" ? "right-0" : "left-0",
          open ? "translate-x-0" : closedTransform,
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="heading">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-ink-soft hover:bg-mist"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-line p-5">{footer}</div>
        )}
      </aside>
    </div>
  );
}
