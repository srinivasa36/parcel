import Container from "../ui/Container";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout({ title, subtitle, footer, children }) {
  const { configured } = useAuth();
  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr]">
      <div className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-end xl:p-16">
        <h2 className="display text-[3.4rem]! text-white">
          Your bag and wishlist, saved wherever you sign in.
        </h2>
        <p className="mt-6 max-w-sm text-white/70">
          Create an account to keep your favourites, track orders and check out
          faster next time.
        </p>
      </div>
      <Container className="flex justify-center py-12 sm:py-20 lg:px-12">
        <div className="w-full max-w-sm">
          <h1 className="title">{title}</h1>
          {subtitle && <p className="lede mt-2">{subtitle}</p>}
          {!configured && (
            <p
              role="note"
              className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              Firebase keys aren’t set yet, so sign-in is disabled. Copy{" "}
              <code className="font-semibold">.env.example</code> to{" "}
              <code className="font-semibold">.env</code> and add your keys.
            </p>
          )}
          <div className="mt-8">{children}</div>
          {footer && (
            <p className="mt-8 text-center text-sm text-ink-soft">{footer}</p>
          )}
        </div>
      </Container>
    </div>
  );
}
