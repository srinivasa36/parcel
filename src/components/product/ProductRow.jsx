import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductRow({ products = [], loading = false }) {
  const item = "w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]";
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:gap-6 lg:px-0">
      {loading
        ? Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={item}>
              <ProductCardSkeleton />
            </div>
          ))
        : products.map((p) => (
            <div key={p.id} className={item}>
              <ProductCard product={p} />
            </div>
          ))}
    </div>
  );
}
