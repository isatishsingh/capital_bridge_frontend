import { create } from 'zustand';
import { authService } from '../services/authService';
import { handleApiError } from '../services/api';
import { storage } from '../utils/storage';
import { buildUserFromToken, normalizeUser } from '../utils/auth';

export const useAuthStore = create((set) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  loading: false,
  initialized: false,
  error: null,
  setUser: (user) => set({ user }),
  hydrate: async () => {
    const token = storage.getToken();
    if (!token) {
      set({ initialized: true, token: null, user: null });
      return;
    }

    set({ loading: true });
    try {
      const localUser = storage.getUser();
      const user = normalizeUser(await authService.getCurrentUser(token)) || localUser || buildUserFromToken(token);
      storage.setUser(user);
      set({ user: user || localUser || buildUserFromToken(token), token, loading: false, initialized: true });
    } catch {
      storage.clearToken();
      storage.clearUser();
      set({ user: null, token: null, loading: false, initialized: true });
    }
  },
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(payload);
      const token =
        response.token || response.jwt || response.accessToken || response.access_token;
      if (!token) {
        throw new Error('Login response did not include a token.');
      }

      const inlineUser = normalizeUser(response.user);
      const user = inlineUser || (await authService.getCurrentUser(token));
      storage.setToken(token);
      storage.setUser(user);
      set({ user, token, loading: false, initialized: true });
      return user;
    } catch (error) {
      const message = handleApiError(error, 'Unable to log in.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(payload);
      set({ loading: false });
      return response;
    } catch (error) {
      const message = handleApiError(error, 'Unable to create account.');
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
  logout: () => {
    storage.clearToken();
    storage.clearUser();
    set({ user: null, token: null, error: null });
  }
}));
