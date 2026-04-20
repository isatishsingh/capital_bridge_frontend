import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/feedback/ToastProvider';
import { Button } from '../components/ui/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loading, error } = useAuthStore();
  const { notify } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: location.state?.defaultRole === 'CREATOR' ? 'CREATOR' : 'INVESTOR'
  });

  useEffect(() => {
    if (location.state?.defaultRole === 'CREATOR') {
      setForm((current) => ({ ...current, role: 'CREATOR' }));
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      notify('Account created successfully. Please log in.', 'success');
      navigate('/login');
    } catch (submitError) {
      notify(submitError.message, 'error');
    }
  };

  return (
    <div className="surface p-8 sm:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Register</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-ink">Create your platform account</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Admin accounts are provisioned internally. Investors and project creators can onboard here.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="field-label">Full name</label>
          <input
            className="field-input"
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </div>
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
            <option value="CREATOR">Customer (project creator)</option>
          </select>
        </div>
        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-semibold text-accent" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
};
