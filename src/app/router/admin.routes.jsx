import RequireRole from '@/shared/auth/RequireRole';
import { USER_ROLES } from '@/shared/constants/roles';
import AdminLayout from '@/modules/admin/layout/AdminLayout';
import AdminDashboardView from '@/modules/admin/pages/AdminDashboardView';
import AdminUsersView from '@/modules/admin/pages/AdminUsersView';
import AdminUserDetailView from '@/modules/admin/pages/AdminUserDetailView';
import AdminRecruitmentView from '@/modules/admin/pages/AdminRecruitmentView';
import AdminJobDetailView from '@/modules/admin/pages/AdminJobDetailView';
import AdminChatView from '@/modules/admin/pages/AdminChatView';
import AdminGeneralView from '@/modules/admin/pages/AdminGeneralView';
import AdminGeneralPostDetailView from '@/modules/admin/pages/AdminGeneralPostDetailView';
import AdminMarketplaceView from '@/modules/admin/pages/AdminMarketplaceView';
import AdminListingDetailView from '@/modules/admin/pages/AdminListingDetailView';
import AdminReportsView from '@/modules/admin/pages/AdminReportsView';
import AdminReportDetailView from '@/modules/admin/pages/AdminReportDetailView';
import AdminAdvertisementView from '@/modules/admin/pages/AdminAdvertisementView';
import AdminAdvertisementDetailView from '@/modules/admin/pages/AdminAdvertisementDetailView';
import AdminBlogsView from '@/modules/admin/pages/AdminBlogsView';
import AdminCreateBlogView from '@/modules/admin/pages/AdminCreateBlogView';
import AdminStatisticsView from '@/modules/admin/pages/AdminStatisticsView';
import AdminSettingsView from '@/modules/admin/pages/AdminSettingsView';
import AdminAccountForm from '@/components/forms/AdminAccountForm/AdminAccountForm';
import { useState } from 'react';
import {
  DEMO_ADMIN_PASSWORD,
  DEMO_ADMIN_PROFILE,
} from '@/data/demoData';

const AdminProfileView = () => {
  const [profile, setProfile] = useState(DEMO_ADMIN_PROFILE);
  const [passwords, setPasswords] = useState(DEMO_ADMIN_PASSWORD);

  return (
    <AdminAccountForm
      profileValues={profile}
      passwordValues={passwords}
      onProfileChange={(key, value) => setProfile((prev) => ({ ...prev, [key]: value }))}
      onPasswordChange={(key, value) => setPasswords((prev) => ({ ...prev, [key]: value }))}
      onUpdateProfile={(e) => e.preventDefault()}
      onChangePassword={(e) => e.preventDefault()}
    />
  );
};

export const adminRoutes = {
  path: '/admin',
  element: <RequireRole allowedRoles={[USER_ROLES.ADMIN]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboardView /> },
        { path: 'users', element: <AdminUsersView /> },
        { path: 'users/:userId', element: <AdminUserDetailView /> },
        { path: 'recruitment', element: <AdminRecruitmentView /> },
        { path: 'recruitment/:jobId', element: <AdminJobDetailView /> },
        { path: 'chat', element: <AdminChatView /> },
        { path: 'general', element: <AdminGeneralView /> },
        { path: 'general/:postId', element: <AdminGeneralPostDetailView /> },
        { path: 'marketplace', element: <AdminMarketplaceView /> },
        { path: 'marketplace/:listingId', element: <AdminListingDetailView /> },
        { path: 'reports', element: <AdminReportsView /> },
        { path: 'reports/:reportId', element: <AdminReportDetailView /> },
        { path: 'advertisement', element: <AdminAdvertisementView /> },
        { path: 'advertisement/:adId', element: <AdminAdvertisementDetailView /> },
        { path: 'blogs', element: <AdminBlogsView /> },
        { path: 'blogs/new', element: <AdminCreateBlogView /> },
        { path: 'statistics', element: <AdminStatisticsView /> },
        { path: 'settings', element: <AdminSettingsView /> },
        { path: 'profile', element: <AdminProfileView /> },
      ],
    },
  ],
};
