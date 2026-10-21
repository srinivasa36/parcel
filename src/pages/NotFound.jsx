import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <Container className="py-12">
      <EmptyState icon="search" title="Page not found" message="The page you’re looking for doesn’t exist or has moved." action={<Button to="/">Back to home</Button>} />
    </Container>
  );
}
