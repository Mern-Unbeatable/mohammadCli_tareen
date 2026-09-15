/**
 * Compatibility facade for `@/api` consumers (axiosInstance, AdminProfileView).
 * Implementation lives in `features/auth/authApi.js`.
 */
import * as featureAuthApi from "../features/auth/authApi";

export const authApi = {
  register: featureAuthApi.register,
  login: featureAuthApi.login,
  refresh: featureAuthApi.refresh,
  logout: featureAuthApi.logout,
  me: featureAuthApi.me,
  changePassword: featureAuthApi.changePassword,
};

export default authApi;
