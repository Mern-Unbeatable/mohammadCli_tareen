import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import AdminAccountForm from "@/components/forms/AdminAccountForm/AdminAccountForm";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import {
  fetchAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  clearProfileError,
  setProfileField,
} from "@/features/admin/profile";

const emptyPasswords = { current: "", next: "", confirm: "" };

const AdminProfileView = () => {
  const dispatch = useDispatch();
  const { form, loading, savingProfile, savingPassword, error, saveError } =
    useSelector((state) => state.adminProfile);
  const [passwords, setPasswords] = useState(emptyPasswords);

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (saveError) toast.error(saveError);
  }, [saveError]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const trimmed = form.name.trim();
    if (!trimmed) {
      toast.error("Name is required");
      return;
    }
    const result = await dispatch(updateAdminProfile(trimmed));
    if (updateAdminProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error("Fill in all password fields");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    const result = await dispatch(
      changeAdminPassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmPassword: passwords.confirm,
      }),
    );
    if (changeAdminPassword.fulfilled.match(result)) {
      setPasswords(emptyPasswords);
      toast.success("Password updated");
    }
  };

  if (loading) {
    return (
      <PanelPage>
        <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
          <span className="text-[14px] font-medium text-[#64748B]">
            Loading profile…
          </span>
        </div>
      </PanelPage>
    );
  }

  return (
    <AdminAccountForm
      profileValues={form}
      passwordValues={passwords}
      onProfileChange={(key, value) =>
        dispatch(setProfileField({ key, value }))
      }
      onPasswordChange={(key, value) =>
        setPasswords((prev) => ({ ...prev, [key]: value }))
      }
      onUpdateProfile={
        savingProfile ? (e) => e.preventDefault() : handleUpdateProfile
      }
      onChangePassword={
        savingPassword ? (e) => e.preventDefault() : handleChangePassword
      }
    />
  );
};

export default AdminProfileView;
