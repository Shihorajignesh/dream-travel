import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import SavedGrid from '../components/SavedGrid.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useLocalStorage, formatPrice } from '../utils/storage.js';
import { formatDate } from '../utils/pricing.js';

const TABS = ['Overview', 'Upcoming trips', 'Past trips', 'Saved', 'Booking history'];
const STYLES = ['Beach', 'Mountain', 'City', 'Luxury', 'Cultural', 'Romantic'];

function BookingList({ items, empty }) {
  if (!items.length) return <p className="text-slate-600 dark:text-slate-400">{empty} <Link to="/packages" className="font-semibold underline">Browse packages</Link></p>;
  return (
    <ul className="space-y-3">{items.map((b) => (
      <li key={b.ref} className="rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700">
        <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-extrabold">{b.name}</h3><span className="rounded-full bg-lagoon-500/15 px-3 py-1 text-xs font-bold tracking-widest text-lagoon-700 dark:text-sun-400">{b.ref}</span></div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{b.location} · {formatDate(b.start)} to {formatDate(b.end)} · {b.travelers} {b.travelers === 1 ? 'traveler' : 'travelers'} · {formatPrice(b.total)}</p>
      </li>))}</ul>
  );
}

export default function Profile() {
  const { user, updateProfile, logout, bookings, toast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState(TABS[0]);
  const [name, setName] = useState({ firstName: user.firstName, lastName: user.lastName });
  const [prefs, setPrefs] = useLocalStorage('dt-prefs', { style: 'Beach', news: true });
  const [errors, setErrors] = useState({});
  const todayIso = new Date().toISOString().slice(0, 10);
  useEffect(() => { document.title = 'My profile | Dream Travel'; }, []);

  const save = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.firstName.trim()) errs.firstName = 'Required.';
    if (!name.lastName.trim()) errs.lastName = 'Required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    updateProfile({ firstName: name.firstName.trim(), lastName: name.lastName.trim() }); toast('Profile updated');
  };

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-4xl font-extrabold">Hello, {user.firstName}</h1><p className="text-slate-600 dark:text-slate-400">{user.email}</p></div>
        <button type="button" onClick={() => { logout(); navigate('/'); }} className="btn border border-slate-300 dark:border-night-700">Sign out</button>
      </div>
      <div role="tablist" aria-label="Account sections" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {TABS.map((t) => <button key={t} id={`tab-${t}`} role="tab" type="button" aria-selected={tab === t} aria-controls="tabpanel" onClick={() => setTab(t)} className={`min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold ${tab === t ? 'bg-lagoon-900 text-white dark:bg-sun-500 dark:text-lagoon-900' : 'bg-white ring-1 ring-slate-200 dark:bg-night-800 dark:ring-night-700'}`}>{t}</button>)}
      </div>
      <div id="tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-6">
        {tab === 'Overview' && (
          <form onSubmit={save} noValidate className="max-w-xl space-y-4 rounded-3xl bg-white p-6 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName}><input value={name.firstName} onChange={(e) => setName({ ...name, firstName: e.target.value })} /></Field>
              <Field label="Last name" error={errors.lastName}><input value={name.lastName} onChange={(e) => setName({ ...name, lastName: e.target.value })} /></Field>
            </div>
            <Field label="Preferred travel style"><select value={prefs.style} onChange={(e) => setPrefs({ ...prefs, style: e.target.value })}>{STYLES.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-lagoon-600" checked={prefs.news} onChange={(e) => setPrefs({ ...prefs, news: e.target.checked })} /> Send me travel inspiration emails</label>
            <button type="submit" className="btn-primary">Save changes</button>
          </form>
        )}
        {tab === 'Upcoming trips' && <BookingList items={bookings.filter((b) => b.start >= todayIso)} empty="No upcoming trips yet." />}
        {tab === 'Past trips' && <BookingList items={bookings.filter((b) => b.start < todayIso)} empty="No past trips yet." />}
        {tab === 'Saved' && <div className="space-y-10"><section><h2 className="mb-4 text-2xl font-extrabold">Saved destinations</h2><SavedGrid kind="destination" /></section><section><h2 className="mb-4 text-2xl font-extrabold">Saved packages</h2><SavedGrid kind="package" /></section></div>}
        {tab === 'Booking history' && <BookingList items={bookings} empty="You haven't booked anything yet." />}
      </div>
    </div>
  );
}
