import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Section({ title, linkTo, linkLabel = 'View all', className = 'py-10 lg:py-14', children }) {
  return (
    <section className={className}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="title">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent">
            {linkLabel}
            <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
