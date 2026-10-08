import { cloneElement, useId } from 'react';

export default function Field({ label, error, children, className = '' }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
      {cloneElement(children, { id, 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-e` : undefined, className: `input mt-1 ${children.props.className || ''} ${error ? 'border-rose-500' : ''}` })}
      {error && <p id={`${id}-e`} role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
