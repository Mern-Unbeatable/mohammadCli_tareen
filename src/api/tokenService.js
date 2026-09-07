import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';

/**
 * Token Service handles reading, writing, and removing authentication tokens in Cookies.
 */
export const tokenService = {
  // Access Token
  getToken: () => Cookies.get(TOKEN_KEY) || null,

  setToken: (token, expires = 7) => {
    // default expires in 7 days
    Cookies.set(TOKEN_KEY, token, {
      expires,
      secure: window.location.protocol === 'https:',
      sameSite: 'Strict',
    });
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  // Refresh Token
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY) || null,

  setRefreshToken: (refreshToken, expires = 30) => {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      expires,
      secure: window.location.protocol === 'https:',
      sameSite: 'Strict',
    });
  },

  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  // Stored User Data (optional helper)
  getUser: () => {
    const user = Cookies.get(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (userData, expires = 7) => {
    Cookies.set(USER_KEY, JSON.stringify(userData), {
      expires,
      secure: window.location.protocol === 'https:',
      sameSite: 'Strict',
    });
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  // Clear all session tokens
  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};

export default tokenService;
