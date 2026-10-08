import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import SavedGrid from '../components/SavedGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Favorites() {
  const { favorites } = useApp();
  useEffect(() => { document.title = 'Favorites | Dream Travel'; }, []);
  return (
    <div className="container-x py-10">
      <h1 className="text-4xl font-extrabold">Your favorites</h1>
      <div className="mt-8">
        {favorites.length === 0 ? (
          <EmptyState icon={Heart} title="Your dream destinations are waiting." text="Tap the heart on any destination or package to save it here."><Link to="/destinations" className="btn-primary">Start Exploring</Link></EmptyState>
        ) : (
          <div className="space-y-12">
            <section aria-labelledby="fd"><h2 id="fd" className="mb-4 text-2xl font-extrabold">Destinations</h2><SavedGrid kind="destination" /></section>
            <section aria-labelledby="fp"><h2 id="fp" className="mb-4 text-2xl font-extrabold">Packages</h2><SavedGrid kind="package" /></section>
          </div>
        )}
      </div>
    </div>
  );
}
