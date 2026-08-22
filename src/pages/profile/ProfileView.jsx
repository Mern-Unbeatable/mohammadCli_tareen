import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import Container from '../../components/ui/Container';
import FeedPost from '../../components/dashboard/FeedPost';
import ReportPostModal from '../../components/dashboard/ReportPostModal';
import {
  ContactInfoCard,
  ProfessionalInfoCard,
  ProfileHero,
  SubscriptionDetailsCard,
} from '../../components/profile/ProfileSections';
import { currentUser, feedPosts } from '../../data/dashboard';

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
          <div className="space-y-4">
            <ProfileHero />

            {isPremium ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
                <SubscriptionDetailsCard />
                <ContactInfoCard showProfessional />
              </div>
            ) : (
              <>
                <ProfessionalInfoCard extended />
                <ContactInfoCard />
              </>
            )}

            <section>
              <h2 className="mb-4 px-1 text-[18px] font-bold text-deep-blue">Activity</h2>
              <div className="space-y-4">
                {activity.map((post) => (
                  <FeedPost key={post.id} post={post} onReport={setReportPost} />
                ))}
              </div>
            </section>

            {!isPremium && (
              <p className="text-center text-[13px] text-[#64748B]">
                Want full access?{' '}
                <Link to="/subscription" className="font-semibold text-primary hover:underline">
                  View membership plans
                </Link>
              </p>
            )}
          </div>
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
