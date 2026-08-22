import { Outlet } from 'react-router';
import NavbarLayout from '@/modules/public/layout/NavbarLayout';
import AppFooter from '@/shared/layout/FooterLayout';

const RootLayout = () => (
  <>
    <header>
      <NavbarLayout />
    </header>
    <main>
      <Outlet />
    </main>
    <footer>
      <AppFooter />
    </footer>
  </>
);

export default RootLayout;
