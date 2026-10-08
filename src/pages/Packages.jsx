import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, SearchX, SlidersHorizontal } from 'lucide-react';
import PackageCard from '../components/PackageCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useFakeLoad from '../hooks/useFakeLoad.js';
import { CATEGORIES, packages } from '../data/packages.js';
import { filterPackages, PKG_SORTS } from '../utils/filterPackages.js';

const INITIAL = { category: '', maxPrice: 'any', duration: 'any', rating: 0, sort: 'popular' };

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
    </label>
  );
}

export default function Packages() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [f, setF] = useState({ ...INITIAL, category: params.get('category') || '' });
  const [list, setList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const loading = useFakeLoad();
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: k === 'rating' ? Number(v) : v }));
  const results = useMemo(() => filterPackages(packages, { ...f, q }), [f, q]);
  const setQ = (v) => setParams((prev) => { const p = new URLSearchParams(prev); if (v) p.set('q', v); else p.delete('q'); return p; }, { replace: true });
  const reset = () => { setF(INITIAL); setQ(''); };

  useEffect(() => { document.title = 'Travel Packages | Dream Travel'; }, []);

  return (
    <>
      <section className="bg-lagoon-900 py-14 text-white">
        <div className="container-x">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Travel packages, handpicked</h1>
          <p className="mt-3 max-w-xl text-white/80">Hotels, transfers, and guided experiences bundled into journeys you can book in minutes.</p>
          <div className="relative mt-6 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search packages" placeholder="Search Bali, honeymoon, safari…" className="input h-12 rounded-full pl-11" />
          </div>
        </div>
      </section>

      <div className="container-x py-8">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Trip category">
          {['', ...CATEGORIES].map((c) => (
            <button key={c || 'all'} type="button" onClick={() => set('category')(c)} aria-pressed={f.category === c}
              className={`min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition ${f.category === c ? 'bg-lagoon-900 text-white dark:bg-sun-500 dark:text-lagoon-900' : 'bg-white ring-1 ring-slate-200 hover:bg-lagoon-50 dark:bg-night-800 dark:ring-night-700'}`}>{c || 'All packages'}</button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">{loading ? 'Loading packages…' : `${results.length} ${results.length === 1 ? 'package' : 'packages'}`}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-controls="pkg-filters" className="btn border border-slate-300 dark:border-night-700 lg:hidden"><SlidersHorizontal size={16} aria-hidden /> Filters</button>
            <div className="hidden overflow-hidden rounded-full ring-1 ring-slate-300 dark:ring-night-700 sm:flex" role="group" aria-label="Layout">
              {[[false, LayoutGrid, 'Grid view'], [true, List, 'List view']].map(([v, Icon, label]) => (
                <button key={label} type="button" onClick={() => setList(v)} aria-pressed={list === v} aria-label={label} className={`grid h-11 w-11 place-items-center ${list === v ? 'bg-lagoon-900 text-white dark:bg-sun-500 dark:text-lagoon-900' : ''}`}><Icon size={18} /></button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">Sort
              <select className="input w-auto" value={f.sort} onChange={(e) => set('sort')(e.target.value)}>{Object.entries(PKG_SORTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
          </div>
        </div>

        <div id="pkg-filters" className={`mt-4 grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 sm:grid-cols-2 lg:grid-cols-4 ${showFilters ? '' : 'hidden lg:grid'}`}>
          <Select label="Max price per person" value={f.maxPrice} onChange={set('maxPrice')} options={[['any', 'Any price'], ['1500', 'Up to $1,500'], ['2500', 'Up to $2,500'], ['3000', 'Up to $3,000']]} />
          <Select label="Duration" value={f.duration} onChange={set('duration')} options={[['any', 'Any length'], ['short', 'Up to 5 days'], ['medium', '6 to 8 days'], ['long', '9+ days']]} />
          <Select label="Rating" value={f.rating} onChange={set('rating')} options={[[0, 'Any rating'], [4.5, '4.5 and up'], [4.8, '4.8 and up']]} />
          <button type="button" onClick={reset} className="btn self-end border border-slate-300 dark:border-night-700">Reset all</button>
        </div>

        <div className="mt-8">
          {loading ? <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}</div>
            : results.length ? <div className={list ? 'grid gap-6' : 'grid gap-1 sm:grid-cols-2 lg:grid-cols-3'}>{results.map((p) => <PackageCard key={p.id} p={p} list={list} />)}</div>
            : <EmptyState icon={SearchX} title="No packages match" text="Try a different category or loosen your price and duration filters."><button type="button" onClick={reset} className="btn-primary">Clear search and filters</button></EmptyState>}
        </div>
      </div>
    </>
  );
}
