import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import ProductGrid from '../components/product/ProductGrid';
import { useWishlist } from '../context/WishlistContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Wishlist() {
  useDocumentTitle('Wishlist');
  const { items } = useWishlist();

  return (
    <Container className="py-8 lg:py-12">
      {items.length === 0 ? (
        <EmptyState icon="heart" title="Your wishlist is empty" message="Tap the heart on anything you like to save it here." action={<Button to="/shop">Browse products</Button>} />
      ) : (
        <>
          <h1 className="title mb-8">Wishlist <span className="text-ink-mute">({items.length})</span></h1>
          <ProductGrid products={items} />
        </>
      )}
    </Container>
  );
}
