/**
 * Centralized API Endpoints Configuration for the entire project.
 * All API routes must be referenced from this single source of truth.
 *
 * VITE_API_BASE_URL must be the host only (no /api/v1).
 * Example: https://mohamed430api.maktechgroup.tech
 * Full path = baseURL + these prefixed routes → .../api/v1/auth/login
 */
const API_PREFIX = '/api/v1';

export const API_ENDPOINTS = {
  // Authentication & User Profile
  AUTH: {
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    REFRESH_TOKEN: `${API_PREFIX}/auth/refresh-token`,
    FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
    RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
    ME: `${API_PREFIX}/auth/me`,
  },

  // User Management
  USERS: {
    BASE: `${API_PREFIX}/users`,
    DETAILS: (id) => `${API_PREFIX}/users/${id}`,
    STATUS: (id) => `${API_PREFIX}/users/${id}/status`,
    UPDATE_PROFILE: `${API_PREFIX}/users/profile`,
    CHANGE_PASSWORD: `${API_PREFIX}/users/change-password`,
  },

  // Products / Items
  PRODUCTS: {
    BASE: `${API_PREFIX}/products`,
    DETAILS: (id) => `${API_PREFIX}/products/${id}`,
    CATEGORIES: `${API_PREFIX}/products/categories`,
    SEARCH: `${API_PREFIX}/products/search`,
  },

  // Admin Module Endpoints
  ADMIN: {
    DASHBOARD: `${API_PREFIX}/admin/dashboard`,
    DASHBOARD_STATS: `${API_PREFIX}/admin/dashboard`,
    STATISTICS: `${API_PREFIX}/admin/statistics`,
    MANAGE_USERS: `${API_PREFIX}/admin/users`,
    USER_STATUS: (id) => `${API_PREFIX}/users/${id}/status`,
  },




  // Supplier Module Endpoints
  SUPPLIER: {
    INVENTORY: `${API_PREFIX}/supplier/inventory`,
    ORDERS: `${API_PREFIX}/supplier/orders`,
    ORDER_DETAILS: (orderId) => `${API_PREFIX}/supplier/orders/${orderId}`,
  },

  // File Upload
  MEDIA: {
    UPLOAD_SINGLE: `${API_PREFIX}/media/upload`,
    UPLOAD_MULTIPLE: `${API_PREFIX}/media/upload-multiple`,
  },
};


export default API_ENDPOINTS;
