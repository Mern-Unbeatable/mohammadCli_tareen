import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '@/components/common/Pagination/Pagination';
import { CardSkeleton } from '@/components/common/Skeleton';
import Container from '@/components/ui/Container';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import MarketplaceToolbar from '@/modules/user/components/marketplace/MarketplaceToolbar';
import {
  fetchListings,
  toggleSaveListing,
  clearMarketplaceError,
  categoryToApi,
  toListingCardModel,
} from '@/features/user/marketplace';
import { GRID_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';

const buildListingsQuery = ({ page, query, category }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: 'desc',
  };
  const q = query?.trim();
  if (q) params.search = q;
  const categoryApi = categoryToApi(category);
  if (categoryApi) params.category = categoryApi;
  return params;
};

const MarketplaceView = () => {
  const dispatch = useDispatch();
  const { listings, listingsMeta, listingsLoading, error } = useSelector(
    (state) => state.userMarketplace,
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category]);

  useEffect(() => {
    dispatch(clearMarketplaceError());
    dispatch(
      fetchListings(
        buildListingsQuery({ page, query: debouncedQuery, category }),
      ),
    );
  }, [dispatch, page, debouncedQuery, category]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (listings || []).map(toListingCardModel).filter(Boolean),
    [listings],
  );

  const totalPages = Math.max(1, listingsMeta?.totalPages || 1);

  const handleToggleSave = async (id) => {
    const result = await dispatch(toggleSaveListing(id));
    if (toggleSaveListing.rejected.match(result)) {
      toast.error(result.payload || 'Failed to update saved listing');
    }
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

          {listingsLoading ? (
            <CardSkeleton
              variant="listing"
              count={GRID_PAGE_SIZE}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          ) : pageItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  saved={listing.isSaved}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">No listings found</p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Try a different search or category filter.
              </p>
            </div>
          )}

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
