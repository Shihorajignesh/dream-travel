import { Star } from 'lucide-react';

export default function ReviewCard({ r }) {
  return (
    <figure className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700">
      <div className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} className={i < r.rating ? 'fill-sun-500 text-sun-500' : 'text-slate-300'} />)}</div>
      <blockquote className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{r.text}</blockquote>
      <figcaption className="mt-3 text-sm font-semibold">{r.name} <span className="font-normal text-slate-500">· {r.country} · {r.date}</span></figcaption>
    </figure>
  );
}
