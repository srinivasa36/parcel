import { cx } from '../../utils/cx';

export default function Input({ label, error, hint, id, className = '', inputClassName = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cx(
          'h-12 w-full rounded-lg border bg-white px-4 text-[15px] outline-none transition placeholder:text-ink-mute/70 read-only:bg-mist focus:border-accent focus:ring-2 focus:ring-accent/20',
          error ? 'border-sale' : 'border-line hover:border-ink-mute',
          inputClassName,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-[13px] text-sale">{error}</p>
      ) : (
        hint && <p className="caption mt-1.5">{hint}</p>
      )}
    </div>
  );
}
