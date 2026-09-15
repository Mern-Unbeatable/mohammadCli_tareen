import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth';
import { adminReducer } from '../features/admin';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
