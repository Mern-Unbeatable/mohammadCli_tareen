import RequireRole from '@/shared/auth/RequireRole';
import { USER_ROLES } from '@/shared/constants/roles';
import SupplierLayout from '@/modules/supplier/layout/SupplierLayout';
import SupplierDashboardView from '@/modules/supplier/pages/SupplierDashboardView';
import SupplierAdsView from '@/modules/supplier/pages/SupplierAdsView';
import SupplierAdDetailView from '@/modules/supplier/pages/SupplierAdDetailView';
import SupplierGeneralView from '@/modules/supplier/pages/SupplierGeneralView';
import SupplierMyGeneralPostsView from '@/modules/supplier/pages/SupplierMyGeneralPostsView';
import SupplierGeneralPostDetailView from '@/modules/supplier/pages/SupplierGeneralPostDetailView';
import SupplierMessagesView from '@/modules/supplier/pages/SupplierMessagesView';
import SupplierContactsView from '@/modules/supplier/pages/SupplierContactsView';
import SupplierContactProfileView from '@/modules/supplier/pages/SupplierContactProfileView';
import SupplierRecruitmentView from '@/modules/supplier/pages/SupplierRecruitmentView';
import SupplierMyJobsView from '@/modules/supplier/pages/SupplierMyJobsView';
import SupplierJobDetailView from '@/modules/supplier/pages/SupplierJobDetailView';
import SupplierPostJobView from '@/modules/supplier/pages/SupplierPostJobView';
import SupplierBlogsView from '@/modules/supplier/pages/SupplierBlogsView';
import SupplierBlogDetailView from '@/modules/supplier/pages/SupplierBlogDetailView';
import SupplierNotificationsView from '@/modules/supplier/pages/SupplierNotificationsView';
import ProfileSetupForm from '@/components/forms/ProfileSetupForm/ProfileSetupForm';
import PanelPlaceholderView from '@/shared/pages/PanelPlaceholderView';
import { useState } from 'react';
import { DEMO_PROFILE_FORM } from '@/data/demoData';
import { profileCountries } from '@/modules/user/data/subscription';

const SupplierProfileView = () => {
  const [form, setForm] = useState(DEMO_PROFILE_FORM);

  return (
    <ProfileSetupForm
      values={form}
      onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))}
      onSubmit={(e) => e.preventDefault()}
      countries={profileCountries}
      title="My Profile"
      subtitle="Update your supplier profile visible to laboratories and buyers."
      submitLabel="Save Profile"
    />
  );
};

const placeholder = (title) => <PanelPlaceholderView title={title} />;

export const supplierRoutes = {
  path: '/supplier',
  element: <RequireRole allowedRoles={[USER_ROLES.SUPPLIER]} />,
  children: [
    {
      element: <SupplierLayout />,
      children: [
        { index: true, element: <SupplierDashboardView /> },
        { path: 'ads', element: <SupplierAdsView /> },
        { path: 'ads/:adId', element: <SupplierAdDetailView /> },
        { path: 'general', element: <SupplierGeneralView /> },
        { path: 'general/my-posts', element: <SupplierMyGeneralPostsView /> },
        { path: 'general/:postId', element: <SupplierGeneralPostDetailView /> },
        { path: 'contacts', element: <SupplierContactsView /> },
        { path: 'contacts/:contactId', element: <SupplierContactProfileView /> },
        { path: 'recruitment', element: <SupplierRecruitmentView /> },
        { path: 'recruitment/my-jobs', element: <SupplierMyJobsView /> },
        { path: 'recruitment/create', element: <SupplierPostJobView /> },
        { path: 'recruitment/:jobId', element: <SupplierJobDetailView /> },
        { path: 'messages', element: <SupplierMessagesView /> },
        { path: 'blogs', element: <SupplierBlogsView /> },
        { path: 'blogs/:slug', element: <SupplierBlogDetailView /> },
        { path: 'notifications', element: <SupplierNotificationsView /> },
        { path: 'profile', element: <SupplierProfileView /> },
      ],
    },
  ],
};
