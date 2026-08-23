import { useMemo, useState } from 'react';
import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import GeneralToolbar from '@/modules/user/components/general/GeneralToolbar';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import { filterGeneralPosts, generalPosts } from '@/modules/user/data/general';

const AdminGeneralView = () => {
  const [category, setCategory] = useState('All');

  const filtered = useMemo(
    () => filterGeneralPosts(generalPosts, category),
    [category]
  );

  return (
    <PanelPage>
      <GeneralToolbar
        category={category}
        onCategoryChange={setCategory}
        activeView="browse"
        showMyPost={false}
        showCreatePost={false}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((post) => (
          <GeneralPostCard
            key={post.id}
            post={post}
            variant="admin"
            detailHref={`/admin/general/${post.id}`}
            onDelete={() => {}}
          />
        ))}
      </div>
    </PanelPage>
  );
};

export default AdminGeneralView;
