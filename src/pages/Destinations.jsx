import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SearchX, SlidersHorizontal } from 'lucide-react';
import DestinationCard from '../components/DestinationCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFakeLoad from '../hooks/useFakeLoad.js';
import { destinations } from '../data/destinations.js';
import { filterDestinations, SORTS } from '../utils/filterDestinations.js';

const INITIAL = { region: '', country: '', budget: 'any', duration: 'any', rating: 0, type: '', sort: 'popularity' };
const uniq = (key) => [...new Set(destinations.map((d) => d[key]))].sort();
const TYPES = uniq('tripType');

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

export default function Destinations() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [f, setF] = useState(INITIAL);
  const [showFilters, setShowFilters] = useState(false);
  const loading = useFakeLoad();
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: k === 'rating' ? Number(v) : v }));
  const results = useMemo(() => filterDestinations(destinations, { ...f, q }), [f, q]);

  useEffect(() => { document.title = 'Destinations | Dream Travel'; }, []);
  const setQ = (v) => setParams((prev) => { const p = new URLSearchParams(prev); if (v) p.set('q', v); else p.delete('q'); return p; }, { replace: true });
  const reset = () => { setF(INITIAL); setQ(''); };

  return (
    <>
      <section className="bg-lagoon-900 py-14 text-white">
        <div className="container-x">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Find your next destination</h1>
          <p className="mt-3 max-w-xl text-white/80">Search by place, country, or style of trip, then narrow it down with filters.</p>
          <div className="relative mt-6 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search destinations" placeholder="Search Bali, Japan, beach…" className="input h-12 rounded-full pl-11" />
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Trip type">
          {['', ...TYPES].map((t) => (
            <button key={t || 'all'} type="button" onClick={() => set('type')(t)} aria-pressed={f.type === t}
              className={`min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition ${f.type === t ? 'bg-lagoon-900 text-white dark:bg-sun-500 dark:text-lagoon-900' : 'bg-white ring-1 ring-slate-200 hover:bg-lagoon-50 dark:bg-night-800 dark:ring-night-700'}`}>{t || 'All trips'}</button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">{loading ? 'Loading destinations…' : `${results.length} ${results.length === 1 ? 'destination' : 'destinations'}`}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-controls="filters" className="btn border border-slate-300 dark:border-night-700 lg:hidden"><SlidersHorizontal size={16} aria-hidden /> Filters</button>
            <label className="flex items-center gap-2 text-sm font-semibold">Sort
              <select className="input w-auto" value={f.sort} onChange={(e) => set('sort')(e.target.value)}>{Object.entries(SORTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
          </div>
        </div>

        <div id="filters" className={`mt-4 grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 sm:grid-cols-2 lg:grid-cols-6 ${showFilters ? '' : 'hidden lg:grid'}`}>
          <Select label="Region" value={f.region} onChange={set('region')} options={[['', 'All regions'], ...uniq('region').map((r) => [r, r])]} />
          <Select label="Country" value={f.country} onChange={set('country')} options={[['', 'All countries'], ...uniq('country').map((c) => [c, c])]} />
          <Select label="Budget" value={f.budget} onChange={set('budget')} options={[['any', 'Any budget'], ['low', 'Under $1,000'], ['mid', '$1,000 to $1,299'], ['high', '$1,300 and up']]} />
          <Select label="Duration" value={f.duration} onChange={set('duration')} options={[['any', 'Any length'], ['short', 'Up to 5 days'], ['medium', '6 to 8 days'], ['long', '9+ days']]} />
          <Select label="Rating" value={f.rating} onChange={set('rating')} options={[[0, 'Any rating'], [4.5, '4.5 and up'], [4.8, '4.8 and up']]} />
          <button type="button" onClick={reset} className="btn self-end border border-slate-300 dark:border-night-700">Reset all</button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}</div>
          ) : results.length ? (
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">{results.map((d) => <DestinationCard key={d.id} d={d} />)}</div>
          ) : (
            <EmptyState icon={SearchX} title="No destinations match" text="Try a broader search or remove a filter or two.">
              <button type="button" onClick={reset} className="btn-primary">Clear search and filters</button>
            </EmptyState>
          )}
        </div>
      </div>
    </>
  );
}
