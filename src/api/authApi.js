import { API_ENDPOINTS } from './endpoints';
import { tokenService } from './tokenService';
import { unwrapApiData, unwrapUser } from './unwrapApiData';
import axiosInstance, { bareAuthClient } from './axiosInstance';

const toError = (error, fallback) => {
  const payload = error?.response?.data?.error || error?.response?.data || error;
  const message =
    payload?.message ||
    (typeof payload === 'string' ? payload : null) ||
    error?.message ||
    fallback;
  const details = payload?.details || error?.response?.data?.errors || null;
  const err = new Error(message);
  err.status = error?.response?.status || error?.status || 500;
  err.details = details;
  err.code = payload?.code || null;
  err.raw = error;
  return err;
};

/**
 * Auth API — matches Postman folder "🔐 Auth" (+ change password).
 *
 * POST   /auth/register
 * POST   /auth/login
 * POST   /auth/refresh
 * POST   /auth/logout
 * GET    /auth/me
 * PATCH  /users/me/password
 */
export const authApi = {
  /**
   * @param {object} input Register body (see Postman Register)
   * @param {{ remember?: boolean }} [options]
   */
  register: async (input, options = {}) => {
    const remember = options.remember ?? true;
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, input);
    const data = unwrapApiData(response) || response;
    const user = unwrapUser(data);
    const session = tokenService.persistSession({
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken,
      user,
      remember,
    });
    return { ...data, ...session, user };
  },

  /**
   * @param {{ email: string, password: string, remember?: boolean }} credentials
   */
  login: async (credentials) => {
    const { remember = true, ...body } = credentials || {};
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
      ...body,
      remember,
    });
    const data = unwrapApiData(response) || response;
    const user = unwrapUser(data);
    const session = tokenService.persistSession({
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken,
      user,
      remember,
    });
    return { ...data, ...session, user };
  },

  /**
   * Rotate access + refresh tokens (no Bearer header).
   * @param {string} [refreshToken]
   */
  refresh: async (refreshToken = tokenService.getRefreshToken()) => {
    if (!refreshToken) {
      throw toError({ message: 'No refresh token' }, 'No refresh token');
    }

    try {
      const { data: envelope } = await bareAuthClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });
      const data = unwrapApiData(envelope) || envelope;
      const remember = tokenService.getRemember();
      const session = tokenService.persistSession({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
        user: tokenService.getUser(),
        remember,
      });
      return { ...data, ...session };
    } catch (error) {
      throw toError(error, 'Failed to refresh session');
    }
  },

  /**
   * Revoke refresh token. Body-only; no Bearer required (Postman).
   */
  logout: async () => {
    const refreshToken = tokenService.getRefreshToken();
    try {
      if (refreshToken) {
        await bareAuthClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
      return { ok: true };
    } catch (error) {
      throw toError(error, 'Logout failed');
    } finally {
      tokenService.clearAuth();
    }
  },

  /** GET /auth/me */
  me: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    const user = unwrapUser(response);
    if (!user) {
      throw toError({ message: 'Invalid profile response' }, 'Invalid profile response');
    }
    tokenService.setUser(user);
    return user;
  },

  /**
   * PATCH /users/me/password
   * @param {{ currentPassword: string, newPassword: string, confirmPassword: string }} input
   */
  changePassword: async (input) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.USER.PROFILE.CHANGE_PASSWORD,
      input,
    );
    return unwrapApiData(response) ?? response;
  },
};

export default authApi;
