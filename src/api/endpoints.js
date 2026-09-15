/**
 * Centralized API endpoints — paths are relative to `VITE_API_BASE_URL`
 * (Postman `baseUrl`, e.g. `http://localhost:4000/api/v1`).
 *
 * Source of truth: server/postman/Lab-Unity.postman_collection.json
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  USERS: {
    ME: '/users/me',
    UPDATE_ME: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
    BASE: '/users',
    DETAILS: (id) => `/users/${id}`,
    STATUS: (id) => `/users/${id}/status`,
  },

  PRODUCTS: {
    BASE: '/products',
    DETAILS: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search',
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    DASHBOARD_STATS: '/admin/dashboard',
    STATISTICS: '/admin/statistics',
    MANAGE_USERS: '/admin/users',
    USER_STATUS: (id) => `/users/${id}/status`,
  },

  SUPPLIER: {
    INVENTORY: '/supplier/inventory',
    ORDERS: '/supplier/orders',
    ORDER_DETAILS: (orderId) => `/supplier/orders/${orderId}`,
  },

  MEDIA: {
    UPLOAD_SINGLE: '/media/upload',
    UPLOAD_MULTIPLE: '/media/upload-multiple',
  },
};

export default API_ENDPOINTS;
