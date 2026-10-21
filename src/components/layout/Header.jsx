import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Icon from "../ui/Icon";
import CategoryNav from "./CategoryNav";
import SearchBox from "./SearchBox";
import UserMenu from "./UserMenu";
import { SITE_NAME } from "../../config/site";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import { useWishlist } from "../../context/WishlistContext";

export function Wordmark({ className = "" }) {
  return (
    <Link
      to="/"
      aria-label={`${SITE_NAME} home`}
      className={`font-display text-[1.9rem] font-semibold leading-none tracking-tight ${className}`}
    >
      {SITE_NAME.toLowerCase()}
      <span className="text-accent">.</span>
    </Link>
  );
}

function IconLink({ onClick, to, icon, count, label }) {
  const classes =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-mist";
  const badge = count > 0 && (
    <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-white">
      {count}
    </span>
  );
  return to ? (
    <Link to={to} aria-label={label} className={classes}>
      <Icon name={icon} className="h-5.5 w-5.5" />
      {badge}
    </Link>
  ) : (
    <button onClick={onClick} aria-label={label} className={classes}>
      <Icon name={icon} className="h-5.5 w-5.5" />
      {badge}
    </button>
  );
}

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { openCart, openMenu } = useUI();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-17 items-center gap-3 md:gap-8">
          <button
            onClick={openMenu}
            aria-label="Open menu"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-mist md:hidden"
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
          <Wordmark />
          <SearchBox className="hidden max-w-2xl flex-1 md:block" />
          <div className="ml-auto flex items-center gap-1">
            <IconLink
              to="/wishlist"
              icon="heart"
              count={wishlistCount}
              label="Wishlist"
            />
            <IconLink
              onClick={openCart}
              icon="bag"
              count={count}
              label="Open bag"
            />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="ml-1 hidden h-10 items-center rounded-full border border-line px-5 text-sm font-semibold transition hover:border-ink sm:flex"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
        <SearchBox className="pb-3 md:hidden" />
        <CategoryNav />
      </Container>
    </header>
  );
}
