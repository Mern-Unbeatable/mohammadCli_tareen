import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import ListingCard from "@/components/data-display/ListingCard/ListingCard";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import {
  fetchListingsList,
  removeListing,
} from "@/features/admin/marketplace";
import {
  MARKETPLACE_CATEGORY_OPTIONS,
  categoryToApi,
  toListingCardModel,
} from "@/features/admin/marketplace/marketplaceMappers";

const PAGE_SIZE = 8;

const buildListingsQuery = ({ page, category }) => {
  const params = {
    page,
    pageSize: PAGE_SIZE,
  };

  const apiCategory = categoryToApi(category);
  if (apiCategory) params.category = apiCategory;

  return params;
};

const AdminMarketplaceView = () => {
  const dispatch = useDispatch();
  const { listings, listingsMeta, listingsLoading, error } = useSelector(
    (state) => state.adminMarketplace,
  );

  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    dispatch(fetchListingsList(buildListingsQuery({ page, category })));
  }, [dispatch, page, category]);

  const pageItems = useMemo(
    () => (listings || []).map(toListingCardModel).filter(Boolean),
    [listings],
  );

  const handleDelete = async (listingId) => {
    const result = await dispatch(removeListing(listingId));
    if (removeListing.fulfilled.match(result)) {
      toast.success("Listing deleted");
      return;
    }
    toast.error(result.payload || "Failed to delete listing");
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Marketplace"
        subtitle="Manage listings, sellers, transactions and commissions."
      />

      <div className="flex flex-wrap gap-2">
        {MARKETPLACE_CATEGORY_OPTIONS.map((item) => {
          const isActive = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                isActive
                  ? "bg-[#E67E22] text-white"
                  : "border border-[#E4E7EC] bg-white text-[#475467] hover:border-[#D0D5DD] hover:text-deep-blue"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {listingsLoading && !pageItems.length ? (
        <CardSkeleton
          variant="listing"
          count={8}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      ) : pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#64748B]">
          No listings found for this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              variant="admin"
              detailHref={`/admin/marketplace/${listing.id}`}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Pagination
        page={listingsMeta?.page || page}
        totalPages={listingsMeta?.totalPages || 1}
        onPageChange={setPage}
        className="mt-2"
      />
    </PanelPage>
  );
};

export default AdminMarketplaceView;
