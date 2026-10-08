import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className="relative max-h-[90vh] w-full max-w-lg animate-rise overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-night-800">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-extrabold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-night-700"><X size={20} /></button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
