import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import PageLoader from '../components/ui/PageLoader';
import CartLine from '../components/cart/CartLine';
import FreeShippingBar from '../components/cart/FreeShippingBar';
import OrderSummary from '../components/cart/OrderSummary';
import { useCart } from '../context/CartContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Cart() {
  useDocumentTitle('Your bag');
  const { lines, totals, loading, clearCart } = useCart();

  if (loading) return <PageLoader />;

  if (lines.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState title="Your bag is empty" message="Items you add will show up here." action={<Button to="/shop">Start shopping</Button>} />
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="title">Your bag <span className="text-ink-mute">({totals.itemCount})</span></h1>
        <button onClick={clearCart} className="text-sm font-semibold text-ink-mute underline-offset-2 hover:text-sale hover:underline">Clear bag</button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_24rem] xl:gap-16">
        <div>
          <div className="mb-2 rounded-2xl border border-line p-5"><FreeShippingBar remaining={totals.freeShippingRemaining} /></div>
          <ul className="divide-y divide-line">
            {lines.map((line) => (
              <CartLine key={line.id} line={line} />
            ))}
          </ul>
        </div>

        <OrderSummary totals={totals} showCoupon className="lg:sticky lg:top-40 lg:self-start">
          <Button to="/checkout" fullWidth size="lg">Checkout</Button>
          <Button to="/shop" variant="ghost" fullWidth className="mt-2">Continue shopping</Button>
        </OrderSummary>
      </div>
    </Container>
  );
}
