import api from './api';
import { asArray } from '../utils/normalizers';

export const userService = {
  getMyProfile: async () => {
    const { data } = await api.get('/api/users/me');
    return data;
  },
  updateMyProfile: async (payload) => {
    const { data } = await api.put('/api/users/me', payload);
    return data;
  },
  listUsers: async () => {
    const { data } = await api.get('/api/users');
    return asArray(data);
  },
  findByEmail: async (email) => {
    if (!email) {
      return null;
    }
    const users = await userService.listUsers();
    return users.find((u) => u.email?.toLowerCase() === String(email).toLowerCase()) || null;
  }
};
