import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvestmentStore } from '../store/investmentStore';
import { LoadingState } from '../components/feedback/LoadingState';
import { EmptyState } from '../components/feedback/EmptyState';
import { StatCard } from '../components/data/StatCard';
import { DataTable } from '../components/data/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { currency, formatDate, percent } from '../utils/formatters';

const statusTone = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  COMPLETED: 'info'
};

export const InvestorDashboardPage = () => {
  const { fetchInvestorRequests, investorRequests, completedInvestments, loading } = useInvestmentStore();
  const [requestFilter, setRequestFilter] = useState('ALL');

  useEffect(() => {
    fetchInvestorRequests();
  }, [fetchInvestorRequests]);

  const filteredRequests = useMemo(() => {
    if (requestFilter === 'ALL') {
      return investorRequests;
    }
    return investorRequests.filter((row) => row.status === requestFilter);
  }, [investorRequests, requestFilter]);

  const sortedCompleted = useMemo(
    () =>
      [...completedInvestments].sort(
        (a, b) =>
          new Date(b.investmentDate || b.createdAt || 0) - new Date(a.investmentDate || a.createdAt || 0)
      ),
    [completedInvestments]
  );

  if (loading && !investorRequests.length && !completedInvestments.length) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading investor dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Investor dashboard</p>
        <h1 className="mt-3 section-title">Track every request, approval, and completed ownership position.</h1>
      </div>

      <div className="mb-10 grid gap-5 md:grid-cols-3">
        <StatCard label="Requested investments" value={investorRequests.length} hint="Pending, approved, and rejected offers" />
        <StatCard label="Completed investments" value={completedInvestments.length} hint="Verified payments only" />
        <StatCard
          label="Total deployed capital"
          value={currency(completedInvestments.reduce((sum, item) => sum + Number(item.amountInvested || item.amount || 0), 0))}
          hint="Across your completed investments"
        />
      </div>

      <div className="space-y-10">
        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-ink">Requested investments</h2>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((key) => (
                <Button
                  key={key}
                  tone={requestFilter === key ? 'primary' : 'slate'}
                  variant={requestFilter === key ? 'solid' : 'outline'}
                  type="button"
                  className="px-4 py-2"
                  onClick={() => setRequestFilter(key)}
                >
                  {key === 'ALL' ? 'All statuses' : key}
                </Button>
              ))}
            </div>
          </div>
          {filteredRequests.length ? (
            <DataTable
              columns={[
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
                  render: (row) => <Badge tone={statusTone[row.status] || 'neutral'}>{row.status}</Badge>
                },
                {
                  key: 'action',
                  label: 'Next step',
                  render: (row) => {
                    if (row.status === 'APPROVED' && row.projectId) {
                      return (
                        <Link
                          className="text-sm font-semibold text-accent hover:text-accentDark hover:underline"
                          to={`/projects/${row.projectId}#investor-pay`}
                        >
                          Complete payment
                        </Link>
                      );
                    }
                    if (row.status === 'PENDING') {
                      return <span className="text-sm text-slate-500">Awaiting creator approval</span>;
                    }
                    return <span className="text-sm text-slate-400">—</span>;
                  }
                }
              ]}
              rows={filteredRequests}
            />
          ) : (
            <EmptyState
              description={
                requestFilter === 'ALL'
                  ? "You haven't submitted any investment requests yet."
                  : 'Nothing in this status bucket yet.'
              }
              title={requestFilter === 'ALL' ? 'No requests yet' : 'No rows to show'}
            />
          )}
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-bold text-ink">Completed investments</h2>
          {sortedCompleted.length ? (
            <DataTable
              columns={[
                {
                  key: 'project',
                  label: 'Project',
                  render: (row) => row.project?.title || row.projectTitle || 'Project'
                },
                {
                  key: 'amount',
                  label: 'Amount invested',
                  render: (row) => currency(row.amountInvested || row.amount)
                },
                {
                  key: 'equity',
                  label: 'Equity owned',
                  render: (row) => percent(row.equityOwned || row.equityPercentage)
                },
                {
                  key: 'date',
                  label: 'Investment date',
                  render: (row) => formatDate(row.investmentDate || row.createdAt)
                }
              ]}
              rows={sortedCompleted}
            />
          ) : (
            <EmptyState
              description="Approved and verified investments will appear here."
              title="No completed investments"
            />
          )}
        </section>
      </div>
    </div>
  );
};
