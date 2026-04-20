export const Button = ({
  children,
  className = '',
  tone = 'primary',
  variant = 'solid',
  ...props
}) => {
  const styles = {
    primary: {
      solid: 'bg-accent text-white hover:bg-accentDark',
      outline: 'border border-accent text-accent hover:bg-accent/5'
    },
    slate: {
      solid: 'bg-slate-900 text-white hover:bg-slate-800',
      outline: 'border border-slate-300 text-slate-700 hover:bg-slate-100'
    },
    danger: {
      solid: 'bg-danger text-white hover:bg-rose-700',
      outline: 'border border-rose-200 text-rose-700 hover:bg-rose-50'
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${
        styles[tone][variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
