import api from './api';
import { asArray } from '../utils/normalizers';

export const projectService = {
  getProjects: async (params = {}) => {
    const { data } = await api.get('/api/projects', { params });
    return data;
  },
  getProjectById: async (projectId) => {
    const { data } = await api.get(`/api/projects/${projectId}`);
    return data;
  },
  /**
   * Completed investments for transparency (GET /api/projects/:id/investors).
   */
  getProjectContributors: async (projectId) => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/investors`);
      return asArray(data);
    } catch {
      return [];
    }
  },
  createProject: async (payload) => {
    const { data } = await api.post('/api/projects', payload);
    return data;
  },
  deleteProject: async (projectId, payload = {}) => {
    const { data } = await api.delete(`/admin/project/${projectId}`, {
      data: Object.keys(payload).length ? payload : undefined
    });
    return data;
  }
};
