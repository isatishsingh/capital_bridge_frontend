import api from './api';
import { asArray } from '../utils/normalizers';
import { storage } from '../utils/storage';

const enrichInvestmentRows = async (rows) => {
  const list = asArray(rows);
  if (!list.length) {
    return list;
  }

  const [{ data: projects }, { data: users }] = await Promise.all([
    api.get('/api/projects').catch(() => ({ data: [] })),
    api.get('/api/users').catch(() => ({ data: [] }))
  ]);

  const projectMap = new Map(asArray(projects).map((p) => [String(p.id), p]));
  const userMap = new Map(asArray(users).map((u) => [String(u.id), u]));

  return list.map((row) => ({
    ...row,
    status: typeof row.status === 'string' ? row.status : row.status?.name || row.status,
    projectTitle: projectMap.get(String(row.projectId))?.title,
    project: projectMap.get(String(row.projectId))
      ? { id: row.projectId, title: projectMap.get(String(row.projectId)).title }
      : null,
    investorName: userMap.get(String(row.investorId))?.name
  }));
};

export const investmentService = {
  requestInvestment: async (payload) => {
    if (!storage.getToken()) {
      throw new Error('Session expired. Please log in again as an investor.');
    }

    const { data } = await api.post('/api/investment-request', {
      projectId: payload.projectId,
      amount: payload.amount,
      equityPercentage: payload.equityPercentage
    });
    return data;
  },
  getInvestorRequests: async () => {
    const { data } = await api.get('/api/investment-request/investor');
    const enriched = await enrichInvestmentRows(data);
    const list = asArray(enriched);
    return {
      requested: list.filter((r) => r.status !== 'COMPLETED'),
      completed: list.filter((r) => r.status === 'COMPLETED')
    };
  },
  getCustomerRequests: async () => {
    const { data } = await api.get('/api/investment-request/customer');
    return enrichInvestmentRows(data);
  },
  updateRequestStatus: async (requestId, payload) => {
    const endpoint =
      payload.status === 'APPROVED'
        ? `/api/investment-request/${requestId}/approve`
        : `/api/investment-request/${requestId}/reject`;
    const { data } = await api.post(endpoint);
    return data;
  },
  getProjectReport: async (projectId) => {
    const { data } = await api.get('/api/investment-request/customer');
    const filtered = asArray(data).filter((r) => String(r.projectId) === String(projectId));
    return enrichInvestmentRows(filtered);
  }
};
