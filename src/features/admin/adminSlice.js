import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { crudService, API_ENDPOINTS } from '@/api';

const initialState = {
  stats: [],
  statistics: null,
  loading: false,
  statisticsLoading: false,
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
      // Response format: { success: true, data: { stats: [...] } }
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
      // Response format: { success: true, data: { year, labels, series: { newUsers, newSubscribers, monthlyRevenue, yearlyRevenue } } }
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

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
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
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
