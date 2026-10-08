import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] lg:bottom-6 flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex max-w-sm animate-rise items-center gap-3 rounded-2xl bg-lagoon-900 px-4 py-3 text-sm text-white shadow-xl ring-1 ring-white/10">
          {t.type === 'error' ? <AlertCircle size={18} className="text-rose-400" aria-hidden /> : <CheckCircle2 size={18} className="text-lagoon-500" aria-hidden />}
          <span>{t.message}</span>
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss notification" className="ml-1 grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}
