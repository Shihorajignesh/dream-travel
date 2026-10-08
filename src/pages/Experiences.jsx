import { useEffect } from 'react';
import ExperienceCard from '../components/ExperienceCard.jsx';
import { experiences } from '../data/experiences.js';

export default function Experiences() {
  useEffect(() => { document.title = 'Experiences | Dream Travel'; }, []);
  return (
    <div className="container-x py-10">
      <h1 className="text-4xl font-extrabold">Travel by experience</h1>
      <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">Start with the feeling you want, then explore the destinations and packages that deliver it.</p>
      <div className="mt-8 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">{experiences.map((e) => <ExperienceCard key={e.id} e={e} />)}</div>
    </div>
  );
}
