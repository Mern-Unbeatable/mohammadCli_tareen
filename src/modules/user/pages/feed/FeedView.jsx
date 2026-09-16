import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Container from "@/components/ui/Container";
import LeftSidebar from "@/modules/user/components/shell/LeftSidebar";
import RightSidebar from "@/modules/user/components/shell/RightSidebar";
import FeedPost from "@/modules/user/components/feed/FeedPost";
import CreatePostModal from "@/modules/user/components/feed/CreatePostModal";
import ReportPostModal from "@/modules/user/components/feed/ReportPostModal";
import {
  FeedComposer,
  FeedFilters,
} from "@/modules/user/components/feed/FeedShared";
import { useFeedActions } from "@/modules/user/context/FeedActionsContext";
import {
  fetchFeed,
  createPost,
  clearFeedError,
  toFeedPostModel,
} from "@/features/user/feed";
import { fetchUserProfile, toProfilePageUser } from "@/features/user/profile";

const feedFilters = [
  { id: "all", label: "All" },
  { id: "questions", label: "Questions" },
  { id: "information", label: "Information" },
  { id: "suppliers", label: "Suppliers" },
];

const filterToApiType = {
  questions: "question",
  information: "information",
  suppliers: "suppliers",
};

const FeedView = () => {
  const dispatch = useDispatch();
  const { registerOpenCreatePost } = useFeedActions();
  const { posts, postsLoading, saving, error } = useSelector(
    (state) => state.userFeed,
  );
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [reportPost, setReportPost] = useState(null);

  useEffect(() => {
    registerOpenCreatePost(() => setCreateOpen(true));
  }, [registerOpenCreatePost]);

  useEffect(() => {
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(clearFeedError());
    const params = { page: 1, pageSize: 20, sort: "desc" };
    const type = filterToApiType[activeFilter];
    if (type) params.type = type;
    dispatch(fetchFeed(params));
  }, [dispatch, activeFilter]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const mappedPosts = useMemo(
    () => (posts || []).map(toFeedPostModel).filter(Boolean),
    [posts],
  );

  const handlePublish = async ({ type, content }) => {
    const apiType =
      type === "question"
        ? "QUESTION"
        : type === "suppliers"
          ? "SUPPLIERS"
          : "INFORMATION";

    const result = await dispatch(
      createPost({ type: apiType, content: content.trim() }),
    );
    if (createPost.fulfilled.match(result)) {
      toast.success("Post published");
      setCreateOpen(false);
      dispatch(
        fetchFeed({
          page: 1,
          pageSize: 20,
          sort: "desc",
          ...(filterToApiType[activeFilter]
            ? { type: filterToApiType[activeFilter] }
            : {}),
        }),
      );
    }
  };

  return (
    <>
      <main className="py-4 sm:py-5">
        <Container className="flex gap-6">
          <LeftSidebar />

          <section className="mx-auto min-w-0 w-full max-w-[620px] flex-1 space-y-4">
            <div className="hidden sm:block">
              <FeedComposer
                user={profileUser}
                onCreatePost={() => setCreateOpen(true)}
              />
            </div>
            <FeedFilters
              filters={feedFilters}
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />

            {postsLoading && mappedPosts.length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : mappedPosts.length === 0 ? (
              <p className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-10 text-center text-[14px] text-[#64748B]">
                No posts yet. Be the first to share something with the community.
              </p>
            ) : (
              <div className="space-y-4">
                {mappedPosts.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    onReport={setReportPost}
                  />
                ))}
              </div>
            )}
          </section>

          <RightSidebar />
        </Container>
      </main>

      <CreatePostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        user={profileUser}
        submitting={saving}
        onPublish={handlePublish}
      />
      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default FeedView;
