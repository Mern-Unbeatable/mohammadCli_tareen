import RootLayout from '@/layouts/RootLayout';
import HomeView from '@/modules/public/pages/home/HomeView';
import DeveloperPage from '@/modules/public/pages/developer/DeveloperPage';
import NotFound from '@/shared/pages/NotFound';

export const publicRoutes = {
  path: '/',
  element: <RootLayout />,
  handle: { audience: 'public' },
  children: [
    { index: true, element: <HomeView />, handle: { title: 'Home' } },
    { path: 'developer', element: <DeveloperPage />, handle: { title: 'Developer' } },
    {
      path: 'developer/:componentId',
      element: <DeveloperPage />,
      handle: { title: 'Developer' },
    },
    { path: '*', element: <NotFound />, handle: { title: 'Not found' } },
  ],
};
