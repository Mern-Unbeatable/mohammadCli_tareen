import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/shared/auth/useAuth';
import { PasswordField, PasswordStrength } from '@/modules/auth/components/AuthFormFields';
import { isStrongPassword } from '@/modules/auth/utils/passwordRules';

const InvalidLinkNotice = ({ message }) => (
  <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-left">
    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
    <div className="text-[14px] leading-[1.6] text-red-700">
      <p>{message}</p>
      <Link to="/forgot-password" className="mt-1 inline-block font-semibold hover:underline">
        Request a new reset link
      </Link>
    </div>
  </div>
);

const ResetPasswordView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() || '';
  const { resetPassword, loading } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isStrongPassword(password)) {
      toast.error('Password must have 8+ characters with an uppercase letter, a number and a symbol.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const result = await resetPassword({ token, password, confirmPassword });

    if (!result.ok) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success(result.message || 'Password reset successfully');
    navigate('/login', { replace: true });
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-deep-blue sm:text-[36px]">
            Set a new password
          </h1>
          <p className="mt-1 text-base text-[#64748B]">
            Choose a strong password you haven&apos;t used before.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 sm:p-8">
          {!token ? (
            <div className="space-y-5">
              <InvalidLinkNotice message="This password reset link is invalid or incomplete." />
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#475467] hover:text-deep-blue"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <InvalidLinkNotice message={error} />}

              <PasswordField
                id="password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                visible={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                autoComplete="new-password"
                disabled={loading}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
                autoComplete="new-password"
                disabled={loading}
              />

              <PasswordStrength password={password} />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#475467] hover:text-deep-blue"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordView;
