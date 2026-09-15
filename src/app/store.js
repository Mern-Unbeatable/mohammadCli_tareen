import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { adminDashboardReducer } from "../features/admin/dashboard";
import { adminUsersReducer } from "../features/admin/users";
import { adminRecruitmentReducer } from "../features/admin/recruitment";
import { adminGeneralReducer } from "../features/admin/general";
import { adminMarketplaceReducer } from "../features/admin/marketplace";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminDashboard: adminDashboardReducer,
    adminUsers: adminUsersReducer,
    adminRecruitment: adminRecruitmentReducer,
    adminGeneral: adminGeneralReducer,
    adminMarketplace: adminMarketplaceReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
