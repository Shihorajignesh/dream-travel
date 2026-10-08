export const PRICE_CAPS = { any: Infinity, '1500': 1500, '2500': 2500, '3000': 3000 };
export const PKG_DURATIONS = { any: [0, Infinity], short: [0, 5], medium: [6, 8], long: [9, Infinity] };
export const PKG_SORTS = { popular: 'Most reviewed', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', rating: 'Highest rated' };

export function filterPackages(list, { q = '', category = '', maxPrice = 'any', duration = 'any', rating = 0, sort = 'popular' }) {
  const term = q.trim().toLowerCase();
  const [minD, maxD] = PKG_DURATIONS[duration];
  const out = list.filter((p) =>
    (!term || [p.name, p.location, p.category, p.summary].join(' ').toLowerCase().includes(term)) &&
    (!category || p.category === category) && p.price <= PRICE_CAPS[maxPrice] && p.days >= minD && p.days <= maxD && p.rating >= rating);
  const by = { popular: (a, b) => b.reviews - a.reviews, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
  return out.sort(by[sort]);
}
export const discountPct = (p) => (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0);

const TITLES = ['City exploration', 'Adventure experience', 'Cultural tour', 'Relaxation day'];
export function buildItinerary(pkg, attractions) {
  const place = pkg.location.split(/ & |,/)[0];
  const middle = Array.from({ length: Math.max(pkg.days - 2, 0) }, (_, i) => ({ title: TITLES[i % TITLES.length], text: `Spend the day around ${attractions[i % attractions.length]} with your guide, leaving time for a long lunch and wandering at your own pace.` }));
  return [{ title: 'Arrival', text: `Arrive in ${place}, meet your host, and settle into your stay at ${pkg.hotel}. Evening welcome dinner.` }, ...middle, { title: 'Departure', text: 'Enjoy a final breakfast before your private transfer to the airport.' }].map((x, i) => ({ ...x, day: i + 1 }));
}
