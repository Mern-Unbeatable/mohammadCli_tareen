import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, clearError } from '@/features/auth/authSlice';
import { ROLE_HOME_PATH } from '@/shared/constants/roles';

/**
 * Custom hook connecting components directly to Redux Auth state & actions.
 * Replaces old dummy AuthContext state with real Redux Toolkit state.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const rawRole = user?.role || user?.profileType || '';
  const normalizedRole = rawRole ? rawRole.toUpperCase() : 'USER';

  const login = async (credentials) => {
    // credentials format: { email, password, remember }
    const resultAction = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(resultAction)) {
      const userPayload = resultAction.payload?.user;
      const userRole = userPayload?.role ? userPayload.role.toUpperCase() : 'USER';
      return {
        ok: true,
        user: userPayload,
        role: userRole,
        redirectTo: ROLE_HOME_PATH[userRole] || '/feed',
      };
    } else {
      return {
        ok: false,
        error: resultAction.payload || 'Invalid email or password.',
      };
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated: Boolean(isAuthenticated && user),
    loading,
    error,

    role: normalizedRole,
    login,
    logout,
    clearError: () => dispatch(clearError()),
    homePath: isAuthenticated ? (ROLE_HOME_PATH[normalizedRole] || '/feed') : '/login',
    isUser: normalizedRole === 'USER',
    isAdmin: normalizedRole === 'ADMIN',
    isSupplier: normalizedRole === 'SUPPLIER',
  };
};

/**
 * Pass-through AuthProvider wrapper (kept for backward compatibility with root providers)
 */
export const AuthProvider = ({ children }) => {
  return children;
};

export default useAuth;
