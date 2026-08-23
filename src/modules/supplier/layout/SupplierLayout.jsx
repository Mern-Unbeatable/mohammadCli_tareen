import { Outlet } from 'react-router';
import PanelLayout from '@/shared/layout/PanelLayout/PanelLayout';
import { supplierNavItems } from '@/modules/supplier/config/nav';

const SupplierLayout = () => (
  <PanelLayout navItems={supplierNavItems}>
    <Outlet />
  </PanelLayout>
);

export default SupplierLayout;
