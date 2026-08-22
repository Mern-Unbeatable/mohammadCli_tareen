import SupplierLayout from '@/modules/supplier/layout/SupplierLayout';
import SupplierDashboardView from '@/modules/supplier/pages/SupplierDashboardView';
import SupplierListingsView from '@/modules/supplier/pages/SupplierListingsView';

export const supplierRoutes = {
  path: '/supplier',
  element: <SupplierLayout />,
  children: [
    { index: true, element: <SupplierDashboardView /> },
    { path: 'listings', element: <SupplierListingsView /> },
  ],
};
