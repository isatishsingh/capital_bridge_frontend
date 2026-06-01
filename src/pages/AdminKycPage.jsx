import { useCallback, useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/feedback/ToastProvider';
import { LoadingState } from '../components/feedback/LoadingState';
import { EmptyState } from '../components/feedback/EmptyState';
import { DataTable } from '../components/data/DataTable';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { handleApiError } from '../services/api';
import { formatDate } from '../utils/formatters';

export const AdminKycPage = () => {
  const { notify } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getKycVerifications('PENDING');
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      notify(handleApiError(error, 'Unable to load verification requests.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (profileId) => {
    setActingId(profileId);
    try {
      await adminService.approveKyc(profileId);
      notify('Creator profile verified.', 'success');
      await load();
    } catch (error) {
      notify(handleApiError(error, 'Unable to approve verification.'), 'error');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (profileId) => {
    const confirmed = window.confirm(
      'Reject this verification request? The creator will need to apply again.'
    );
    if (!confirmed) {
      return;
    }

    setActingId(profileId);
    try {
      await adminService.rejectKyc(profileId);
      notify('Verification rejected.', 'success');
      await load();
    } catch (error) {
      notify(handleApiError(error, 'Unable to reject verification.'), 'error');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Profile verification
        </p>
        <h1 className="mt-3 section-title">Approve creator KYC applications</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Review pending verification requests. Creators cannot list projects until you approve
          their profile.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Loading pending verifications..." />
      ) : rows.length ? (
        <DataTable
          columns={[
            {
              key: 'creator',
              label: 'Creator',
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.creatorName || 'Creator'}</p>
                  <p className="text-xs text-slate-500">{row.email}</p>
                </div>
              )
            },
            {
              key: 'phone',
              label: 'Phone',
              render: (row) => row.phoneNumber || '—'
            },
            {
              key: 'pan',
              label: 'PAN',
              render: (row) => row.panNumber || '—'
            },
            {
              key: 'aadhaar',
              label: 'Aadhaar',
              render: (row) => row.aadhaarNumber || '—'
            },
            {
              key: 'gst',
              label: 'GST',
              render: (row) => row.gstNumber || '—'
            },
            {
              key: 'submitted',
              label: 'Submitted',
              render: (row) => formatDate(row.submittedAt)
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => <Badge tone="warning">{row.kycStatus || 'PENDING'}</Badge>
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="px-4 py-2"
                    disabled={actingId === row.profileId}
                    onClick={() => handleApprove(row.profileId)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="px-4 py-2"
                    disabled={actingId === row.profileId}
                    tone="danger"
                    variant="outline"
                    onClick={() => handleReject(row.profileId)}
                  >
                    Reject
                  </Button>
                </div>
              )
            }
          ]}
          rows={rows}
        />
      ) : (
        <EmptyState
          description="When creators apply for verification, their requests will appear here."
          title="No pending verifications"
        />
      )}
    </div>
  );
};
