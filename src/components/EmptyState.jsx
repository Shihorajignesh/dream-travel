export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-night-700">
      <div>
        {Icon && <Icon size={40} className="mx-auto text-lagoon-500" aria-hidden />}
        <h2 className="mt-4 text-2xl font-extrabold">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">{text}</p>
        <div className="mt-6 flex justify-center">{children}</div>
      </div>
    </div>
  );
}
