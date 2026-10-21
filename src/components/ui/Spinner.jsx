import { cx } from '../../utils/cx';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-9 w-9' };
  return (
    <svg className={cx('animate-spin', sizes[size], className)} viewBox="0 0 24 24" fill="none" role="status" aria-label="Loading">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
