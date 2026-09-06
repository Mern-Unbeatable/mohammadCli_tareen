import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { crudService, API_ENDPOINTS } from '@/api';

const initialState = {
  stats: [],
  statistics: null,
  users: [],
  usersMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  selectedUser: null,
  loading: false,
  statisticsLoading: false,
  usersLoading: false,
  selectedUserLoading: false,
  error: null,
};

/**
 * Fetch Admin Dashboard Stats Async Thunk
 */
export const fetchAdminDashboardStats = createAsyncThunk(
  'admin/fetchAdminDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crudService.get(API_ENDPOINTS.ADMIN.DASHBOARD);
      const stats = response?.data?.stats || response?.stats || [];
      return stats;
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.error?.message ||
        err?.response?.data?.error?.message ||
        'Failed to load dashboard stats';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch Admin Statistics (Charts) Async Thunk
 */
export const fetchAdminStatistics = createAsyncThunk(
  'admin/fetchAdminStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crudService.get(API_ENDPOINTS.ADMIN.STATISTICS);
      const statisticsData = response?.data || response;
      return statisticsData;
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.error?.message ||
        err?.response?.data?.error?.message ||
        'Failed to load statistics chart data';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch Users List with Pagination & Filters Async Thunk
 */
export const fetchUsersList = createAsyncThunk(
  'admin/fetchUsersList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await crudService.get(API_ENDPOINTS.USERS.BASE, params);
      const usersData = response?.data || [];
      const metaData = response?.meta || { page: 1, pageSize: 10, total: usersData.length, totalPages: 1 };
      return { data: usersData, meta: metaData };
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.error?.message ||
        err?.response?.data?.error?.message ||
        'Failed to load users list';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch Single User Details Async Thunk
 */
export const fetchUserDetails = createAsyncThunk(
  'admin/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await crudService.get(API_ENDPOINTS.USERS.DETAILS(userId));
      const userData = response?.data || response;
      return userData;
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.error?.message ||
        err?.response?.data?.error?.message ||
        'Failed to load user details';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update User Status Async Thunk
 */
export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status, reason }, { rejectWithValue }) => {
    try {
      const response = await crudService.patch(API_ENDPOINTS.ADMIN.USER_STATUS(userId), { status, reason });
      return { userId, status, data: response?.data };
    } catch (err) {
      const errorMessage =
        err?.message ||
        err?.error?.message ||
        err?.response?.data?.error?.message ||
        'Failed to update user status';
      return rejectWithValue(errorMessage);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Statistics Charts
      .addCase(fetchAdminStatistics.pending, (state) => {
        state.statisticsLoading = true;
      })
      .addCase(fetchAdminStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchAdminStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.error = action.payload;
      })
      // Users List
      .addCase(fetchUsersList.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data;
        state.usersMeta = action.payload.meta;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      // Single User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.selectedUserLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.selectedUserLoading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        if (state.selectedUser && state.selectedUser.id === userId) {
          state.selectedUser.status = status;
        }
        const target = state.users.find((u) => u.id === userId);
        if (target) {
          target.status = status;
        }
      });
  },
});

export const { clearAdminError, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
