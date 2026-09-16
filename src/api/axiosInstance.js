import axios from "axios";
import { tokenService } from "./cookies";
import { API_ENDPOINTS } from "./httpEndpoints";

/** Must match Postman `baseUrl` (includes `/api/v1`). */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

<<<<<<< HEAD
/**
 * Production-ready Axios Instance configured with Interceptors
 */
=======
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Bare client for token refresh / logout — no auth or 401 interceptors.
 * Callers receive the raw Axios response (`response.data` is the envelope).
 */
export const bareAuthClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let refreshQueue = [];
let handlingUnauthorized = false;

const flushRefreshQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

const isAuthCredentialRequest = (url = "") =>
  url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
  url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
  url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
  url.includes(API_ENDPOINTS.AUTH.LOGOUT);

const isMeRequest = (url = "") => url.includes(API_ENDPOINTS.AUTH.ME);

const clearSessionAndRedirect = () => {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  tokenService.clearAuth();

  Promise.all([
    import("../app/store"),
    import("../features/auth"),
    import("../app/router/index.jsx"),
  ])
    .then(([{ store }, { resetAuth }, { router }]) => {
      store.dispatch(resetAuth());
      const path = window.location.pathname;
      if (!path.startsWith("/login")) {
        router.navigate("/login", {
          replace: true,
          state: { from: path },
        });
      }
    })
    .catch(() => {
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    })
    .finally(() => {
      handlingUnauthorized = false;
    });
};

/**
 * Attempt refresh + retry. Concurrent 401s share one refresh via a queue.
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
    const { refresh } = await import("../features/auth/authApi");
    const session = await refresh();
    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new Error("Refresh did not return an access token");
    }

    import("../app/store")
      .then(async ({ store }) => {
        const { tokenRefreshed } = await import("../features/auth");
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

// ═══════════════════════════════════════════════════════════════════════
// Request Interceptor
// ═══════════════════════════════════════════════════════════════════════
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

<<<<<<< HEAD
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
=======
// ═══════════════════════════════════════════════════════════════════════
// Response Interceptor
// ═══════════════════════════════════════════════════════════════════════
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;
    const url = originalRequest.url || "";

<<<<<<< HEAD
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
=======
    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthCredentialRequest(url) &&
      tokenService.getRefreshToken()
    ) {
      // /auth/me with a dead access token: try refresh once before giving up
      if (isMeRequest(url) || !isAuthCredentialRequest(url)) {
        try {
          return await refreshAndRetry(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
      }
    }

    if (status === 401 && !isAuthCredentialRequest(url)) {
      clearSessionAndRedirect();
    }

    const payload =
      error?.response?.data?.error || error?.response?.data || error;
    const message =
      payload?.message ||
      (typeof payload === "string" ? payload : null) ||
      error?.message ||
      "Something went wrong";

    return Promise.reject({
      status,
      message,
      data: error?.response?.data,
      details: payload?.details || error?.response?.data?.errors || null,
      code: payload?.code || null,
      raw: error,
    });
  },
);

export default axiosInstance;
