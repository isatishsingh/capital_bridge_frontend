import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    if (!store.initialized) {
      store.hydrate();
    }
  }, [store]);

  return store;
};
