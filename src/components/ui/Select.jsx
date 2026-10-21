import { cx } from '../../utils/cx';
import Icon from './Icon';

export default function Select({ label, error, id, className = '', selectClassName = '', children, ...props }) {
  const selectId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error)}
          className={cx(
            'h-12 w-full appearance-none rounded-lg border bg-white pl-4 pr-10 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20',
            error ? 'border-sale' : 'border-line hover:border-ink-mute',
            selectClassName,
          )}
          {...props}
        >
          {children}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
      </div>
      {error && <p className="mt-1.5 text-[13px] text-sale">{error}</p>}
    </div>
  );
}
