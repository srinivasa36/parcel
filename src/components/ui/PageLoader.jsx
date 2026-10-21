import Spinner from './Spinner';

export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-accent">
      <Spinner size="lg" />
    </div>
  );
}
