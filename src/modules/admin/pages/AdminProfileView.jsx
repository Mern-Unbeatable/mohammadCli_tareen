import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminAccountForm from '@/components/forms/AdminAccountForm/AdminAccountForm';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import { authApi, crudService, API_ENDPOINTS, unwrapApiData, getApiErrorMessage } from '@/api';

const emptyPasswords = { current: '', next: '', confirm: '' };

const mapUserToForm = (user) => {
  const profile = user?.profile || {};
  const name =
    profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
    user?.email ||
    '';
  return {
    name,
    email: user?.email || '',
    displayName: name || 'Admin',
    displayEmail: user?.email || '',
  };
};

const AdminProfileView = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    displayName: '',
    displayEmail: '',
  });
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const user = await authApi.me();
        if (!cancelled) setProfile(mapUserToForm(user));
      } catch (err) {
        if (!cancelled) {
          toast.error(getApiErrorMessage(err, 'Failed to load profile'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const trimmed = profile.name.trim();
    if (!trimmed) {
      toast.error('Name is required');
      return;
    }
    const [firstName, ...rest] = trimmed.split(/\s+/);
    const lastName = rest.join(' ') || firstName;

    try {
      setSavingProfile(true);
      const response = await crudService.patch(API_ENDPOINTS.ADMIN.PROFILE.UPDATE, {
        firstName,
        lastName,
      });
      const user = unwrapApiData(response) || response;
      setProfile(mapUserToForm(user));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update profile'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error('Fill in all password fields');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      await authApi.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmPassword: passwords.confirm,
      });
      setPasswords(emptyPasswords);
      toast.success('Password updated');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to change password'));
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <PanelPage>
        <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
          <span className="text-[14px] font-medium text-[#64748B]">Loading profile…</span>
        </div>
      </PanelPage>
    );
  }

  return (
    <AdminAccountForm
      profileValues={profile}
      passwordValues={passwords}
      onProfileChange={(key, value) => setProfile((prev) => ({ ...prev, [key]: value }))}
      onPasswordChange={(key, value) => setPasswords((prev) => ({ ...prev, [key]: value }))}
      onUpdateProfile={savingProfile ? (e) => e.preventDefault() : handleUpdateProfile}
      onChangePassword={savingPassword ? (e) => e.preventDefault() : handleChangePassword}
    />
  );
};

export default AdminProfileView;
