import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../feedback/ToastProvider';
import { Button } from '../ui/Button';
import { currency } from '../../utils/formatters';
import { handleApiError, isSubscriptionError } from '../../services/api';
import { ROLES } from '../../utils/constants';

export const MembershipUpgradeCard = ({ compact = false }) => {
  const { user } = useAuthStore();
  const { notify } = useToast();
  const [status, setStatus] = useState(null);

  const plan =
    user?.role === ROLES.CREATOR ? ROLES.CREATOR : user?.role === ROLES.INVESTOR ? ROLES.INVESTOR : null;

  useEffect(() => {
    if (!plan) {
      return;
    }
    subscriptionService
      .getStatus()
      .then(setStatus)
      .catch((error) => {
        notify(handleApiError(error, 'Unable to load subscription status.'), 'error');
      });
  }, [plan, notify, user?.id]);

  if (!plan || status?.hasMembership) {
    return null;
  }

  return (
    <div className={`rounded-3xl border border-amber-200 bg-amber-50 ${compact ? 'p-4' : 'p-6'}`}>
      <p className="text-sm font-bold uppercase tracking-wide text-amber-800">Free plan limits</p>
      <p className="mt-2 text-sm leading-6 text-amber-900">
        {status?.guidanceMessage || 'Upgrade to remove free-tier limits on projects and investments.'}
      </p>
      <p className="mt-2 text-sm text-amber-800">
        Membership from {currency(status?.membershipPriceInr || 0)} (one-time)
      </p>
      <Link className="mt-4 inline-block" to="/subscription">
        <Button type="button">{compact ? 'View plans' : 'View plans & upgrade'}</Button>
      </Link>
    </div>
  );
};

export const notifySubscriptionRequired = (notify, error) => {
  if (isSubscriptionError(error)) {
    notify(handleApiError(error), 'error');
    return true;
  }
  return false;
};
