import { useMemo, useState } from 'react';
import Container from '../../components/ui/Container';
import LeftSidebar from '../../components/dashboard/LeftSidebar';
import RightSidebar from '../../components/dashboard/RightSidebar';
import FeedPost from '../../components/dashboard/FeedPost';
import CreatePostModal from '../../components/dashboard/CreatePostModal';
import ReportPostModal from '../../components/dashboard/ReportPostModal';
import { FeedComposer, FeedFilters } from '../../components/dashboard/FeedShared';
import { feedFilters, feedPosts } from '../../data/dashboard';

const FeedView = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [reportPost, setReportPost] = useState(null);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return feedPosts;
    return feedPosts.filter((post) => post.filter === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <main className="py-5">
        <Container className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
          <LeftSidebar />

          <section className="min-w-0 space-y-4">
            <FeedComposer onCreatePost={() => setCreateOpen(true)} />
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
