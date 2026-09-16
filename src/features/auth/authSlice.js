<<<<<<< HEAD
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  crudService,
  API_ENDPOINTS,
  tokenService,
  getApiErrorMessage,
  unwrapApiData,
  unwrapUser,
} from '../../api';

/** Heal cookies/state if an older bug stored the API envelope as `user`. */
const coerceStoredUser = (raw) => {
  if (!raw || typeof raw !== 'object') return raw;
  if (raw.role || raw.email || raw.id) return raw;
  return unwrapUser(raw) || raw;
};

const initialUser = coerceStoredUser(tokenService.getUser());

// Heal corrupted cookie shape from older /auth/me parsing
if (
  initialUser &&
  typeof initialUser === 'object' &&
  initialUser.role &&
  tokenService.getUser() &&
  !tokenService.getUser().role
) {
  tokenService.setUser(initialUser);
}

// Initial Auth State
const initialState = {
  user: initialUser,
  token: tokenService.getToken(),
  isAuthenticated: !!(tokenService.getToken() && initialUser),
  loading: false,
  error: null,
  // When a token exists, AuthSessionBridge revalidates before marking ready.
  sessionReady: !tokenService.getToken(),
};

const persistSession = (payload, remember = true) => {
  const payloadData = unwrapApiData(payload) || payload;
  const accessToken = payloadData?.accessToken || payloadData?.token;
  const refreshToken = payloadData?.refreshToken;
  const user = unwrapUser(payloadData) || payloadData?.user || null;
  const cookieOpts = { remember: Boolean(remember) };

  if (accessToken) {
    tokenService.setToken(accessToken, cookieOpts);
  }
  if (refreshToken) {
    tokenService.setRefreshToken(refreshToken, cookieOpts);
  }
  if (user) {
    tokenService.setUser(user, cookieOpts);
  }

  return {
    accessToken: accessToken || null,
    user,
  };
};

/**
 * Login Async Thunk
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const { remember = true, ...body } = credentials || {};
      const response = await crudService.post(API_ENDPOINTS.AUTH.LOGIN, {
        ...body,
        remember,
      });

      const persisted = persistSession(response, remember);
      const payloadData = unwrapApiData(response) || response;
      return {
        ...payloadData,
        user: persisted.user,
        accessToken: persisted.accessToken,
        remember,
      };
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err, 'Invalid email or password'));
    }
  }
);

/**
 * Register Async Thunk
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const { remember = true, ...body } = formData || {};
      const response = await crudService.post(API_ENDPOINTS.AUTH.REGISTER, body);

      const persisted = persistSession(response, remember);
      const payloadData = unwrapApiData(response) || response;
      return {
        ...payloadData,
        user: persisted.user,
        accessToken: persisted.accessToken,
        remember,
      };
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err, 'Registration failed'));
    }
  }
);

/**
 * Fetch Profile Async Thunk — used on bootstrap to revalidate session
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crudService.get(API_ENDPOINTS.AUTH.ME);
      // /auth/me → { success, data: user } (not { data: { user } })
      const userData = unwrapUser(response);
      if (!userData) {
        tokenService.clearAuth();
        return rejectWithValue('Invalid session profile response');
      }
      tokenService.setUser(userData);
      return userData;
    } catch (err) {
      tokenService.clearAuth();
      return rejectWithValue(getApiErrorMessage(err, 'Failed to fetch user profile'));
    }
  }
);

/**
 * Logout Async Thunk
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await crudService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore API logout error and clear local session anyway
    } finally {
      tokenService.clearAuth();
      dispatch(authSlice.actions.resetAuth());
    }
  }
);
=======
import { createSlice } from "@reduxjs/toolkit";
import { tokenService } from "@/api/cookies";
import { unwrapUser } from "@/api/unwrapApiData";
import {
  loginUser,
  registerUser,
  fetchUserProfile,
  refreshSession,
  logoutUser,
  changePassword,
} from "./authThunks";

/** Heal cookies/state if an older bug stored the API envelope as `user`. */
const coerceStoredUser = (raw) => {
  if (!raw || typeof raw !== "object") return raw;
  if (raw.role || raw.email || raw.id) return raw;
  return unwrapUser(raw) || raw;
};

const initialUser = coerceStoredUser(tokenService.getUser());

if (
  initialUser &&
  typeof initialUser === "object" &&
  initialUser.role &&
  tokenService.getUser() &&
  !tokenService.getUser().role
) {
  tokenService.setUser(initialUser);
}

const initialState = {
  user: initialUser,
  token: tokenService.getToken(),
  isAuthenticated: !!(tokenService.getToken() && initialUser),
  loading: false,
  error: null,
  sessionReady: !tokenService.getToken(),
};

const applyReset = (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
  state.sessionReady = true;
};
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
<<<<<<< HEAD
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.sessionReady = true;
=======
      applyReset(state);
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
    },
    clearError: (state) => {
      state.error = null;
    },
    setSessionReady: (state, action) => {
      state.sessionReady = Boolean(action.payload);
    },
<<<<<<< HEAD
=======
    tokenRefreshed: (state, action) => {
      state.token = action.payload || tokenService.getToken();
      state.isAuthenticated = !!(state.token && state.user);
    },
    setUser: (state, action) => {
      const user = coerceStoredUser(action.payload) || null;
      state.user = user;
      if (user) tokenService.setUser(user);
      state.isAuthenticated = !!(state.token && user);
    },
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
<<<<<<< HEAD
        state.token = action.payload?.accessToken || action.payload?.token || null;
=======
        state.token = action.payload?.accessToken || null;
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
        state.sessionReady = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
<<<<<<< HEAD
        state.token = action.payload?.accessToken || action.payload?.token || null;
=======
        state.token = action.payload?.accessToken || null;
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
        state.sessionReady = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
<<<<<<< HEAD
=======
      // Profile bootstrap
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
      .addCase(fetchUserProfile.pending, (state) => {
        state.sessionReady = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
<<<<<<< HEAD
        state.isAuthenticated = !!(action.payload && (state.token || tokenService.getToken()));
        state.token = state.token || tokenService.getToken();
=======
        state.token = tokenService.getToken();
        state.isAuthenticated = !!(action.payload && state.token);
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
        state.sessionReady = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionReady = true;
        state.error = action.payload;
<<<<<<< HEAD
=======
      })
      // Refresh
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.token = action.payload?.accessToken || tokenService.getToken();
        state.isAuthenticated = !!(state.token && state.user);
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionReady = true;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        applyReset(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        applyReset(state);
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
      });
  },
});

<<<<<<< HEAD
export const { resetAuth, clearError, setSessionReady } = authSlice.actions;
=======
export const { resetAuth, clearError, setSessionReady, tokenRefreshed, setUser } =
  authSlice.actions;
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
export default authSlice.reducer;
