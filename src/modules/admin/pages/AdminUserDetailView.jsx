import { Link, Navigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import ProfilePageContent from '@/components/data-display/ProfilePageContent/ProfilePageContent';
import ProfileHero, {
  ContactInfoCard,
  ProfessionalInfoCard,
} from '@/components/data-display/ProfileHero/ProfileHero';
import ActivitySection from '@/components/data-display/ActivitySection/ActivitySection';
import { SubscriptionDetailsCard } from '@/modules/user/components/profile/ProfileSections';
import {
  getAdminMemberPosts,
  getAdminMemberProfile,
} from '@/modules/admin/data/users';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';

const AdminUserDetailView = () => {
  const { userId } = useParams();
  const profile = getAdminMemberProfile(userId);
  const posts = profile ? getAdminMemberPosts(profile) : [];

  if (!profile) {
    return <Navigate to="/admin/users" replace />;
  }

  const isSupplier = profile.kind === 'supplier';

  return (
    <PanelPage>
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] transition-colors hover:text-primary"
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
          isPremium
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
