import { Outlet } from 'react-router';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import { navItems } from '../data/dashboard';
import FooterLayout from './FooterLayout';

const FeedLayout = () => (
  <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
    <DashboardNavbar navItems={navItems} />
    <div className="flex-1">
      <Outlet />
    </div>
    <FooterLayout />
  </div>
);

export default FeedLayout;
