import { useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import GeneralPostCard from '@/modules/user/components/general/GeneralPostCard';
import GeneralToolbar from '@/modules/user/components/general/GeneralToolbar';
import CreateGeneralPostModal from '@/modules/user/components/general/CreateGeneralPostModal';
import { filterGeneralPosts, generalPosts } from '@/modules/user/data/general';

const GeneralView = () => {
  const [category, setCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () => filterGeneralPosts(generalPosts, category),
    [category]
  );

  return (
    <>
      <main className="pt-6 pb-8 sm:pt-8">
        <Container>
          <GeneralToolbar
            category={category}
            onCategoryChange={setCategory}
            activeView="browse"
            onCreatePost={() => setModalOpen(true)}
          />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((post) => (
              <GeneralPostCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      </main>

      <CreateGeneralPostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default GeneralView;
