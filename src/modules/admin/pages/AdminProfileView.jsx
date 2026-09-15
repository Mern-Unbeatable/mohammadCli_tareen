import { useState } from 'react';
import AdminAccountForm from '@/components/forms/AdminAccountForm/AdminAccountForm';
import {
  DEMO_ADMIN_PASSWORD,
  DEMO_ADMIN_PROFILE,
} from '@/data/demoData';

const AdminProfileView = () => {
  const [profile, setProfile] = useState(DEMO_ADMIN_PROFILE);
  const [passwords, setPasswords] = useState(DEMO_ADMIN_PASSWORD);

  return (
    <AdminAccountForm
      profileValues={profile}
      passwordValues={passwords}
      onProfileChange={(key, value) => setProfile((prev) => ({ ...prev, [key]: value }))}
      onPasswordChange={(key, value) => setPasswords((prev) => ({ ...prev, [key]: value }))}
      onUpdateProfile={(e) => e.preventDefault()}
      onChangePassword={(e) => e.preventDefault()}
    />
  );
};

export default AdminProfileView;
