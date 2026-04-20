import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { useInvestmentStore } from '../store/investmentStore';
import { StatCard } from '../components/data/StatCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { LoadingState } from '../components/feedback/LoadingState';
import { DataTable } from '../components/data/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/feedback/ToastProvider';
import { currency, percent, progressFromAmounts } from '../utils/formatters';

const statusTone = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger'
};

export const CustomerDashboardPage = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const {
    customerRequests,
    fetchCustomerRequests,
    updateRequestStatus,
    loading: requestsLoading
  } = useInvestmentStore();
  const { notify } = useToast();
  const normalizeStatus = (value) => String(value || '').trim().toUpperCase();
  const myProjects = projects.filter((project) => String(project.creatorId) === String(user?.id));

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetchProjects({ creatorId: user.id });
    fetchCustomerRequests();
  }, [fetchCustomerRequests, fetchProjects, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    const id = window.setInterval(() => {
      fetchCustomerRequests();
    }, 12000);

    return () => clearInterval(id);
  }, [fetchCustomerRequests, user?.id]);

  const summary = useMemo(() => {
    const totalFunding = myProjects.reduce((sum, item) => sum + Number(item.currentFunding || 0), 0);
    const totalGoal = myProjects.reduce((sum, item) => sum + Number(item.goalAmount || 0), 0);
    const soldEquity = myProjects.reduce((sum, item) => sum + Number(item.equitySold || 0), 0);
    return {
      totalFunding,
      remainingFunding: Math.max(totalGoal - totalFunding, 0),
      soldEquity
    };
  }, [myProjects]);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, { status });
      notify(`Request ${status.toLowerCase()}.`, 'success');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <div className="page-shell py-16">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Creator dashboard</p>
          <h1 className="mt-3 section-title">Manage campaigns, requests, and live funding performance.</h1>
        </div>
        <Link to="/creator/projects/create">
          <Button>Create New Project</Button>
        </Link>
      </div>

      <div className="mb-10 grid gap-5 md:grid-cols-4">
        <StatCard label="My projects" value={myProjects.length} hint="Active and historical campaigns" />
        <StatCard label="Funding received" value={currency(summary.totalFunding)} hint="Across your projects" />
        <StatCard label="Remaining funding" value={currency(summary.remainingFunding)} hint="Relative to combined goals" />
        <StatCard label="Equity sold" value={percent(summary.soldEquity)} hint="Combined distributed equity" />
      </div>

      <section className="mb-16">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">My projects</h2>
        </div>
        {projectsLoading ? (
          <LoadingState label="Loading your projects..." />
        ) : myProjects.length ? (
          <div className="grid auto-rows-min grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
            {myProjects.map((project) => (
              <div key={project.id} className="flex min-h-0 flex-col gap-4">
                <ProjectCard project={project} />
                <div className="surface relative z-0 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-slate-500">Equity sold vs remaining</p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {percent(project.equitySold || 0)} sold / {percent(project.remainingEquity || 0)} remaining
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Funding progress</p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {percent(progressFromAmounts(project.currentFunding, project.goalAmount))}
                      </p>
                    </div>
                  </div>
                  <Link className="mt-5 inline-block" to={`/creator/projects/${project.id}`}>
                    <Button tone="slate" variant="outline">
                      Open analytics
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Create your first campaign to start receiving investor requests."
            title="No projects created yet"
            action={
              <Link to="/creator/projects/create">
                <Button>Create project</Button>
              </Link>
            }
          />
        )}
      </section>

      <section className="relative z-10 scroll-mt-8">
        <h2 className="mb-5 text-2xl font-bold text-ink">Investment requests management</h2>
        {requestsLoading && !customerRequests.length ? (
          <LoadingState label="Loading incoming requests..." />
        ) : customerRequests.length ? (
          <DataTable
            columns={[
              {
                key: 'investor',
                label: 'Investor',
                render: (row) => row.investorName || row.investor?.name || 'Investor'
              },
              {
                key: 'project',
                label: 'Project',
                render: (row) => row.project?.title || row.projectTitle || 'Project'
              },
              {
                key: 'amount',
                label: 'Amount',
                render: (row) => currency(row.amount)
              },
              {
                key: 'equity',
                label: 'Equity',
                render: (row) => percent(row.equityPercentage)
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => {
                  const status = normalizeStatus(row.status);
                  return <Badge tone={statusTone[status] || 'neutral'}>{status || 'UNKNOWN'}</Badge>;
                }
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => {
                  const status = normalizeStatus(row.status);
                  return status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <Button className="px-4 py-2" onClick={() => handleStatusUpdate(row.id, 'APPROVED')}>
                        Approve
                      </Button>
                      <Button
                        className="px-4 py-2"
                        tone="danger"
                        variant="outline"
                        onClick={() => handleStatusUpdate(row.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">Decision recorded</span>
                  );
                }
              }
            ]}
            rows={customerRequests}
          />
        ) : (
          <EmptyState
            description="Investor requests will appear here when people start submitting offers."
            title="No requests yet"
          />
        )}
      </section>
    </div>
  );
};
