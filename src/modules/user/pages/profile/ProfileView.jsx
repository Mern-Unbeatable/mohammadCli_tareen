import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import Container from '@/components/ui/Container';
import ProfilePageContent from '@/components/data-display/ProfilePageContent/ProfilePageContent';
import ReportPostModal from '@/modules/user/components/feed/ReportPostModal';
import { SubscriptionDetailsCard } from '@/modules/user/components/profile/ProfileSections';
import { currentUser, feedPosts } from '@/modules/user/data/dashboard';

const ProfileView = () => {
  const [reportPost, setReportPost] = useState(null);
  const isPremium = currentUser.membershipStatus === 'premium';

  const activity = useMemo(
    () => feedPosts.filter((post) => post.author.name !== currentUser.name).slice(0, 2),
    []
  );

  return (
    <>
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-[760px]">
          <ProfilePageContent
            user={currentUser}
            posts={activity}
            onReport={setReportPost}
            isPremium={isPremium}
            subscriptionSlot={isPremium ? <SubscriptionDetailsCard /> : null}
          />

          {!isPremium && (
            <p className="mt-6 text-center text-[13px] text-[#64748B]">
              Want full access?{' '}
              <Link to="/subscription" className="font-semibold text-primary hover:underline">
                View membership plans
              </Link>
            </p>
          )}
        </Container>
      </main>

      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default ProfileView;
