import ProfileHero, {
  ContactInfoCard,
  ProfessionalInfoCard,
} from '@/components/data-display/ProfileHero/ProfileHero';
import ActivitySection from '@/components/data-display/ActivitySection/ActivitySection';
import { currentUser } from '@/modules/user/data/dashboard';

/**
 * Composed own-profile page content: hero, info cards, and activity feed.
 */
const ProfilePageContent = ({
  user = currentUser,
  posts = [],
  onReport,
  isPremium = user.membershipStatus === 'premium',
  editHref = '/profile/edit',
  showEdit = true,
  showMessage = false,
  messageHref = '/messages',
  subscriptionSlot = null,
}) => (
  <div className="space-y-4">
    <ProfileHero
      user={user}
      editHref={editHref}
      showEdit={showEdit}
      showMessage={showMessage}
      messageHref={messageHref}
    />

    {isPremium ? (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {subscriptionSlot}
        <ContactInfoCard user={user} showProfessional />
      </div>
    ) : (
      <>
        <ProfessionalInfoCard user={user} extended />
        <ContactInfoCard user={user} />
      </>
    )}

    <ActivitySection posts={posts} onReport={onReport} emptyName={user.firstName || user.name} />
  </div>
);

export default ProfilePageContent;
