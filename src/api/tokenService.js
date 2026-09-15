import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';
const REMEMBER_KEY = 'auth_remember';

/** Persistent cookie lifetimes when remember=true */
const REMEMBER_ACCESS_DAYS = 7;
const REMEMBER_REFRESH_DAYS = 30;
const REMEMBER_USER_DAYS = 7;

const baseCookieOptions = () => ({
  secure: window.location.protocol === 'https:',
  sameSite: 'Strict',
});

const withExpiry = (remember, days) => {
  const options = { ...baseCookieOptions() };
  if (remember) {
    options.expires = days;
  }
  return options;
};

/**
 * Token Service — JS-readable cookies for Bearer auth.
 * Prefer server HttpOnly cookies when the API supports cookie sessions.
 */
export const tokenService = {
  getRemember: () => {
    const raw = Cookies.get(REMEMBER_KEY);
    if (raw === '0' || raw === 'false') return false;
    return true;
  },

  setRemember: (remember) => {
    Cookies.set(REMEMBER_KEY, remember ? '1' : '0', withExpiry(true, REMEMBER_REFRESH_DAYS));
  },

  getToken: () => Cookies.get(TOKEN_KEY) || null,

  setToken: (token, options = {}) => {
    const remember = options.remember ?? tokenService.getRemember();
    const expires = options.expires;
    const cookieOptions =
      typeof expires === 'number'
        ? { ...baseCookieOptions(), expires }
        : withExpiry(remember, REMEMBER_ACCESS_DAYS);
    Cookies.set(TOKEN_KEY, token, cookieOptions);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY) || null,

  setRefreshToken: (refreshToken, options = {}) => {
    const remember = options.remember ?? tokenService.getRemember();
    const expires = options.expires;
    const cookieOptions =
      typeof expires === 'number'
        ? { ...baseCookieOptions(), expires }
        : withExpiry(remember, REMEMBER_REFRESH_DAYS);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
  },

  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  getUser: () => {
    const user = Cookies.get(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (userData, options = {}) => {
    const remember = options.remember ?? tokenService.getRemember();
    const expires = options.expires;
    const cookieOptions =
      typeof expires === 'number'
        ? { ...baseCookieOptions(), expires }
        : withExpiry(remember, REMEMBER_USER_DAYS);
    Cookies.set(USER_KEY, JSON.stringify(userData), cookieOptions);
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  /**
   * Persist a full auth session from login/register/refresh payloads.
   * @returns {{ accessToken: string|null, refreshToken: string|null, user: object|null }}
   */
  persistSession: ({ accessToken, refreshToken, user, remember = true } = {}) => {
    tokenService.setRemember(Boolean(remember));
    const opts = { remember: Boolean(remember) };

    if (accessToken) tokenService.setToken(accessToken, opts);
    if (refreshToken) tokenService.setRefreshToken(refreshToken, opts);
    if (user) tokenService.setUser(user, opts);

    return {
      accessToken: accessToken || tokenService.getToken(),
      refreshToken: refreshToken || tokenService.getRefreshToken(),
      user: user || tokenService.getUser(),
    };
  },

  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
    Cookies.remove(REMEMBER_KEY);
  },
};

export default tokenService;
