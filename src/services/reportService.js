import api from './api';

export const reportService = {
  createReport: async (payload) => {
    const { data } = await api.post('/api/reports', payload);
    return data;
  }
};

