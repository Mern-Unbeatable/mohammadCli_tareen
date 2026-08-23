import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { getDemoAccountsByRole } from '@/shared/auth/dummyAccounts';
import { useAuth } from '@/shared/auth/AuthContext';
import { USER_ROLES } from '@/shared/constants/roles';

const labelClass = 'mb-1.5 block text-base font-medium text-deep-blue';
const inputClass =
  'w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[15px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15';

const ROLE_LABELS = {
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.SUPPLIER]: 'Supplier',
};

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, homePath } = useAuth();
  const demoAccounts = getDemoAccountsByRole();

  const [email, setEmail] = useState('elise.moreau@novalab.eu');
  const [password, setPassword] = useState('password123');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    navigate(location.state?.from || homePath, { replace: true });
  }, [isAuthenticated, homePath, location.state?.from, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login({ email, password, remember: keepSignedIn });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(location.state?.from || result.redirectTo, { replace: true });
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Welcome back
          </h1>
          <p className="mt-1 text-base text-[#64748B]">
            Sign in to continue to your professional network.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-pink-secondary px-3 py-2 text-[13px] font-medium text-pink-light">
                {error}
              </p>
            ) : null}

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary/20"
                />
                <span className="text-[14px] text-[#475467]">Keep me signed in</span>
              </label>
              <Link to="#" className="text-[14px] font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 border-t border-[#E4E7EC] pt-5">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
              Demo accounts
            </p>
            <div className="space-y-2">
              {Object.values(demoAccounts).map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="flex w-full items-center justify-between rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-secondary/40"
                >
                  <span>
                    <span className="block text-[13px] font-semibold text-deep-blue">
                      {ROLE_LABELS[account.role]}
                    </span>
                    <span className="text-[12px] text-[#64748B]">{account.email}</span>
                  </span>
                  <span className="text-[11px] font-medium text-primary">Use</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-[#98A2B3]">Password for all demo accounts: password123</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginView;
