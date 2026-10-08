import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import SmartImage from './SmartImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import useReveal from '../hooks/useReveal.js';
import { formatPrice } from '../utils/storage.js';

export default function DestinationCard({ d }) {
  const [ref, cls] = useReveal();
  return (
    <article ref={ref} className={`group relative aspect-[4/5] overflow-hidden text-white ${cls}`}>
      <SmartImage src={d.image} alt={`${d.name}, ${d.country}`} className="absolute inset-0 h-full w-full group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute right-3 top-3"><FavoriteButton kind="destination" id={d.id} label={d.name} /></div>
      <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
        <p className="flex items-center gap-1 text-sm text-white/85"><MapPin size={14} aria-hidden /> {d.country}</p>
        <h3 className="mt-1 text-3xl font-extrabold"><Link to={`/destinations/${d.slug}`} className="after:absolute after:inset-0 after:content-['']">{d.name}</Link></h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/85">{d.blurb}</p>
        <p className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1"><Star size={14} className="fill-sun-500 text-sun-500" aria-hidden /> {d.rating} · {d.experiences} experiences</span>
          <span>from <strong className="text-lg text-sun-400">{formatPrice(d.from)}</strong></span>
        </p>
      </div>
    </article>
  );
}
