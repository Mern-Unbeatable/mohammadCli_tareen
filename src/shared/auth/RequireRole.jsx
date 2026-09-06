import { Navigate, Outlet, useLocation } from 'react-router';
import { ROLE_HOME_PATH } from '@/shared/constants/roles';
import { useAuth } from '@/shared/auth/AuthContext';

/**
 * Protects panel routes. Redirects unauthenticated users to login
 * and wrong-role users to their role home.
 */
const RequireRole = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const userRole = (role || user?.role || '').toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole)) {
    const targetPath = ROLE_HOME_PATH[userRole] || ROLE_HOME_PATH.USER || '/login';
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
};

export default RequireRole;
