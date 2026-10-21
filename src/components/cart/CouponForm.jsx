import { useState } from 'react';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';

export default function CouponForm() {
  const { couponCode, totals, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    const result = applyCoupon(code);
    setFeedback(result);
    if (result.ok) setCode('');
  };

  if (couponCode && totals.coupon) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-accent-soft px-4 py-3 text-sm">
        <span><span className="font-bold">{totals.coupon.code}</span> · {totals.coupon.label}</span>
        <button onClick={removeCoupon} className="font-semibold text-accent-dark underline-offset-2 hover:underline">Remove</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="coupon" className="mb-1.5 block text-sm font-semibold">Discount code</label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => { setCode(e.target.value); setFeedback(null); }}
          placeholder="Try WELCOME10"
          className="h-11 min-w-0 flex-1 rounded-lg border border-line px-4 text-[15px] uppercase outline-none placeholder:normal-case focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <Button type="submit" variant="dark" size="md">Apply</Button>
      </div>
      {feedback && !feedback.ok && <p className="mt-1.5 text-[13px] text-sale">{feedback.message}</p>}
    </form>
  );
}
