import { useEffect, useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import LeftSidebar from '@/modules/user/components/shell/LeftSidebar';
import RightSidebar from '@/modules/user/components/shell/RightSidebar';
import FeedPost from '@/modules/user/components/feed/FeedPost';
import CreatePostModal from '@/modules/user/components/feed/CreatePostModal';
import ReportPostModal from '@/modules/user/components/feed/ReportPostModal';
import { FeedComposer, FeedFilters } from '@/modules/user/components/feed/FeedShared';
import { feedFilters, feedPosts } from '@/modules/user/data/dashboard';
import { useFeedActions } from '@/modules/user/context/FeedActionsContext';

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
