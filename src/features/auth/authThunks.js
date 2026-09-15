import { createAsyncThunk } from "@reduxjs/toolkit";
import { tokenService } from "@/api/tokenService";
import * as authApi from "./authApi";

/**
 * Auth async thunks — orchestration only; HTTP lives in authApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Login
// ═══════════════════════════════════════════════════════════════════════
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Invalid email or password"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Register
// ═══════════════════════════════════════════════════════════════════════
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { remember = true, ...body } = formData || {};
      return await authApi.register(body, { remember });
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Registration failed"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Fetch profile (bootstrap / revalidate)
// ═══════════════════════════════════════════════════════════════════════
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (err) {
      // Access expired but refresh still valid → rotate once, then me again
      try {
        if (tokenService.getRefreshToken()) {
          await authApi.refresh();
          return await authApi.me();
        }
      } catch {
        // fall through
      }
      tokenService.clearAuth();
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Failed to fetch user profile"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Refresh session
// ═══════════════════════════════════════════════════════════════════════
export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.refresh();
    } catch (err) {
      tokenService.clearAuth();
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Session expired"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Logout
// ═══════════════════════════════════════════════════════════════════════
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await authApi.logout();
  } catch {
    tokenService.clearAuth();
  }
});

// ═══════════════════════════════════════════════════════════════════════
// Change password
// ═══════════════════════════════════════════════════════════════════════
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (input, { rejectWithValue }) => {
    try {
      return await authApi.changePassword(input);
    } catch (err) {
      return rejectWithValue(
        authApi.getApiErrorMessage(err, "Failed to change password"),
      );
    }
  },
);
