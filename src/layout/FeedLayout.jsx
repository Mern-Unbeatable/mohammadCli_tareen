import { Outlet } from 'react-router';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import { navItems } from '../data/dashboard';
import FooterLayout from './FooterLayout';

const FeedLayout = () => (
  <div className="min-h-screen bg-[#F3F4F6]">
    <DashboardNavbar navItems={navItems} />
    <Outlet />
    <FooterLayout/>
  </div>
);

export default FeedLayout;
