import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function AuthShell({ title, subtitle, children, footer }) {
  const { toast } = useApp();
  return (
    <div className="container-x grid min-h-[80vh] place-items-center py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700 sm:p-8">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="my-5 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-200 dark:bg-night-700" />or continue with<span className="h-px flex-1 bg-slate-200 dark:bg-night-700" /></div>
        <div className="grid grid-cols-2 gap-3">
          {['Google', 'Apple'].map((n) => <button key={n} type="button" onClick={() => toast(`${n} sign-in isn't available in this demo`, 'error')} className="btn border border-slate-300 dark:border-night-700">{n}</button>)}
        </div>
        <p className="mt-6 text-center text-sm">{footer.text} <Link to={footer.to} className="font-semibold text-lagoon-700 underline dark:text-sun-400">{footer.link}</Link></p>
      </div>
    </div>
  );
}
