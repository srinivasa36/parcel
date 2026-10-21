import { useState } from 'react';
import GoogleIcon from '../ui/GoogleIcon';
import Spinner from '../ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { getAuthErrorMessage } from '../../utils/firebaseErrors';

export default function GoogleButton({ onError }) {
  const { loginWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      const message = getAuthErrorMessage(err);
      if (message) onError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line text-[15px] font-semibold transition hover:border-ink disabled:opacity-60"
    >
      {busy ? <Spinner size="sm" /> : <GoogleIcon />}
      Continue with Google
    </button>
  );
}
