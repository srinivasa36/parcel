import { Link, useLocation, useParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ErrorState from "../components/ui/ErrorState";
import Icon from "../components/ui/Icon";
import PageLoader from "../components/ui/PageLoader";
import OrderSummary from "../components/cart/OrderSummary";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFetch from "../hooks/useFetch";
import { getOrder } from "../services/orders";
import { formatCurrency, formatDate, shortOrderId } from "../utils/format";
import { cx } from "../utils/cx";

const STEPS = ["processing", "shipped", "delivered"];

function Tracker({ status }) {
  const current = Math.max(0, STEPS.indexOf(status));
  return (
    <ol className="grid grid-cols-3 gap-2">
      {STEPS.map((step, i) => (
        <li key={step}>
          <div
            className={cx(
              "h-1.5 rounded-full",
              i <= current ? "bg-accent" : "bg-line",
            )}
          />
          <p
            className={cx(
              "mt-2 text-sm capitalize",
              i <= current ? "font-semibold" : "text-ink-mute",
            )}
          >
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const {
    data: order,
    loading,
    error,
    refetch,
  } = useFetch(() => getOrder(id), [id]);
  useDocumentTitle(order ? `Order #${shortOrderId(order.id)}` : "Order");

  if (loading) return <PageLoader />;
  if (error)
    return (
      <Container className="py-20">
        <ErrorState
          title="Couldn’t load this order"
          message={error}
          onRetry={refetch}
        />
      </Container>
    );
  if (!order) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Order not found"
          message="It may belong to a different account."
        />
      </Container>
    );
  }

  const a = order.shipping;
  const totals = {
    ...order.totals,
    itemCount: order.items.reduce((n, i) => n + i.quantity, 0),
    coupon: order.totals.coupon ? { code: order.totals.coupon } : null,
  };

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "My orders", to: "/orders" },
          { label: `Order #${shortOrderId(order.id)}` },
        ]}
      />

      {state?.placed && (
        <div className="mb-8 flex items-start gap-4 rounded-2xl bg-accent-soft p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <Icon name="check" strokeWidth={2.4} />
          </span>
          <div>
            <h1 className="heading text-2xl!">Thank you, your order is in</h1>
            <p className="mt-1 text-ink-soft">
              We’ve started preparing order #{shortOrderId(order.id)}. A
              confirmation was saved to your account.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          {!state?.placed && (
            <h1 className="title">Order #{shortOrderId(order.id)}</h1>
          )}
          {state?.placed && (
            <h2 className="title">Order #{shortOrderId(order.id)}</h2>
          )}
          <p className="caption mt-1.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge tone="accent" className="capitalize">
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_24rem] xl:gap-16">
        <div className="space-y-10">
          <Tracker status={order.status} />

          <section>
            <h2 className="heading mb-2">Items</h2>
            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-20 w-20 rounded-xl bg-mist object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="line-clamp-2 font-medium hover:text-accent"
                    >
                      {item.title}
                    </Link>
                    <p className="caption mt-0.5">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="price">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="heading mb-2">Delivery address</h2>
              <address className="not-italic leading-relaxed text-ink-soft">
                {a.fullName}
                <br />
                {a.address}
                <br />
                {a.city}, {a.state} {a.postalCode}
                <br />
                {a.country}
                <br />
                {a.phone}
              </address>
            </div>
            <div>
              <h2 className="heading mb-2">Payment</h2>
              <p className="text-ink-soft">
                {order.paymentMethod === "card"
                  ? "Credit or debit card"
                  : "Cash on delivery"}
                <br />
                <span className="capitalize">{order.paymentStatus}</span>
              </p>
            </div>
          </section>
        </div>

        <OrderSummary totals={totals} className="lg:self-start">
          <Button to="/shop" variant="secondary" fullWidth>
            Continue shopping
          </Button>
        </OrderSummary>
      </div>
    </Container>
  );
}
