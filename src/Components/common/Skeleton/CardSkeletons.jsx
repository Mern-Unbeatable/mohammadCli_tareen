import Card from '@/components/ui/Card';
import Skeleton from './Skeleton';

/** Matches ContactCard layout */
export const ContactCardSkeleton = () => (
  <Card className="flex flex-col p-5 text-center">
    <Skeleton className="mx-auto h-16 w-16" rounded="full" />
    <Skeleton className="mx-auto mt-3 h-4 w-28" />
    <Skeleton className="mx-auto mt-2 h-3 w-36" />
    <Skeleton className="mx-auto mt-1.5 h-3.5 w-24" />
    <Skeleton className="mx-auto mt-1 h-3 w-20" />
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Skeleton className="h-9 w-full" rounded="md" />
      <Skeleton className="h-9 w-full" rounded="md" />
    </div>
  </Card>
);

/** Matches ListingCard layout */
export const ListingCardSkeleton = () => (
  <Card className="flex h-full flex-col">
    <Skeleton className="aspect-[4/3] w-full" rounded="none" />
    <div className="flex flex-1 flex-col p-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-24" />
      <Skeleton className="mt-3 h-6 w-20" />
      <Skeleton className="mt-2 h-3 w-40" />
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  </Card>
);

/** Matches JobCard layout */
export const JobCardSkeleton = () => (
  <Card className="p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4 max-w-md" />
        <Skeleton className="h-4 w-1/2 max-w-xs" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-14" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-9 w-28 shrink-0" />
    </div>
  </Card>
);

/** Matches GeneralPostCard layout */
export const GeneralPostCardSkeleton = () => (
  <Card className="flex h-full flex-col overflow-hidden">
    <div className="relative aspect-[16/10]">
      <Skeleton className="h-full w-full" rounded="none" />
      <Skeleton className="absolute left-3 top-3 h-5 w-14" rounded="full" />
    </div>
    <div className="flex flex-1 flex-col p-4 lg:p-5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-2/3" />
      <Skeleton className="mt-3 h-3 w-28" />
    </div>
  </Card>
);

/** Matches BlogGridCard layout */
export const BlogGridCardSkeleton = () => (
  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
    <Skeleton className="aspect-[16/10] w-full" rounded="none" />
    <div className="flex flex-1 flex-col p-4 lg:p-5">
      <Skeleton className="h-5 w-16" rounded="full" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-3/4" />
      <div className="mt-4 flex items-center gap-2.5 border-t border-[#E4E7EC] pt-4">
        <Skeleton className="h-8 w-8 shrink-0" rounded="full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  </article>
);

/** Matches LatestHubCard layout */
export const BlogHubCardSkeleton = () => (
  <div className="flex h-full w-full gap-3 rounded-xl border border-[#E4E7EC] bg-white p-4 lg:p-5 sm:gap-4">
    <Skeleton className="h-20 w-20 shrink-0 sm:h-24 sm:w-24 lg:h-28 lg:w-28" rounded="lg" />
    <div className="min-w-0 flex-1 space-y-2 py-0.5">
      <Skeleton className="h-5 w-16" rounded="full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="mt-1 h-3 w-36" />
    </div>
  </div>
);

/** Matches FeedPost card layout */
export const FeedPostCardSkeleton = () => (
  <Card>
    <div className="flex items-start gap-3 p-4 pb-3">
      <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-16" rounded="full" />
        </div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-5 shrink-0" rounded="full" />
    </div>
    <div className="space-y-2 px-4 pb-3">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
    </div>
    <Skeleton className="mx-4 mb-3 aspect-[16/9] w-[calc(100%-2rem)]" rounded="lg" />
    <div className="flex items-center justify-between border-t border-[#E4E7EC] px-4 py-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex gap-2 border-t border-[#E4E7EC] px-4 py-2.5">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </Card>
);

/** Matches RightSidebar “People you may know” row */
export const SidebarPersonRowSkeleton = () => (
  <li className="flex items-center gap-3 px-4 py-3">
    <Skeleton className="h-8 w-8 shrink-0" rounded="full" />
    <div className="min-w-0 flex-1 space-y-1.5">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-8 w-[76px] shrink-0" />
  </li>
);

/** Matches RightSidebar marketplace row */
export const SidebarListingRowSkeleton = () => (
  <li className="px-4 py-3">
    <Skeleton className="h-3.5 w-4/5" />
    <Skeleton className="mt-1.5 h-3 w-2/3" />
    <Skeleton className="mt-2 h-3.5 w-16" />
  </li>
);

/** Matches RightSidebar job row */
export const SidebarJobRowSkeleton = () => (
  <li className="px-4 py-3">
    <Skeleton className="h-3.5 w-4/5" />
    <Skeleton className="mt-1.5 h-3 w-3/5" />
    <Skeleton className="mt-2 h-5 w-16" rounded="full" />
  </li>
);

/** Matches My Applications row on MyJobsView */
export const ApplicationRowSkeleton = () => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white px-5 py-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);

/** Matches Profile MyReports list rows */
export const ReportRowSkeleton = () => (
  <li className="px-5 py-3.5 sm:px-6">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-14 shrink-0" rounded="full" />
    </div>
  </li>
);

const CARD_SKELETONS = {
  contact: ContactCardSkeleton,
  listing: ListingCardSkeleton,
  job: JobCardSkeleton,
  generalPost: GeneralPostCardSkeleton,
  blogGrid: BlogGridCardSkeleton,
  blogHub: BlogHubCardSkeleton,
  feedPost: FeedPostCardSkeleton,
  sidebarPerson: SidebarPersonRowSkeleton,
  sidebarListing: SidebarListingRowSkeleton,
  sidebarJob: SidebarJobRowSkeleton,
  application: ApplicationRowSkeleton,
  reportRow: ReportRowSkeleton,
};

/**
 * Renders one or more card skeletons by variant.
 * Reuse the same variant wherever that card appears.
 */
export function CardSkeleton({
  variant,
  count = 1,
  className = '',
  itemClassName = '',
  as: As = 'div',
}) {
  const Comp = CARD_SKELETONS[variant];
  if (!Comp) return null;

  if (count <= 1) {
    return (
      <As className={className || undefined} aria-busy="true" aria-live="polite">
        {itemClassName ? (
          <div className={itemClassName}>
            <Comp />
          </div>
        ) : (
          <Comp />
        )}
      </As>
    );
  }

  return (
    <As className={className || undefined} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, i) =>
        itemClassName ? (
          <div key={i} className={itemClassName}>
            <Comp />
          </div>
        ) : (
          <Comp key={i} />
        ),
      )}
    </As>
  );
}

export { CARD_SKELETONS };
