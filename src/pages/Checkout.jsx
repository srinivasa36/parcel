import { useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import Input from '../components/ui/Input';
import PageLoader from '../components/ui/PageLoader';
import Select from '../components/ui/Select';
import OrderSummary from '../components/cart/OrderSummary';
import CardFields from '../components/checkout/CardFields';
import RadioCard from '../components/checkout/RadioCard';
import { COUNTRIES, SHIPPING_OPTIONS } from '../config/site';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { createOrder } from '../services/orders';
import { formatCurrency } from '../utils/format';
import { calcTotals } from '../utils/pricing';
import { validateRequired } from '../utils/validators';

const ADDRESS_KEY = 'parcel_address';
const ADDRESS_LABELS = { fullName: 'Full name', phone: 'Phone number', address: 'Street address', city: 'City', state: 'State / region', postalCode: 'Postal code', country: 'Country' };
const EMPTY_CARD = { cardNumber: '', cardName: '', cardExpiry: '', cardCvc: '' };

const loadAddress = (name) => {
  try {
    return { fullName: name || '', phone: '', address: '', city: '', state: '', postalCode: '', country: COUNTRIES[0], ...JSON.parse(localStorage.getItem(ADDRESS_KEY) || '{}') };
  } catch {
    return { fullName: name || '', phone: '', address: '', city: '', state: '', postalCode: '', country: COUNTRIES[0] };
  }
};

function Step({ number, title, children }) {
  return (
    <section className="border-b border-line pb-8 last:border-0">
      <h2 className="heading mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-sans text-sm font-bold text-white">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Checkout() {
  useDocumentTitle('Checkout');
  const { user } = useAuth();
  const { lines, couponCode, loading, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const placed = useRef(false);

  const [address, setAddress] = useState(() => loadAddress(user?.displayName));
  const [shippingId, setShippingId] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [card, setCard] = useState(EMPTY_CARD);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => calcTotals(lines, { shippingId, couponCode }), [lines, shippingId, couponCode]);

  if (loading) return <PageLoader />;
  if (lines.length === 0 && !placed.current) return <Navigate to="/cart" replace />;

  const setField = (e) => {
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [e.target.name]: undefined }));
  };
  const setCardField = (name, value) => {
    setCard((c) => ({ ...c, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const validate = () => {
    const next = validateRequired(address, ADDRESS_LABELS);
    if (!next.phone && address.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number';
    if (payment === 'card') {
      Object.assign(next, validateRequired(card, { cardNumber: 'Card number', cardName: 'Name on card', cardExpiry: 'Expiry', cardCvc: 'CVC' }));
      if (!next.cardNumber && card.cardNumber.replace(/\s/g, '').length < 13) next.cardNumber = 'Enter a valid card number';
      if (!next.cardExpiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.cardExpiry)) next.cardExpiry = 'Use MM/YY';
      if (!next.cardCvc && card.cardCvc.length < 3) next.cardCvc = '3–4 digits';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    setSubmitting(true);
    try {
      const orderId = await createOrder({
        userId: user.uid,
        email: user.email ?? null,
        items: lines.map((l) => ({ id: l.id, title: l.title, thumbnail: l.thumbnail, price: l.finalPrice, quantity: l.quantity })),
        shipping: address, // card details are intentionally never included
        deliveryMethod: shippingId,
        paymentMethod: payment,
        paymentStatus: payment === 'card' ? 'paid' : 'pending',
        totals: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, tax: totals.tax, total: totals.total, coupon: totals.coupon?.code ?? null },
        status: 'processing',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
      placed.current = true;
      clearCart();
      navigate(`/orders/${orderId}`, { replace: true, state: { placed: true } });
    } catch (err) {
      toast.error(err.message || 'We couldn’t place your order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-8 lg:py-12">
      <h1 className="title mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_26rem] xl:gap-16">
        <div className="space-y-8">
          <Step number="1" title="Contact">
            <Input name="email" label="Email" value={user.email || ''} readOnly />
          </Step>

          <Step number="2" title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input className="sm:col-span-2" name="fullName" label="Full name" autoComplete="name" value={address.fullName} error={errors.fullName} onChange={setField} />
              <Input className="sm:col-span-2" name="phone" type="tel" label="Phone number" autoComplete="tel" value={address.phone} error={errors.phone} onChange={setField} />
              <Input className="sm:col-span-2" name="address" label="Street address" autoComplete="street-address" value={address.address} error={errors.address} onChange={setField} />
              <Input name="city" label="City" autoComplete="address-level2" value={address.city} error={errors.city} onChange={setField} />
              <Input name="state" label="State / region" autoComplete="address-level1" value={address.state} error={errors.state} onChange={setField} />
              <Input name="postalCode" label="Postal code" autoComplete="postal-code" value={address.postalCode} error={errors.postalCode} onChange={setField} />
              <Select name="country" label="Country" value={address.country} onChange={setField}>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </div>
          </Step>

          <Step number="3" title="Delivery method">
            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((option) => {
                const price = calcTotals(lines, { shippingId: option.id, couponCode }).shipping;
                return (
                  <RadioCard key={option.id} name="shipping" value={option.id} checked={shippingId === option.id} onChange={() => setShippingId(option.id)} title={option.label} description={option.eta} aside={price === 0 ? 'Free' : formatCurrency(price)} />
                );
              })}
            </div>
          </Step>

          <Step number="4" title="Payment">
            <div className="space-y-3">
              <RadioCard name="payment" value="card" checked={payment === 'card'} onChange={() => setPayment('card')} title="Credit or debit card" description="Visa, Mastercard, Amex">
                <CardFields values={card} errors={errors} onChange={setCardField} />
              </RadioCard>
              <RadioCard name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} title="Cash on delivery" description="Pay when your order arrives" />
            </div>
          </Step>
        </div>

        <div className="lg:sticky lg:top-40 lg:self-start">
          <OrderSummary totals={totals} showCoupon>
            <ul className="mb-5 max-h-60 space-y-3 overflow-y-auto border-b border-line pb-5">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-3 text-sm">
                  <span className="relative">
                    <img src={l.thumbnail} alt="" className="h-14 w-14 rounded-lg bg-white object-contain" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">{l.quantity}</span>
                  </span>
                  <span className="line-clamp-2 flex-1 font-medium">{l.title}</span>
                  <span className="price">{formatCurrency(l.finalPrice * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <Button type="submit" fullWidth size="lg" loading={submitting}>Place order · {formatCurrency(totals.total)}</Button>
            <p className="caption mt-3 text-center">Demo store: no payment is taken.</p>
          </OrderSummary>
        </div>
      </form>
    </Container>
  );
}
