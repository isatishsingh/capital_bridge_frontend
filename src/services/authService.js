import api from './api';
import { buildUserFromToken, normalizeUser } from '../utils/auth';
import { asArray } from '../utils/normalizers';

const postJson = async (url, body) => {
  const { data } = await api.post(url, body);
  return data;
};

export const authService = {
  login: async (payload) => {
    if (payload.role === 'ADMIN') {
      return postJson('/admin/login', {
        email: payload.email,
        password: payload.password
      });
    }

    return postJson('/api/users/login', {
      email: payload.email,
      password: payload.password
    });
  },
  register: async (payload) => {
    return postJson('/api/users/register', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || 'INVESTOR'
    });
  },
  getCurrentUser: async (token) => {
    const fallbackUser = buildUserFromToken(token);

    try {
      const { data } = await api.get('/api/users');
      const matchedUser = asArray(data).find(
        (user) => user.email?.toLowerCase() === fallbackUser.email?.toLowerCase()
      );
      return normalizeUser(matchedUser) || fallbackUser;
    } catch {
      return fallbackUser;
    }
  }
};
