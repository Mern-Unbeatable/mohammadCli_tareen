import RootLayout from '@/layouts/RootLayout';
import HomeView from '@/modules/public/pages/home/HomeView';
import DeveloperPage from '@/modules/public/pages/developer/DeveloperPage';
import NotFound from '@/shared/pages/NotFound';

export const publicRoutes = {
  path: '/',
  element: <RootLayout />,
  children: [
    { index: true, element: <HomeView /> },
    { path: 'developer', element: <DeveloperPage /> },
    { path: 'developer/:componentId', element: <DeveloperPage /> },
    { path: '*', element: <NotFound /> },
  ],
};
