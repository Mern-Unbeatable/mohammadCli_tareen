import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { panelPrimaryBtn } from '@/shared/layout/PanelLayout/panelPageTheme';

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';

const labelClass = 'mb-1.5 block text-[13px] font-semibold text-deep-blue';

const PasswordField = ({ id, label, value, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`${fieldClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-deep-blue"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

const AdminAccountForm = ({
  profileValues,
  passwordValues,
  onProfileChange,
  onPasswordChange,
  onUpdateProfile,
  onChangePassword,
  title = 'My Profile',
  subtitle = 'Manage your account and store preferences.',
}) => (
  <PanelPage>
    <PanelPageHeader title={title} subtitle={subtitle} />

    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-4 border-b border-[#E4E7EC] pb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E4E7EC] text-[#98A2B3]">
          <span className="text-2xl">👤</span>
        </div>
        <div>
          <p className="text-[16px] font-bold text-deep-blue">{profileValues.displayName}</p>
          <p className="text-[13px] text-[#64748B]">{profileValues.displayEmail}</p>
        </div>
      </div>

      <section className="mt-5">
        <h2 className="text-[16px] font-bold text-deep-blue">Account Information</h2>
        <form
          onSubmit={onUpdateProfile}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <label htmlFor="admin-name" className={labelClass}>
              Name
            </label>
            <input
              id="admin-name"
              type="text"
              value={profileValues.name}
              onChange={(e) => onProfileChange('name', e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="admin-email" className={labelClass}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={profileValues.email}
              onChange={(e) => onProfileChange('email', e.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className={panelPrimaryBtn}>
              Update Profile
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 border-t border-[#E4E7EC] pt-5">
        <h2 className="text-[16px] font-bold text-deep-blue">Change Password</h2>
        <form
          onSubmit={onChangePassword}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <PasswordField
            id="current-password"
            label="Current Password"
            value={passwordValues.current}
            onChange={(e) => onPasswordChange('current', e.target.value)}
          />
          <PasswordField
            id="new-password"
            label="New Password"
            value={passwordValues.next}
            onChange={(e) => onPasswordChange('next', e.target.value)}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={passwordValues.confirm}
            onChange={(e) => onPasswordChange('confirm', e.target.value)}
          />
          <div className="sm:col-span-3 flex justify-end">
            <button type="submit" className={panelPrimaryBtn}>
              Change Password
            </button>
          </div>
        </form>
      </section>
    </Card>
  </PanelPage>
);

export default AdminAccountForm;
