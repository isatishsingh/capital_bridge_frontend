import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { investmentService } from '../services/investmentService';
import { LoadingState } from '../components/feedback/LoadingState';
import { StatCard } from '../components/data/StatCard';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/data/DataTable';
import { SimpleBarChart } from '../components/data/SimpleBarChart';
import { currency, percent, progressFromAmounts } from '../utils/formatters';

export const CustomerProjectDetailPage = () => {
  const { projectId } = useParams();
  const { selectedProject, fetchProjectById, loading } = useProjectStore();
  const [report, setReport] = useState([]);
  const [reportLoading, setReportLoading] = useState(true);

  useEffect(() => {
    fetchProjectById(projectId);
  }, [fetchProjectById, projectId]);

  useEffect(() => {
    const loadReport = async () => {
      setReportLoading(true);
      try {
        const response = await investmentService.getProjectReport(projectId);
        setReport(Array.isArray(response) ? response : []);
      } finally {
        setReportLoading(false);
      }
    };

    loadReport();
  }, [projectId]);

  const analytics = useMemo(() => {
    const fundingReceived = Number(selectedProject?.currentFunding || 0);
    const goalAmount = Number(selectedProject?.goalAmount || 0);
    const equityOffered = Number(selectedProject?.totalEquityOffered || selectedProject?.equityOffered || 0);
    const equitySold = Number(selectedProject?.equitySold || 0);

    return {
      investors: selectedProject?.investorCount || report.length,
      fundingReceived,
      remainingFunding: Math.max(goalAmount - fundingReceived, 0),
      equitySold,
      equityRemaining: Math.max(equityOffered - equitySold, 0)
    };
  }, [report.length, selectedProject]);

  if (loading || !selectedProject || reportLoading) {
    return <div className="page-shell py-16"><LoadingState label="Loading project analytics..." /></div>;
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Project analytics</p>
        <h1 className="mt-3 section-title">{selectedProject.title}</h1>
      </div>

      <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total investors" value={analytics.investors} />
        <StatCard label="Funding received" value={currency(analytics.fundingReceived)} />
        <StatCard label="Remaining funding" value={currency(analytics.remainingFunding)} />
        <StatCard label="Equity sold" value={percent(analytics.equitySold)} />
        <StatCard label="Equity remaining" value={percent(analytics.equityRemaining)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-2xl font-bold text-ink">Performance summary</h2>
          <div className="mt-6">
            <SimpleBarChart
              items={[
                {
                  label: 'Funding progress',
                  value: progressFromAmounts(selectedProject.currentFunding, selectedProject.goalAmount),
                  meta: `${progressFromAmounts(selectedProject.currentFunding, selectedProject.goalAmount).toFixed(1)}%`
                },
                {
                  label: 'Likes',
                  value: selectedProject.likes || 0,
                  meta: `${selectedProject.likes || 0}`
                },
                {
                  label: 'Shares',
                  value: selectedProject.shares || 0,
                  meta: `${selectedProject.shares || 0}`
                },
                {
                  label: 'Comments',
                  value: selectedProject.commentsCount || 0,
                  meta: `${selectedProject.commentsCount || 0}`
                }
              ]}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-ink">Engagement</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ['Likes', selectedProject.likes || 0],
              ['Shares', selectedProject.shares || 0],
              ['Comments', selectedProject.commentsCount || 0]
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-bold text-ink">Project investment report</h2>
        <DataTable
          columns={[
            {
              key: 'investor',
              label: 'Investor',
              render: (row) => row.investorName || row.name || row.investor?.name || 'Investor'
            },
            {
              key: 'amount',
              label: 'Amount invested',
              render: (row) => currency(row.amount || row.amountInvested)
            },
            {
              key: 'equity',
              label: 'Equity distributed',
              render: (row) => percent(row.equityTaken || row.equityPercentage)
            }
          ]}
          rows={report}
        />
      </section>
    </div>
  );
};
