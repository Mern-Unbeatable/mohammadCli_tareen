import { useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination/Pagination';
import Container from '@/components/ui/Container';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import MarketplaceToolbar from '@/modules/user/components/marketplace/MarketplaceToolbar';
import { defaultSavedIds, filterListings, listings } from '@/modules/user/data/marketplace';
import { GRID_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const useMarketplaceFilters = (items) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = useMemo(() => filterListings(items, query, category), [items, query, category]);
  return { query, setQuery, category, setCategory, filtered };
};

const MarketplaceView = () => {
  const [savedIds, setSavedIds] = useState(defaultSavedIds);
  const { query, setQuery, category, setCategory, filtered } = useMarketplaceFilters(listings);
  const { page, setPage, totalPages, pageItems } = usePaginatedList(filtered, GRID_PAGE_SIZE, [
    query,
    category,
  ]);

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
      <Container>
        <MarketplaceToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          activeView="browse"
        />

        <section className="mt-6">
          <h2 className="mb-4 text-[16px] font-bold text-deep-blue">Featured listings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                saved={savedIds.includes(listing.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-8"
          />
        </section>
      </Container>
    </main>
  );
};

export default MarketplaceView;
