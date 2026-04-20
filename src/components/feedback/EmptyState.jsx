export const EmptyState = ({ title, description, action }) => (
  <div className="surface flex flex-col items-start gap-4 p-8 text-left">
    <div className="rounded-2xl bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
      Empty state
    </div>
    <div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{description}</p>
    </div>
    {action}
  </div>
);
