import { useEffect, useMemo, useState } from 'react';
import Container from '../../components/ui/Container';
import LeftSidebar from '../../components/dashboard/LeftSidebar';
import RightSidebar from '../../components/dashboard/RightSidebar';
import FeedPost from '../../components/dashboard/FeedPost';
import CreatePostModal from '../../components/dashboard/CreatePostModal';
import ReportPostModal from '../../components/dashboard/ReportPostModal';
import { FeedComposer, FeedFilters } from '../../components/dashboard/FeedShared';
import { feedFilters, feedPosts } from '../../data/dashboard';
import { useFeedActions } from '../../context/FeedActionsContext';

const FeedView = () => {
  const { registerOpenCreatePost } = useFeedActions();
  const [activeFilter, setActiveFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [reportPost, setReportPost] = useState(null);

  useEffect(() => {
    registerOpenCreatePost(() => setCreateOpen(true));
  }, [registerOpenCreatePost]);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return feedPosts;
    return feedPosts.filter((post) => post.filter === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <main className="py-4 sm:py-5">
        <Container className="flex gap-6">
          <LeftSidebar />

          <section className="mx-auto min-w-0 w-full max-w-[620px] flex-1 space-y-4">
            <div className="hidden sm:block">
              <FeedComposer onCreatePost={() => setCreateOpen(true)} />
            </div>
            <FeedFilters
              filters={feedFilters}
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <FeedPost key={post.id} post={post} onReport={setReportPost} />
              ))}
            </div>
          </section>

          <RightSidebar />
        </Container>
      </main>

      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default FeedView;
