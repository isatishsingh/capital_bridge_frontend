import { create } from 'zustand';
import { investmentService } from '../services/investmentService';
import { paymentService } from '../services/paymentService';
import { handleApiError } from '../services/api';
import { adaptInvestmentRequest, adaptInvestmentRequests } from '../utils/adapters';

export const useInvestmentStore = create((set, get) => ({
  investorRequests: [],
  customerRequests: [],
  completedInvestments: [],
  paymentOrder: null,
  loading: false,
  error: null,
  fetchInvestorRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await investmentService.getInvestorRequests();
      set({
        investorRequests: adaptInvestmentRequests(response?.requested || []),
        completedInvestments: adaptInvestmentRequests(response?.completed || []),
        loading: false
      });
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load your investments.') });
    }
  },
  fetchCustomerRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await investmentService.getCustomerRequests();
      const customerRequests = adaptInvestmentRequests(response);
      set({ customerRequests, loading: false });
    } catch (error) {
      set({ loading: false, error: handleApiError(error, 'Unable to load requests.') });
    }
  },
  requestInvestment: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await investmentService.requestInvestment(payload);
      const request = adaptInvestmentRequest(response);
      set({ investorRequests: [request, ...get().investorRequests], loading: false });
      return request;
    } catch (error) {
      const message = handleApiError(error, 'Unable to submit investment request.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  updateRequestStatus: async (requestId, payload) => {
    set({ loading: true, error: null });
    try {
      await investmentService.updateRequestStatus(requestId, payload);
      const updated = get().customerRequests.find((request) => String(request.id) === String(requestId));
      set({
        customerRequests: get().customerRequests.map((request) =>
          String(request.id) === String(requestId) ? { ...request, status: payload.status } : request
        ),
        loading: false
      });
      return updated ? { ...updated, status: payload.status } : null;
    } catch (error) {
      const message = handleApiError(error, 'Unable to update request.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  createOrder: async (payload) => {
    set({ loading: true, error: null });
    try {
      const paymentOrder = await paymentService.createOrder(payload);
      set({ paymentOrder, loading: false });
      return paymentOrder;
    } catch (error) {
      const message = handleApiError(error, 'Unable to initialize payment.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  verifyPayment: async (payload) => {
    set({ loading: true, error: null });
    try {
      const result = await paymentService.verifyPayment(payload);
      if (!result?.ok) {
        throw new Error(result?.message || 'Payment verification failed.');
      }
      set({ loading: false });
      return result;
    } catch (error) {
      const message = handleApiError(error, 'Unable to verify payment.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  }
}));
