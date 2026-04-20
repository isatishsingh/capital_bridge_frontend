import { create } from 'zustand';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { handleApiError } from '../services/api';
import { adaptProjectDetail, adaptProjects } from '../utils/adapters';

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  fetchProjects: async (params = {}) => {
    const { creatorId, status, ...apiParams } = params;
    set({ loading: true, error: null });
    try {
      const response = await projectService.getProjects(apiParams);
      let list = adaptProjects(response);
      if (creatorId != null && creatorId !== '') {
        list = list.filter((project) => String(project.creatorId) === String(creatorId));
      }
      if (status) {
        list = list.filter((project) => (project.status || 'ACTIVE') === status);
      }
      set({ projects: list, loading: false });
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load projects.') });
    }
  },
  fetchProjectById: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.getProjectById(projectId);
      const existing = get().projects.find((item) => String(item.id) === String(projectId));
      let project = adaptProjectDetail(response, existing);
      if (project?.creatorEmail && !project.creatorId) {
        const creator = await userService.findByEmail(project.creatorEmail);
        if (creator?.id) {
          project = { ...project, creatorId: creator.id };
        }
      }
      set({ selectedProject: project, loading: false });
      return project;
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load project.') });
      throw error;
    }
  },
  createProject: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.createProject(payload);
      const created = adaptProjectDetail(response);
      set({ projects: [created, ...get().projects], loading: false });
      return created;
    } catch (error) {
      const message = handleApiError(error, 'Unable to create project.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  removeProject: async (projectId, payload) => {
    set({ loading: true, error: null });
    try {
      await projectService.deleteProject(projectId, payload);
      set({
        projects: get().projects.filter((project) => String(project.id) !== String(projectId)),
        loading: false
      });
    } catch (error) {
      const message = handleApiError(error, 'Unable to delete project.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  }
}));
