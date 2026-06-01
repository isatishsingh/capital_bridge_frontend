import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/userService';
import { useToast } from '../components/feedback/ToastProvider';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/feedback/LoadingState';
import { handleApiError } from '../services/api';
import { getRoleLabel, getMembershipPlanName } from '../utils/roleLabels';
import { ROLES } from '../utils/constants';
import { normalizeUser } from '../utils/auth';
import { storage } from '../utils/storage';

export const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const { notify } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await userService.getMyProfile();
        setProfile(data);
        setForm((current) => ({
          ...current,
          name: data.name || ''
        }));
      } catch (error) {
        notify(handleApiError(error, 'Unable to load profile.'), 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newPassword = form.newPassword.trim();
    const confirmPassword = form.confirmPassword.trim();
    const currentPassword = form.currentPassword;

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        notify('Enter your current password to change your password.', 'error');
        return;
      }
      if (!newPassword) {
        notify('Enter a new password.', 'error');
        return;
      }
      if (newPassword.length < 6) {
        notify('New password must be at least 6 characters.', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        notify('New password and confirmation do not match.', 'error');
        return;
      }
    }

    setSaving(true);

    try {
      const payload = { name: form.name.trim() };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const updated = await userService.updateMyProfile(payload);
      setProfile(updated);
      const nextUser = normalizeUser({
        ...user,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        creatorMembershipActive: updated.creatorMembershipActive,
        investorMembershipActive: updated.investorMembershipActive
      });
      storage.setUser(nextUser);
      setUser(nextUser);
      setForm((current) => ({
        ...current,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      notify('Profile updated successfully.', 'success');
    } catch (error) {
      notify(handleApiError(error, 'Unable to update profile.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading your profile..." />
      </div>
    );
  }

  const role = profile?.role || user?.role;
  const membershipActive =
    role === ROLES.CREATOR
      ? profile?.creatorMembershipActive
      : role === ROLES.INVESTOR
        ? profile?.investorMembershipActive
        : null;

  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Account</p>
        <h1 className="mt-3 section-title">Your profile</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Manage your account details. Role-specific information is shown below.
        </p>

        <Card className="mt-10 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="mt-1 text-xl font-bold text-ink">{profile?.name || user?.name}</p>
              <p className="mt-1 text-sm text-slate-600">{profile?.email || user?.email}</p>
            </div>
            <Badge tone="neutral">{getRoleLabel(role)}</Badge>
          </div>

          <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Account type</dt>
              <dd className="mt-1 font-semibold text-slate-900">{getRoleLabel(role)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="mt-1 font-semibold text-slate-900">{profile?.email}</dd>
            </div>

            {role === ROLES.CREATOR ? (
              <>
                <div>
                  <dt className="text-sm text-slate-500">KYC verification</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {profile?.kycVerified ? 'Verified' : 'Not verified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">{getMembershipPlanName(role)}</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {membershipActive ? 'Active' : 'Free plan'}
                  </dd>
                </div>
              </>
            ) : null}

            {role === ROLES.INVESTOR ? (
              <div className="sm:col-span-2">
                <dt className="text-sm text-slate-500">{getMembershipPlanName(role)}</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {membershipActive ? 'Active' : 'Free plan'}
                </dd>
              </div>
            ) : null}

            {role === ROLES.ADMIN ? (
              <div className="sm:col-span-2">
                <dt className="text-sm text-slate-500">Admin access</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  Platform moderation, users, projects, and reports
                </dd>
              </div>
            ) : null}
          </dl>

          {role === ROLES.CREATOR && !profile?.kycVerified ? (
            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
              Complete verification before creating projects.{' '}
              <Link className="font-semibold underline" to="/creator/verification">
                Go to KYC
              </Link>
            </div>
          ) : null}

          {(role === ROLES.CREATOR || role === ROLES.INVESTOR) && !membershipActive ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <Link className="font-semibold text-accent" to="/subscription">
                View subscription plans
              </Link>
            </div>
          ) : null}
        </Card>

        <form className="surface mt-8 grid gap-6 p-8" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-ink">Update details</h2>
          <div>
            <label className="field-label">Full name</label>
            <input
              className="field-input"
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-lg font-semibold text-ink">Change password</h3>
            <p className="mt-2 text-sm text-slate-600">
              Leave blank to keep your current password. To set a new one, enter your
              current password first — it must match before the update is saved.
            </p>
          </div>
          <div>
            <label className="field-label">Current password</label>
            <input
              autoComplete="current-password"
              className="field-input"
              type="password"
              value={form.currentPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  currentPassword: event.target.value
                }))
              }
            />
          </div>
          <div>
            <label className="field-label">New password</label>
            <input
              autoComplete="new-password"
              className="field-input"
              minLength={6}
              type="password"
              value={form.newPassword}
              onChange={(event) =>
                setForm((current) => ({ ...current, newPassword: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="field-label">Confirm new password</label>
            <input
              autoComplete="new-password"
              className="field-input"
              minLength={6}
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value
                }))
              }
            />
          </div>
          <Button disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};
