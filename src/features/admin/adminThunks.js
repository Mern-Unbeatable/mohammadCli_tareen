import { createAsyncThunk } from "@reduxjs/toolkit";
import * as adminApi from "./adminApi";

/**
 * Admin async thunks — orchestration only; HTTP lives in adminApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Admin dashboard stats
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdminDashboardStats = createAsyncThunk(
  "admin/fetchAdminDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getDashboardStats();
    } catch (err) {
      return rejectWithValue(
        adminApi.getApiErrorMessage(err, "Failed to load dashboard stats"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Admin statistics
// ═══════════════════════════════════════════════════════════════════════
export const fetchAdminStatistics = createAsyncThunk(
  "admin/fetchAdminStatistics",
  async (yearArg, { rejectWithValue }) => {
    try {
      return await adminApi.getStatistics(yearArg);
    } catch (err) {
      return rejectWithValue(
        adminApi.getApiErrorMessage(
          err,
          "Failed to load statistics chart data",
        ),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Admin users list
// ═══════════════════════════════════════════════════════════════════════
export const fetchUsersList = createAsyncThunk(
  "admin/fetchUsersList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await adminApi.getUsersList(params);
    } catch (err) {
      return rejectWithValue(
        adminApi.getApiErrorMessage(err, "Failed to load users list"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Admin user details
// ═══════════════════════════════════════════════════════════════════════
export const fetchUserDetails = createAsyncThunk(
  "admin/fetchUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      return await adminApi.getUserById(userId);
    } catch (err) {
      return rejectWithValue(
        adminApi.getApiErrorMessage(err, "Failed to load user details"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Admin user status
// ═══════════════════════════════════════════════════════════════════════
export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, status, reason }, { rejectWithValue }) => {
    try {
      return await adminApi.patchUserStatus(userId, status, reason);
    } catch (err) {
      return rejectWithValue(
        adminApi.getApiErrorMessage(err, "Failed to update user status"),
      );
    }
  },
);
