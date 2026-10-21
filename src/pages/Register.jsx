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

export default function Register() {
  useDocumentTitle('Create account');
  const { register, isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ''}` : '/';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    if (!form.name.trim()) next.name = 'Enter your name';
    if (!isEmail(form.email)) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Use at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    } catch (err) {
      setFormError(getAuthErrorMessage(err) || '');
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It only takes a moment."
      footer={<>Already have an account? <Link to="/login" state={location.state} className="font-semibold text-accent hover:underline">Sign in</Link></>}
    >
      <FormError message={formError} />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input name="name" label="Full name" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input name="email" type="email" label="Email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <Input name="password" type="password" label="Password" autoComplete="new-password" hint="At least 6 characters" value={form.password} onChange={handleChange} error={errors.password} />
        <Button type="submit" fullWidth size="lg" loading={submitting}>Create account</Button>
      </form>
      <Divider />
      <GoogleButton onError={setFormError} />
    </AuthLayout>
  );
}
