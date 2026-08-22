import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const labelClass = 'mb-1.5 block text-base font-medium text-deep-blue';
const inputClass =
  'w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-[15px] text-deep-blue outline-none transition-colors placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/15';

const LoginView = () => {
  const navigate = useNavigate();
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/feed');
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Welcome back
          </h1>
          <p className="mt-1 text-base text-[#64748B]">
            Sign in to continue to your professional network.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6  sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                defaultValue="elise.moreau@novalab.eu"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                defaultValue="password123"
                className={inputClass}
              />
            </div>

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
        </div>
      </div>
    </section>
  );
};

export default LoginView;
