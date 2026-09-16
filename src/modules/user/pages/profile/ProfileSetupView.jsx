import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import ProfileSetupForm from '@/components/forms/ProfileSetupForm/ProfileSetupForm';
import { profileCountries } from '@/modules/user/data/subscription';
import {
  fetchUserProfile,
  updateUserProfile,
  clearProfileError,
  setProfileField,
} from '@/features/user/profile';

const ProfileSetupView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { form, loading, saving, error, saveError } = useSelector(
    (state) => state.userProfile,
  );

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (saveError) toast.error(saveError);
  }, [saveError]);

  const countries = useMemo(() => {
    if (form.country && !profileCountries.includes(form.country)) {
      return [form.country, ...profileCountries];
    }
    return profileCountries;
  }, [form.country]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!form.firstName?.trim() || !form.lastName?.trim()) {
      toast.error('First and last name are required');
      return;
    }

    const result = await dispatch(updateUserProfile(form));
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success('Profile updated');
      navigate('/profile');
      return;
    }
    toast.error(result.payload || 'Failed to update profile');
  };

  if (loading) {
    return (
      <main className="py-6 sm:py-10">
        <Container className="max-w-[760px]">
          <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <span className="text-[14px] font-medium text-[#64748B]">
              Loading profile…
            </span>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-6 sm:py-10">
      <Container className="max-w-[760px]">
        <ProfileSetupForm
          values={form}
          onChange={(key, value) => dispatch(setProfileField({ key, value }))}
          onSubmit={handleSubmit}
          countries={countries}
          submitLabel={saving ? 'Saving…' : undefined}
        />
      </Container>
    </main>
  );
};

export default ProfileSetupView;
