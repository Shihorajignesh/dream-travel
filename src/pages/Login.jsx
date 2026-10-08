import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Field from '../components/Field.jsx';
import Modal from '../components/Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { isEmail } from '../utils/validate.js';

export default function Login() {
  const { login, toast, user } = useApp();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [f, setF] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  useEffect(() => { document.title = 'Log in | Dream Travel'; }, []);
  useEffect(() => { if (user) navigate(state?.from || '/profile', { replace: true }); }, [user, navigate, state]);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!isEmail(f.email)) errs.email = 'Enter a valid email address.';
    if (!f.password) errs.password = 'Enter your password.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const msg = login(f.email, f.password, f.remember);
    if (msg) setErrors({ form: msg }); else toast('Welcome back');
  };
  const sendReset = (e) => {
    e.preventDefault();
    if (!isEmail(resetEmail)) return setResetError('Enter a valid email address.');
    setForgot(false); setResetError(''); toast('If that account exists, a reset link is on its way');
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to see your trips, favorites, and bookings." footer={{ text: 'New to Dream Travel?', to: '/signup', link: 'Create an account' }}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {errors.form && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300">{errors.form}</p>}
        <Field label="Email" error={errors.email}><input type="email" autoComplete="email" value={f.email} onChange={set('email')} /></Field>
        <Field label="Password" error={errors.password}><input type="password" autoComplete="current-password" value={f.password} onChange={set('password')} /></Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex min-h-[44px] items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-lagoon-600" checked={f.remember} onChange={set('remember')} /> Remember me</label>
          <button type="button" onClick={() => setForgot(true)} className="min-h-[44px] font-semibold text-lagoon-700 underline dark:text-sun-400">Forgot password?</button>
        </div>
        <button type="submit" className="btn-primary w-full">Log in</button>
      </form>
      <Modal open={forgot} onClose={() => setForgot(false)} title="Reset your password">
        <form onSubmit={sendReset} noValidate className="space-y-4">
          <Field label="Email" error={resetError}><input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} /></Field>
          <button type="submit" className="btn-primary w-full">Send reset link</button>
        </form>
      </Modal>
    </AuthShell>
  );
}
