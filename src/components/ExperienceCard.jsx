import { Link } from 'react-router-dom';
import SmartImage from './SmartImage.jsx';
import useReveal from '../hooks/useReveal.js';

export default function ExperienceCard({ e }) {
  const [ref, cls] = useReveal();
  return (
    <article ref={ref} className={`group relative aspect-[4/5] overflow-hidden text-white sm:aspect-[5/4] ${cls}`}>
      <SmartImage src={e.image} alt={e.title} className="absolute inset-0 h-full w-full group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
        <h3 className="text-3xl font-extrabold">{e.title}</h3>
        <p className="mt-2 max-w-sm text-sm text-white/85">{e.text}</p>
        <div className="mt-3 flex gap-5 text-sm font-semibold text-sun-400">
          <Link to={`/destinations?q=${e.type}`} className="min-h-[44px] py-3 hover:underline">Destinations →</Link>
          <Link to={`/packages?category=${e.category}`} className="min-h-[44px] py-3 hover:underline">Packages →</Link>
        </div>
      </div>
    </article>
  );
}
