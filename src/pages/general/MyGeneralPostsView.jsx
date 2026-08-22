import { useMemo, useState } from 'react';
import Container from '../../components/ui/Container';
import GeneralPostCard from '../../components/general/GeneralPostCard';
import GeneralToolbar from '../../components/general/GeneralToolbar';
import CreateGeneralPostModal from '../../components/general/CreateGeneralPostModal';
import { filterGeneralPosts, getMyGeneralPosts } from '../../data/general';

const MyGeneralPostsView = () => {
  const [category, setCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () => filterGeneralPosts(getMyGeneralPosts(), category),
    [category]
  );

  return (
    <>
      <main className="pt-6 pb-8 sm:pt-8">
        <Container>
          <GeneralToolbar
            category={category}
            onCategoryChange={setCategory}
            activeView="mine"
            onCreatePost={() => setModalOpen(true)}
          />

          {filtered.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((post) => (
                <GeneralPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">No posts yet</p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Share industry news or documentation with the laboratory community.
              </p>
            </div>
          )}
        </Container>
      </main>

      <CreateGeneralPostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default MyGeneralPostsView;
