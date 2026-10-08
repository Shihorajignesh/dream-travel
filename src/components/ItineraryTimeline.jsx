export default function ItineraryTimeline({ items }) {
  return (
    <ol className="relative space-y-3 border-l-2 border-lagoon-500/30 pl-6">
      {items.map((it) => (
        <li key={it.day} className="relative">
          <span aria-hidden className="absolute -left-[33px] top-4 grid h-5 w-5 place-items-center rounded-full bg-lagoon-500 text-[10px] font-bold text-white">{it.day}</span>
          <details open={it.day === 1} className="group rounded-2xl bg-white ring-1 ring-slate-100 dark:bg-night-800 dark:ring-night-700">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold">Day {it.day} — {it.title}<span aria-hidden className="text-xl transition group-open:rotate-45">+</span></summary>
            <p className="px-4 pb-4 text-slate-600 dark:text-slate-300">{it.text}</p>
          </details>
        </li>
      ))}
    </ol>
  );
}
