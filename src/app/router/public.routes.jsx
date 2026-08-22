import RootLayout from '@/layouts/RootLayout';
import HomeView from '@/modules/public/pages/home/HomeView';
import NotFound from '@/shared/pages/NotFound';

export const publicRoutes = {
  path: '/',
  element: <RootLayout />,
  children: [
    { index: true, element: <HomeView /> },
    { path: '*', element: <NotFound /> },
  ],
};
