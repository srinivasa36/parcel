export default function FormError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-sale">
      {message}
    </p>
  );
}
