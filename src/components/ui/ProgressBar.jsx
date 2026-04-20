export const ProgressBar = ({ value, className = '' }) => (
  <div className={`h-3 w-full rounded-full bg-slate-100 ${className}`}>
    <div
      className="h-3 rounded-full bg-gradient-to-r from-accent to-signal"
      style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
    />
  </div>
);
