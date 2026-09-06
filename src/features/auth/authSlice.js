import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { crudService, API_ENDPOINTS, tokenService } from '../../api';

// Initial Auth State
const initialState = {
  user: tokenService.getUser(),
  token: tokenService.getToken(),
  isAuthenticated: !!(tokenService.getToken() && tokenService.getUser()),
  loading: false,
  error: null,
};


/**
 * Login Async Thunk
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Expects credentials format: { email, password, remember }
      const response = await crudService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      const payloadData = response?.data || response;
      const accessToken = payloadData?.accessToken || payloadData?.token;
      const refreshToken = payloadData?.refreshToken;
      const user = payloadData?.user;

      // Save tokens in Cookies using tokenService
      if (accessToken) {
        tokenService.setToken(accessToken);
      }
      if (refreshToken) {
        tokenService.setRefreshToken(refreshToken);
      }
      if (user) {
        tokenService.setUser(user);
      }
      return payloadData;
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.error?.message ||
        err?.response?.data?.error?.message ||
        'Invalid email or password';
      return rejectWithValue(errorMessage);
    }

  }
);

/**
 * Fetch Profile Async Thunk
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crudService.get(API_ENDPOINTS.AUTH.ME);
      const userData = response?.data?.user || response?.user || response;
      if (userData) {
        tokenService.setUser(userData);
      }
      return userData;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch user profile');
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
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
        state.token = action.payload?.accessToken || action.payload?.token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { resetAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
