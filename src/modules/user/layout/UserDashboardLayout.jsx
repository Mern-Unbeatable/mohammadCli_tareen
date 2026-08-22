import { Outlet } from 'react-router';
import DashboardNavbar from '@/modules/user/components/shell/DashboardNavbar';
import MobileBottomNav from '@/modules/user/components/shell/MobileBottomNav';
import { FeedActionsProvider } from '@/modules/user/context/FeedActionsContext';
import { LayoutChromeProvider } from '@/shared/context/LayoutChromeContext';
import AppFooter from '@/shared/layout/FooterLayout';

const UserDashboardLayout = () => (
  <FeedActionsProvider>
    <LayoutChromeProvider>
      <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
        <DashboardNavbar />
        <div className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
          <Outlet />
        </div>
        <div className="hidden xl:block">
          <AppFooter />
        </div>
        <MobileBottomNav />
      </div>
    </LayoutChromeProvider>
  </FeedActionsProvider>
);

export default UserDashboardLayout;
