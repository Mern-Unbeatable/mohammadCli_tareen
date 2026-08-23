import { Navigate, Outlet, useLocation } from 'react-router';
import { ROLE_HOME_PATH } from '@/shared/constants/roles';
import { useAuth } from '@/shared/auth/AuthContext';

/**
 * Protects panel routes. Redirects unauthenticated users to login
 * and wrong-role users to their role home.
 */
const RequireRole = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_PATH[user.role]} replace />;
  }

  return <Outlet />;
};

export default RequireRole;
