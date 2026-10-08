import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import Field from '../components/Field.jsx';
import { useApp } from '../context/AppContext.jsx';
import { isEmail, isPhone } from '../utils/validate.js';

const FAQ = [
  ['Can I change or cancel a booking?', 'Yes. Cancellation is free up to 14 days before departure. Contact us with your booking reference to change dates.'],
  ['Do you offer custom itineraries?', 'We can adapt any package: add nights, swap hotels, or build a private trip around your plans.'],
  ['Is support available during my trip?', 'Our support line is open 24/7 for every traveler on a Dream Travel package.'],
];
const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const { toast } = useApp();
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  useEffect(() => { document.title = 'Contact | Dream Travel'; }, []);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.name.trim()) errs.name = 'Please enter your name.';
    if (!isEmail(f.email)) errs.email = 'Enter a valid email address.';
    if (f.phone && !isPhone(f.phone)) errs.phone = 'Enter a valid phone number.';
    if (!f.subject.trim()) errs.subject = 'Please add a subject.';
    if (f.message.trim().length < 10) errs.message = 'Please write at least 10 characters.';
    setErrors(errs);
    if (Object.keys(errs).length) return toast('Please fix the highlighted fields', 'error');
    setSent(true); toast('Message sent successfully');
  };

  return (
    <div className="container-x py-10">
      <h1 className="text-4xl font-extrabold">We're here to help</h1>
      <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">Questions about a trip, a booking, or planning something custom? Send us a note.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 sm:p-8">
          {sent ? (
            <div role="status" className="py-8 text-center"><CheckCircle2 size={48} className="mx-auto text-lagoon-500" aria-hidden /><h2 className="mt-4 text-2xl font-extrabold">Thanks, {f.name.split(' ')[0]}. We've got your message.</h2><p className="mt-2 text-slate-600 dark:text-slate-400">A travel specialist will reply to {f.email} within one business day.</p>
              <button type="button" onClick={() => { setF(EMPTY); setSent(false); }} className="btn-primary mt-6">Send another message</button></div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Name" error={errors.name}><input autoComplete="name" value={f.name} onChange={set('name')} /></Field><Field label="Email" error={errors.email}><input type="email" autoComplete="email" value={f.email} onChange={set('email')} /></Field></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Phone (optional)" error={errors.phone}><input type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} /></Field><Field label="Subject" error={errors.subject}><input value={f.subject} onChange={set('subject')} /></Field></div>
              <Field label="Message" error={errors.message}><textarea rows={5} className="py-2" value={f.message} onChange={set('message')} /></Field>
              <button type="submit" className="btn-primary">Send message</button>
            </form>
          )}
        </div>
        <aside className="space-y-4" aria-label="Contact details">
          {[[Mail, 'Email support', 'support@dreamtravel.example'], [Phone, 'Phone support', '+1 (800) 555-0142, 24/7'], [MapPin, 'Head office', '120 Harbor Street, Lisbon, Portugal']].map(([Icon, t, v]) => (
            <div key={t} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700"><Icon size={20} className="mt-0.5 shrink-0 text-lagoon-500" aria-hidden /><div><p className="font-bold">{t}</p><p className="text-sm text-slate-600 dark:text-slate-300">{v}</p></div></div>
          ))}
          <a href="#faq" className="btn-primary w-full">Read our FAQ</a>
        </aside>
      </div>
      <section id="faq" aria-labelledby="faqh" className="mt-14 scroll-mt-24"><h2 id="faqh" className="text-2xl font-extrabold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-3xl bg-white ring-1 ring-slate-100 dark:divide-night-700 dark:bg-night-800 dark:ring-night-700">
          {FAQ.map(([q, a]) => <details key={q} className="group p-5"><summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-semibold">{q}<span aria-hidden className="text-xl transition group-open:rotate-45">+</span></summary><p className="mt-2 text-slate-600 dark:text-slate-300">{a}</p></details>)}
        </div>
        <p className="mt-4 text-sm">Still stuck? <Link to="/packages" className="font-semibold underline">Browse packages</Link> or write to us above.</p></section>
    </div>
  );
}
