import { useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination/Pagination';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { categories, filterListings, listings } from '@/modules/user/data/marketplace';
import { GRID_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const AdminMarketplaceView = () => {
  const [category, setCategory] = useState('All');
  const filtered = useMemo(() => filterListings(listings, '', category), [category]);
  const { page, setPage, totalPages, pageItems } = usePaginatedList(filtered, GRID_PAGE_SIZE, [
    category,
  ]);

  return (
    <PanelPage>
      <PanelPageHeader
        title="Marketplace"
        subtitle="Manage listings, sellers, transactions and commissions."
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => {
          const isActive = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                isActive
                  ? 'bg-[#E67E22] text-white'
                  : 'border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            variant="admin"
            detailHref={`/admin/marketplace/${listing.id}`}
            onDelete={() => {}}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-2" />
    </PanelPage>
  );
};

export default AdminMarketplaceView;
