import { createBrowserRouter } from 'react-router';
import RootLayout from '../layout/RootLayout';
import AuthLayout from '../layout/AuthLayout';
import HomeView from '../pages/public/public_Home/HomeView';
import LoginView from '../pages/auth/LoginView';
import RegisterView from '../pages/auth/RegisterView';
import NotFound from '../pages/error/NotFound';
import FeedLayout from '../layout/FeedLayout';
import FeedView from '../pages/feed/FeedView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginView />,
      },
    ],
  },
  {
    path: '/join',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <RegisterView />,
      },
    ],
  },
  {
    path: '/feed',
    element: <FeedLayout />,
    children: [
      {
        index: true,
        element: <FeedView />,
      },
    ],
  },
]);
