import { create } from "zustand";
import { projectService } from "../services/projectService";
import { userService } from "../services/userService";
import { getApiErrorCode, handleApiError } from "../services/api";
import { adaptProjectDetail, adaptProjects } from "../utils/adapters";

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,

  fetchProjects: async (params = {}) => {
    const { creatorId, mine, status, ...apiParams } = params;
    set({ loading: true, error: null });
    try {
      const response = mine
        ? await projectService.getMyProjects()
        : await projectService.getProjects(apiParams);
      let list = adaptProjects(response);
      if (!mine && creatorId != null && creatorId !== "") {
        list = list.filter(
          (project) => String(project.creatorId) === String(creatorId),
        );
      }
      if (status) {
        list = list.filter(
          (project) =>
            (project.listingStatus || project.status || "ACTIVE") === status,
        );
      }
      set({ projects: list, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: handleApiError(error, "Unable to load projects."),
      });
    }
  },

  fetchProjectById: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.getProjectById(projectId);
      const existing = get().projects.find(
        (item) => String(item.id) === String(projectId),
      );
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
      set({
        loading: false,
        error: handleApiError(error, "Unable to load project."),
      });
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
      const message = handleApiError(error, "Unable to create project.");
      const errorCode = error?.response?.data?.code;
      set({ loading: false, error: message, errorCode: errorCode });
      throw new Error(message);
    }
  },

  updateProject: async (projectId, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.updateProject(projectId, payload);
      const updated = adaptProjectDetail(response);
      set({
        projects: get().projects.map((project) =>
          String(project.id) === String(projectId) ? { ...project, ...updated } : project,
        ),
        selectedProject:
          get().selectedProject &&
          String(get().selectedProject.id) === String(projectId)
            ? { ...get().selectedProject, ...updated }
            : get().selectedProject,
        loading: false,
      });
      return updated;
    } catch (error) {
      const message = handleApiError(error, "Unable to update project.");
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },

  removeProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await projectService.deleteProject(projectId);
      set({
        projects: get().projects.filter(
          (project) => String(project.id) !== String(projectId),
        ),
        selectedProject:
          get().selectedProject &&
          String(get().selectedProject.id) === String(projectId)
            ? null
            : get().selectedProject,
        loading: false,
      });
    } catch (error) {
      const message = handleApiError(error, "Unable to delete project.");
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));
