import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Check, MapPin, PartyPopper } from 'lucide-react';
import BookingSummary from '../components/BookingSummary.jsx';
import Field from '../components/Field.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useApp } from '../context/AppContext.jsx';
import { packages } from '../data/packages.js';
import { addDays, calcTotal, EXTRAS, formatDate, ROOMS } from '../utils/pricing.js';
import { isEmail, isPhone, makeRef } from '../utils/validate.js';
import { formatPrice } from '../utils/storage.js';

const STEPS = ['Dates', 'Travelers', 'Details', 'Review', 'Confirmed'];
const today = () => new Date().toISOString().slice(0, 10);

export default function Booking() {
  const { packageId } = useParams();
  const [params] = useSearchParams();
  const { addBooking, toast, user } = useApp();
  const p = packages.find((x) => x.id === packageId);
  const [step, setStep] = useState(0);
  const [start, setStart] = useState(params.get('start') || '');
  const [travelers, setTravelers] = useState(Number(params.get('travelers')) || 2);
  const [room, setRoom] = useState(params.get('room') || ROOMS[0]);
  const [extras, setExtras] = useState((params.get('extras') || '').split(',').filter(Boolean));
  const [people, setPeople] = useState([]);
  const [contact, setContact] = useState({ email: user?.email || '', phone: '' });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);

  useEffect(() => { document.title = 'Book your trip | Dream Travel'; }, []);
  if (!p) return <div className="container-x py-20"><EmptyState icon={MapPin} title="Package not found" text="We couldn't find the package you're trying to book."><Link to="/packages" className="btn-primary">Browse packages</Link></EmptyState></div>;

  const person = (i) => people[i] || { first: '', last: '' };
  const setPerson = (i, k, v) => setPeople(Array.from({ length: travelers }, (_, j) => (j === i ? { ...person(j), [k]: v } : person(j))));
  const toggleExtra = (id) => setExtras((x) => (x.includes(id) ? x.filter((e) => e !== id) : [...x, id]));

  const validate = () => {
    const e = {};
    if (step === 0) { if (!start) e.start = 'Choose a start date.'; else if (start < today()) e.start = 'Start date cannot be in the past.'; }
    if (step === 2) {
      for (let i = 0; i < travelers; i += 1) {
        if (!person(i).first.trim()) e[`first${i}`] = 'Required.';
        if (!person(i).last.trim()) e[`last${i}`] = 'Required.';
      }
      if (!isEmail(contact.email)) e.email = 'Enter a valid email address.';
      if (!isPhone(contact.phone)) e.phone = 'Enter a phone number with at least 7 digits.';
    }
    if (step === 3 && !agree) e.agree = 'Please accept the booking terms.';
    return e;
  };
  const next = () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return toast('Please fix the highlighted fields', 'error');
    if (step < 3) return setStep(step + 1);
    const c = calcTotal({ price: p.price, travelers, nights: p.days - 1, extras });
    const b = { ref: makeRef(), packageId: p.id, name: p.name, location: p.location, start, end: addDays(start, p.days - 1), travelers, room, extras, total: c.total, contact, people: Array.from({ length: travelers }, (_, i) => person(i)), createdAt: new Date().toISOString() };
    addBooking(b); setBooking(b); setStep(4); toast('Booking completed');
  };
  const back = () => { setErrors({}); setStep(step - 1); };

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Book {p.name}</h1>
      <ol className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Booking progress">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${i === step ? 'bg-lagoon-900 text-white dark:bg-sun-500 dark:text-lagoon-900' : i < step ? 'bg-lagoon-500/15 text-lagoon-700 dark:text-sun-400' : 'bg-white ring-1 ring-slate-200 dark:bg-night-800 dark:ring-night-700'}`}>
            {i < step ? <Check size={14} aria-hidden /> : <span>{i + 1}</span>} {s}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 sm:p-8">
          {step === 0 && (
            <section aria-labelledby="s0"><h2 id="s0" className="text-2xl font-extrabold">Choose your dates</h2>
              <Field label="Start date" error={errors.start} className="mt-5 max-w-xs"><input type="date" min={today()} value={start} onChange={(e) => setStart(e.target.value)} /></Field>
              {start && <p className="mt-3 text-slate-600 dark:text-slate-300">Trip runs {formatDate(start)} to {formatDate(addDays(start, p.days - 1))} ({p.days} days).</p>}</section>
          )}
          {step === 1 && (
            <section aria-labelledby="s1"><h2 id="s1" className="text-2xl font-extrabold">Travelers and extras</h2>
              <div className="mt-5 flex items-center gap-4"><span className="font-semibold">Travelers</span>
                <button type="button" aria-label="Fewer travelers" disabled={travelers <= 1} onClick={() => setTravelers(travelers - 1)} className="btn h-11 w-11 border border-slate-300 px-0 disabled:opacity-40 dark:border-night-700">−</button>
                <span className="w-6 text-center text-lg font-extrabold" aria-live="polite">{travelers}</span>
                <button type="button" aria-label="More travelers" disabled={travelers >= 8} onClick={() => setTravelers(travelers + 1)} className="btn h-11 w-11 border border-slate-300 px-0 disabled:opacity-40 dark:border-night-700">+</button></div>
              <Field label="Room preference" className="mt-5 max-w-xs"><select value={room} onChange={(e) => setRoom(e.target.value)}>{ROOMS.map((r) => <option key={r}>{r}</option>)}</select></Field>
              <fieldset className="mt-5"><legend className="text-sm font-semibold">Optional extras</legend>
                {EXTRAS.map((x) => (
                  <label key={x.id} className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-lagoon-600" checked={extras.includes(x.id)} onChange={() => toggleExtra(x.id)} />{x.label}</span><span className="text-slate-500">{formatPrice(x.price)}{x.per === 'person' ? ' /person' : x.per === 'person-night' ? ' /person/night' : ''}</span></label>
                ))}</fieldset></section>
          )}
          {step === 2 && (
            <section aria-labelledby="s2"><h2 id="s2" className="text-2xl font-extrabold">Traveler information</h2>
              {Array.from({ length: travelers }, (_, i) => (
                <div key={i} className="mt-5"><h3 className="font-bold">Traveler {i + 1}{i === 0 ? ' (lead)' : ''}</h3>
                  <div className="mt-2 grid gap-4 sm:grid-cols-2">
                    <Field label="First name" error={errors[`first${i}`]}><input value={person(i).first} onChange={(e) => setPerson(i, 'first', e.target.value)} /></Field>
                    <Field label="Last name" error={errors[`last${i}`]}><input value={person(i).last} onChange={(e) => setPerson(i, 'last', e.target.value)} /></Field>
                  </div></div>
              ))}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Contact email" error={errors.email}><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></Field>
                <Field label="Contact phone" error={errors.phone}><input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></Field>
              </div></section>
          )}
          {step === 3 && (
            <section aria-labelledby="s3"><h2 id="s3" className="text-2xl font-extrabold">Review your booking</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><strong>Dates:</strong> {formatDate(start)} to {formatDate(addDays(start, p.days - 1))}</li>
                <li><strong>Travelers:</strong> {Array.from({ length: travelers }, (_, i) => `${person(i).first} ${person(i).last}`).join(', ')}</li>
                <li><strong>Room:</strong> {room}</li>
                <li><strong>Extras:</strong> {extras.length ? extras.map((id) => EXTRAS.find((x) => x.id === id).label).join(', ') : 'None'}</li>
                <li><strong>Contact:</strong> {contact.email}, {contact.phone}</li>
              </ul>
              <p className="mt-4 rounded-xl bg-lagoon-50 p-3 text-sm dark:bg-night-700">No payment is taken in this demo. Your booking is saved to your account history.</p>
              <label className="mt-4 flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-lagoon-600" checked={agree} onChange={(e) => setAgree(e.target.checked)} aria-invalid={!!errors.agree} /> I accept the booking terms and cancellation policy</label>
              {errors.agree && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">{errors.agree}</p>}</section>
          )}
          {step === 4 && booking && (
            <section aria-labelledby="s4" className="text-center"><PartyPopper size={48} className="mx-auto text-sun-500" aria-hidden />
              <h2 id="s4" className="mt-4 text-3xl font-extrabold">Your dream journey is confirmed.</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">Booking reference</p>
              <p className="mt-1 text-3xl font-extrabold tracking-widest text-lagoon-700 dark:text-sun-400">{booking.ref}</p>
              <p className="mt-3 text-sm text-slate-500">A confirmation was sent to {booking.contact.email}.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link to={user ? '/profile' : '/login'} className="btn-primary">View my bookings</Link><Link to="/packages" className="btn border border-slate-300 dark:border-night-700">Explore more packages</Link></div></section>
          )}
          {step < 4 && (
            <div className="mt-8 flex justify-between gap-3">
              <button type="button" onClick={back} disabled={step === 0} className="btn border border-slate-300 disabled:invisible dark:border-night-700">Back</button>
              <button type="button" onClick={next} className="btn-primary">{step === 3 ? 'Confirm booking' : 'Continue'}</button>
            </div>
          )}
        </div>
        <aside aria-label="Booking summary"><BookingSummary p={p} start={start} travelers={travelers} extras={extras} /></aside>
      </div>
    </div>
  );
}
