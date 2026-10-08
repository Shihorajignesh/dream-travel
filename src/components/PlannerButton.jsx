import { ListPlus } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function PlannerButton({ kind, id, label }) {
  const { addToTrip } = useApp();
  return (
    <button type="button" onClick={() => addToTrip(kind, id)} aria-label={`Add ${label} to trip planner`} className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lagoon-900 shadow transition hover:bg-white"><ListPlus size={20} /></button>
  );
}
