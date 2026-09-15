import AuthLayout from '@/layouts/AuthLayout';
import GuestOnly from '@/shared/auth/GuestOnly';
import LoginView from '@/modules/auth/pages/LoginView';
import RegisterView from '@/modules/auth/pages/RegisterView';

export const authRoutes = [
  {
    element: <GuestOnly />,
    handle: { guestOnly: true },
    children: [
      {
        path: '/login',
        element: <AuthLayout />,
        handle: { title: 'Sign in' },
        children: [{ index: true, element: <LoginView /> }],
      },
      {
        path: '/join',
        element: <AuthLayout />,
        handle: { title: 'Create account' },
        children: [{ index: true, element: <RegisterView /> }],
      },
    ],
  },
];
