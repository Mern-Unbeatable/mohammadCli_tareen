import { useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import ListingCard from '@/modules/user/components/marketplace/ListingCard';
import MarketplaceToolbar from '@/modules/user/components/marketplace/MarketplaceToolbar';
import { defaultSavedIds, filterListings, listings } from '@/modules/user/data/marketplace';

const useMarketplaceFilters = (items) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = useMemo(() => filterListings(items, query, category), [items, query, category]);
  return { query, setQuery, category, setCategory, filtered };
};

const MarketplaceView = () => {
  const [savedIds, setSavedIds] = useState(defaultSavedIds);
  const { query, setQuery, category, setCategory, filtered } = useMarketplaceFilters(listings);

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
            {filtered.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                saved={savedIds.includes(listing.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
};

export default MarketplaceView;
