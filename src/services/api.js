import axios from 'axios';
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

const pickSpringMessage = (data) => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  if (typeof data.message === 'string') {
    return data.message;
  }

  if (typeof data.error === 'string') {
    return data.error;
  }

  const errors = data.errors;
  if (Array.isArray(errors) && errors.length) {
    const first = errors[0];
    if (typeof first === 'string') {
      return first;
    }
    if (first?.defaultMessage) {
      return first.defaultMessage;
    }
  }

  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0];
    const value = firstKey ? errors[firstKey] : null;
    if (Array.isArray(value) && value.length) {
      return `${firstKey}: ${value[0]}`;
    }
  }

  return null;
};

export const handleApiError = (error, fallback = 'Something went wrong. Please try again.') =>
  pickSpringMessage(error?.response?.data) || error?.response?.data?.detail || error?.message || fallback;

export default api;
