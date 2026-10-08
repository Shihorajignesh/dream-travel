import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, Moon, Plane, Search, Sun, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const NAV = [
  { to: '/', label: 'Home' }, { to: '/destinations', label: 'Destinations' }, { to: '/packages', label: 'Packages' },
  { to: '/experiences', label: 'Experiences' }, { to: '/trip-planner', label: 'Trip Planner' },
];
const mobileNav = (user) => [...NAV, { to: '/favorites', label: 'Favorites' }, user ? { to: '/profile', label: 'Profile' } : { to: '/login', label: 'Log in' }, { to: '/contact', label: 'Contact' }];

export default function Navbar({ isHome }) {
  const { theme, toggleTheme, favorites, user } = useApp();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  const light = isHome && !solid && !open;
  const link = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-sun-500 text-lagoon-900' : light ? 'text-white hover:bg-white/15' : 'hover:bg-lagoon-50 dark:hover:bg-night-700'}`;
  const icon = `grid h-11 w-11 place-items-center rounded-full transition ${light ? 'text-white hover:bg-white/15' : 'hover:bg-lagoon-50 dark:hover:bg-night-700'}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${light ? 'bg-transparent text-white' : 'bg-white/90 shadow-sm backdrop-blur dark:bg-night-900/90'}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold"><Plane size={22} className="text-sun-500" aria-hidden /> Dream Travel</Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">{NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={link}>{n.label}</NavLink>)}</nav>
        <div className="flex items-center">
          <Link to="/destinations" className={icon} aria-label="Search destinations"><Search size={20} /></Link>
          <button type="button" onClick={toggleTheme} className={icon} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
          <Link to="/favorites" className={`${icon} relative hidden sm:grid`} aria-label={`Favorites (${favorites.length})`}>
            <Heart size={20} />{favorites.length > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{favorites.length}</span>}
          </Link>
          <Link to={user ? '/profile' : '/login'} className={`${icon} hidden sm:grid`} aria-label={user ? 'My profile' : 'Log in'}><User size={20} /></Link>
          <button type="button" className={`${icon} lg:hidden`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      <div id="mobile-menu" className={`fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] bg-white px-4 py-6 text-lagoon-900 transition duration-300 dark:bg-night-900 dark:text-slate-200 lg:hidden ${open ? 'translate-x-0' : 'invisible translate-x-full'}`}>
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {mobileNav(user).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `rounded-2xl px-4 py-3.5 text-lg font-semibold ${isActive ? 'bg-sun-500 text-lagoon-900' : 'hover:bg-lagoon-50 dark:hover:bg-night-700'}`}>{n.label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
