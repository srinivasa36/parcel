import { cx } from '../../utils/cx';

const TONES = {
  sale: 'bg-sale text-white',
  light: 'bg-white text-ink',
  accent: 'bg-accent-soft text-accent-dark',
  ok: 'bg-emerald-50 text-ok',
  warn: 'bg-amber-50 text-amber-800',
  neutral: 'bg-mist text-ink-soft',
};

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={cx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none', TONES[tone], className)}>
      {children}
    </span>
  );
}
