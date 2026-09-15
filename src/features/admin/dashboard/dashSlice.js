import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminDashboardStats,
  fetchAdminStatistics,
} from "./dashThunks";

const initialState = {
  stats: [],
  statistics: null,
  loading: false,
  statisticsLoading: false,
  statsError: null,
  statisticsError: null,
  error: null,
};

const dashSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
      state.statsError = null;
      state.statisticsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard KPIs
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.loading = true;
        state.statsError = null;
        state.error = null;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.statsError = null;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.stats = [];
        state.statsError = action.payload;
        state.error = action.payload;
      })
      // Statistics charts
      .addCase(fetchAdminStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
      })
      .addCase(fetchAdminStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
        state.statisticsError = null;
      })
      .addCase(fetchAdminStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = null;
        state.statisticsError = action.payload;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = dashSlice.actions;
export default dashSlice.reducer;
