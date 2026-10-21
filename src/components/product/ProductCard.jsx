import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";
import Price from "../ui/Price";
import Rating from "../ui/Rating";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { slugToTitle } from "../../utils/format";
import { cx } from "../../utils/cx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const soldOut = product.stock < 1;
  const link = `/product/${product.id}`;

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-xl bg-mist">
        <Link to={link} aria-label={product.title} className="block aspect-4/5">
          <img
            src={product.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3">
          {soldOut ? (
            <Badge tone="light">Sold out</Badge>
          ) : product.discountPercentage >= 10 ? (
            <Badge tone="sale">
              −{Math.round(product.discountPercentage)}%
            </Badge>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${product.title} from wishlist`
              : `Save ${product.title} to wishlist`
          }
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110"
        >
          <Icon
            name="heart"
            filled={saved}
            className={cx("h-4.5 w-4.5", saved ? "text-sale" : "text-ink")}
          />
        </button>

        {!soldOut && (
          <>
            <button
              type="button"
              onClick={() => addItem(product.id, 1)}
              className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-ink py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition duration-200 hover:bg-accent focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:block"
            >
              Quick add
            </button>
            <button
              type="button"
              onClick={() => addItem(product.id, 1)}
              aria-label={`Add ${product.title} to bag`}
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-lg lg:hidden"
            >
              <Icon name="plus" className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3.5">
        <p className="caption">
          {product.brand || slugToTitle(product.category)}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-[15px] font-medium leading-snug">
          <Link to={link} className="hover:text-accent">
            {product.title}
          </Link>
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Price price={product.price} finalPrice={product.finalPrice} />
          <Rating compact value={product.rating} />
        </div>
      </div>
    </article>
  );
}
