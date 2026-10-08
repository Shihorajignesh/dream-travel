import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Field from '../components/Field.jsx';
import { useApp } from '../context/AppContext.jsx';
import { isEmail, passwordIssue } from '../utils/validate.js';

export default function Signup() {
  const { signup, toast, user } = useApp();
  const navigate = useNavigate();
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', terms: false });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  useEffect(() => { document.title = 'Create account | Dream Travel'; }, []);
  useEffect(() => { if (user) navigate('/profile', { replace: true }); }, [user, navigate]);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.firstName.trim()) errs.firstName = 'Enter your first name.';
    if (!f.lastName.trim()) errs.lastName = 'Enter your last name.';
    if (!isEmail(f.email)) errs.email = 'Enter a valid email address.';
    if (passwordIssue(f.password)) errs.password = passwordIssue(f.password);
    if (f.confirm !== f.password) errs.confirm = 'Passwords do not match.';
    if (!f.terms) errs.terms = 'Please accept the terms to continue.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const msg = signup(f);
    if (msg) setErrors({ email: msg }); else toast('Account created. Welcome aboard!');
  };

  return (
    <AuthShell title="Create your account" subtitle="Save trips, track bookings, and plan faster." footer={{ text: 'Already have an account?', to: '/login', link: 'Log in' }}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName}><input autoComplete="given-name" value={f.firstName} onChange={set('firstName')} /></Field>
          <Field label="Last name" error={errors.lastName}><input autoComplete="family-name" value={f.lastName} onChange={set('lastName')} /></Field>
        </div>
        <Field label="Email" error={errors.email}><input type="email" autoComplete="email" value={f.email} onChange={set('email')} /></Field>
        <Field label="Password (8+ characters, letters and numbers)" error={errors.password}><input type="password" autoComplete="new-password" value={f.password} onChange={set('password')} /></Field>
        <Field label="Confirm password" error={errors.confirm}><input type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></Field>
        <div>
          <label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-lagoon-600" checked={f.terms} onChange={set('terms')} aria-invalid={!!errors.terms} /> I agree to the terms and privacy policy</label>
          {errors.terms && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">{errors.terms}</p>}
        </div>
        <button type="submit" className="btn-primary w-full">Create account</button>
      </form>
    </AuthShell>
  );
}
