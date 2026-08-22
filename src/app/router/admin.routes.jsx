import AdminLayout from '@/modules/admin/layout/AdminLayout';
import AdminDashboardView from '@/modules/admin/pages/AdminDashboardView';
import AdminUsersView from '@/modules/admin/pages/AdminUsersView';

export const adminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminDashboardView /> },
    { path: 'users', element: <AdminUsersView /> },
  ],
};
