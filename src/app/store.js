import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { adminDashboardReducer } from "../features/admin/dashboard";
import { adminStatisticsReducer } from "../features/admin/statistics";
import { adminUsersReducer } from "../features/admin/users";
import { adminRecruitmentReducer } from "../features/admin/recruitment";
import { adminGeneralReducer } from "../features/admin/general";
import { adminMarketplaceReducer } from "../features/admin/marketplace";
import { adminReportsReducer } from "../features/admin/reports";
import { adminAdsReducer } from "../features/admin/advertisements";
import { adminBlogsReducer } from "../features/admin/blogs";
import { adminSettingsReducer } from "../features/admin/settings";
import { adminProfileReducer } from "../features/admin/profile";
import { supplierDashboardReducer } from "../features/supplier/dashboard";
import { supplierAdsReducer } from "../features/supplier/advertisements";
import { supplierContactsReducer } from "../features/supplier/contacts";
import { supplierRecruitmentReducer } from "../features/supplier/recruitment";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminDashboard: adminDashboardReducer,
    adminStatistics: adminStatisticsReducer,
    adminUsers: adminUsersReducer,
    adminRecruitment: adminRecruitmentReducer,
    adminGeneral: adminGeneralReducer,
    adminMarketplace: adminMarketplaceReducer,
    adminReports: adminReportsReducer,
    adminAds: adminAdsReducer,
    adminBlogs: adminBlogsReducer,
    adminSettings: adminSettingsReducer,
    adminProfile: adminProfileReducer,
    supplierDashboard: supplierDashboardReducer,
    supplierAds: supplierAdsReducer,
    supplierContacts: supplierContactsReducer,
    supplierRecruitment: supplierRecruitmentReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
