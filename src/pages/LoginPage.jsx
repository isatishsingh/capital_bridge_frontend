import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/feedback/ToastProvider';
import { Button } from '../components/ui/Button';

const roleHome = {
  INVESTOR: '/investor/dashboard',
  CREATOR: '/creator/dashboard',
  ADMIN: '/admin/dashboard'
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuthStore();
  const { notify } = useToast();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'INVESTOR'
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form);
      notify('Welcome back.', 'success');
      navigate(location.state?.from?.pathname || roleHome[user.role] || '/');
    } catch (submitError) {
      notify(submitError.message, 'error');
    }
  };

  return (
    <div className="surface p-8 sm:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Log in</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-ink">Access your workspace</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Investors, creators, and admins all use the same secure login flow with role-aware access.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="field-label">Email</label>
          <input
            className="field-input"
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input
            className="field-input"
            required
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />
        </div>
        <div>
          <label className="field-label">Role</label>
          <select
            className="field-input"
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
          >
            <option value="INVESTOR">Investor</option>
            <option value="CREATOR">Customer (creator)</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Need an account?{' '}
        <Link className="font-semibold text-accent" to="/register">
          Register as investor or creator
        </Link>
      </p>
    </div>
  );
};
