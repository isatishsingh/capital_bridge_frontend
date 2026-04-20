import { useEffect, useMemo } from 'react';
import { useAdminStore } from '../store/adminStore';
import { LoadingState } from '../components/feedback/LoadingState';
import { StatCard } from '../components/data/StatCard';
import { Card } from '../components/ui/Card';
import { SimpleBarChart } from '../components/data/SimpleBarChart';
import { currency, progressFromAmounts } from '../utils/formatters';

export const AdminDashboardPage = () => {
  const { dashboard, projects, fetchDashboard, fetchProjects, loading } = useAdminStore();

  useEffect(() => {
    const load = async () => {
      await fetchDashboard();
      await fetchProjects({ page: 0, size: 40 });
    };
    load();
  }, [fetchDashboard, fetchProjects]);

  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => Number(b.currentFunding || 0) - Number(a.currentFunding || 0))
      .slice(0, 6);
  }, [projects]);

  const activeProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!p.deadline) {
        return true;
      }
      return new Date(p.deadline) > new Date();
    }).length;
  }, [projects]);

  if (loading && !dashboard) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading admin dashboard..." />
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Admin dashboard</p>
        <h1 className="mt-3 section-title">Monitor the health of the platform at a glance.</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total users" value={dashboard.totalUsers ?? 0} hint="Registered accounts" />
        <StatCard label="Total projects" value={dashboard.totalProjects ?? 0} hint="Across the database" />
        <StatCard label="Recorded investments" value={dashboard.totalInvestments ?? 0} hint="Investment rows" />
        <StatCard label="Platform funding" value={currency(dashboard.totalFunding)} hint="Summed from investments" />
        <StatCard label="Active projects (sample)" value={activeProjects} hint="Deadline in the future on current page" />
        <StatCard
          label="Investor signal"
          value={dashboard.totalInvestments ?? 0}
          hint="Use as a proxy until a dedicated investor count ships in the API"
        />
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-bold text-ink">Top performing projects</h2>
          <p className="mt-2 text-sm text-slate-500">Built from the latest admin projects page response.</p>
          <div className="mt-6">
            {topProjects.length ? (
              <SimpleBarChart
                items={topProjects.map((project) => ({
                  label: project.title?.slice(0, 18) || 'Project',
                  value: progressFromAmounts(project.currentFunding, project.goalAmount),
                  meta: currency(project.currentFunding || 0)
                }))}
              />
            ) : (
              <p className="text-sm text-slate-500">Load projects from the admin API to populate this chart.</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-ink">Operational focus</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>Use deletion, blocking, and report resolution carefully. Every action should be traceable in your own audit logs.</p>
            <p>Pair dashboard totals with payment provider exports when reconciling Razorpay settlements.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
