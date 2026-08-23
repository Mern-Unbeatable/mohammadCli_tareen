import { useState } from 'react';
import { useNavigate } from 'react-router';
import Container from '@/components/ui/Container';
import ProfileSetupForm from '@/components/forms/ProfileSetupForm/ProfileSetupForm';
import { currentUser } from '@/modules/user/data/dashboard';
import { profileCountries } from '@/modules/user/data/subscription';

const ProfileSetupView = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    title: currentUser.title,
    company: currentUser.company,
    country: currentUser.country,
    email: currentUser.email,
    phone: currentUser.phone,
    about: `${currentUser.about} ${currentUser.aboutExtended || ''}`.trim(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  return (
    <main className="py-6 sm:py-10">
      <Container className="max-w-[760px]">
        <ProfileSetupForm
          values={form}
          onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))}
          onSubmit={handleSubmit}
          countries={profileCountries}
        />
      </Container>
    </main>
  );
};

export default ProfileSetupView;
