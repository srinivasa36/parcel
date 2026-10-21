import { useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import Section from "../components/ui/Section";
import ProductRow from "../components/product/ProductRow";
import ProductGrid from "../components/product/ProductGrid";
import {
  FEATURED_CATEGORIES,
  FREE_SHIPPING_THRESHOLD,
  HERO_CATEGORIES,
} from "../config/site";
import { useCatalog } from "../context/CatalogContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { formatCurrency } from "../utils/format";
import { cx } from "../utils/cx";

const TILE_TINTS = ["bg-[#e7e9ff]", "bg-[#fde8e2]", "bg-[#e1f0e8]"];
const TILE_LAYOUT = ["col-span-3 row-span-2", "col-span-2", "col-span-2"];

function HeroTile({ product, index }) {
  if (!product)
    return (
      <div
        className={cx("animate-pulse rounded-2xl bg-mist", TILE_LAYOUT[index])}
      />
    );
  return (
    <Link
      to={`/product/${product.id}`}
      className={cx(
        "group relative overflow-hidden rounded-2xl",
        TILE_TINTS[index],
        TILE_LAYOUT[index],
      )}
    >
      <img
        src={product.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 sm:p-8"
      />
      <span className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-white py-1.5 pl-3.5 pr-3 text-[13px] shadow-sm">
        <span className="truncate font-medium">{product.title}</span>
        <span className="price shrink-0">
          {formatCurrency(product.finalPrice)}
        </span>
      </span>
    </Link>
  );
}

const PERKS = [
  {
    icon: "truck",
    title: "Free delivery",
    text: `On every order over ${formatCurrency(FREE_SHIPPING_THRESHOLD)}`,
  },
  {
    icon: "returns",
    title: "30-day returns",
    text: "Changed your mind? Send it back, no fuss",
  },
  {
    icon: "shield",
    title: "Secure checkout",
    text: "Your details are protected end to end",
  },
];

export default function Home() {
  useDocumentTitle();
  const { products, categories, loading, error, reload } = useCatalog();

  const { heroProducts, featured, deals, topRated } = useMemo(() => {
    const bySlug = new Map(categories.map((c) => [c.slug, c]));
    return {
      heroProducts: HERO_CATEGORIES.map((slug) => bySlug.get(slug)?.cover),
      featured: FEATURED_CATEGORIES.map((slug) => bySlug.get(slug)).filter(
        Boolean,
      ),
      deals: [...products]
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 8),
      topRated: [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
    };
  }, [products, categories]);

  if (error) {
    return (
      <Container className="py-20">
        <ErrorState
          title="We couldn’t load the store"
          message={error}
          onRetry={reload}
        />
      </Container>
    );
  }

  return (
    <Container>
      <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-16">
        <div>
          <h1 className="display">Everyday things, thoughtfully chosen.</h1>
          <p className="lede mt-6 max-w-md">
            {products.length > 0
              ? `${products.length} products`
              : "Hundreds of products"}{" "}
            across {categories.length || 24} categories, from phones and laptops
            to fragrances and furniture.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/shop" size="lg">
              Shop all products
            </Button>
            <Button to="/shop?sort=discount-desc" size="lg" variant="secondary">
              See deals
            </Button>
          </div>
        </div>
        <div className="grid h-88 grid-cols-5 grid-rows-2 gap-3 sm:h-120 lg:h-136">
          {[0, 1, 2].map((i) => (
            <HeroTile
              key={i}
              index={i}
              product={loading ? null : heroProducts[i]}
            />
          ))}
        </div>
      </section>

      <section
        aria-label="Why shop with us"
        className="grid gap-6 border-y border-line py-7 sm:grid-cols-3"
      >
        {PERKS.map((perk) => (
          <div key={perk.title} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-dark">
              <Icon name={perk.icon} />
            </span>
            <div>
              <p className="font-semibold">{perk.title}</p>
              <p className="caption mt-0.5">{perk.text}</p>
            </div>
          </div>
        ))}
      </section>

      <Section title="Shop by category" linkTo="/shop" linkLabel="All products">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-5/4 animate-pulse rounded-xl bg-mist"
                />
              ))
            : featured.map((c) => (
                <Link
                  key={c.slug}
                  to={`/shop?category=${c.slug}`}
                  className="group relative aspect-5/4 overflow-hidden rounded-xl bg-mist"
                >
                  <img
                    src={c.cover.thumbnail}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain p-6 pb-12 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3.5">
                    <span className="font-semibold">{c.name}</span>
                    <span className="caption">{c.count}</span>
                  </span>
                </Link>
              ))}
        </div>
      </Section>

      <Section title="Deals this week" linkTo="/shop?sort=discount-desc">
        <ProductRow products={deals} loading={loading} />
      </Section>

      <Section
        title="Top rated"
        linkTo="/shop?sort=rating-desc"
        className="pb-6 pt-4 lg:pt-6"
      >
        <ProductGrid products={topRated} loading={loading} />
      </Section>
    </Container>
  );
}
