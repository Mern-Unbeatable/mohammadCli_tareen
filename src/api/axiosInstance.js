import axios from 'axios';
import { tokenService } from './tokenService';
import { API_ENDPOINTS } from './endpoints';

/** Must match Postman `baseUrl` (includes `/api/v1`). */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/** Bare client for token refresh / logout — no interceptors. */
export const bareAuthClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let handlingUnauthorized = false;
let isRefreshing = false;
let refreshQueue = [];

const flushRefreshQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

const clearSessionAndRedirect = () => {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  tokenService.clearAuth();

  Promise.all([
    import('../app/store'),
    import('../features/auth/authSlice'),
    import('../app/router/index.jsx'),
  ])
    .then(([{ store }, { resetAuth }, { router }]) => {
      store.dispatch(resetAuth());
      const path = window.location.pathname;
      if (!path.startsWith('/login')) {
        router.navigate('/login', { replace: true, state: { from: path } });
      }
    })
    .catch(() => {
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    })
    .finally(() => {
      handlingUnauthorized = false;
    });
};

const isAuthCredentialRequest = (url = '') =>
  url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
  url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
  url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
  url.includes(API_ENDPOINTS.AUTH.LOGOUT);

const isMeRequest = (url = '') => url.includes(API_ENDPOINTS.AUTH.ME);

/**
 * Attempt refresh + retry. Shared by concurrent 401s via a queue.
 */
const refreshAndRetry = async (originalRequest) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axiosInstance(originalRequest);
    });
  }

  isRefreshing = true;
  originalRequest._retry = true;

  try {
    const { authApi } = await import('./authApi');
    const session = await authApi.refresh();
    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new Error('Refresh did not return an access token');
    }

    // Keep Redux token in sync when possible
    import('../app/store')
      .then(async ({ store }) => {
        const { tokenRefreshed } = await import('../features/auth/authSlice');
        store.dispatch(tokenRefreshed(accessToken));
      })
      .catch(() => {});

    flushRefreshQueue(null, accessToken);
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    flushRefreshQueue(refreshError, null);
    clearSessionAndRedirect();
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const errorPayload = error.response?.data?.error;
    const backendMessage =
      errorPayload?.message ||
      error.response?.data?.message ||
      (typeof errorPayload === 'string' ? errorPayload : null);
    const details = errorPayload?.details || error.response?.data?.errors || null;

    const customError = {
      status: error.response?.status || 500,
      code: errorPayload?.code || null,
      message: backendMessage || error.message || 'Something went wrong. Please try again.',
      details,
      errors: details,
      raw: error,
    };

    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url || '');
    const status = error.response?.status;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(customError);
    }

    // Expected auth failures — do not refresh / redirect loops
    if (isAuthCredentialRequest(requestUrl)) {
      return Promise.reject(customError);
    }

    // Bootstrap /me: let fetchUserProfile clear session; try refresh once if possible
    if (isMeRequest(requestUrl) && originalRequest._retry) {
      tokenService.clearAuth();
      return Promise.reject(customError);
    }

    if (originalRequest._retry) {
      clearSessionAndRedirect();
      return Promise.reject(customError);
    }

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      if (isMeRequest(requestUrl)) {
        tokenService.clearAuth();
      } else {
        clearSessionAndRedirect();
      }
      return Promise.reject(customError);
    }

    try {
      return await refreshAndRetry(originalRequest);
    } catch {
      return Promise.reject(customError);
    }
  },
);

export default axiosInstance;
