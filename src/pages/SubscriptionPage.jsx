import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { subscriptionService } from '../services/subscriptionService';
import { useToast } from '../components/feedback/ToastProvider';
import { LoadingState } from '../components/feedback/LoadingState';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { currency } from '../utils/formatters';
import { handleApiError } from '../services/api';
import { openRazorpayCheckout } from '../utils/razorpayCheckout';
import { FREE_TIER, ROLES } from '../utils/constants';
import { getMembershipPlanName, getRoleLabel } from '../utils/roleLabels';

const PLAN_CONTENT = {
  [ROLES.CREATOR]: {
    subtitle: 'List more campaigns and raise beyond the free funding cap.',
    freeFeatures: [
      `List ${FREE_TIER.MAX_PROJECTS} project on the platform`,
      `Fundraising goal up to ${currency(FREE_TIER.MAX_GOAL_INR)}`,
      'Standard project dashboard and request management'
    ],
    paidFeatures: [
      'Unlimited project listings',
      'Any fundraising goal amount',
      'Priority visibility for campaigns (coming soon)',
      'Full creator analytics'
    ]
  },
  [ROLES.INVESTOR]: {
    subtitle: 'Invest across more projects with higher ticket sizes.',
    freeFeatures: [
      `Invest on ${FREE_TIER.MAX_INVESTOR_PROJECTS} project`,
      `Up to ${currency(FREE_TIER.MAX_INVESTMENT_INR)} per investment`,
      'Investment requests and payment tracking'
    ],
    paidFeatures: [
      'Invest on unlimited projects',
      'No per-investment amount cap',
      'Payment receipts and investment history',
      'Founder chat on all eligible projects'
    ]
  }
};

export const SubscriptionPage = () => {
  const { user, hydrate } = useAuthStore();
  const { notify } = useToast();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const role = user?.role;
  const roleLabel = getRoleLabel(role);
  const planName = getMembershipPlanName(role);
  const planKey = role === ROLES.CREATOR ? ROLES.CREATOR : ROLES.INVESTOR;
  const content = PLAN_CONTENT[planKey];

  const dashboardPath =
    role === ROLES.CREATOR ? '/creator/dashboard' : '/investor/dashboard';

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getStatus();
      setStatus(data);
    } catch (error) {
      notify(handleApiError(error, 'Unable to load subscription details.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const usageStats = useMemo(() => {
    if (!status) {
      return [];
    }
    if (role === ROLES.CREATOR) {
      return [
        { label: 'Projects listed', value: `${status.projectsCreated ?? 0} / ${status.freeProjectLimit ?? FREE_TIER.MAX_PROJECTS}` },
        { label: 'Free goal limit', value: currency(status.freeGoalLimitInr ?? FREE_TIER.MAX_GOAL_INR) }
      ];
    }
    return [
      { label: 'Projects used', value: `${status.distinctProjectsUsed ?? 0} / ${status.freeProjectInvestLimit ?? FREE_TIER.MAX_INVESTOR_PROJECTS}` },
      { label: 'Free investment limit', value: currency(status.freeInvestmentLimitInr ?? FREE_TIER.MAX_INVESTMENT_INR) }
    ];
  }, [role, status]);

  const handleUpgrade = async () => {
    if (!role || status?.hasMembership) {
      return;
    }

    setPaying(true);
    try {
      const order = await subscriptionService.createMembershipOrder(planKey);
      const orderId = order.orderId || order.id;

      await openRazorpayCheckout({
        orderId,
        description: `${planName} — ${user?.name} (${roleLabel})`,
        user,
        onSuccess: async (response) => {
          const result = await subscriptionService.verifyMembership({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
          if (!result?.success) {
            throw new Error(result?.message || 'Membership payment could not be verified.');
          }
          notify(result.message || 'Membership activated successfully.', 'success');
          await hydrate();
          await loadStatus();
          return result;
        }
      });
    } catch (error) {
      notify(handleApiError(error, 'Membership payment could not be completed.'), 'error');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading subscription plans..." />
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Membership</p>
        <h1 className="mt-3 section-title">Upgrade your CapitalBridge plan</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          One shared subscription experience for every account type. Your plan limits depend on whether you
          are raising funds or investing — details below are tailored to your role.
        </p>

        {/* Account identity — role-specific label */}
        <Card className="mt-10 border border-slate-200 bg-gradient-to-br from-white to-slate-50">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Signed in as</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{user?.name || 'Your account'}</p>
              <p className="mt-1 text-sm text-slate-600">{user?.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info">{roleLabel}</Badge>
              {status?.hasMembership ? (
                <Badge tone="success">Membership active</Badge>
              ) : (
                <Badge tone="warning">Free plan</Badge>
              )}
            </div>
          </div>
        </Card>

        {status?.hasMembership ? (
          <Card className="mt-8 border border-emerald-200 bg-emerald-50">
            <h2 className="text-xl font-bold text-emerald-900">{planName} is active</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              {status.guidanceMessage || 'You have full access to membership benefits.'}
            </p>
            <Link className="mt-6 inline-block" to={dashboardPath}>
              <Button tone="slate" variant="outline">
                Back to dashboard
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <p className="mt-8 text-sm text-slate-500">{content?.subtitle}</p>

            {usageStats.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {usageStats.map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-50 px-5 py-4">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card className="border border-slate-200">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Free</p>
                <p className="mt-2 font-display text-3xl font-bold text-ink">₹0</p>
                <p className="mt-1 text-sm text-slate-500">Current plan for {roleLabel}s</p>
                <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
                  {content?.freeFeatures.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-accent" aria-hidden="true">
                        •
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="border-2 border-accent/30 bg-teal-50/40 ring-1 ring-accent/10">
                <p className="text-sm font-bold uppercase tracking-wide text-accent">{planName}</p>
                <p className="mt-2 font-display text-3xl font-bold text-ink">
                  {currency(status?.membershipPriceInr || 0)}
                </p>
                <p className="mt-1 text-sm text-slate-500">One-time activation</p>
                <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
                  {content?.paidFeatures.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-accent" aria-hidden="true">
                        ✓
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Checkout — payer name + role shown before payment */}
            <Card className="mt-10">
              <h2 className="text-xl font-bold text-ink">Complete membership payment</h2>
              <p className="mt-2 text-sm text-slate-500">
                Review your account details below. Razorpay checkout will use the same name and email.
              </p>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt>
                    <dd className="mt-1 text-base font-semibold text-ink">{user?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt>
                    <dd className="mt-1 text-base font-semibold text-ink">{roleLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                    <dd className="mt-1 text-base text-slate-800">{user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</dt>
                    <dd className="mt-1 text-base font-semibold text-ink">{planName}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount due</dt>
                    <dd className="mt-1 font-display text-2xl font-bold text-accent">
                      {currency(status?.membershipPriceInr || 0)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="sm:min-w-[220px]" disabled={paying} type="button" onClick={handleUpgrade}>
                  {paying ? 'Opening secure checkout...' : `Pay as ${roleLabel}`}
                </Button>
                <Link to={dashboardPath}>
                  <Button tone="slate" variant="outline" type="button">
                    Maybe later
                  </Button>
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
