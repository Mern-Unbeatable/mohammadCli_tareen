import AuthLayout from '@/layouts/AuthLayout';
import GuestOnly from '@/shared/auth/GuestOnly';
import LoginView from '@/modules/auth/pages/LoginView';
import RegisterView from '@/modules/auth/pages/RegisterView';
import ForgotPasswordView from '@/modules/auth/pages/ForgotPasswordView';
import ResetPasswordView from '@/modules/auth/pages/ResetPasswordView';

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
      {
        path: '/forgot-password',
        element: <AuthLayout />,
        handle: { title: 'Forgot password' },
        children: [{ index: true, element: <ForgotPasswordView /> }],
      },
      {
        path: '/reset-password',
        element: <AuthLayout />,
        handle: { title: 'Reset password' },
        children: [{ index: true, element: <ResetPasswordView /> }],
      },
    ],
  },
];
