/**
 * Admin feature public API.
 *
 * - adminApi     → HTTP
 * - adminThunks  → async actions
 * - adminSlice   → state + sync reducers
 */

export { default as adminReducer } from "./adminSlice";
export { clearAdminError, clearSelectedUser } from "./adminSlice";
export {
  fetchAdminDashboardStats,
  fetchAdminStatistics,
  fetchUsersList,
  fetchUserDetails,
  updateUserStatus,
} from "./adminThunks";
export * as adminApi from "./adminApi";
