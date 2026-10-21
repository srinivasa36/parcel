import { FREE_SHIPPING_THRESHOLD } from '../../config/site';
import { formatCurrency } from '../../utils/format';

export default function FreeShippingBar({ remaining }) {
  const progress = Math.min(100, Math.max(0, ((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100));
  return (
    <div>
      <p className="text-sm">
        {remaining > 0 ? (
          <>You’re <span className="font-bold">{formatCurrency(remaining)}</span> away from free delivery</>
        ) : (
          <span className="font-semibold text-ok">You’ve unlocked free standard delivery</span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
