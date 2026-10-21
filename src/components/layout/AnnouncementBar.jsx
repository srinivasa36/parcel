import { FREE_SHIPPING_THRESHOLD } from '../../config/site';
import { formatCurrency } from '../../utils/format';

export default function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-[13px] font-medium text-white">
      Free standard delivery on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}. Use code <span className="font-bold">WELCOME10</span> for 10% off.
    </div>
  );
}
