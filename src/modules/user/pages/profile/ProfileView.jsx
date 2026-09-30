import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Container from "@/components/ui/Container";
import { ProfilePageSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
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
import { fetchFeed, removePost, toFeedPostModel } from "@/features/user/feed";
import {
  fetchMyReports,
  clearReportsError,
  toMyReportModel,
} from "@/features/user/reports";

const MY_POSTS_QUERY = { page: 1, pageSize: 5, mine: true, sort: "desc" };

const ProfileView = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading,
    error: profileError,
  } = useSelector((state) => state.userProfile);
  const { posts, postsLoading, deleting } = useSelector(
    (state) => state.userFeed,
  );
  const {
    reports,
    reportsLoading,
    error: reportsError,
  } = useSelector((state) => state.userReports);
  const [reportPost, setReportPost] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

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
    dispatch(fetchFeed(MY_POSTS_QUERY));
    dispatch(fetchMyReports({ page: 1, pageSize: 10, sort: "desc" }));
  }, [dispatch]);

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removePost(pendingDelete.id));
    if (removePost.fulfilled.match(result)) {
      toast.success("Post deleted");
      setPendingDelete(null);
      dispatch(fetchFeed(MY_POSTS_QUERY));
      return;
    }
    toast.error(result.payload || "Failed to delete post");
  };

  useEffect(() => {
    if (profileError) toast.error(profileError);
  }, [profileError]);

  useEffect(() => {
    if (reportsError) toast.error(reportsError);
  }, [reportsError]);

  if (loading && !profileUser) {
    return (
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-7xl">
          <ProfilePageSkeleton showSubscription sidebar />
        </Container>
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
        <Container className="max-w-7xl">
          <ProfilePageContent
            user={profileUser}
            posts={activity}
            postsLoading={postsLoading && activity.length === 0}
            onReport={setReportPost}
            onDelete={deleting ? undefined : setPendingDelete}
            isPremium={isPremium}
            subscriptionSlot={
              showSubscriptionCard ? (
                <SubscriptionDetailsCard
                  subscription={profileUser.subscription}
                />
              ) : null
            }
            sidebarSlot={
              <MyReportsCard reports={myReports} loading={reportsLoading} />
            }
            postsTitle="My Posts"
          />

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

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete post?"
        description="This will permanently remove this post, including its comments and reactions. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ProfileView;
