import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProfilePageContent from '@/components/data-display/ProfilePageContent/ProfilePageContent';
import ProfileHero, {
  ContactInfoCard,
  ProfessionalInfoCard,
} from '@/components/data-display/ProfileHero/ProfileHero';
import ActivitySection from '@/components/data-display/ActivitySection/ActivitySection';
import { SubscriptionDetailsCard } from '@/modules/user/components/profile/ProfileSections';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import { fetchUserDetails, clearSelectedUser } from '@/features/admin/adminSlice';
import { getAdminMemberPosts } from '@/modules/admin/data/users';

const AdminUserDetailView = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { selectedUser, selectedUserLoading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, userId]);

  // Format backend API response into component-ready user profile object
  const profile = useMemo(() => {
    if (!selectedUser) return null;

    const profileObj = selectedUser.profile || {};
    const subObj = selectedUser.subscription || {};

    const fullName =
      profileObj.name ||
      [profileObj.firstName, profileObj.lastName].filter(Boolean).join(' ') ||
      selectedUser.email;

    const initials =
      profileObj.initials ||
      (profileObj.firstName && profileObj.lastName
        ? `${profileObj.firstName[0]}${profileObj.lastName[0]}`
        : 'U');

    const kind =
      selectedUser.role === 'SUPPLIER' || selectedUser.profileType === 'SUPPLIER'
        ? 'supplier'
        : 'user';

    return {
      id: selectedUser.id,
      kind,
      name: fullName,
      title: profileObj.title || (kind === 'supplier' ? 'Supplier' : 'Lab Manager'),
      company: profileObj.company || 'N/A',
      country: profileObj.country || 'N/A',
      location: profileObj.location || profileObj.country || 'N/A',
      email: selectedUser.email,
      phone: profileObj.phone || 'N/A',
      about: profileObj.about || 'No professional summary available.',
      aboutExtended: profileObj.aboutExtended || null,
      initials,
      avatar: profileObj.avatar || null,
      coverPhoto: profileObj.coverPhoto || null,
      connections: profileObj.connections || 0,
      membershipStatus: subObj.plan?.toLowerCase() === 'free' ? 'free' : 'premium',
      subscription: {
        plan: subObj.plan || 'Free',
        status: subObj.status || 'Active',
        amount: subObj.amount ? `€${subObj.amount}` : 'Free',
        billingCycle: subObj.billingCycle || 'N/A',
        startDate: subObj.startDate
          ? new Date(subObj.startDate).toLocaleDateString()
          : 'N/A',
        renewalDate: subObj.renewalDate
          ? new Date(subObj.renewalDate).toLocaleDateString()
          : 'N/A',
        trialDaysLeft: subObj.trialDaysLeft ?? 90,
      },
    };
  }, [selectedUser]);

  const posts = profile ? getAdminMemberPosts(profile) : [];

  if (selectedUserLoading) {
    return (
      <PanelPage>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] transition-colors hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back
        </Link>
        <div className="flex h-64 items-center justify-center rounded-xl bg-white p-6 shadow-sm">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
          <span className="text-[15px] font-medium text-[#64748B]">
            Loading user profile...
          </span>
        </div>
      </PanelPage>
    );
  }

  if (error || !profile) {
    return (
      <PanelPage>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] transition-colors hover:text-primary mb-4"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to Users
        </Link>
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-[16px] font-semibold text-deep-blue">
            {error || 'User details not found'}
          </p>
        </div>
      </PanelPage>
    );
  }

  const isSupplier = profile.kind === 'supplier';

  return (
    <PanelPage>
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] transition-colors hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back
      </Link>

      {isSupplier ? (
        <>
          <ProfileHero
            user={profile}
            showMessage
            messageHref="/admin/chat"
            showEdit={false}
          />
          <ProfessionalInfoCard user={profile} extended />
          <ContactInfoCard user={profile} />
          <ActivitySection posts={posts} emptyName={profile.name.split(' ')[0]} />
        </>
      ) : (
        <ProfilePageContent
          user={profile}
          posts={posts}
          isPremium={profile.membershipStatus === 'premium'}
          showEdit={false}
          showMessage
          messageHref="/admin/chat"
          subscriptionSlot={<SubscriptionDetailsCard subscription={profile.subscription} />}
        />
      )}
    </PanelPage>
  );
};

export default AdminUserDetailView;
