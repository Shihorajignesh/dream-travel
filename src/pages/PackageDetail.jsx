import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BedDouble, Bus, Check, Clock, MapPin, Share2, Star, Users, X } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SmartImage from '../components/SmartImage.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import PlannerButton from '../components/PlannerButton.jsx';
import ItineraryTimeline from '../components/ItineraryTimeline.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFakeLoad from '../hooks/useFakeLoad.js';
import { useApp } from '../context/AppContext.jsx';
import { IMPORTANT_INFO, INCLUDED, NOT_INCLUDED, TRANSPORT, packages } from '../data/packages.js';
import { destinationDetails } from '../data/destinationDetails.js';
import { reviews } from '../data/reviews.js';
import { addDays, calcTotal, EXTRAS, formatDate, ROOMS } from '../utils/pricing.js';
import { buildItinerary, discountPct } from '../utils/filterPackages.js';
import { formatPrice } from '../utils/storage.js';

function BookingWidget({ p }) {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [params] = useSearchParams();
  const [start, setStart] = useState(params.get('in') || '');
  const [travelers, setTravelers] = useState(Number(params.get('travelers')) || 2);
  const [room, setRoom] = useState(ROOMS[0]);
  const [extras, setExtras] = useState([]);
  const nights = p.days - 1;
  const cost = useMemo(() => calcTotal({ price: p.price, travelers, nights, extras }), [p.price, travelers, nights, extras]);
  const toggle = (id) => setExtras((x) => (x.includes(id) ? x.filter((e) => e !== id) : [...x, id]));

  const book = (e) => {
    e.preventDefault();
    if (!start) return toast('Please choose your start date', 'error');
    if (start < new Date().toISOString().slice(0, 10)) return toast('Start date cannot be in the past', 'error');
    navigate(`/booking/${p.id}?${new URLSearchParams({ start, travelers, room, extras: extras.join(',') })}`);
  };

  return (
    <form id="book" onSubmit={book} className="scroll-mt-24 space-y-4 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 lg:sticky lg:top-24">
      <h2 className="text-lg font-extrabold">Plan your dates</h2>
      <label className="block text-xs font-semibold text-slate-500">Start date
        <input type="date" className="input mt-1" value={start} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setStart(e.target.value)} />
      </label>
      {start && <p className="text-sm text-slate-600 dark:text-slate-300">{formatDate(start)} to {formatDate(addDays(start, nights))} · {nights} nights</p>}
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-semibold text-slate-500">Travelers
          <select className="input mt-1" value={travelers} onChange={(e) => setTravelers(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
        <label className="block text-xs font-semibold text-slate-500">Room
          <select className="input mt-1" value={room} onChange={(e) => setRoom(e.target.value)}>{ROOMS.map((r) => <option key={r}>{r}</option>)}</select></label>
      </div>
      <fieldset><legend className="text-xs font-semibold text-slate-500">Optional extras</legend>
        {EXTRAS.map((x) => (
          <label key={x.id} className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-lagoon-600" checked={extras.includes(x.id)} onChange={() => toggle(x.id)} />{x.label}</span>
            <span className="text-slate-500">{formatPrice(x.price)}{x.per === 'person' ? ' /person' : x.per === 'person-night' ? ' /person/night' : ''}</span>
          </label>
        ))}
      </fieldset>
      <dl className="space-y-1 border-t border-slate-200 pt-3 text-sm dark:border-night-700" aria-live="polite">
        <div className="flex justify-between"><dt>{formatPrice(p.price)} × {travelers} {travelers === 1 ? 'traveler' : 'travelers'}</dt><dd>{formatPrice(cost.base)}</dd></div>
        {cost.lines.map((l) => <div key={l.id} className="flex justify-between"><dt>{l.label}</dt><dd>{formatPrice(l.amount)}</dd></div>)}
        <div className="flex justify-between text-slate-500"><dt>Taxes (8%)</dt><dd>{formatPrice(cost.taxes)}</dd></div>
        <div className="flex justify-between text-slate-500"><dt>Service fee (3%)</dt><dd>{formatPrice(cost.fee)}</dd></div>
        <div className="flex justify-between pt-2 text-lg font-extrabold"><dt>Estimated total</dt><dd className="text-lagoon-700 dark:text-sun-400">{formatPrice(cost.total)}</dd></div>
      </dl>
      <button type="submit" className="btn-primary w-full">Book Now</button>
    </form>
  );
}

export default function PackageDetail() {
  const { slug } = useParams();
  const { toast } = useApp();
  const loading = useFakeLoad(350);
  const p = packages.find((x) => x.slug === slug);
  const itinerary = useMemo(() => p && buildItinerary(p, destinationDetails[p.destinationId].attractions), [p]);

  useEffect(() => { document.title = p ? `${p.name} | Dream Travel` : 'Package not found | Dream Travel'; }, [p]);
  const share = async () => {
    try { if (navigator.share) await navigator.share({ title: p.name, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); toast('Link copied to clipboard'); } } catch { /* share cancelled */ }
  };

  if (loading) return <div className="container-x animate-pulse py-10" aria-hidden><div className="h-[45vh] rounded-3xl bg-slate-200 dark:bg-night-700" /><div className="mt-6 h-8 w-1/3 rounded bg-slate-200 dark:bg-night-700" /></div>;
  if (!p) return <div className="container-x py-20"><EmptyState icon={MapPin} title="Package not found" text="That package is no longer available or the link is incorrect."><Link to="/packages" className="btn-primary">Browse packages</Link></EmptyState></div>;
  const off = discountPct(p);

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-x pt-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Packages', to: '/packages' }, { label: p.name }]} /></div>
      <div className="mt-2">
        <div className="relative h-[60vh] min-h-[340px] overflow-hidden sm:h-[72vh]">
          <SmartImage src={p.image} alt={`${p.name} in ${p.location}`} eager kenburns className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-lagoon-900/75 to-transparent" />
          <div className="absolute right-4 top-4 flex gap-2">
            <button type="button" onClick={share} aria-label={`Share ${p.name}`} className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lagoon-900 shadow hover:bg-white"><Share2 size={20} /></button>
            <PlannerButton kind="package" id={p.id} label={p.name} />
            <FavoriteButton kind="package" id={p.id} label={p.name} />
          </div>
          <div className="absolute bottom-5 left-5 right-5 text-white">
            {off > 0 && <span className="rounded-full bg-sun-500 px-3 py-1 text-xs font-extrabold text-lagoon-900">{off}% off</span>}
            <h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">{p.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1"><MapPin size={16} aria-hidden /> {p.location}</span>
              <span className="flex items-center gap-1"><Star size={16} className="fill-sun-500 text-sun-500" aria-hidden /> {p.rating} ({p.reviews} reviews)</span>
              <span className="flex items-center gap-1"><Clock size={16} aria-hidden /> {p.days} days</span>
              <span className="flex items-center gap-1"><Users size={16} aria-hidden /> Groups of {p.group}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container-x mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          <section aria-labelledby="ov"><h2 id="ov" className="text-2xl font-extrabold">Overview</h2><p className="mt-3 max-w-prose leading-relaxed text-slate-600 dark:text-slate-300">{p.summary}</p>
            <p className="mt-4 text-sm text-slate-500">Starting from {p.oldPrice && <s>{formatPrice(p.oldPrice)}</s>} <strong className="text-lg text-lagoon-700 dark:text-sun-400">{formatPrice(p.price)}</strong> per person</p></section>
          <section aria-labelledby="hl"><h2 id="hl" className="text-2xl font-extrabold">Highlights</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">{p.highlights.map((h) => <li key={h} className="rounded-2xl bg-white p-4 text-sm font-semibold ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700">{h}</li>)}</ul></section>
          <section aria-labelledby="it"><h2 id="it" className="text-2xl font-extrabold">Detailed itinerary</h2><div className="mt-5"><ItineraryTimeline items={itinerary} /></div></section>
          <section aria-labelledby="inc" className="grid gap-6 sm:grid-cols-2">
            <div><h2 id="inc" className="text-2xl font-extrabold">Included</h2><ul className="mt-4 space-y-2">{INCLUDED.map((x) => <li key={x} className="flex gap-2 text-sm"><Check size={18} className="mt-0.5 shrink-0 text-lagoon-500" aria-hidden />{x}</li>)}</ul></div>
            <div><h2 className="text-2xl font-extrabold">Not included</h2><ul className="mt-4 space-y-2">{NOT_INCLUDED.map((x) => <li key={x} className="flex gap-2 text-sm"><X size={18} className="mt-0.5 shrink-0 text-rose-500" aria-hidden />{x}</li>)}</ul></div>
          </section>
          <section aria-labelledby="stay" className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700"><h2 id="stay" className="flex items-center gap-2 text-lg font-extrabold"><BedDouble size={20} className="text-lagoon-500" aria-hidden /> Hotels</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{p.hotel}</p></div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700"><h2 className="flex items-center gap-2 text-lg font-extrabold"><Bus size={20} className="text-lagoon-500" aria-hidden /> Transportation</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{TRANSPORT}</p></div>
          </section>
          <section aria-labelledby="info"><h2 id="info" className="text-2xl font-extrabold">Important information</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">{IMPORTANT_INFO.map((x) => <li key={x}>{x}</li>)}</ul></section>
          <section aria-labelledby="rev"><h2 id="rev" className="text-2xl font-extrabold">Traveler reviews</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{reviews.map((r) => <ReviewCard key={r.name} r={r} />)}</div></section>
        </div>
        <aside aria-label="Booking"><BookingWidget p={p} /></aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-night-700 dark:bg-night-900/95 lg:hidden">
        <p className="text-sm text-slate-500">from <span className="block text-xl font-extrabold text-lagoon-700 dark:text-sun-400">{formatPrice(p.price)}</span></p>
        <a href="#book" className="btn-primary">Book Now</a>
      </div>
    </div>
  );
}
