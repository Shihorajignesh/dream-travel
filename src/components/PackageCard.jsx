import { Link } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
import SmartImage from './SmartImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import useReveal from '../hooks/useReveal.js';
import { formatPrice } from '../utils/storage.js';
import { discountPct } from '../utils/filterPackages.js';

export default function PackageCard({ p, list = false }) {
  const [ref, cls] = useReveal();
  const off = discountPct(p);
  return (
    <article ref={ref} className={`group relative overflow-hidden text-white ${list ? 'aspect-[4/5] sm:aspect-[16/6]' : 'aspect-[4/5]'} ${cls}`}>
      <SmartImage src={p.image} alt={`${p.name} in ${p.location}`} className="absolute inset-0 h-full w-full group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      {off > 0 && <span className="absolute left-3 top-3 bg-sun-500 px-3 py-1 text-xs font-extrabold text-lagoon-900">{off}% off</span>}
      <div className="absolute right-3 top-3"><FavoriteButton kind="package" id={p.id} label={p.name} /></div>
      <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-sun-400">{p.category}</p>
        <h3 className="mt-1 text-2xl font-extrabold"><Link to={`/packages/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">{p.name}</Link></h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-white/85"><MapPin size={14} aria-hidden /> {p.location}</p>
        {list && <p className="mt-2 hidden max-w-xl text-sm text-white/85 sm:block">{p.summary}</p>}
        <p className="mt-3 flex items-end justify-between text-sm">
          <span className="flex items-center gap-3"><span className="flex items-center gap-1"><Clock size={14} aria-hidden /> {p.days} days</span><span className="flex items-center gap-1"><Star size={14} className="fill-sun-500 text-sun-500" aria-hidden /> {p.rating} ({p.reviews})</span></span>
          <span className="flex items-baseline gap-2">{p.oldPrice && <s className="text-white/60">{formatPrice(p.oldPrice)}</s>}<strong className="text-xl text-sun-400">{formatPrice(p.price)}</strong></span>
        </p>
      </div>
    </article>
  );
}
