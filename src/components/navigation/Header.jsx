import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { NAV_LINKS, ROLES } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { ProfileMenu } from './ProfileMenu';

const linkClassName = ({ isActive }) =>
  `text-sm font-medium ${isActive ? 'text-accent' : 'text-slate-600 hover:text-slate-900'}`;

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleLinks = user ? NAV_LINKS[user.role] : NAV_LINKS.public;

  const dashboardTarget =
    user?.role === ROLES.INVESTOR
      ? '/investor/dashboard'
      : user?.role === ROLES.CREATOR
        ? '/creator/dashboard'
        : '/admin/dashboard';

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-canvas/90 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
          <Link to="/" className="flex shrink-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-lg font-black text-white">
              CS
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg font-bold text-ink">CrowdSpring</div>
              <div className="hidden text-xs uppercase tracking-[0.22em] text-slate-500 sm:block">
                Equity crowdfunding
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {roleLinks.map((item) => (
              <NavLink key={item.to} className={linkClassName} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button tone="slate" variant="outline">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardTarget} className="hidden lg:block">
                <Button tone="slate" variant="outline">
                  Dashboard
                </Button>
              </Link>
              <div className="hidden lg:block">
                <ProfileMenu />
              </div>
              <Button className="lg:hidden" tone="slate" variant="outline" onClick={() => setMobileOpen((o) => !o)}>
                Menu
              </Button>
            </>
          )}
        </div>
      </div>

      {!user ? (
        <div className="border-t border-slate-100 bg-white/90 px-4 py-2 lg:hidden">
          <nav className="flex gap-4 overflow-x-auto">
            {NAV_LINKS.public.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm font-medium ${isActive ? 'text-accent' : 'text-slate-600'}`
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}

      {user && mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {roleLinks.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-accent/10 text-accent' : 'text-slate-700'}`}
                to={item.to}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700"
              to={dashboardTarget}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            {user.role === ROLES.CREATOR ? (
              <Link
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700"
                to="/creator/verification"
                onClick={() => setMobileOpen(false)}
              >
                Verification (KYC)
              </Link>
            ) : null}
            <button
              type="button"
              className="rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600"
              onClick={handleLogout}
            >
              Log out
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
};
