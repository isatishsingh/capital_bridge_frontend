import api from './api';

export const adminService = {
  getDashboard: async () => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },
  getProjects: async (params = {}) => {
    const { data } = await api.get('/admin/projects', { params });
    return data;
  },
  getUsers: async (params = {}) => {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },
  deleteUser: async (userId) => {
    const { data } = await api.delete(`/admin/user/${userId}`);
    return data;
  },
  getReports: async (params = {}) => {
    const { data } = await api.get('/admin/reports', { params });
    return data;
  },
  resolveReport: async (reportId, payload) => {
    const { data } = await api.patch(`/admin/reports/${reportId}`, payload);
    return data;
  },
  blockUser: async (userId, payload) => {
    const { data } = await api.patch(`/admin/users/${userId}/block`, payload);
    return data;
  }
};
