export const Modal = ({ open, title, children, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-ink">{title}</h3>
          <button className="text-sm font-semibold text-slate-500" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
