import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingState } from '../feedback/LoadingState';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, initialized, loading } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return <LoadingState label="Checking your access..." />;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
};
