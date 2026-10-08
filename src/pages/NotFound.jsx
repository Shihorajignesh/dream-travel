import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] place-items-center text-center">
      <div>
        <Compass size={56} className="mx-auto text-sun-500" aria-hidden />
        <h1 className="mt-6 text-3xl font-extrabold sm:text-5xl">Looks like your compass sent you somewhere unexpected.</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">That page doesn't exist. Head back and pick a new direction.</p>
        <Link to="/" className="btn-primary mt-8">Back to home</Link>
      </div>
    </section>
  );
}
