import { Link } from "react-router-dom";
import Container from "../ui/Container";
import { Wordmark } from "./Header";
import { FEATURED_CATEGORIES } from "../../config/site";
import { slugToTitle } from "../../utils/format";

const linkClass = "text-sm text-ink-soft hover:text-ink hover:underline";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-mist">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-4 text-sm text-ink-soft">
            Everyday things, thoughtfully chosen.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-bold tracking-normal">
            Shop
          </h2>
          <ul className="space-y-2">
            {FEATURED_CATEGORIES.slice(0, 5).map((slug) => (
              <li key={slug}>
                <Link className={linkClass} to={`/shop?category=${slug}`}>
                  {slugToTitle(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-bold tracking-normal">
            Discover
          </h2>
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} to="/shop">
                All products
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/shop?sort=discount-desc">
                Deals
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/shop?sort=rating-desc">
                Top rated
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-bold tracking-normal">
            Account
          </h2>
          <ul className="space-y-2">
            <li>
              <Link className={linkClass} to="/orders">
                My orders
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/wishlist">
                Wishlist
              </Link>
            </li>
            <li>
              <Link className={linkClass} to="/cart">
                Shopping bag
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col justify-between gap-2 py-5 text-[13px] text-ink-mute sm:flex-row">
          <p>
            © {new Date().getFullYear()} Parcel. Demo store, no real payments
            are taken.
          </p>
          <p>
            Product data from{" "}
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-ink hover:underline"
            >
              DummyJSON
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
