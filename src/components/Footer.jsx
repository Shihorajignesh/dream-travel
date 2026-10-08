import { Link } from 'react-router-dom';
import { Facebook, Instagram, Plane, Twitter, Youtube } from 'lucide-react';

const cols = [
  { title: 'Explore', links: [['Destinations', '/destinations'], ['Packages', '/packages'], ['Experiences', '/experiences'], ['Trip Planner', '/trip-planner']] },
  { title: 'Support', links: [['Contact us', '/contact'], ['Favorites', '/favorites'], ['My profile', '/profile'], ['Log in', '/login']] },
  { title: 'Company', links: [['Create account', '/signup'], ['Get in touch', '/contact']] },
];
const socials = [[Instagram, 'Instagram', 'instagram'], [Facebook, 'Facebook', 'facebook'], [Twitter, 'Twitter', 'twitter'], [Youtube, 'YouTube', 'youtube']];

export default function Footer() {
  return (
    <footer className="mt-20 bg-lagoon-900 text-slate-300 dark:bg-night-800">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display text-xl font-extrabold text-white"><Plane size={22} className="text-sun-500" aria-hidden /> Dream Travel</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">Handpicked journeys, local experts, and support whenever you need it.</p>
          <div className="mt-5 flex gap-2">{socials.map(([Icon, label, host]) => (
            <a key={label} href={`https://www.${host}.com`} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-sun-500 hover:text-lagoon-900"><Icon size={18} /></a>
          ))}</div>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="font-display text-base font-extrabold text-white">{c.title}</h2>
            <ul className="mt-4 space-y-2 text-sm">{c.links.map(([l, to]) => <li key={l}><Link to={to} className="inline-block py-1 hover:text-sun-400">{l}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} Dream Travel. All rights reserved.</div>
    </footer>
  );
}
