import { useState } from 'react';
import ProfileSetupForm from '@/components/forms/ProfileSetupForm/ProfileSetupForm';
import { DEMO_PROFILE_FORM } from '@/data/demoData';
import { profileCountries } from '@/modules/user/data/subscription';

const SupplierProfileView = () => {
  const [form, setForm] = useState(DEMO_PROFILE_FORM);

  return (
    <ProfileSetupForm
      values={form}
      onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))}
      onSubmit={(e) => e.preventDefault()}
      countries={profileCountries}
      title="My Profile"
      subtitle="Update your supplier profile visible to laboratories and buyers."
      submitLabel="Save Profile"
    />
  );
};

export default SupplierProfileView;
