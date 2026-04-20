export const StatCard = ({ label, value, hint }) => (
  <div className="surface p-5">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-3 font-display text-3xl font-bold text-ink">{value}</p>
    {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
  </div>
);
