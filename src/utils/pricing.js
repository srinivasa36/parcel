import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_OPTIONS,
  TAX_RATE,
} from "../config/site";

export const COUPONS = {
  WELCOME10: { type: "percent", value: 10, label: "10% off your order" },
  FREESHIP: { type: "shipping", label: "Free standard delivery" },
};

export const findCoupon = (code = "") => {
  const key = code.trim().toUpperCase();
  return COUPONS[key] ? { code: key, ...COUPONS[key] } : null;
};

const roundMoney = (n) => Math.round(n);

export function calcTotals(
  lines,
  { shippingId = "standard", couponCode = null } = {},
) {
  const coupon = couponCode ? findCoupon(couponCode) : null;
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = roundMoney(
    lines.reduce((sum, l) => sum + l.finalPrice * l.quantity, 0),
  );
  const discount =
    coupon?.type === "percent"
      ? roundMoney((subtotal * coupon.value) / 100)
      : 0;
  const discounted = roundMoney(subtotal - discount);

  const option =
    SHIPPING_OPTIONS.find((o) => o.id === shippingId) || SHIPPING_OPTIONS[0];
  let shipping = 0;
  if (lines.length > 0) {
    const free =
      option.freeOver !== undefined &&
      (discounted >= option.freeOver || coupon?.type === "shipping");
    shipping = free ? 0 : option.price;
  }

  const tax = roundMoney(discounted * TAX_RATE);
  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    total: roundMoney(discounted + shipping + tax),
    coupon,
    freeShippingRemaining: Math.max(
      0,
      roundMoney(FREE_SHIPPING_THRESHOLD - discounted),
    ),
  };
}
