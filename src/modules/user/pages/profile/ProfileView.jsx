import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Container from "@/components/ui/Container";
import ProfilePageContent from "@/components/data-display/ProfilePageContent/ProfilePageContent";
import ReportPostModal from "@/modules/user/components/feed/ReportPostModal";
import {
  SubscriptionDetailsCard,
  MyReportsCard,
} from "@/modules/user/components/profile/ProfileSections";
import {
  fetchUserProfile,
  clearProfileError,
  toProfilePageUser,
} from "@/features/user/profile";
import { fetchFeed, toFeedPostModel } from "@/features/user/feed";
import {
  fetchMyReports,
  clearReportsError,
  toMyReportModel,
} from "@/features/user/reports";

const ProfileView = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading,
    error: profileError,
  } = useSelector((state) => state.userProfile);
  const { posts } = useSelector((state) => state.userFeed);
  const {
    reports,
    reportsLoading,
    error: reportsError,
  } = useSelector((state) => state.userReports);
  const [reportPost, setReportPost] = useState(null);

  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const isPremium =
    profileUser?.isActive ||
    profileUser?.membershipStatus === "premium" ||
    profileUser?.membershipStatus === "trial" ||
    profileUser?.membershipStatus === "cancelled";
  const showSubscriptionCard =
    Boolean(profileUser?.subscription) &&
    ["premium", "trial", "cancelled"].includes(profileUser?.membershipStatus);

  const activity = useMemo(
    () => (posts || []).map(toFeedPostModel).filter(Boolean).slice(0, 4),
    [posts],
  );

  const myReports = useMemo(
    () => (reports || []).map(toMyReportModel).filter(Boolean),
    [reports],
  );

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(clearReportsError());
    dispatch(fetchUserProfile());
    dispatch(fetchFeed({ page: 1, pageSize: 5, mine: true, sort: "desc" }));
    dispatch(fetchMyReports({ page: 1, pageSize: 10, sort: "desc" }));
  }, [dispatch]);

  useEffect(() => {
    if (profileError) toast.error(profileError);
  }, [profileError]);

  useEffect(() => {
    if (reportsError) toast.error(reportsError);
  }, [reportsError]);

  if (loading && !profileUser) {
    return (
      <main className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!profileUser) {
    return (
      <main className="py-10 text-center text-[14px] text-[#64748B]">
        Unable to load profile.
      </main>
    );
  }

  return (
    <>
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-6xl">
          <ProfilePageContent
            user={profileUser}
            posts={activity}
            onReport={setReportPost}
            isPremium={isPremium}
            subscriptionSlot={
              showSubscriptionCard ? (
                <SubscriptionDetailsCard
                  subscription={profileUser.subscription}
                />
              ) : null
            }
          />

          <div className="mt-4">
            <MyReportsCard reports={myReports} loading={reportsLoading} />
          </div>

          {!profileUser.isActive && (
            <p className="mt-6 text-center text-[13px] text-[#64748B]">
              Want full access?{" "}
              <Link
                to="/subscription"
                className="font-semibold text-primary hover:underline"
              >
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
