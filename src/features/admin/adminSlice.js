import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminDashboardStats,
  fetchAdminStatistics,
  fetchUsersList,
  fetchUserDetails,
  updateUserStatus,
} from "./adminThunks";

const initialState = {
  // Dashboard / statistics
  stats: [],
  statistics: null,
  loading: false,
  statisticsLoading: false,
  statsError: null,
  statisticsError: null,

  // Users
  users: [],
  usersMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  selectedUser: null,
  usersLoading: false,
  selectedUserLoading: false,

  // Shared
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
      state.statsError = null;
      state.statisticsError = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
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
      })
      // Users list
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
      // User detail
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
      // User status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        if (state.selectedUser?.id === userId) {
          state.selectedUser.status = status;
        }
        const target = state.users.find((u) => u.id === userId);
        if (target) target.status = status;
      });
  },
});

export const { clearAdminError, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
