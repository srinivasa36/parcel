import Button from './Button';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-2xl border border-line bg-mist px-6 py-10 text-center">
      <h2 className="heading">{title}</h2>
      {message && <p className="mt-1.5 text-sm text-ink-soft">{message}</p>}
      {onRetry && (
        <Button variant="dark" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
