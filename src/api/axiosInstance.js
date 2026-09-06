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
    // Extract message from nested backend error format: { success: false, error: { message, code } }
    const backendMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      (typeof error.response?.data?.error === 'string' ? error.response?.data?.error : null);

    // Standardized Error Object Structure
    const customError = {
      status: error.response?.status || 500,
      code: error.response?.data?.error?.code || null,
      message: backendMessage || error.message || 'Something went wrong. Please try again.',
      errors: error.response?.data?.errors || null,
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
