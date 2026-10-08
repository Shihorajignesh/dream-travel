export const EXTRAS = [
  { id: 'transfer', label: 'Airport transfer', price: 120, per: 'booking' },
  { id: 'insurance', label: 'Travel insurance', price: 85, per: 'person' },
  { id: 'guide', label: 'Private guide', price: 250, per: 'booking' },
  { id: 'upgrade', label: 'Room upgrade', price: 200, per: 'booking' },
  { id: 'breakfast', label: 'Extra breakfast package', price: 18, per: 'person-night' },
];
export const ROOMS = ['Double bed', 'Twin beds', 'Quiet room away from lifts'];
const TAX_RATE = 0.08;
const FEE_RATE = 0.03;

export function calcTotal({ price, travelers, nights, extras = [] }) {
  const base = price * travelers;
  const lines = extras.map((id) => {
    const e = EXTRAS.find((x) => x.id === id);
    const mult = e.per === 'person' ? travelers : e.per === 'person-night' ? travelers * nights : 1;
    return { id, label: e.label, amount: e.price * mult };
  });
  const subtotal = base + lines.reduce((s, l) => s + l.amount, 0);
  const taxes = Math.round(subtotal * TAX_RATE);
  const fee = Math.round(subtotal * FEE_RATE);
  return { base, lines, subtotal, taxes, fee, total: subtotal + taxes + fee };
}
export const addDays = (iso, n) => { const d = new Date(`${iso}T00:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
