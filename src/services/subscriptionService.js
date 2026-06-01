import api from './api';

export const subscriptionService = {
  getStatus: async () => {
    const { data } = await api.get('/api/subscriptions/status');
    return data;
  },
  createMembershipOrder: async (plan) => {
    const { data } = await api.post('/api/subscriptions/membership-order', { plan });
    return data;
  },
  verifyMembership: async (payload) => {
    const { data } = await api.post('/api/subscriptions/verify-membership', payload);
    return data;
  }
};
