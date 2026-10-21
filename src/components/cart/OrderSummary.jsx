import CouponForm from "./CouponForm";
import { TAX_RATE } from "../../config/site";
import { formatCurrency } from "../../utils/format";

function Row({ label, value, tone }) {
  return (
    <div
      className={`flex justify-between text-[15px] ${tone === "ok" ? "text-ok" : "text-ink-soft"}`}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export default function OrderSummary({
  totals,
  showCoupon = false,
  title = "Order summary",
  className = "",
  children,
}) {
  return (
    <aside className={`rounded-2xl bg-mist p-6 ${className}`}>
      <h2 className="heading mb-5">{title}</h2>
      {showCoupon && (
        <div className="mb-5">
          <CouponForm />
        </div>
      )}
      <dl className="space-y-3">
        <Row
          label={`Subtotal (${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"})`}
          value={formatCurrency(totals.subtotal)}
        />
        {totals.discount > 0 && (
          <Row
            tone="ok"
            label={`Discount (${totals.coupon.code})`}
            value={`−${formatCurrency(totals.discount)}`}
          />
        )}
        <Row
          label="Delivery"
          value={
            totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)
          }
        />
        <Row
          label={`GST (${Math.round(TAX_RATE * 100)}%)`}
          value={formatCurrency(totals.tax)}
        />
        <div className="flex justify-between border-t border-line pt-4 text-lg font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatCurrency(totals.total)}</dd>
        </div>
      </dl>
      {children && <div className="mt-6">{children}</div>}
    </aside>
  );
}
