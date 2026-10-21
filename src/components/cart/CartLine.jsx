import { Link } from 'react-router-dom';
import QuantityStepper from '../ui/QuantityStepper';
import { MAX_QTY } from '../../config/site';
import { useCart } from '../../context/CartContext';
import { formatCurrency, slugToTitle } from '../../utils/format';

export default function CartLine({ line, compact = false }) {
  const { setQuantity, removeItem } = useCart();
  const link = `/product/${line.id}`;
  const max = Math.min(line.stock, MAX_QTY);

  return (
    <li className="flex gap-4 py-5">
      <Link to={link} className={`${compact ? 'h-24 w-24' : 'h-28 w-28 sm:h-32 sm:w-32'} shrink-0 overflow-hidden rounded-xl bg-mist`}>
        <img src={line.thumbnail} alt={line.title} className="h-full w-full object-contain p-2" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link to={link} className="line-clamp-2 font-medium leading-snug hover:text-accent">{line.title}</Link>
            <p className="caption mt-0.5">{line.brand || slugToTitle(line.category)}</p>
          </div>
          <p className="price shrink-0">{formatCurrency(line.finalPrice * line.quantity)}</p>
        </div>
        {line.stock <= 5 && <p className="mt-1 text-[13px] font-medium text-sale">Only {line.stock} left</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper size="sm" value={line.quantity} max={max} onChange={(q) => setQuantity(line.id, q)} />
          <button onClick={() => removeItem(line.id)} className="text-[13px] font-semibold text-ink-mute underline-offset-2 hover:text-sale hover:underline">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
