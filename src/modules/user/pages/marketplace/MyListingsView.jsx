import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import { CardSkeleton } from '@/components/common/Skeleton';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import MarketplaceToolbar from '@/modules/user/components/marketplace/MarketplaceToolbar';
import {
  fetchListings,
  removeListing,
  clearMarketplaceError,
  categoryToApi,
  toListingCardModel,
} from '@/features/user/marketplace';
import { GRID_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';

const buildMineQuery = ({ query, category }) => {
  const params = {
    page: 1,
    pageSize: GRID_PAGE_SIZE * 3,
    sort: 'desc',
    mine: true,
  };
  const q = query?.trim();
  if (q) params.search = q;
  const categoryApi = categoryToApi(category);
  if (categoryApi) params.category = categoryApi;
  return params;
};

const MyListingsView = () => {
  const dispatch = useDispatch();
  const { listings, listingsLoading, deleting, error } = useSelector(
    (state) => state.userMarketplace,
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(clearMarketplaceError());
    dispatch(fetchListings(buildMineQuery({ query: debouncedQuery, category })));
  }, [dispatch, debouncedQuery, category]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = useMemo(
    () => (listings || []).map(toListingCardModel).filter(Boolean),
    [listings],
  );

  const handleDelete = async (id) => {
    const result = await dispatch(removeListing(id));
    if (removeListing.fulfilled.match(result)) {
      toast.success('Listing removed');
      return;
    }
    toast.error(result.payload || 'Failed to delete listing');
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

          {listingsLoading ? (
            <CardSkeleton
              variant="listing"
              count={GRID_PAGE_SIZE}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  variant="mine"
                  onDelete={deleting ? undefined : handleDelete}
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
