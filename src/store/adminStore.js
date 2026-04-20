import { create } from 'zustand';
import { adminService } from '../services/adminService';
import { handleApiError } from '../services/api';
import { adaptPagedAdminData, adaptProject } from '../utils/adapters';
import { normalizeUser } from '../utils/auth';

export const useAdminStore = create((set, get) => ({
  dashboard: null,
  users: [],
  projects: [],
  reports: [],
  loading: false,
  error: null,
  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const dashboard = await adminService.getDashboard();
      set({ dashboard, loading: false });
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load admin dashboard.') });
    }
  },
  fetchProjects: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adminService.getProjects(params);
      set({
        projects: adaptPagedAdminData(response).map((p) => adaptProject(p)).filter(Boolean),
        loading: false
      });
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load projects.') });
    }
  },
  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adminService.getUsers(params);
      set({
        users: adaptPagedAdminData(response).map((u) => normalizeUser(u) || u),
        loading: false
      });
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load users.') });
    }
  },
  fetchReports: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adminService.getReports(params);
      set({ reports: adaptPagedAdminData(response), loading: false });
    } catch {
      set({ reports: [], loading: false });
    }
  },
  resolveReport: async (reportId, payload) => {
    set({ loading: true, error: null });
    try {
      await adminService.resolveReport(reportId, payload);
      set({
        reports: get().reports.filter((row) => String(row.id) !== String(reportId)),
        loading: false
      });
    } catch (error) {
      const message = handleApiError(error, 'Unable to update report.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  blockUser: async (userId, payload) => {
    set({ loading: true, error: null });
    try {
      await adminService.blockUser(userId, payload);
      set({
        users: get().users.map((user) =>
          String(user.id) === String(userId)
            ? { ...user, blocked: payload.blocked, blockUntil: payload.blockUntil }
            : user
        ),
        loading: false
      });
    } catch (error) {
      const message = handleApiError(error, 'Unable to update user block state.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await adminService.deleteUser(userId);
      set({
        users: get().users.filter((user) => String(user.id) !== String(userId)),
        loading: false
      });
    } catch (error) {
      const message = handleApiError(error, 'Unable to delete user.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  }
}));
