import { useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import MarketplaceToolbar from '@/modules/user/components/marketplace/MarketplaceToolbar';
import { defaultSavedIds, filterListings, listings } from '@/modules/user/data/marketplace';

const SavedListingsView = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [savedIds, setSavedIds] = useState(defaultSavedIds);

  const savedListings = useMemo(
    () => listings.filter((item) => savedIds.includes(item.id)),
    [savedIds]
  );

  const filtered = useMemo(
    () => filterListings(savedListings, query, category),
    [savedListings, query, category]
  );

  const toggleSave = (id) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
      <Container>
        <MarketplaceToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          activeView="saved"
        />

        <section className="mt-6">
          <h2 className="mb-4 text-[16px] font-bold text-deep-blue">Saved listings</h2>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  saved
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">No saved listings</p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Browse the marketplace and tap the heart icon to save equipment here.
              </p>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
};

export default SavedListingsView;
