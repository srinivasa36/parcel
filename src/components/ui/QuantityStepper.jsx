import Icon from './Icon';

export default function QuantityStepper({ value, min = 1, max = 10, onChange, disabled = false, size = 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  const btn = `${box} flex items-center justify-center text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:text-line disabled:hover:bg-transparent`;
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-line bg-white">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={disabled || value <= min} aria-label="Decrease quantity">
        <Icon name="minus" className="h-4 w-4" />
      </button>
      <span className={`${size === 'sm' ? 'w-7 text-sm' : 'w-9'} text-center font-semibold tabular-nums`} aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={disabled || value >= max} aria-label="Increase quantity">
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}
