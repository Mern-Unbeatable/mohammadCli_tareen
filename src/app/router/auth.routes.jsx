import AuthLayout from '@/layouts/AuthLayout';
import LoginView from '@/modules/auth/pages/LoginView';
import RegisterView from '@/modules/auth/pages/RegisterView';

export const authRoutes = [
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginView /> }],
  },
  {
    path: '/join',
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterView /> }],
  },
];
