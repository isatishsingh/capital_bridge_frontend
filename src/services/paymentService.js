import api from './api';

export const paymentService = {
  createOrder: async (payload) => {
    const { data } = await api.post('/api/payments/create-order', payload);
    return data;
  },
  verifyPayment: async (payload) => {
    const { data } = await api.post('/api/payments/verify', payload);
    const text = typeof data === 'string' ? data : '';
    return {
      ok: text.toLowerCase().includes('success'),
      message: text
    };
  }
};
