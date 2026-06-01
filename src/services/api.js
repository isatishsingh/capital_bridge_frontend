import axios from 'axios';
import { formatUserError } from '../utils/errorMessages';
import { storage } from '../utils/storage';

const resolvedBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:8080' : '');

if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.DEV) {
  console.warn(
    '[CapitalBridge] VITE_API_BASE_URL is not set. Using http://localhost:8080. Create a .env file (see .env.example) if your API runs elsewhere.'
  );
}

const api = axios.create({
  baseURL: resolvedBaseUrl || undefined,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearToken();
      storage.clearUser();
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error, fallback = 'Something went wrong. Please try again.') =>
  formatUserError(error, fallback);

export const getApiErrorCode = (error) => {
  const data = error?.response?.data;
  if (!data) {
    return null;
  }
  if (typeof data === 'object' && data.code) {
    return data.code;
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data).code || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const isSubscriptionError = (error) => {
  const code = getApiErrorCode(error);
  return code === 'CREATOR_SUBSCRIPTION_REQUIRED' || code === 'INVESTOR_SUBSCRIPTION_REQUIRED';
};

export default api;
