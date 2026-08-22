import { Outlet } from 'react-router';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import { FeedActionsProvider } from '../context/FeedActionsContext';
import { LayoutChromeProvider } from '../context/LayoutChromeContext';
import FooterLayout from './FooterLayout';

const FeedLayout = () => (
  <FeedActionsProvider>
    <LayoutChromeProvider>
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <DashboardNavbar />
      <div className="flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
        <Outlet />
      </div>
      <div className="hidden xl:block">
        <FooterLayout />
      </div>
      <MobileBottomNav />
    </div>
    </LayoutChromeProvider>
  </FeedActionsProvider>
);

export default FeedLayout;
