export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-4/5 rounded-xl bg-mist" />
      <div className="mt-3.5 space-y-2">
        <div className="h-3 w-1/3 rounded bg-mist" />
        <div className="h-4 w-4/5 rounded bg-mist" />
        <div className="h-4 w-1/2 rounded bg-mist" />
      </div>
    </div>
  );
}
