import { useApp } from '../context/AppContext.jsx';
import DestinationCard from './DestinationCard.jsx';
import PackageCard from './PackageCard.jsx';
import { destinations } from '../data/destinations.js';
import { packages } from '../data/packages.js';

export default function SavedGrid({ kind }) {
  const { favorites } = useApp();
  const source = kind === 'destination' ? destinations : packages;
  const items = favorites.filter((f) => f.kind === kind).map((f) => source.find((x) => x.id === f.id)).filter(Boolean);
  if (!items.length) return <p className="text-slate-600 dark:text-slate-400">Nothing saved yet.</p>;
  return <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">{items.map((x) => (kind === 'destination' ? <DestinationCard key={x.id} d={x} /> : <PackageCard key={x.id} p={x} />))}</div>;
}
