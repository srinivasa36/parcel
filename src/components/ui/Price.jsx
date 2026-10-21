import { formatCurrency } from '../../utils/format';
import { cx } from '../../utils/cx';

export default function Price({ price, finalPrice, size = 'md', className = '' }) {
  const hasDiscount = finalPrice < price;
  const sizes = { md: 'text-[15px]', lg: 'text-3xl' };
  return (
    <span className={cx('inline-flex flex-wrap items-baseline gap-x-2', className)}>
      <span className={cx('price', sizes[size], hasDiscount && size === 'lg' && 'text-sale')}>{formatCurrency(finalPrice)}</span>
      {hasDiscount && (
        <span className={cx('tabular-nums text-ink-mute line-through', size === 'lg' ? 'text-lg' : 'text-[13px]')}>{formatCurrency(price)}</span>
      )}
    </span>
  );
}
