import axios from 'axios';
import { tokenService } from './tokenService';

/**
 * Host-only base URL. Path prefix `/api/v1` lives on each route in endpoints.js.
 * Strip a trailing `/api/v1` (and slash) if someone puts it in VITE_API_BASE_URL by mistake.
 */
const normalizeBaseUrl = (url) =>
  String(url || '')
    .trim()
    .replace(/\/api\/v1\/?$/i, '')
    .replace(/\/+$/, '');

const BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) ||
  'https://mohamed430api.maktechgroup.tech';

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
      tokenService.clearAuth();
      // Optional: Dispatch event or redirect user to login if needed
      window.dispatchEvent(new Event('unauthorized_session'));
    }

    return Promise.reject(customError);
  }
);

export default axiosInstance;
