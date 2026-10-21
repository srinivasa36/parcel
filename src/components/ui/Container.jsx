import { cx } from "../../utils/cx";

export default function Container({ className = "", children }) {
  return (
    <div
      className={cx(
        "mx-auto w-full max-w-336 px-4 sm:px-6 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
