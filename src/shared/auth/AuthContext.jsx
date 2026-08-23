import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ROLE_HOME_PATH, USER_ROLES } from '@/shared/constants/roles';
import { findAccountByCredentials } from '@/shared/auth/dummyAccounts';
import { clearSession, loadSession, saveSession } from '@/shared/auth/authStorage';

const AuthContext = createContext(null);

const toSessionUser = (account) => ({
  id: account.id,
  email: account.email,
  role: account.role,
  name: account.name,
  title: account.title,
  initials: account.initials,
  avatar: account.avatar,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const session = loadSession();
    return session?.user ?? null;
  });

  const login = useCallback(({ email, password, remember = true }) => {
    const account = findAccountByCredentials(email, password);
    if (!account) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const nextUser = toSessionUser(account);
    setUser(nextUser);

    if (remember) {
      saveSession({ user: nextUser });
    } else {
      clearSession();
    }

    return { ok: true, role: nextUser.role, redirectTo: ROLE_HOME_PATH[nextUser.role] };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      login,
      logout,
      homePath: user ? ROLE_HOME_PATH[user.role] : '/login',
      isUser: user?.role === USER_ROLES.USER,
      isAdmin: user?.role === USER_ROLES.ADMIN,
      isSupplier: user?.role === USER_ROLES.SUPPLIER,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
