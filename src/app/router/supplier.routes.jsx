import RequireRole from '@/shared/auth/RequireRole';
import { USER_ROLES } from '@/shared/constants/roles';
import SupplierLayout from '@/modules/supplier/layout/SupplierLayout';
import SupplierDashboardView from '@/modules/supplier/pages/SupplierDashboardView';
import SupplierAdsView from '@/modules/supplier/pages/SupplierAdsView';
import SupplierAdDetailView from '@/modules/supplier/pages/SupplierAdDetailView';
import SupplierGeneralView from '@/modules/supplier/pages/SupplierGeneralView';
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
        { path: 'contacts', element: placeholder('Contacts') },
        { path: 'recruitment', element: placeholder('Recruitment') },
        { path: 'messages', element: placeholder('Messages') },
        { path: 'blogs', element: placeholder('Blogs') },
        { path: 'notifications', element: placeholder('Notifications') },
        { path: 'profile', element: <SupplierProfileView /> },
      ],
    },
  ],
};
