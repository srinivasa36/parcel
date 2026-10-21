import Rating from '../ui/Rating';
import { formatDate } from '../../utils/format';

export default function ReviewList({ reviews = [] }) {
  if (reviews.length === 0) return <p>No reviews yet.</p>;
  return (
    <ul className="divide-y divide-line">
      {reviews.map((review, i) => (
        <li key={i} className="flex gap-4 py-5 first:pt-0 last:pb-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-bold">
            {review.reviewerName.charAt(0)}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <p className="font-semibold text-ink">{review.reviewerName}</p>
              <Rating value={review.rating} />
            </div>
            <p className="caption mt-0.5">{formatDate(review.date)}</p>
            <p className="mt-2 text-ink-soft">{review.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
