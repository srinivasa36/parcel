import { Link } from "react-router-dom";
import { cx } from "../../utils/cx";
import Spinner from "./Spinner";

const VARIANTS = {
  primary: "bg-accent text-white hover:bg-accent-dark disabled:bg-accent/40",
  dark: "bg-ink text-white hover:bg-ink-soft disabled:bg-ink/40",
  secondary:
    "border border-line bg-white text-ink hover:border-ink disabled:text-ink-mute disabled:hover:border-line",
  ghost: "text-ink hover:bg-mist disabled:text-ink-mute",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  to,
  className = "",
  disabled,
  children,
  ...props
}) {
  const classes = cx(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button disabled={disabled || loading} className={classes} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
