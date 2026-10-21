import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import FormError from '../components/auth/FormError';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getAuthErrorMessage } from '../utils/firebaseErrors';
import { isEmail } from '../utils/validators';

export default function ForgotPassword() {
  useDocumentTitle('Reset password');
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err) || '');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll email you a link to choose a new one."
      footer={<Link to="/login" className="font-semibold text-accent hover:underline">Back to sign in</Link>}
    >
      {sent ? (
        <p role="status" className="rounded-lg bg-accent-soft px-4 py-4 text-sm">
          If an account exists for <span className="font-semibold">{email}</span>, a reset link is on its way. Check your spam folder too.
        </p>
      ) : (
        <>
          <FormError message={error} />
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input name="email" type="email" label="Email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
            <Button type="submit" fullWidth size="lg" loading={submitting}>Send reset link</Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
