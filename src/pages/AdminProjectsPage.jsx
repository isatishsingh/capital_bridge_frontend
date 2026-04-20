import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useProjectStore } from '../store/projectStore';
import { LoadingState } from '../components/feedback/LoadingState';
import { DataTable } from '../components/data/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/feedback/ToastProvider';
import { currency } from '../utils/formatters';

export const AdminProjectsPage = () => {
  const { projects, fetchProjects, loading } = useAdminStore();
  const { removeProject } = useProjectStore();
  const { notify } = useToast();
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    fetchProjects({ page: 0, size: 20 });
  }, [fetchProjects]);

  const handleDelete = async () => {
    try {
      const payload = deleteReason.trim() ? { reason: deleteReason.trim() } : {};
      await removeProject(selectedProject.id, payload);
      notify('Project removed successfully.', 'success');
      setSelectedProject(null);
      setDeleteReason('');
      fetchProjects({ page: 0, size: 20 });
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  if (loading && !projects.length) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading platform projects..." />
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Manage projects</p>
        <h1 className="mt-3 section-title">Review every campaign with moderation context.</h1>
      </div>

      <DataTable
        columns={[
          {
            key: 'title',
            label: 'Project',
            render: (row) => (
              <div>
                <p className="font-semibold text-slate-900">{row.title}</p>
                <p className="text-xs text-slate-500">Creator ID: {row.creatorId || '-'}</p>
              </div>
            )
          },
          {
            key: 'funding',
            label: 'Funding',
            render: (row) => `${currency(row.currentFunding)} / ${currency(row.goalAmount)}`
          },
          {
            key: 'equity',
            label: 'Equity',
            render: (row) => `${row.totalEquityOffered || row.equityOffered || 0}% offered`
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Button tone="danger" variant="outline" onClick={() => setSelectedProject(row)}>
                Delete project
              </Button>
            )
          }
        ]}
        rows={projects}
      />

      <Modal open={!!selectedProject} title="Delete project" onClose={() => setSelectedProject(null)}>
        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-600">
            Provide an internal reason for audit trails. The delete request is forwarded to your Spring Boot admin route
            (body supported when the controller accepts it).
          </p>
          <div>
            <label className="field-label">Reason</label>
            <textarea
              className="field-input min-h-24"
              placeholder="Policy breach, fraud concern, duplicate listing…"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button tone="danger" onClick={handleDelete}>
              Confirm delete
            </Button>
            <Button tone="slate" variant="outline" onClick={() => setSelectedProject(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
