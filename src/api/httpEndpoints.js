/**
 * Centralized API endpoints — paths relative to `VITE_API_BASE_URL`
 * (Postman `baseUrl`, e.g. `http://localhost:4000/api/v1`).
 *
 * Grouped by role surface, matching Lab-Unity.postman_collection.json:
 * Auth (shared) → Public → Admin → Supplier → User
 */

export const API_ENDPOINTS = {
  // ═══════════════════════════════════════════════════════════════════════
  // Shared auth (all roles)
  // ═══════════════════════════════════════════════════════════════════════
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Public (no auth / optional auth)
  // ═══════════════════════════════════════════════════════════════════════
  PUBLIC: {
    HEALTH: "/health",
    BLOGS: {
      LIST: "/blogs",
      BY_SLUG: (slug) => `/blogs/${slug}`,
    },
    SUBSCRIPTION_PLANS: "/subscriptions/plans",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Admin
  // ═══════════════════════════════════════════════════════════════════════
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    STATISTICS: "/admin/statistics",

    SETTINGS: "/admin/settings",
    SETTING: (key) => `/admin/settings/${key}`,

    USERS: {
      LIST: "/users",
      DETAILS: (userId) => `/users/${userId}`,
      STATUS: (userId) => `/users/${userId}/status`,
    },

    BLOGS: {
      LIST: "/blogs",
      CREATE: "/blogs",
      BY_SLUG: (slug) => `/blogs/${slug}`,
      UPDATE: (blogId) => `/blogs/${blogId}`,
      DELETE: (blogId) => `/blogs/${blogId}`,
    },

    REPORTS: {
      LIST: "/reports",
      STATS: "/reports/stats",
      DETAILS: (reportId) => `/reports/${reportId}`,
      STATUS: (reportId) => `/reports/${reportId}/status`,
      MODERATE: (reportId) => `/reports/${reportId}/moderate`,
    },

    ADVERTISEMENTS: {
      LIST: "/advertisements",
      DETAILS: (adId) => `/advertisements/${adId}`,
      REVIEW: (adId) => `/advertisements/${adId}/review`,
    },

    MARKETPLACE: {
      LIST: "/marketplace",
      DETAILS: (listingId) => `/marketplace/${listingId}`,
      DELETE: (listingId) => `/marketplace/${listingId}`,
    },

    RECRUITMENT: {
      LIST: "/recruitment",
      DETAILS: (jobId) => `/recruitment/${jobId}`,
      APPLICATIONS: (jobId) => `/recruitment/${jobId}/applications`,
      DELETE: (jobId) => `/recruitment/${jobId}`,
    },

    GENERAL: {
      LIST: "/general",
      DETAILS: (postId) => `/general/${postId}`,
      DELETE: (postId) => `/general/${postId}`,
    },

    /** Profile endpoints the admin panel also uses */
    PROFILE: {
      ME: "/users/me",
      UPDATE: "/users/me",
      CHANGE_PASSWORD: "/users/me/password",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Supplier
  // ═══════════════════════════════════════════════════════════════════════
  SUPPLIER: {
    ADVERTISEMENTS: {
      LIST: "/advertisements",
      CREATE: "/advertisements",
      DETAILS: (adId) => `/advertisements/${adId}`,
      UPDATE: (adId) => `/advertisements/${adId}`,
      DELETE: (adId) => `/advertisements/${adId}`,
    },

    MARKETPLACE: {
      LIST: "/marketplace",
      CREATE: "/marketplace",
      DETAILS: (listingId) => `/marketplace/${listingId}`,
      UPDATE: (listingId) => `/marketplace/${listingId}`,
      DELETE: (listingId) => `/marketplace/${listingId}`,
    },

    RECRUITMENT: {
      LIST: "/recruitment",
      CREATE: "/recruitment",
      DETAILS: (jobId) => `/recruitment/${jobId}`,
      UPDATE: (jobId) => `/recruitment/${jobId}`,
      DELETE: (jobId) => `/recruitment/${jobId}`,
      APPLICATIONS: (jobId) => `/recruitment/${jobId}/applications`,
    },

    GENERAL: {
      LIST: "/general",
      CREATE: "/general",
      DETAILS: (postId) => `/general/${postId}`,
      UPDATE: (postId) => `/general/${postId}`,
      DELETE: (postId) => `/general/${postId}`,
    },

    BLOGS: {
      LIST: "/blogs",
      DETAILS: (slug) => `/blogs/${slug}`,
    },

    NOTIFICATIONS: {
      LIST: "/notifications",
      READ_ALL: "/notifications/read-all",
      READ: (notificationId) => `/notifications/${notificationId}/read`,
      DELETE: (notificationId) => `/notifications/${notificationId}`,
    },

    MESSAGES: {
      LIST: "/messages",
      DIRECT: "/messages/direct",
      GROUP: "/messages/group",
      THREAD: (conversationId) => `/messages/${conversationId}/messages`,
    },

    CONTACTS: {
      LIST: "/contacts",
      DETAILS: (contactId) => `/contacts/${contactId}`,
      REQUEST: "/contacts/request",
      ACCEPT: (connectionId) => `/contacts/${connectionId}/accept`,
      DECLINE: (connectionId) => `/contacts/${connectionId}/decline`,
      REMOVE: (connectionId) => `/contacts/${connectionId}`,
    },

    PROFILE: {
      ME: "/users/me",
      UPDATE: "/users/me",
      CHANGE_PASSWORD: "/users/me/password",
    },

    UPLOADS: {
      SINGLE: "/uploads",
      MULTIPLE: "/uploads/multiple",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // User (customer)
  // ═══════════════════════════════════════════════════════════════════════
  USER: {
    PROFILE: {
      ME: "/users/me",
      UPDATE: "/users/me",
      CHANGE_PASSWORD: "/users/me/password",
    },

    FEED: {
      LIST: "/feed",
      CREATE: "/feed",
      DETAILS: (postId) => `/feed/${postId}`,
      UPDATE: (postId) => `/feed/${postId}`,
      DELETE: (postId) => `/feed/${postId}`,
      COMMENTS: (postId) => `/feed/${postId}/comments`,
      COMMENT: (postId, commentId) => `/feed/${postId}/comments/${commentId}`,
      REACTIONS: (postId) => `/feed/${postId}/reactions`,
    },

    CONTACTS: {
      LIST: "/contacts",
      DETAILS: (connectionId) => `/contacts/${connectionId}`,
      REQUEST: "/contacts/request",
      ACCEPT: (connectionId) => `/contacts/${connectionId}/accept`,
      DECLINE: (connectionId) => `/contacts/${connectionId}/decline`,
      REMOVE: (connectionId) => `/contacts/${connectionId}`,
    },

    MARKETPLACE: {
      LIST: "/marketplace",
      DETAILS: (listingId) => `/marketplace/${listingId}`,
      SAVE: (listingId) => `/marketplace/${listingId}/save`,
    },

    RECRUITMENT: {
      LIST: "/recruitment",
      DETAILS: (jobId) => `/recruitment/${jobId}`,
      APPLY: (jobId) => `/recruitment/${jobId}/apply`,
    },

    GENERAL: {
      LIST: "/general",
      CREATE: "/general",
      DETAILS: (postId) => `/general/${postId}`,
      UPDATE: (postId) => `/general/${postId}`,
      DELETE: (postId) => `/general/${postId}`,
    },

    MESSAGES: {
      LIST: "/messages",
      DIRECT: "/messages/direct",
      GROUP: "/messages/group",
      THREAD: (conversationId) => `/messages/${conversationId}/messages`,
    },

    NOTIFICATIONS: {
      LIST: "/notifications",
      READ_ALL: "/notifications/read-all",
      READ: (notificationId) => `/notifications/${notificationId}/read`,
      DELETE: (notificationId) => `/notifications/${notificationId}`,
    },

    ADVERTISEMENTS: {
      ACTIVE: "/advertisements/active",
      TRACK: (adId, metric) => `/advertisements/${adId}/track/${metric}`,
    },

    REPORTS: {
      CREATE: "/reports",
    },

    SUBSCRIPTIONS: {
      ME: "/subscriptions/me",
      SUBSCRIBE: "/subscriptions/subscribe",
      CANCEL: "/subscriptions/cancel",
    },

    UPLOADS: {
      SINGLE: "/uploads",
      MULTIPLE: "/uploads/multiple",
    },
  },
};

export default API_ENDPOINTS;
