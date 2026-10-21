import Icon from "../ui/Icon";

export default function ActiveFilters({ chips, onRemove }) {
  if (chips.length === 0) return null;
  return (
    <ul className="mb-6 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            onClick={() => onRemove(chip.clear)}
            aria-label={`Remove filter ${chip.label}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-mist py-1.5 pl-3.5 pr-2.5 text-[13px] font-medium transition hover:bg-line"
          >
            {chip.label}
            <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </li>
      ))}
    </ul>
  );
}
