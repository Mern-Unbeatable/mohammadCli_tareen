import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/shared/auth/AuthContext';

const labelClass = 'mb-1.5 block text-base font-medium text-deep-blue';
const inputClass =
  'w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[15px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-gray-100';

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, homePath } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    navigate(location.state?.from || homePath, { replace: true });
  }, [isAuthenticated, homePath, location.state?.from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login({
      email,
      password,
      remember: keepSignedIn,
    });

    if (!result.ok) {
      const errorMsg = result.error || 'Invalid email or password';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    toast.success('Login successful!');
    navigate(location.state?.from || result.redirectTo || homePath, { replace: true });
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
                placeholder="name@example.com"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#64748B]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>


            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  disabled={loading}
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
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginView;
