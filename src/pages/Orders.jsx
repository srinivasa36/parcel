import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import PageLoader from '../components/ui/PageLoader';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useFetch from '../hooks/useFetch';
import { listOrders } from '../services/orders';
import { formatCurrency, formatDate, shortOrderId } from '../utils/format';

export default function Orders() {
  useDocumentTitle('My orders');
  const { user } = useAuth();
  const { data: orders, loading, error, refetch } = useFetch(() => listOrders(user.uid), [user.uid]);

  if (loading) return <PageLoader />;
  if (error) return <Container className="py-20"><ErrorState title="Couldn’t load your orders" message={error} onRetry={refetch} /></Container>;

  if (orders.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState icon="box" title="No orders yet" message="When you place an order it will show up here." action={<Button to="/shop">Browse products</Button>} />
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl py-8 lg:py-12">
      <h1 className="title mb-8">My orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id}>
            <Link to={`/orders/${order.id}`} className="block rounded-2xl border border-line p-5 transition hover:border-ink sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Order #{shortOrderId(order.id)}</p>
                  <p className="caption mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone="accent" className="capitalize">{order.status}</Badge>
                  <span className="price text-base">{formatCurrency(order.totals.total)}</span>
                </div>
              </div>
              <div className="mt-5 flex gap-2 overflow-x-auto">
                {order.items.map((item) => (
                  <img key={item.id} src={item.thumbnail} alt={item.title} className="h-16 w-16 shrink-0 rounded-lg bg-mist object-contain" />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
