import { Link } from 'react-router-dom';
import { ProgressBar } from '../ui/ProgressBar';
import { creatorService } from '../../services/creatorService';

const STEPS = [
  {
    key: 'account',
    title: 'Creator account',
    description: 'Registered on the platform'
  },
  {
    key: 'submitted',
    title: 'Application submitted',
    description: 'KYC details sent for review'
  },
  {
    key: 'review',
    title: 'Admin review',
    description: 'Team verifies your profile'
  },
  {
    key: 'verified',
    title: 'Profile verified',
    description: 'Create projects unlocked'
  }
];

const resolveJourney = (kycStatus) => {
  const status = String(kycStatus || 'NOT_SUBMITTED').toUpperCase();

  if (status === 'APPROVED') {
    return {
      completedThrough: 3,
      activeIndex: 3,
      progress: 100,
      headline: 'Account Verified Successfully',
      detail: 'Verification is complete. You can create and manage projects.',
      rejected: false
    };
  }

  if (status === 'PENDING') {
    return {
      completedThrough: 1,
      activeIndex: 2,
      progress: 65,
      headline: 'Application in Review',
      detail: 'Your application is in progress. We will update this tracker when an admin decides.',
      rejected: false
    };
  }

  if (status === 'REJECTED') {
    return {
      completedThrough: 1,
      activeIndex: 2,
      progress: 50,
      headline: 'Application Rejected',
      detail: 'Verification was not approved. Update your details and apply again.',
      rejected: true
    };
  }

  return {
    completedThrough: 0,
    activeIndex: 1,
    progress: 20,
    headline: 'Next Step: submit application',
    detail: 'Apply for verification to move your status to admin review.',
    rejected: false
  };
};

const getStepState = (index, journey) => {
  if (journey.rejected && index === journey.activeIndex) {
    return 'rejected';
  }
  if (index <= journey.completedThrough) {
    return 'done';
  }
  if (index === journey.activeIndex) {
    return 'current';
  }
  return 'upcoming';
};

export const VerificationProgressTracker = ({ kycStatus, className = '' }) => {
  const journey = resolveJourney(kycStatus);
  const markerLeft = `calc(${journey.progress}% - 12px)`;

  return (
    <div className={`rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50/90 to-white p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
            Verification journey
          </p>
          <p className="mt-2 text-lg font-semibold text-ink">{journey.headline}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{journey.detail}</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-2 text-right shadow-sm ring-1 ring-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall</p>
          <p className="font-display text-2xl font-bold text-accent">{journey.progress}%</p>
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar value={journey.progress} />
      </div>

      {/* Desktop: horizontal route */}
      <div className="relative mt-12 hidden md:block">
        <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-slate-200" />
        <div
          className="absolute left-0 top-5 h-1 rounded-full bg-gradient-to-r from-accent to-signal transition-all duration-500"
          style={{ width: `${journey.progress}%` }}
        />
        <div
          className="absolute top-2 z-20 transition-all duration-500"
          style={{ left: markerLeft }}
          title="Current position"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-lg ring-4 ring-white">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 16.5 12 5l8 11.5H4z" />
            </svg>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-accent">
              Now
            </span>
          </div>
        </div>

        <ol className="relative grid grid-cols-4 gap-2">
          {STEPS.map((step, index) => {
            const state = getStepState(index, journey);
            const isDone = state === 'done';
            const isCurrent = state === 'current';
            const isRejected = state === 'rejected';

            return (
              <li key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={[
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold',
                    isDone
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isRejected
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : isCurrent
                          ? 'border-accent bg-white text-accent ring-4 ring-accent/20'
                          : 'border-slate-200 bg-white text-slate-400'
                  ].join(' ')}
                >
                  {isDone ? '✓' : isRejected ? '!' : index + 1}
                </div>
                <p
                  className={[
                    'mt-4 text-sm font-semibold',
                    isRejected ? 'text-rose-700' : isCurrent || isDone ? 'text-slate-900' : 'text-slate-500'
                  ].join(' ')}
                >
                  {!(kycStatus === "APPROVED") ? <Link to="/creator/verification">{step.title}</Link>: step.title}
                </p>
                <p className="mt-1 px-1 text-xs leading-5 text-slate-500">{step.description}</p>
                {isCurrent ? (
                  <span className="mt-2 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    You are here
                  </span>
                ) : null}
                {isRejected ? (
                  <span className="mt-2 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                    Not approved
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical route */}
      <ol className="relative mt-8 space-y-0 md:hidden">
        {STEPS.map((step, index) => {
          const state = getStepState(index, journey);
          const isDone = state === 'done';
          const isCurrent = state === 'current';
          const isRejected = state === 'rejected';
          const isLast = index === STEPS.length - 1;

          return (
            <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast ? (
                <div
                  className={[
                    'absolute left-5 top-10 bottom-0 w-0.5',
                    isDone ? 'bg-emerald-400' : 'bg-slate-200'
                  ].join(' ')}
                  aria-hidden="true"
                />
              ) : null}
              <div
                className={[
                  'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',
                  isDone
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isRejected
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : isCurrent
                        ? 'border-accent bg-white text-accent ring-4 ring-accent/20'
                        : 'border-slate-200 bg-white text-slate-400'
                ].join(' ')}
              >
                {isDone ? '✓' : isRejected ? '!' : index + 1}
                {isCurrent ? (
                  <span className="absolute -right-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={[
                      'font-semibold',
                      isRejected ? 'text-rose-700' : isCurrent || isDone ? 'text-slate-900' : 'text-slate-500'
                    ].join(' ')}
                  >
                    {step.title}
                  </p>
                  {isCurrent ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                      You are here
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {journey.progress < 100 ? (
        <p className="mt-6 text-center text-sm text-slate-600">
          <Link className="font-semibold text-accent hover:underline" to="/creator/verification">
            {journey.rejected ? 'Re-apply for verification' : 'Open verification page'}
          </Link>
        </p>
      ) : null}
    </div>
  );
};
