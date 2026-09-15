import axios from 'axios';
import { tokenService } from './tokenService';

// Base API URL from environment variables with fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mohamed430api.maktechgroup.tech';

/**
 * Production-ready Axios Instance configured with Interceptors
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically attaches Authorization Bearer token to outgoing requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let handlingUnauthorized = false;

const clearSessionAndRedirect = () => {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  tokenService.clearAuth();

  // Dynamic imports avoid circular dependency: api → store/router → features → api
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

/**
 * Response Interceptor
 * Handles responses globally and manages errors (e.g. 401 unauthorized token clearing)
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return data directly for cleaner consumption
    return response.data;
  },
  (error) => {
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

    // Handle 401 Unauthorized (Token Expired / Invalid)
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url || '');
      const isAuthBootstrap =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/me');

      // Login/register 401s are expected failures; /auth/me is handled by fetchUserProfile.
      if (!isAuthBootstrap) {
        clearSessionAndRedirect();
      } else if (requestUrl.includes('/auth/me')) {
        tokenService.clearAuth();
      }
    }

    return Promise.reject(customError);
  }
);

export default axiosInstance;
