import SmartImage from './SmartImage.jsx';
import { addDays, calcTotal, formatDate } from '../utils/pricing.js';
import { formatPrice } from '../utils/storage.js';

export default function BookingSummary({ p, start, travelers, extras }) {
  const c = calcTotal({ price: p.price, travelers, nights: p.days - 1, extras });
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 lg:sticky lg:top-24">
      <SmartImage src={p.image} alt={p.name} className="h-36 w-full" />
      <div className="p-5">
        <h2 className="text-lg font-extrabold">{p.name}</h2>
        <p className="text-sm text-slate-500">{p.location}</p>
        <p className="mt-2 text-sm">{start ? `${formatDate(start)} to ${formatDate(addDays(start, p.days - 1))}` : 'Dates not chosen yet'} · {travelers} {travelers === 1 ? 'traveler' : 'travelers'}</p>
        <dl className="mt-4 space-y-1 border-t border-slate-200 pt-3 text-sm dark:border-night-700" aria-live="polite">
          <div className="flex justify-between"><dt>{formatPrice(p.price)} × {travelers}</dt><dd>{formatPrice(c.base)}</dd></div>
          {c.lines.map((l) => <div key={l.id} className="flex justify-between"><dt>{l.label}</dt><dd>{formatPrice(l.amount)}</dd></div>)}
          <div className="flex justify-between text-slate-500"><dt>Taxes (8%)</dt><dd>{formatPrice(c.taxes)}</dd></div>
          <div className="flex justify-between text-slate-500"><dt>Service fee (3%)</dt><dd>{formatPrice(c.fee)}</dd></div>
          <div className="flex justify-between pt-2 text-lg font-extrabold"><dt>Total</dt><dd className="text-lagoon-700 dark:text-sun-400">{formatPrice(c.total)}</dd></div>
        </dl>
      </div>
    </div>
  );
}
