import Icon from "./Icon";

export default function EmptyState({ icon = "bag", title, message, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mist text-ink-soft">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h2 className="title mt-6 text-3xl!">{title}</h2>
      {message && <p className="lede mt-2">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
