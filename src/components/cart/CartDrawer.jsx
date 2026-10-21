import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import EmptyState from '../ui/EmptyState';
import CartLine from './CartLine';
import FreeShippingBar from './FreeShippingBar';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { formatCurrency } from '../../utils/format';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { lines, totals, count } = useCart();
  const navigate = useNavigate();

  const go = (path) => {
    closeCart();
    navigate(path);
  };

  const footer =
    lines.length > 0 ? (
      <div className="space-y-4">
        <FreeShippingBar remaining={totals.freeShippingRemaining} />
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold">Subtotal</span>
          <span className="price text-lg">{formatCurrency(totals.subtotal)}</span>
        </div>
        <p className="caption">Delivery and tax are calculated at checkout.</p>
        <div className="grid gap-2">
          <Button fullWidth size="lg" onClick={() => go('/checkout')}>Checkout</Button>
          <Button fullWidth variant="secondary" onClick={() => go('/cart')}>View bag</Button>
        </div>
      </div>
    ) : null;

  return (
    <Drawer open={cartOpen} onClose={closeCart} title={`Your bag${count ? ` (${count})` : ''}`} footer={footer}>
      {lines.length === 0 ? (
        <EmptyState
          title="Your bag is empty"
          message="Browse the shop and add something you like."
          action={<Button onClick={() => go('/shop')}>Start shopping</Button>}
        />
      ) : (
        <ul className="divide-y divide-line px-5">
          {lines.map((line) => (
            <CartLine key={line.id} line={line} compact />
          ))}
        </ul>
      )}
    </Drawer>
  );
}
