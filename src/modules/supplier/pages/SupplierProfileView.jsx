import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileSetupForm from "@/components/forms/ProfileSetupForm/ProfileSetupForm";
import { ProfileSetupFormSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import { profileCountries } from "@/modules/user/data/subscription";
import {
  fetchSupplierProfile,
  updateSupplierProfile,
  clearProfileError,
  setProfileField,
} from "@/features/supplier/profile";

const SupplierProfileView = () => {
  const dispatch = useDispatch();
  const { form, loading, saving, error, saveError } = useSelector(
    (state) => state.supplierProfile,
  );

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(fetchSupplierProfile());
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
      toast.error("First and last name are required");
      return;
    }

    const result = await dispatch(updateSupplierProfile(form));
    if (updateSupplierProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    }
  };

  if (loading) {
    return (
      <PanelPage width="narrow">
        <ProfileSetupFormSkeleton />
      </PanelPage>
    );
  }

  return (
    <PanelPage width="narrow">
      <ProfileSetupForm
        values={form}
        onChange={(key, value) => dispatch(setProfileField({ key, value }))}
        onSubmit={handleSubmit}
        countries={countries}
        title="My Profile"
        subtitle="Update your supplier profile visible to laboratories and buyers."
        submitLabel={saving ? "Saving…" : "Save Profile"}
      />
    </PanelPage>
  );
};

export default SupplierProfileView;
