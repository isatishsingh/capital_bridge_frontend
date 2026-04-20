import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { initialsFromName, roleLabel } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';

export const ProfileMenu = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDoc = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  if (!user) {
    return null;
  }

  const dashboard =
    user.role === ROLES.INVESTOR
      ? '/investor/dashboard'
      : user.role === ROLES.CREATOR
        ? '/creator/dashboard'
        : '/admin/dashboard';

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 pr-3 shadow-sm transition hover:border-slate-300"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
          {initialsFromName(user.name || user.fullName || user.email)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-[8rem] truncate text-sm font-semibold text-slate-900">
            {user.name || user.fullName || 'Account'}
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {roleLabel(user.role)}
          </span>
        </span>
        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl"
          role="menu"
        >
          <Link
            role="menuitem"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            to={dashboard}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          {user.role === ROLES.CREATOR ? (
            <Link
              role="menuitem"
              className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              to="/creator/verification"
              onClick={() => setOpen(false)}
            >
              Verification (KYC)
            </Link>
          ) : null}
          <Link
            role="menuitem"
            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            to="/projects"
            onClick={() => setOpen(false)}
          >
            Browse projects
          </Link>
          <div className="my-2 border-t border-slate-100" />
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
};
