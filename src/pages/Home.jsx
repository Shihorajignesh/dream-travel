import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, LifeBuoy, Sparkles, Tag } from 'lucide-react';
import SearchBox from '../components/SearchBox.jsx';
import SmartImage from '../components/SmartImage.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import PackageCard from '../components/PackageCard.jsx';
import ExperienceCard from '../components/ExperienceCard.jsx';
import Modal from '../components/Modal.jsx';
import Newsletter from '../components/Newsletter.jsx';
import Reveal from '../components/Reveal.jsx';
import useReveal from '../hooks/useReveal.js';
import { destinations, HERO_IMAGE } from '../data/destinations.js';
import { packages } from '../data/packages.js';
import { experiences } from '../data/experiences.js';
import { posts } from '../data/posts.js';

const WHY = [[Sparkles, 'Handpicked experiences', 'Every stay and tour is tested by our travel editors before it is listed.'], [Tag, 'Best price guarantee', 'Find the same trip cheaper elsewhere and we will match it.'], [Compass, 'Local experts', 'Guides who live where you travel, with insider routes and timing.'], [LifeBuoy, '24/7 travel support', 'A real person on the line, day or night, before and during your trip.']];
const MOSAIC = 'grid gap-1 sm:grid-cols-2 lg:grid-cols-3';
const delay = (ms) => ({ animationDelay: `${ms}ms`, animationFillMode: 'backwards' });

function Heading({ id, title, sub, to, cta }) {
  return (
    <Reveal className="container-x flex items-end justify-between gap-4">
      <div><h2 id={id} className="text-3xl font-extrabold sm:text-5xl">{title}</h2>{sub && <p className="mt-2 text-slate-600 dark:text-slate-400">{sub}</p>}</div>
      {to && <Link to={to} className="hidden min-h-[44px] items-center font-semibold text-lagoon-700 hover:underline dark:text-sun-400 sm:flex">{cta} →</Link>}
    </Reveal>
  );
}

function PostCard({ p, onOpen }) {
  const [ref, cls] = useReveal();
  return (
    <article ref={ref} className={`group relative aspect-[4/5] overflow-hidden text-white sm:aspect-[5/4] ${cls}`}>
      <SmartImage src={p.image} alt={p.title} className="absolute inset-0 h-full w-full group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-sun-400">{p.tag}</p>
        <h3 className="mt-1 text-2xl font-extrabold">{p.title}</h3>
        <p className="mt-2 text-sm text-white/85">{p.excerpt}</p>
        <button type="button" onClick={() => onOpen(p)} className="mt-2 min-h-[44px] text-sm font-semibold text-sun-400 hover:underline">Read article →</button>
      </div>
    </article>
  );
}

export default function Home() {
  const [post, setPost] = useState(null);
  useEffect(() => { document.title = 'Dream Travel | Travel beyond your imagination'; }, []);
  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-10 pt-28 text-white sm:items-center">
        <SmartImage src={HERO_IMAGE} alt="Turquoise lagoon with overwater villas at sunrise" eager kenburns className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-lagoon-900/70 via-lagoon-900/30 to-lagoon-900/85" />
        <div className="container-x relative">
          <h1 className="max-w-3xl animate-rise text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl" style={delay(100)}>Travel Beyond Your Imagination</h1>
          <p className="mt-5 max-w-xl animate-rise text-base leading-relaxed text-white/90 sm:text-lg" style={delay(300)}>Discover unforgettable destinations, handpicked experiences, and journeys designed around the way you dream of traveling.</p>
          <div className="mt-7 flex animate-rise flex-col gap-3 sm:flex-row" style={delay(500)}><Link to="/destinations" className="btn-primary">Explore Destinations</Link><Link to="/trip-planner" className="btn-ghost">Plan My Trip</Link></div>
          <div className="mt-10 animate-rise" style={delay(700)}><SearchBox /></div>
        </div>
      </section>

      <section className="pt-24" aria-labelledby="trending">
        <Heading id="trending" title="Trending destinations" sub="Where travelers are heading this season." to="/destinations" cta="View all" />
        <div className={`mt-10 ${MOSAIC}`}>{destinations.slice(0, 6).map((d) => <DestinationCard key={d.id} d={d} />)}</div>
      </section>

      <section className="pt-24" aria-labelledby="exp">
        <Heading id="exp" title="Popular experiences" sub="Choose the feeling, we'll find the place." to="/experiences" cta="All experiences" />
        <div className={`mt-10 ${MOSAIC}`}>{experiences.map((e) => <ExperienceCard key={e.id} e={e} />)}</div>
      </section>

      <section className="pt-24" aria-labelledby="feat">
        <Heading id="feat" title="Featured packages" sub="Bundled stays and guided experiences at launch-week prices." to="/packages" cta="View all packages" />
        <div className={`mt-10 ${MOSAIC}`}>{packages.filter((p) => p.oldPrice).slice(0, 3).map((p) => <PackageCard key={p.id} p={p} />)}</div>
      </section>

      <section className="container-x pt-24" aria-labelledby="why">
        <Reveal><h2 id="why" className="text-3xl font-extrabold sm:text-5xl">Why Dream Travel</h2></Reveal>
        <div className="mt-10 grid gap-10 border-t border-slate-200 pt-10 dark:border-night-700 sm:grid-cols-2 lg:grid-cols-4">{WHY.map(([Icon, t, d]) => (
          <Reveal key={t}><Icon size={30} className="text-lagoon-500" aria-hidden /><h3 className="mt-4 text-xl font-extrabold">{t}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{d}</p></Reveal>
        ))}</div>
      </section>

      <section className="pt-24" aria-labelledby="insp">
        <Heading id="insp" title="Travel inspiration" sub="Ideas and guides from our editors." />
        <div className={`mt-10 ${MOSAIC}`}>{posts.map((p) => <PostCard key={p.id} p={p} onOpen={setPost} />)}</div>
      </section>
      <Modal open={!!post} onClose={() => setPost(null)} title={post?.title || ''}><p className="leading-relaxed text-slate-600 dark:text-slate-300">{post?.body}</p><Link to="/destinations" className="btn-primary mt-6">Explore Destinations</Link></Modal>

      <Newsletter />
    </>
  );
}
