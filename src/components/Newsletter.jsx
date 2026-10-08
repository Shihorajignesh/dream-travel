import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { isEmail } from '../utils/validate.js';

export default function Newsletter() {
  const { toast } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError('Please enter a valid email address.');
    setError(''); setDone(true); toast('Newsletter subscription successful');
  };
  return (
    <section className="mt-24" aria-labelledby="news">
      <div className="bg-lagoon-900 px-6 py-20 text-center text-white sm:px-12">
        <h2 id="news" className="text-3xl font-extrabold sm:text-4xl">Get inspired before everyone else.</h2>
        <p className="mx-auto mt-3 max-w-md text-white/80">Early access to new journeys, seasonal deals, and travel ideas worth saving.</p>
        {done ? <p role="status" className="mt-6 font-semibold text-sun-400">You're on the list. Check your inbox soon.</p> : (
          <form onSubmit={submit} noValidate className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" aria-invalid={!!error} placeholder="you@example.com" className="input h-12 flex-1 rounded-full px-5" />
            <button type="submit" className="btn-primary h-12">Subscribe</button>
          </form>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
      </div>
    </section>
  );
}
