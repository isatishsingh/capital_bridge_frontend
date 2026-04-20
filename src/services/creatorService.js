import api from './api';

export const creatorService = {
  saveProfile: async (payload) => {
    const { data } = await api.post('/api/creator/profile', payload);
    return data;
  }
};
