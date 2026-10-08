import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, CalendarCheck, Lightbulb, MapPin, Share2, Star, Users } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SmartImage from '../components/SmartImage.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import PlannerButton from '../components/PlannerButton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFakeLoad from '../hooks/useFakeLoad.js';
import { useApp } from '../context/AppContext.jsx';
import { destinations } from '../data/destinations.js';
import { destinationDetails } from '../data/destinationDetails.js';
import { formatPrice } from '../utils/storage.js';

function PlanWidget({ d }) {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [f, setF] = useState({ checkIn: '', checkOut: '', travelers: 2 });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!f.checkIn || !f.checkOut) return toast('Choose both travel dates', 'error');
    if (f.checkOut <= f.checkIn) return toast('Check-out must be after check-in', 'error');
    navigate(`/packages?${new URLSearchParams({ q: d.name, in: f.checkIn, out: f.checkOut, travelers: f.travelers })}`);
  };
  return (
    <form id="plan" onSubmit={submit} className="scroll-mt-24 space-y-3 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 lg:sticky lg:top-24">
      <p className="text-sm text-slate-500">from <span className="text-2xl font-extrabold text-lagoon-700 dark:text-sun-400">{formatPrice(d.from)}</span> per person</p>
      <label className="block text-xs font-semibold text-slate-500">Check-in<input type="date" className="input mt-1" value={f.checkIn} min={new Date().toISOString().slice(0, 10)} onChange={set('checkIn')} /></label>
      <label className="block text-xs font-semibold text-slate-500">Check-out<input type="date" className="input mt-1" value={f.checkOut} min={f.checkIn} onChange={set('checkOut')} /></label>
      <label className="block text-xs font-semibold text-slate-500">Travelers
        <select className="input mt-1" value={f.travelers} onChange={set('travelers')}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'traveler' : 'travelers'}</option>)}</select>
      </label>
      <button type="submit" className="btn-primary w-full"><CalendarCheck size={18} aria-hidden /> See {d.name} packages</button>
    </form>
  );
}

export default function DestinationDetail() {
  const { slug } = useParams();
  const { toast } = useApp();
  const loading = useFakeLoad(350);
  const d = destinations.find((x) => x.slug === slug);
  const info = d && destinationDetails[d.id];

  useEffect(() => { document.title = d ? `${d.name}, ${d.country} | Dream Travel` : 'Destination not found | Dream Travel'; }, [d]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: d.name, url });
      else { await navigator.clipboard.writeText(url); toast('Link copied to clipboard'); }
    } catch { /* share cancelled */ }
  };

  if (loading) return <div className="container-x animate-pulse py-10" aria-hidden><div className="h-[45vh] rounded-3xl bg-slate-200 dark:bg-night-700" /><div className="mt-6 h-8 w-1/3 rounded bg-slate-200 dark:bg-night-700" /></div>;
  if (!d) return <div className="container-x py-20"><EmptyState icon={MapPin} title="Destination not found" text="We couldn't find that destination. It may have moved or the link is mistyped."><Link to="/destinations" className="btn-primary">Explore Destinations</Link></EmptyState></div>;

  const faq = [
    [`When is the best time to visit ${d.name}?`, info.bestTime],
    [`How many days should I plan for ${d.name}?`, `Most travelers spend about ${d.days} days here, which covers the main highlights without rushing.`],
    [`What is a typical starting budget?`, `Packages start around ${formatPrice(d.from)} per person, depending on season, hotel level, and extras.`],
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-x pt-4"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations' }, { label: d.name }]} /></div>
      <div className="mt-2">
        <div className="relative h-[60vh] min-h-[340px] overflow-hidden sm:h-[72vh]">
          <SmartImage src={d.image} alt={`${d.name}, ${d.country}`} eager kenburns className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-lagoon-900/70 to-transparent" />
          <div className="absolute right-4 top-4 flex gap-2">
            <button type="button" onClick={share} aria-label={`Share ${d.name}`} className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lagoon-900 shadow hover:bg-white"><Share2 size={20} /></button>
            <PlannerButton kind="destination" id={d.id} label={d.name} />
            <FavoriteButton kind="destination" id={d.id} label={d.name} />
          </div>
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <h1 className="text-4xl font-extrabold sm:text-6xl">{d.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:text-base">
              <span className="flex items-center gap-1"><MapPin size={16} aria-hidden /> {d.country}</span>
              <span className="flex items-center gap-1"><Star size={16} className="fill-sun-500 text-sun-500" aria-hidden /> {d.rating} ({d.reviews.toLocaleString()} reviews)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container-x mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          <section aria-labelledby="about"><h2 id="about" className="text-2xl font-extrabold">About {d.name}</h2><p className="mt-3 max-w-prose leading-relaxed text-slate-600 dark:text-slate-300">{info.overview}</p></section>
          <section aria-labelledby="when"><h2 id="when" className="text-2xl font-extrabold">Best time to visit</h2><p className="mt-3 flex max-w-prose items-start gap-2 leading-relaxed text-slate-600 dark:text-slate-300"><Calendar size={18} className="mt-1 shrink-0 text-lagoon-500" aria-hidden />{info.bestTime}</p></section>
          <section aria-labelledby="top"><h2 id="top" className="text-2xl font-extrabold">Top attractions</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">{info.attractions.map((a) => <li key={a} className="rounded-2xl bg-white p-4 text-sm font-semibold ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700">{a}</li>)}</ul></section>
          <section aria-labelledby="tips"><h2 id="tips" className="text-2xl font-extrabold">Travel tips</h2>
            <ul className="mt-4 space-y-3">{info.tips.map((t) => <li key={t} className="flex gap-3 text-slate-600 dark:text-slate-300"><Lightbulb size={20} className="mt-0.5 shrink-0 text-sun-500" aria-hidden />{t}</li>)}</ul></section>
          <section aria-labelledby="map"><h2 id="map" className="text-2xl font-extrabold">Where it is</h2>
            <iframe title={`Map of ${d.name}`} loading="lazy" className="mt-4 h-72 w-full rounded-3xl border-0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${info.lng - 0.3}%2C${info.lat - 0.2}%2C${info.lng + 0.3}%2C${info.lat + 0.2}&layer=mapnik&marker=${info.lat}%2C${info.lng}`} /></section>
          <section aria-labelledby="faq"><h2 id="faq" className="text-2xl font-extrabold">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-slate-200 rounded-3xl bg-white ring-1 ring-slate-100 dark:divide-night-700 dark:bg-night-800 dark:ring-night-700">
              {faq.map(([qn, an]) => (
                <details key={qn} className="group p-5"><summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-semibold">{qn}<span aria-hidden className="text-xl transition group-open:rotate-45">+</span></summary><p className="mt-2 text-slate-600 dark:text-slate-300">{an}</p></details>
              ))}
            </div></section>
        </div>
        <aside aria-label="Plan your trip"><PlanWidget d={d} /></aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-night-700 dark:bg-night-900/95 lg:hidden">
        <p className="text-sm text-slate-500">from <span className="block text-xl font-extrabold text-lagoon-700 dark:text-sun-400">{formatPrice(d.from)}</span></p>
        <a href="#plan" className="btn-primary"><Users size={18} aria-hidden /> Plan this trip</a>
      </div>
    </div>
  );
}
