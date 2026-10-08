import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useLocalStorage } from '../utils/storage.js';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);
const uid = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('dt-theme', 'light');
  const [favorites, setFavorites] = useLocalStorage('dt-favorites', []);
  const [recentSearches, setRecentSearches] = useLocalStorage('dt-recent', []);
  const [users, setUsers] = useLocalStorage('dt-users', []);
  const [user, setUser] = useLocalStorage('dt-user', null);
  const [bookings, setBookings] = useLocalStorage('dt-bookings', []);
  const [trip, setTrip] = useLocalStorage('dt-trip', { start: '', end: '', items: [] });
  const [toasts, setToasts] = useState([]);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => {
    if (user && !user.remember && !sessionStorage.getItem('dt-active')) setUser(null);
    sessionStorage.setItem('dt-active', '1');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismissToast(id), 3500);
  }, [dismissToast]);

  const value = useMemo(() => {
    const isFavorite = (kind, id) => favorites.some((f) => f.kind === kind && f.id === id);
    const publicUser = (u, remember) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, remember });
    return {
      theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      favorites, isFavorite,
      toggleFavorite: (kind, id) => {
        const had = isFavorite(kind, id);
        setFavorites((f) => (had ? f.filter((x) => !(x.kind === kind && x.id === id)) : [...f, { kind, id }]));
        toast(had ? 'Removed from favorites' : 'Added to favorites');
      },
      recentSearches, addRecentSearch: (q) => q && setRecentSearches((r) => [q, ...r.filter((x) => x !== q)].slice(0, 5)),
      user,
      signup: (d) => {
        const email = d.email.trim().toLowerCase();
        if (users.some((u) => u.email === email)) return 'An account with this email already exists.';
        const u = { id: uid(), firstName: d.firstName.trim(), lastName: d.lastName.trim(), email, password: d.password };
        setUsers([...users, u]); setUser(publicUser(u, true)); return '';
      },
      login: (email, password, remember) => {
        const u = users.find((x) => x.email === email.trim().toLowerCase() && x.password === password);
        if (!u) return 'Incorrect email or password.';
        setUser(publicUser(u, remember)); return '';
      },
      logout: () => { setUser(null); toast('Signed out'); },
      updateProfile: (patch) => { setUser((u) => ({ ...u, ...patch })); setUsers((all) => all.map((x) => (x.id === user.id ? { ...x, ...patch } : x))); },
      bookings, addBooking: (b) => setBookings((all) => [b, ...all]),
      trip, setTripDates: (start, end) => setTrip((t) => ({ ...t, start, end })),
      addToTrip: (kind, id) => {
        if (trip.items.some((i) => i.kind === kind && i.id === id)) return toast('Already in your trip planner', 'error');
        setTrip((t) => ({ ...t, items: [...t.items, { uid: uid(), kind, id, note: '' }] })); toast('Trip added to planner');
      },
      removeFromTrip: (u) => setTrip((t) => ({ ...t, items: t.items.filter((i) => i.uid !== u) })),
      moveTripItem: (u, dir) => setTrip((t) => {
        const items = [...t.items]; const i = items.findIndex((x) => x.uid === u); const j = i + dir;
        if (j < 0 || j >= items.length) return t;
        [items[i], items[j]] = [items[j], items[i]]; return { ...t, items };
      }),
      setTripNote: (u, note) => setTrip((t) => ({ ...t, items: t.items.map((i) => (i.uid === u ? { ...i, note } : i)) })),
      toasts, toast, dismissToast,
    };
  }, [theme, favorites, recentSearches, users, user, bookings, trip, toasts, toast, dismissToast, setTheme, setFavorites, setRecentSearches, setUsers, setUser, setBookings, setTrip]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
