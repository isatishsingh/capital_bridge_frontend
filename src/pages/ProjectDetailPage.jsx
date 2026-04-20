import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useInvestmentStore } from '../store/investmentStore';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/feedback/ToastProvider';
import { LoadingState } from '../components/feedback/LoadingState';
import { EmptyState } from '../components/feedback/EmptyState';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { InvestmentRequestForm } from '../components/projects/InvestmentRequestForm';
import { ReportIssueForm } from '../components/projects/ReportIssueForm';
import { ChatPanel } from '../components/chat/ChatPanel';
import { projectService } from '../services/projectService';
import { engagementService } from '../services/engagementService';
import { reportService } from '../services/reportService';
import { handleApiError } from '../services/api';
import { compactCurrency, currency, formatDate, percent, progressFromAmounts } from '../utils/formatters';
import { ROLES } from '../utils/constants';
import { getRazorpayKeyIdError } from '../utils/razorpayKey';

const TRANSPARENCY_PREVIEW = 4;
const roundEquity = (value) => Math.max(Math.round(Number(value || 0) * 10) / 10, 0);

const badgeTone = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  COMPLETED: 'info'
};

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const { selectedProject, fetchProjectById, loading } = useProjectStore();
  const {
    requestInvestment,
    createOrder,
    verifyPayment,
    fetchInvestorRequests,
    investorRequests,
    loading: investmentLoading
  } = useInvestmentStore();
  const { user, token } = useAuthStore();
  const { notify } = useToast();
  const [requestOpen, setRequestOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [extrasLoading, setExtrasLoading] = useState(true);
  const [transparencyExpanded, setTransparencyExpanded] = useState(false);

  const loadExtras = useCallback(async () => {
    if (!projectId) {
      return;
    }
    setExtrasLoading(true);
    try {
      const [rows, snap] = await Promise.all([
        projectService.getProjectContributors(projectId),
        engagementService.getSnapshot(projectId)
      ]);
      setContributors(Array.isArray(rows) ? rows : []);
      setEngagement(snap);
    } finally {
      setExtrasLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectById(projectId);
    if (user?.role === ROLES.INVESTOR) {
      fetchInvestorRequests();
    }
  }, [fetchInvestorRequests, fetchProjectById, projectId, user?.role]);

  useEffect(() => {
    if (user?.role !== ROLES.INVESTOR) {
      return undefined;
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchInvestorRequests();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [fetchInvestorRequests, user?.role]);

  useEffect(() => {
    if (location.hash !== '#investor-pay') {
      return;
    }
    const el = document.getElementById('investor-pay');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash, projectId]);

  useEffect(() => {
    loadExtras();
  }, [loadExtras]);

  useEffect(() => {
    setTransparencyExpanded(false);
  }, [projectId]);

  const visibleContributors = useMemo(() => {
    if (!contributors.length) {
      return [];
    }
    if (transparencyExpanded || contributors.length <= TRANSPARENCY_PREVIEW) {
      return contributors;
    }
    return contributors.slice(0, TRANSPARENCY_PREVIEW);
  }, [contributors, transparencyExpanded]);

  const hasMoreContributors = contributors.length > TRANSPARENCY_PREVIEW;

  const progress = progressFromAmounts(selectedProject?.currentFunding, selectedProject?.goalAmount);

  const investorRequest = useMemo(
    () =>
      investorRequests.find(
        (request) => String(request.projectId || request.project?.id) === String(projectId)
      ),
    [investorRequests, projectId]
  );

  useEffect(() => {
    if (user?.role !== ROLES.INVESTOR || investorRequest?.status !== 'PENDING') {
      return undefined;
    }
    const id = window.setInterval(() => {
      fetchInvestorRequests();
    }, 12000);
    return () => clearInterval(id);
  }, [fetchInvestorRequests, investorRequest?.status, user?.role]);

  const likes = engagement?.likes ?? selectedProject?.likes ?? 0;
  const shares = engagement?.shares ?? selectedProject?.shares ?? 0;
  const commentsCount = engagement?.commentsCount ?? selectedProject?.commentsCount ?? 0;
  const investorCount = engagement?.investorCount ?? selectedProject?.investorCount ?? contributors.length;
  const remainingEquity = roundEquity(selectedProject?.remainingEquity);

  const handleRequestSubmit = async (payload) => {
    const normalizedRole = String(user?.role || '')
      .replace(/^ROLE_/i, '')
      .toUpperCase();

    if (!user || !token) {
      notify('Log in as an investor to send investment requests.', 'error');
      return;
    }

    if (normalizedRole !== ROLES.INVESTOR) {
      notify('Only investor accounts can send investment requests.', 'error');
      return;
    }

    try {
      if (payload.equityPercentage > remainingEquity) {
        notify(`Requested equity exceeds remaining equity (${remainingEquity}%).`, 'error');
        return;
      }
      await requestInvestment({ projectId: Number(projectId), ...payload });
      notify('Investment request sent.', 'success');
      setRequestOpen(false);
      await fetchInvestorRequests();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handlePayNow = async () => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY?.trim();
    const keyError = getRazorpayKeyIdError(keyId);
    if (keyError) {
      notify(keyError, 'error');
      return;
    }

    try {
      const order = await createOrder({
        investmentRequestId: investorRequest.id
      });

      if (!window.Razorpay) {
        notify('Razorpay SDK is not loaded. Add the checkout script to enable payments.', 'error');
        return;
      }

      const orderId = order.orderId || order.id;
      if (!orderId) {
        notify('Invalid order from server (missing order id). Check create-order API response.', 'error');
        return;
      }

      /**
       * Orders API: amount/currency are taken from the server-created order.
       * Passing a mismatched `amount` here breaks checkout (blank methods / Razorpay error UI).
       */
      const razorpay = new window.Razorpay({
        key: keyId,
        name: 'CrowdSpring',
        description: selectedProject?.title || 'Investment payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            notify('Payment verified successfully.', 'success');
            fetchInvestorRequests();
            await fetchProjectById(projectId);
            await loadExtras();
          } catch (err) {
            notify(err?.message || 'Verification failed after payment.', 'error');
          }
        },
        modal: {
          ondismiss: () => {
            /* User closed checkout — not necessarily failure */
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: '#0f766e'
        }
      });

      razorpay.open();
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleLike = async () => {
    if (!user) {
      notify('Log in to react to projects.', 'error');
      return;
    }
    try {
      await engagementService.like(projectId);
      notify('Thanks for the like.', 'success');
      await loadExtras();
    } catch (error) {
      notify(handleApiError(error, 'Like could not be recorded. Add a matching API route when ready.'), 'error');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await engagementService.share(projectId);
    } catch {
      /* optional API */
    }
    try {
      if (navigator.share) {
        await navigator.share({ title: selectedProject?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        notify('Link copied to clipboard.', 'success');
      }
    } catch (error) {
      notify(error?.message || 'Unable to share.', 'error');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      notify('Log in to comment.', 'error');
      return;
    }
    try {
      await engagementService.addComment(projectId, { message: commentText });
      notify('Comment submitted.', 'success');
      setCommentText('');
      setCommentOpen(false);
      await loadExtras();
    } catch (error) {
      notify(handleApiError(error, 'Comment endpoint not available yet.'), 'error');
    }
  };

  const handleReport = async (payload) => {
    setReportLoading(true);
    try {
      await reportService.createReport({
        projectId: Number(projectId),
        ...payload
      });
      notify('Report submitted to admins.', 'success');
      setReportOpen(false);
    } catch (error) {
      notify(handleApiError(error, 'Report could not be submitted.'), 'error');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading || !selectedProject) {
    return <div className="page-shell py-16">{loading ? <LoadingState label="Loading project..." /> : null}</div>;
  }

  return (
    <div className="page-shell py-16">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
                  {selectedProject.category || 'Project overview'}
                </p>
                <h1 className="mt-3 font-display text-4xl font-bold text-ink">{selectedProject.title}</h1>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  {selectedProject.description || 'Detailed narrative will appear here when returned by the project API.'}
                </p>
              </div>
              <Badge tone="info">{selectedProject.status || 'ACTIVE'}</Badge>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Deadline</p>
                <p className="mt-2 font-semibold text-slate-900">{formatDate(selectedProject.deadline)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Goal</p>
                <p className="mt-2 font-semibold text-slate-900">{currency(selectedProject.goalAmount)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Current funding</p>
                <p className="mt-2 font-semibold text-slate-900">{currency(selectedProject.currentFunding)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Equity offered</p>
                <p className="mt-2 font-semibold text-slate-900">{percent(selectedProject.equityOffered || 0)}</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
                <span>Funding progress</span>
                <span>{percent(progress)}</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          </Card>

          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ink">Investment transparency</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Shows completed investments after payment (same records as your Investment entity). Pending requests are not
                  listed here.
                </p>
              </div>
            </div>
            {extrasLoading ? (
              <LoadingState label="Loading contributor context..." />
            ) : contributors.length ? (
              <div className="space-y-4">
                {visibleContributors.map((row, index) => (
                  <div
                    key={row.id || index}
                    className="flex flex-col gap-3 rounded-3xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {row.investorName || row.name || row.investor?.name || 'Investor'}
                      </p>
                      <p className="text-sm text-slate-500">{formatDate(row.date || row.createdAt || row.investedAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                      <span>{compactCurrency(row.amount || row.amountInvested)}</span>
                      <span>{percent(row.equityTaken || row.equityPercentage)}</span>
                    </div>
                  </div>
                ))}
                {hasMoreContributors ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      className="text-sm font-semibold text-accent hover:text-accentDark"
                      onClick={() => setTransparencyExpanded((v) => !v)}
                    >
                      {transparencyExpanded
                        ? 'View less'
                        : `View more (${contributors.length - TRANSPARENCY_PREVIEW} more)`}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="No completed investments yet"
                description="Investors appear here after an approved request is paid and an investment row is created. Until then this list stays empty."
              />
            )}
          </Card>

          <Card>
            <h2 className="mb-6 text-2xl font-bold text-ink">Engagement</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Likes', likes],
                ['Shares', shares],
                ['Comments', commentsCount],
                ['Investor count', investorCount]
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <ChatPanel projectId={projectId} receiverId={selectedProject.creatorId} />
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-ink">Project metrics</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {[
                ['Remaining amount', selectedProject.remainingAmount || 0],
                ['Equity allocated', selectedProject.equitySold || 0],
                ['Remaining equity', selectedProject.remainingEquity || 0]
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-ink">
                    {label.toLowerCase().includes('equity') ? percent(value) : currency(value)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-ink">Actions</h2>
            <p className="mt-2 text-sm text-slate-500">
              Engagement buttons call your REST layer when routes exist; otherwise you will see a guided toast.
            </p>
            <div className="mt-6 grid gap-3">
              <Button tone="slate" variant="outline" type="button" onClick={handleLike}>
                Like
              </Button>
              <Button tone="slate" variant="outline" type="button" onClick={() => setCommentOpen(true)}>
                Comment
              </Button>
              <Button tone="slate" variant="outline" type="button" onClick={handleShare}>
                Share
              </Button>
              <Button tone="danger" variant="outline" type="button" onClick={() => setReportOpen(true)}>
                Report issue
              </Button>
            </div>
          </Card>

          {user?.role === ROLES.INVESTOR ? (
            <Card id="investor-pay" className="scroll-mt-24">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-ink">Investor actions</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Submit requests, then complete payment only after the customer approves.
                  </p>
                </div>
                {investorRequest?.status ? (
                  <Badge tone={badgeTone[investorRequest.status]}>{investorRequest.status}</Badge>
                ) : null}
              </div>

              {investorRequest ? (
                <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
                  <p>
                    Request amount: <span className="font-semibold text-slate-900">{currency(investorRequest.amount)}</span>
                  </p>
                  <p>
                    Requested equity:{' '}
                    <span className="font-semibold text-slate-900">
                      {percent(investorRequest.equityPercentage)}
                    </span>
                  </p>
                  {investorRequest.status === 'APPROVED' ? (
                    <Button disabled={investmentLoading} onClick={handlePayNow}>
                      {investmentLoading ? 'Preparing payment...' : 'Pay now'}
                    </Button>
                  ) : investorRequest.status === 'REJECTED' ? (
                    <>
                      <p className="text-xs text-slate-500">
                        This request was rejected. You can submit a new proposal with updated terms.
                      </p>
                      <Button disabled={investmentLoading} onClick={() => setRequestOpen(true)}>
                        Send new request
                      </Button>
                    </>
                  ) : (
                    <Button disabled tone="slate" variant="outline">
                      Waiting for customer decision
                    </Button>
                  )}
                </div>
              ) : (
                <Button className="mt-6 w-full" onClick={() => setRequestOpen(true)}>
                  Request investment
                </Button>
              )}
            </Card>
          ) : null}
        </div>
      </div>

      <Modal open={requestOpen} title="Send investment request" onClose={() => setRequestOpen(false)}>
        <InvestmentRequestForm
          loading={investmentLoading}
          maxEquity={remainingEquity}
          onSubmit={handleRequestSubmit}
        />
      </Modal>

      <Modal open={reportOpen} title="Report an issue" onClose={() => setReportOpen(false)}>
        <ReportIssueForm loading={reportLoading} onSubmit={handleReport} />
      </Modal>

      <Modal open={commentOpen} title="Add a comment" onClose={() => setCommentOpen(false)}>
        <form className="space-y-4" onSubmit={handleCommentSubmit}>
          <textarea
            className="field-input min-h-28"
            required
            placeholder="Share a question or observation with the founder community"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button className="w-full" type="submit">
            Post comment
          </Button>
        </form>
      </Modal>
    </div>
  );
};
