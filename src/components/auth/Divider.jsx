export default function Divider({ children = 'or' }) {
  return (
    <div className="my-6 flex items-center gap-4 text-[13px] text-ink-mute">
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
