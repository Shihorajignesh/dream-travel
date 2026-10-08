import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Map, Trash2 } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { useApp } from '../context/AppContext.jsx';
import { destinations } from '../data/destinations.js';
import { destinationDetails } from '../data/destinationDetails.js';
import { packages } from '../data/packages.js';
import { formatPrice } from '../utils/storage.js';

function resolve(item) {
  if (item.kind === 'destination') { const d = destinations.find((x) => x.id === item.id); return d && { title: d.name, sub: d.country, image: d.image, price: d.from, link: `/destinations/${d.slug}`, days: d.days, activities: destinationDetails[d.id].attractions }; }
  const p = packages.find((x) => x.id === item.id);
  return p && { title: p.name, sub: p.location, image: p.image, price: p.price, link: `/packages/${p.slug}`, days: p.days, activities: p.highlights };
}

export default function TripPlanner() {
  const { trip, setTripDates, addToTrip, removeFromTrip, moveTripItem, setTripNote, toast } = useApp();
  const [dest, setDest] = useState(destinations[0].id);
  const [pkg, setPkg] = useState(packages[0].id);
  useEffect(() => { document.title = 'Trip Planner | Dream Travel'; }, []);

  const rows = useMemo(() => trip.items.map((i) => ({ item: i, info: resolve(i) })).filter((r) => r.info), [trip.items]);
  const cost = rows.reduce((s, r) => s + r.info.price, 0);
  const dateDays = trip.start && trip.end && trip.end >= trip.start ? Math.round((new Date(trip.end) - new Date(trip.start)) / 864e5) + 1 : null;
  const duration = dateDays ?? rows.reduce((s, r) => s + r.info.days, 0);
  const activities = [...new Set(rows.flatMap((r) => r.info.activities))];
  const setDate = (k) => (e) => {
    const v = e.target.value; const [s, en] = k === 'start' ? [v, trip.end] : [trip.start, v];
    if (s && en && en < s) return toast('End date must be after the start date', 'error');
    setTripDates(s, en);
  };

  return (
    <div className="container-x py-10">
      <h1 className="text-4xl font-extrabold">Trip planner</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Collect destinations and packages, order them, and add notes. Everything saves automatically.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 sm:grid-cols-2">
            {[['Add a destination', dest, setDest, destinations.map((d) => [d.id, `${d.name}, ${d.country}`]), 'destination'], ['Add a package', pkg, setPkg, packages.map((p) => [p.id, p.name]), 'package']].map(([label, val, setVal, opts, kind]) => (
              <div key={kind} className="flex items-end gap-2">
                <label className="flex-1 text-xs font-semibold text-slate-500">{label}<select className="input mt-1" value={val} onChange={(e) => setVal(e.target.value)}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
                <button type="button" onClick={() => addToTrip(kind, val)} className="btn-primary">Add</button>
              </div>
            ))}
          </div>
          {rows.length === 0 ? (
            <EmptyState icon={Map} title="Your itinerary is empty" text="Add a destination or package above, or save one from its detail page."><Link to="/packages" className="btn-primary">Browse packages</Link></EmptyState>
          ) : (
            <ol className="space-y-4">
              {rows.map(({ item, info }, i) => (
                <li key={item.uid} className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 sm:flex">
                  <SmartImage src={info.image} alt={info.title} className="h-36 w-full sm:h-auto sm:w-44" />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div><p className="text-xs font-semibold uppercase text-slate-500">Stop {i + 1} · {item.kind}</p><h2 className="text-lg font-extrabold"><Link to={info.link} className="hover:underline">{info.title}</Link></h2><p className="text-sm text-slate-500">{info.sub} · from {formatPrice(info.price)}</p></div>
                      <div className="flex">
                        <button type="button" onClick={() => moveTripItem(item.uid, -1)} disabled={i === 0} aria-label={`Move ${info.title} up`} className="grid h-11 w-11 place-items-center rounded-full hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-night-700"><ArrowUp size={18} /></button>
                        <button type="button" onClick={() => moveTripItem(item.uid, 1)} disabled={i === rows.length - 1} aria-label={`Move ${info.title} down`} className="grid h-11 w-11 place-items-center rounded-full hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-night-700"><ArrowDown size={18} /></button>
                        <button type="button" onClick={() => removeFromTrip(item.uid)} aria-label={`Remove ${info.title}`} className="grid h-11 w-11 place-items-center rounded-full text-rose-600 hover:bg-rose-50 dark:hover:bg-night-700"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <label className="mt-2 block text-xs font-semibold text-slate-500">Notes<textarea rows={2} className="input mt-1 py-2" value={item.note} onChange={(e) => setTripNote(item.uid, e.target.value)} placeholder="Add reminders, hotel ideas, must-dos…" /></label>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <aside aria-label="Trip summary" className="space-y-4 rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-lg font-extrabold">Trip summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-500">Start<input type="date" className="input mt-1" value={trip.start} onChange={setDate('start')} /></label>
            <label className="text-xs font-semibold text-slate-500">End<input type="date" className="input mt-1" min={trip.start} value={trip.end} onChange={setDate('end')} /></label>
          </div>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt>Duration</dt><dd className="font-semibold">{duration ? `${duration} days` : '—'}</dd></div>
            <div className="flex justify-between"><dt>Stops</dt><dd className="font-semibold">{rows.length}</dd></div>
            <div className="flex justify-between"><dt>Estimated cost (per person)</dt><dd className="font-extrabold text-lagoon-700 dark:text-sun-400">{formatPrice(cost)}</dd></div>
          </dl>
          {activities.length > 0 && <div><h3 className="text-sm font-bold">Activities and saved experiences</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">{activities.map((a) => <li key={a}>{a}</li>)}</ul></div>}
        </aside>
      </div>
    </div>
  );
}
