import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, tokenService, unwrapUser, getApiErrorMessage } from '../../api';

/** Heal cookies/state if an older bug stored the API envelope as `user`. */
const coerceStoredUser = (raw) => {
  if (!raw || typeof raw !== 'object') return raw;
  if (raw.role || raw.email || raw.id) return raw;
  return unwrapUser(raw) || raw;
};

const initialUser = coerceStoredUser(tokenService.getUser());

if (
  initialUser &&
  typeof initialUser === 'object' &&
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

/**
 * POST /auth/login
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err, 'Invalid email or password'));
    }
  },
);

/**
 * POST /auth/register
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const { remember = true, ...body } = formData || {};
      return await authApi.register(body, { remember });
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err, 'Registration failed'));
    }
  },
);

/**
 * GET /auth/me — bootstrap / revalidate
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (err) {
      // Try one refresh then me again when access token expired but refresh is valid
      try {
        if (tokenService.getRefreshToken()) {
          await authApi.refresh();
          return await authApi.me();
        }
      } catch {
        // fall through
      }
      tokenService.clearAuth();
      return rejectWithValue(getApiErrorMessage(err, 'Failed to fetch user profile'));
    }
  },
);

/**
 * POST /auth/refresh
 */
export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.refresh();
    } catch (err) {
      tokenService.clearAuth();
      return rejectWithValue(getApiErrorMessage(err, 'Session expired'));
    }
  },
);

/**
 * POST /auth/logout { refreshToken }
 */
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  try {
    await authApi.logout();
  } catch {
    tokenService.clearAuth();
  } finally {
    dispatch(authSlice.actions.resetAuth());
  }
});

/**
 * PATCH /users/me/password
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (input, { rejectWithValue }) => {
    try {
      return await authApi.changePassword(input);
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err, 'Failed to change password'));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.sessionReady = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSessionReady: (state, action) => {
      state.sessionReady = Boolean(action.payload);
    },
    tokenRefreshed: (state, action) => {
      state.token = action.payload || tokenService.getToken();
      state.isAuthenticated = !!(state.token && state.user);
    },
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
        state.token = action.payload?.accessToken || null;
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
        state.token = action.payload?.accessToken || null;
        state.sessionReady = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.sessionReady = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = tokenService.getToken();
        state.isAuthenticated = !!(action.payload && state.token);
        state.sessionReady = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionReady = true;
        state.error = action.payload;
      })
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
      });
  },
});

export const { resetAuth, clearError, setSessionReady, tokenRefreshed } = authSlice.actions;
export default authSlice.reducer;
