import { createBrowserRouter } from 'react-router';
import { publicRoutes } from './public.routes';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { adminRoutes } from './admin.routes';
import { supplierRoutes } from './supplier.routes';

export const router = createBrowserRouter([
  publicRoutes,
  ...authRoutes,
  userRoutes,
  adminRoutes,
  supplierRoutes,
]);
