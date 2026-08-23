import { useMemo, useState } from 'react';
import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import GeneralToolbar from '@/modules/user/components/general/GeneralToolbar';
import CreateGeneralPostModal from '@/modules/user/components/general/CreateGeneralPostModal';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import { filterGeneralPosts, generalPosts } from '@/modules/user/data/general';

const SupplierGeneralView = () => {
  const [category, setCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () => filterGeneralPosts(generalPosts, category),
    [category]
  );

  return (
    <PanelPage>
      <GeneralToolbar
        category={category}
        onCategoryChange={setCategory}
        activeView="mine"
        onCreatePost={() => setModalOpen(true)}
        myPostHref="/supplier/general"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((post) => (
          <GeneralPostCard
            key={post.id}
            post={post}
            variant="mine"
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>

      <CreateGeneralPostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PanelPage>
  );
};

export default SupplierGeneralView;
