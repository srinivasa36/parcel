import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import Divider from '../components/auth/Divider';
import FormError from '../components/auth/FormError';
import GoogleButton from '../components/auth/GoogleButton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getAuthErrorMessage } from '../utils/firebaseErrors';
import { isEmail } from '../utils/validators';

export default function Login() {
  useDocumentTitle('Sign in');
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ''}` : '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [e.target.name]: undefined }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!isEmail(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Enter your password';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setFormError(getAuthErrorMessage(err) || '');
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see your bag, wishlist and orders."
      footer={<>New to Parcel? <Link to="/register" state={location.state} className="font-semibold text-accent hover:underline">Create an account</Link></>}
    >
      <FormError message={formError} />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input name="email" type="email" label="Email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <div>
          <Input name="password" type="password" label="Password" autoComplete="current-password" value={form.password} onChange={handleChange} error={errors.password} />
          <Link to="/forgot-password" className="mt-2 inline-block text-[13px] font-semibold text-accent hover:underline">Forgot your password?</Link>
        </div>
        <Button type="submit" fullWidth size="lg" loading={submitting}>Sign in</Button>
      </form>
      <Divider />
      <GoogleButton onError={setFormError} />
    </AuthLayout>
  );
}
