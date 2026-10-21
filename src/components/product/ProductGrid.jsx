import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { cx } from '../../utils/cx';

export default function ProductGrid({ products = [], loading = false, skeletonCount = 8, className = 'md:grid-cols-3 xl:grid-cols-4' }) {
  return (
    <div className={cx('grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6', className)}>
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
