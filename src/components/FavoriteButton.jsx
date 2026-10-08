import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function FavoriteButton({ kind, id, label }) {
  const { isFavorite, toggleFavorite } = useApp();
  const active = isFavorite(kind, id);
  return (
    <button type="button" onClick={() => toggleFavorite(kind, id)} aria-pressed={active}
      aria-label={`${active ? 'Remove' : 'Add'} ${label} ${active ? 'from' : 'to'} favorites`}
      className="relative z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lagoon-900 shadow transition hover:bg-white">
      <Heart key={String(active)} size={20} className={active ? 'animate-pop fill-rose-500 text-rose-500' : ''} />
    </button>
  );
}
