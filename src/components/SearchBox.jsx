import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const today = () => new Date().toISOString().slice(0, 10);

function Field({ icon: Icon, label, children }) {
  return (
    <label className="flex flex-1 flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1"><Icon size={14} aria-hidden /> {label}</span>{children}
    </label>
  );
}

export default function SearchBox() {
  const navigate = useNavigate();
  const { addRecentSearch, toast, recentSearches } = useApp();
  const [f, setF] = useState({ q: '', checkIn: '', checkOut: '', travelers: 2 });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (f.checkIn && f.checkOut && f.checkOut <= f.checkIn) return toast('Check-out must be after check-in', 'error');
    const q = f.q.trim();
    addRecentSearch(q);
    const p = new URLSearchParams({ ...(q && { q }), ...(f.checkIn && { in: f.checkIn }), ...(f.checkOut && { out: f.checkOut }), travelers: f.travelers });
    navigate(`/destinations?${p}`);
  };

  return (
    <form onSubmit={submit} role="search" aria-label="Search destinations"
      className="grid gap-3 rounded-3xl bg-white p-4 text-lagoon-900 shadow-2xl dark:bg-night-800 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_.8fr_auto] lg:items-end">
      <Field icon={MapPin} label="Destination">
        <input className="input" list="recent" placeholder="Where to? Try Bali" value={f.q} onChange={set('q')} />
        <datalist id="recent">{recentSearches.map((r) => <option key={r} value={r} />)}</datalist>
      </Field>
      <Field icon={Calendar} label="Check-in"><input type="date" className="input" min={today()} value={f.checkIn} onChange={set('checkIn')} /></Field>
      <Field icon={Calendar} label="Check-out"><input type="date" className="input" min={f.checkIn || today()} value={f.checkOut} onChange={set('checkOut')} /></Field>
      <Field icon={Users} label="Travelers">
        <select className="input" value={f.travelers} onChange={set('travelers')}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'traveler' : 'travelers'}</option>)}
        </select>
      </Field>
      <button type="submit" className="btn-primary h-[44px] sm:col-span-2 lg:col-span-1"><Search size={18} aria-hidden /> Search</button>
    </form>
  );
}
