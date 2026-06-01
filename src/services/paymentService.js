import api from './api';

export const paymentService = {
  createOrder: async (payload) => {
    const { data } = await api.post('/api/payments/create-order', payload);
    return data;
  },
  verifyPayment: async (payload) => {
    const { data } = await api.post('/api/payments/verify', payload);
    if (typeof data === 'object' && data !== null) {
      return {
        ok: Boolean(data.success),
        message: data.message,
        receipt: data.receipt
      };
    }
    const text = typeof data === 'string' ? data : '';
    return {
      ok: text.toLowerCase().includes('success'),
      message: text,
      receipt: null
    };
  },
  getReceipt: async (paymentId) => {
    const { data } = await api.get(`/api/payments/receipt/${paymentId}`);
    return data;
  }
};
