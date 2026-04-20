export const LoadingState = ({ label = 'Loading...' }) => (
  <div className="surface flex min-h-40 items-center justify-center p-8">
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
      <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
      {label}
    </div>
  </div>
);
