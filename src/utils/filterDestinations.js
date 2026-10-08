export const BUDGETS = { any: [0, Infinity], low: [0, 1000], mid: [1000, 1300], high: [1300, Infinity] };
export const DURATIONS = { any: [0, Infinity], short: [0, 5], medium: [6, 8], long: [9, Infinity] };
export const SORTS = { popularity: 'Popularity', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', rating: 'Highest rated' };

export function filterDestinations(list, { q = '', region = '', country = '', budget = 'any', duration = 'any', rating = 0, type = '', sort = 'popularity' }) {
  const term = q.trim().toLowerCase();
  const [minP, maxP] = BUDGETS[budget];
  const [minD, maxD] = DURATIONS[duration];
  const out = list.filter((d) =>
    (!term || [d.name, d.country, d.region, d.tripType, d.blurb].join(' ').toLowerCase().includes(term)) &&
    (!region || d.region === region) && (!country || d.country === country) && (!type || d.tripType === type) &&
    d.from >= minP && d.from < maxP && d.days >= minD && d.days <= maxD && d.rating >= rating);
  const by = { popularity: (a, b) => b.popularity - a.popularity, 'price-asc': (a, b) => a.from - b.from, 'price-desc': (a, b) => b.from - a.from, rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews };
  return out.sort(by[sort]);
}
