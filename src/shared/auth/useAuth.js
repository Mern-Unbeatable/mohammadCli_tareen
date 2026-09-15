import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginUser, registerUser, logoutUser, clearError } from '@/features/auth/authSlice';
import { normalizeAppRole, roleHomePath } from '@/shared/constants/roles';

/**
 * Production custom hook connecting components directly to Redux Auth state & actions.
 * No React Context wrapper required.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, sessionReady } = useSelector((state) => state.auth);

  const role = normalizeAppRole(user);
  const homePath = role ? roleHomePath(role) : '/login';

  const login = async (credentials) => {
    const resultAction = await dispatch(loginUser(credentials));

    if (loginUser.fulfilled.match(resultAction)) {
      const userPayload = resultAction.payload?.user;
      const userRole = normalizeAppRole(userPayload);
      return {
        ok: true,
        user: userPayload,
        role: userRole,
        redirectTo: userRole ? roleHomePath(userRole) : '/login',
      };
    }

    return {
      ok: false,
      error: resultAction.payload || 'Invalid email or password.',
    };
  };

  const register = async (formData) => {
    const resultAction = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(resultAction)) {
      const userPayload = resultAction.payload?.user;
      const userRole = normalizeAppRole(userPayload);
      return {
        ok: true,
        user: userPayload,
        role: userRole,
        redirectTo: userRole ? roleHomePath(userRole) : '/login',
      };
    }

    return {
      ok: false,
      error: resultAction.payload || 'Registration failed.',
    };
  };

  const logout = async () => {
    await dispatch(logoutUser());
    toast.info('Logged out successfully');
  };

  return {
    user,
    isAuthenticated: Boolean(isAuthenticated && user && role),
    loading,
    error,
    sessionReady: Boolean(sessionReady),
    role,
    login,
    register,
    logout,
    clearError: () => dispatch(clearError()),
    homePath,
    isUser: role === 'USER',
    isAdmin: role === 'ADMIN',
    isSupplier: role === 'SUPPLIER',
  };
};

export default useAuth;
