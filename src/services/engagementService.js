import api from './api';
import { asArray } from '../utils/normalizers';

const defaultSnapshot = () => ({
  likes: 0,
  shares: 0,
  commentsCount: 0,
  investorCount: 0
});

export const engagementService = {
  async getSnapshot(projectId) {
    const paths = [
      `/api/projects/${projectId}/engagement`,
      `/api/projects/${projectId}/stats`
    ];

    for (const url of paths) {
      try {
        const { data } = await api.get(url);
        if (data && typeof data === 'object') {
          return {
            likes: data.likes ?? data.likeCount ?? 0,
            shares: data.shares ?? data.shareCount ?? 0,
            commentsCount: data.commentsCount ?? data.comments ?? asArray(data.commentList).length,
            investorCount: data.investorCount ?? data.investors ?? 0
          };
        }
      } catch {
        /* try next */
      }
    }

    return null;
  },

  async getComments(projectId) {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/comments`);
      return asArray(data);
    } catch {
      return [];
    }
  },

  async like(projectId) {
    await api.post(`/api/projects/${projectId}/like`);
  },

  async share(projectId) {
    await api.post(`/api/projects/${projectId}/share`);
  },

  async addComment(projectId, body) {
    const { data } = await api.post(`/api/projects/${projectId}/comments`, body);
    return data;
  }
};
