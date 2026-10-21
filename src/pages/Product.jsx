import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../api/catalog";
import Accordion from "../components/ui/Accordion";
import Badge from "../components/ui/Badge";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import PageLoader from "../components/ui/PageLoader";
import Price from "../components/ui/Price";
import QuantityStepper from "../components/ui/QuantityStepper";
import Rating from "../components/ui/Rating";
import Section from "../components/ui/Section";
import ProductGallery from "../components/product/ProductGallery";
import ProductRow from "../components/product/ProductRow";
import ReviewList from "../components/product/ReviewList";
import { MAX_QTY } from "../config/site";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import { useWishlist } from "../context/WishlistContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFetch from "../hooks/useFetch";
import { formatCurrency, slugToTitle } from "../utils/format";
import { cx } from "../utils/cx";

function Specs({ product }) {
  const { dimensions } = product;
  const rows = [
    ["Brand", product.brand],
    ["SKU", product.sku],
    ["Weight", product.weight && `${product.weight} g`],
    [
      "Dimensions",
      dimensions &&
        `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} cm`,
    ],
    ["Warranty", product.warrantyInformation],
    ["Minimum order", product.minimumOrderQuantity],
  ].filter(([, value]) => value);

  return (
    <dl className="divide-y divide-line">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[8rem_1fr] gap-4 py-3 first:pt-0"
        >
          <dt className="font-semibold text-ink">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StockStatus({ stock }) {
  if (stock < 1)
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-sale">
        <span className="h-2 w-2 rounded-full bg-sale" />
        Out of stock
      </p>
    );
  if (stock <= 10)
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        Only {stock} left, order soon
      </p>
    );
  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-ok">
      <span className="h-2 w-2 rounded-full bg-ok" />
      In stock
    </p>
  );
}

function ProductView({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { products } = useCatalog();
  const [quantity, setQuantity] = useState(1);

  const related = useMemo(
    () =>
      products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8),
    [products, product.category, product.id],
  );

  const soldOut = product.stock < 1;
  const saved = has(product.id);
  const savings = product.price - product.finalPrice;
  const categoryName = slugToTitle(product.category);
  const add = () => addItem(product.id, quantity);

  const delivery = [
    ["truck", product.shippingInformation],
    ["returns", product.returnPolicy],
    ["shield", product.warrantyInformation],
  ].filter(([, text]) => text);

  const accordion = [
    {
      id: "description",
      title: "Description",
      defaultOpen: true,
      content: (
        <p className="max-w-prose leading-relaxed">{product.description}</p>
      ),
    },
    {
      id: "specs",
      title: "Specifications",
      content: <Specs product={product} />,
    },
    {
      id: "reviews",
      title: `Reviews (${product.reviews?.length || 0})`,
      content: <ReviewList reviews={product.reviews} />,
    },
  ];

  return (
    <>
      <Container className="pb-28 pt-6 lg:pb-14">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/shop" },
            { label: categoryName, to: `/shop?category=${product.category}` },
            { label: product.title },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery images={product.images} title={product.title} />

          <div className="lg:sticky lg:top-40 lg:self-start">
            {product.brand && (
              <Link
                to={`/shop?q=${encodeURIComponent(product.brand)}`}
                className="text-sm font-semibold text-accent hover:underline"
              >
                {product.brand}
              </Link>
            )}
            <h1 className="title mt-1">{product.title}</h1>
            <div className="mt-3">
              <Rating value={product.rating} count={product.reviews?.length} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Price
                size="lg"
                price={product.price}
                finalPrice={product.finalPrice}
              />
              {savings > 0.005 && (
                <Badge tone="sale">Save {formatCurrency(savings)}</Badge>
              )}
            </div>
            <p className="caption mt-1">Tax calculated at checkout</p>

            <p className="mt-6 line-clamp-4 leading-relaxed text-ink-soft">
              {product.description}
            </p>
            <div className="mt-5">
              <StockStatus stock={product.stock} />
            </div>

            <div className="mt-7 flex items-center gap-3">
              <QuantityStepper
                value={quantity}
                max={Math.min(product.stock, MAX_QTY)}
                disabled={soldOut}
                onChange={setQuantity}
              />
              <Button
                size="lg"
                className="flex-1"
                disabled={soldOut}
                onClick={add}
              >
                {soldOut ? "Sold out" : "Add to bag"}
              </Button>
              <button
                onClick={() => toggle(product.id)}
                aria-pressed={saved}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-line transition hover:border-ink"
              >
                <Icon
                  name="heart"
                  filled={saved}
                  className={cx("h-6 w-6", saved ? "text-sale" : "text-ink")}
                />
              </button>
            </div>

            {delivery.length > 0 && (
              <ul className="mt-8 space-y-3.5 rounded-2xl bg-mist p-5">
                {delivery.map(([icon, text]) => (
                  <li key={icon} className="flex items-start gap-3 text-sm">
                    <Icon
                      name={icon}
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            )}

            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/shop?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-mist px-3 py-1 text-[13px] text-ink-soft hover:bg-line"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 max-w-3xl lg:mt-20">
          <Accordion items={accordion} />
        </div>

        {related.length > 0 && (
          <Section
            title="You may also like"
            linkTo={`/shop?category=${product.category}`}
            className="mt-10 pt-4 lg:mt-16"
          >
            <ProductRow products={related} />
          </Section>
        )}
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-white px-4 py-3 lg:hidden">
        <div className="min-w-0">
          <Price
            price={product.price}
            finalPrice={product.finalPrice}
            size="md"
          />
          <p className="caption truncate">{product.title}</p>
        </div>
        <Button className="ml-auto shrink-0" disabled={soldOut} onClick={add}>
          {soldOut ? "Sold out" : "Add to bag"}
        </Button>
      </div>
    </>
  );
}

export default function Product() {
  const { id } = useParams();
  const {
    data: product,
    loading,
    error,
    refetch,
  } = useFetch(() => fetchProduct(id), [id]);
  useDocumentTitle(product?.title);

  if (loading) return <PageLoader />;
  if (error) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Product unavailable"
          message={error}
          onRetry={refetch}
        />
      </Container>
    );
  }
  return <ProductView key={product.id} product={product} />;
}
