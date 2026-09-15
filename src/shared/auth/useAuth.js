import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchUserProfile,
  refreshSession,
  changePassword,
  clearError,
} from '@/features/auth';
import { normalizeAppRole, roleHomePath } from '@/shared/constants/roles';

/**
 * Auth hook — mirrors Postman Auth flow:
 * login / register / refresh / logout / me / changePassword
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, sessionReady, token } = useSelector(
    (state) => state.auth,
  );

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

  const refresh = async () => {
    const resultAction = await dispatch(refreshSession());
    if (refreshSession.fulfilled.match(resultAction)) {
      return { ok: true, ...resultAction.payload };
    }
    return { ok: false, error: resultAction.payload || 'Session expired.' };
  };

  const fetchProfile = async () => {
    const resultAction = await dispatch(fetchUserProfile());
    if (fetchUserProfile.fulfilled.match(resultAction)) {
      return { ok: true, user: resultAction.payload };
    }
    return { ok: false, error: resultAction.payload || 'Failed to load profile.' };
  };

  const updatePassword = async (input) => {
    const resultAction = await dispatch(changePassword(input));
    if (changePassword.fulfilled.match(resultAction)) {
      toast.success('Password updated');
      return { ok: true };
    }
    const message = resultAction.payload || 'Failed to change password.';
    toast.error(message);
    return { ok: false, error: message };
  };

  return {
    user,
    token,
    isAuthenticated: Boolean(isAuthenticated && user && role),
    loading,
    error,
    sessionReady: Boolean(sessionReady),
    role,
    login,
    register,
    logout,
    refresh,
    fetchProfile,
    changePassword: updatePassword,
    clearError: () => dispatch(clearError()),
    homePath,
    isUser: role === 'USER',
    isAdmin: role === 'ADMIN',
    isSupplier: role === 'SUPPLIER',
  };
};

export default useAuth;
