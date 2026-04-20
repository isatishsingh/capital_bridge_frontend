import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { LoadingState } from '../components/feedback/LoadingState';
import { DataTable } from '../components/data/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/feedback/ToastProvider';
import { roleLabel } from '../utils/formatters';
import { ROLES } from '../utils/constants';

export const AdminUsersPage = () => {
  const { users, fetchUsers, deleteUser, blockUser, loading } = useAdminStore();
  const { notify } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);
  const [blockDays, setBlockDays] = useState(30);

  useEffect(() => {
    fetchUsers({ page: 0, size: 20 });
  }, [fetchUsers]);

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget.id);
      notify('User deleted successfully.', 'success');
      setDeleteTarget(null);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleBlock = async () => {
    try {
      const blockUntil =
        blockDays > 0 ? new Date(Date.now() + blockDays * 86400000).toISOString() : null;
      await blockUser(blockTarget.id, { blocked: true, blockDays, blockUntil });
      notify('User block state updated.', 'success');
      setBlockTarget(null);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  if (loading && !users.length) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading users..." />
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">User control</p>
        <h1 className="mt-3 section-title">Block accounts with duration or remove them entirely.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Blocking calls the admin user block endpoint when your backend exposes it. Deletion uses the existing admin delete
          route.
        </p>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            label: 'User',
            render: (row) => (
              <div>
                <p className="font-semibold text-slate-900">{row.name || row.fullName}</p>
                <p className="text-xs text-slate-500">{row.email}</p>
              </div>
            )
          },
          {
            key: 'role',
            label: 'Role',
            render: (row) => roleLabel(row.role)
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (row.blocked ? 'Blocked' : 'Active')
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) =>
              row.role === ROLES.ADMIN ? (
                <span className="text-xs text-slate-400">Protected</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button className="px-3 py-2" tone="slate" variant="outline" onClick={() => setBlockTarget(row)}>
                    Block
                  </Button>
                  <Button className="px-3 py-2" tone="danger" variant="outline" onClick={() => setDeleteTarget(row)}>
                    Delete
                  </Button>
                </div>
              )
          }
        ]}
        rows={users}
      />

      <Modal open={!!blockTarget} title="Block user" onClose={() => setBlockTarget(null)}>
        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-600">
            Choose how long <span className="font-semibold">{blockTarget?.email}</span> should remain blocked. Set to 0 for
            indefinite (backend permitting).
          </p>
          <div>
            <label className="field-label">Duration (days)</label>
            <input
              className="field-input"
              min={0}
              type="number"
              value={blockDays}
              onChange={(e) => setBlockDays(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleBlock}>Confirm block</Button>
            <Button tone="slate" variant="outline" onClick={() => setBlockTarget(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} title="Delete user" onClose={() => setDeleteTarget(null)}>
        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-600">
            This permanently removes <span className="font-semibold">{deleteTarget?.email}</span> using the admin delete
            endpoint.
          </p>
          <div className="flex gap-3">
            <Button tone="danger" onClick={handleDelete}>
              Confirm delete
            </Button>
            <Button tone="slate" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
