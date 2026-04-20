import { useAuthStore } from '../store/authStore';

export const useProtectedAction = (allowedRoles = []) => {
  const { user } = useAuthStore();

  const canAccess = !!user && (!allowedRoles.length || allowedRoles.includes(user.role));

  return {
    canAccess,
    userRole: user?.role
  };
};
