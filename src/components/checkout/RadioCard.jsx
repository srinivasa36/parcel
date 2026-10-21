import { cx } from '../../utils/cx';

export default function RadioCard({ name, value, checked, onChange, title, description, aside, children }) {
  return (
    <label
      className={cx(
        'block cursor-pointer rounded-xl border p-4 transition',
        checked ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-ink-mute',
      )}
    >
      <span className="flex items-start gap-3">
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="mt-1 h-4 w-4 accent-accent" />
        <span className="flex-1">
          <span className="flex items-center justify-between gap-3">
            <span className="font-semibold">{title}</span>
            {aside && <span className="text-sm font-semibold tabular-nums">{aside}</span>}
          </span>
          {description && <span className="caption mt-0.5 block">{description}</span>}
        </span>
      </span>
      {checked && children && <span className="mt-4 block">{children}</span>}
    </label>
  );
}
