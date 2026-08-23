import { useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import MarketplaceToolbar from '@/modules/user/components/marketplace/MarketplaceToolbar';
import { filterListings, getMyListings } from '@/modules/user/data/marketplace';

const MyListingsView = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [myListings, setMyListings] = useState(getMyListings);

  const filtered = useMemo(
    () => filterListings(myListings, query, category),
    [myListings, query, category]
  );

  const handleDelete = (id) => {
    setMyListings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
      <Container>
        <MarketplaceToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          activeView="mine"
        />

        <section className="mt-6">
          <h2 className="mb-4 text-[16px] font-bold text-deep-blue">My listings</h2>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant="mine"
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">No listings yet</p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Create your first listing to sell laboratory equipment to verified members.
              </p>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
};

export default MyListingsView;
