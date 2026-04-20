import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { LoadingState } from '../components/feedback/LoadingState';
import { EmptyState } from '../components/feedback/EmptyState';
import { DataTable } from '../components/data/DataTable';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/feedback/ToastProvider';

export const AdminReportsPage = () => {
  const { reports, fetchReports, resolveReport, loading } = useAdminStore();
  const { notify } = useToast();

  useEffect(() => {
    fetchReports({ page: 0, size: 50 });
  }, [fetchReports]);

  const handleAction = async (reportId, action) => {
    try {
      await resolveReport(reportId, { action });
      notify(`Report marked as ${action.toLowerCase()}.`, 'success');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  if (loading && !reports.length) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading reports..." />
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="page-shell py-16">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Reports management</p>
          <h1 className="mt-3 section-title">Trust and safety queue</h1>
        </div>
        <EmptyState
          title="No reports loaded"
          description="Connect GET /admin/reports on your Spring Boot service to populate this table. Until then the UI stays ready with ignore / take action controls."
        />
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Reports management</p>
        <h1 className="mt-3 section-title">Handle trust and safety incidents with context attached.</h1>
      </div>

      <DataTable
        columns={[
          {
            key: 'reason',
            label: 'Reason'
          },
          {
            key: 'project',
            label: 'Project details',
            render: (row) => row.project?.title || row.projectTitle || 'Project'
          },
          {
            key: 'reporter',
            label: 'Reporter',
            render: (row) => row.reporter?.name || row.reporterName || 'User'
          },
          {
            key: 'details',
            label: 'Details',
            render: (row) => <p className="max-w-md whitespace-normal text-sm leading-6">{row.details || '-'}</p>
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <Button className="px-4 py-2" tone="slate" variant="outline" onClick={() => handleAction(row.id, 'IGNORE')}>
                  Ignore
                </Button>
                <Button className="px-4 py-2" onClick={() => handleAction(row.id, 'TAKE_ACTION')}>
                  Take action
                </Button>
              </div>
            )
          }
        ]}
        rows={reports}
      />
    </div>
  );
};
