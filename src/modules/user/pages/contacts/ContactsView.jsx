import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import Container from "@/components/ui/Container";
import ContactCard from "@/components/data-display/ContactCard/ContactCard";
import {
  fetchContactsList,
  requestContactConnection,
  acceptConnection,
  clearContactsError,
  invalidateContactsList,
  COUNTRY_OPTIONS,
  toContactCardModel,
} from "@/features/user/contacts";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";
import { usePageParam } from "@/shared/hooks/usePageParam";
import {
  COUNTRY_PARAM,
  DEFAULT_COUNTRY,
  FILTER_PARAM,
  SEARCH_MAX_LENGTH,
  SEARCH_PARAM,
  applyFilterChanges,
  buildContactsQuery,
  parseCountryParam,
  parseFilterParam,
  parseSearchParam,
  withoutInvalidFilters,
} from "./contactsUrlFilters";

const PROFILE_BASE = "/contacts";

const FILTER_OPTIONS = [
  { id: "people", label: "People" },
  { id: "requests", label: "Requests" },
  { id: "connected", label: "Connected" },
];

const EMPTY_MESSAGES = {
  people: "No members match your search.",
  requests: "No pending connection requests.",
  connected: "You have no connections yet.",
};

const FILTERED_EMPTY_MESSAGES = {
  ...EMPTY_MESSAGES,
  requests: "No requests match your search.",
  connected: "No connections match your search.",
};

const countLabel = (filter, total) => {
  if (filter === "requests") {
    return `${total} request${total === 1 ? "" : "s"}`;
  }
  if (filter === "connected") {
    return `${total} connection${total === 1 ? "" : "s"}`;
  }
  return `${total} member${total === 1 ? "" : "s"} found`;
};

const ContactsView = () => {
  const dispatch = useDispatch();
  const {
    contacts,
    contactsMeta,
    contactsLoading,
    contactsError,
    connectingId,
    acceptingId,
    error,
  } = useSelector((state) => state.userContacts);

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = parseFilterParam(searchParams.get(FILTER_PARAM));
  const country = parseCountryParam(searchParams.get(COUNTRY_PARAM));
  const search = parseSearchParam(searchParams.get(SEARCH_PARAM));
  const [page, setPage] = usePageParam();

  const [query, setQuery] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  // Back/Forward can change `q`; mirror it into the search box.
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setQuery(search);
  }

  const isRequests = filter === "requests";

  const updateFilters = useCallback(
    (changes, { replace = false } = {}) => {
      dispatch(invalidateContactsList());
      setSearchParams((prev) => applyFilterChanges(prev, changes), { replace });
    },
    [dispatch, setSearchParams],
  );

  useEffect(() => {
    const next = withoutInvalidFilters(searchParams);
    if (next) setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = query.trim() ? query : "";
      if (nextSearch === search) return;
      updateFilters({ [SEARCH_PARAM]: nextSearch }, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [query, search, updateFilters]);

  const contactsQuery = useMemo(
    () =>
      buildContactsQuery({
        page,
        search,
        country,
        filter,
        pageSize: GRID_PAGE_SIZE,
      }),
    [page, search, country, filter],
  );

  const latestQueryRef = useRef(contactsQuery);
  useEffect(() => {
    latestQueryRef.current = contactsQuery;
  }, [contactsQuery]);

  const loadContacts = useCallback(() => {
    dispatch(clearContactsError());
    dispatch(fetchContactsList(contactsQuery));
  }, [dispatch, contactsQuery]);

  // Run before paint so skeletons replace stale cards immediately on filter/page change
  useLayoutEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const cards = useMemo(
    () => (contacts || []).map(toContactCardModel).filter(Boolean),
    [contacts],
  );

  const total = contactsMeta?.total || 0;
  const totalPages = Math.max(
    1,
    contactsMeta?.totalPages || Math.ceil(total / GRID_PAGE_SIZE) || 1,
  );
  // Only trust totalPages once it belongs to the page in the URL.
  const pageOutOfRange =
    !contactsLoading &&
    !contactsError &&
    Number(contactsMeta?.page) === page &&
    page > totalPages;
  const showSkeleton = contactsLoading || pageOutOfRange;

  useEffect(() => {
    if (pageOutOfRange) setPage(totalPages, { replace: true });
  }, [pageOutOfRange, totalPages, setPage]);

  const handleFilterChange = (next) => {
    if (next === filter) return;
    updateFilters({ [FILTER_PARAM]: next });
  };

  const handleCountryChange = (next) => {
    if (next === country) return;
    updateFilters({ [COUNTRY_PARAM]: next });
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    setPage(next);
  };

  const handleConnect = async (id) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.connected || card.pending || connectingId === id) return;

    const result = await dispatch(requestContactConnection(id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success("Connection request sent");
    }
  };

  const handleAccept = async (connectionId) => {
    if (!connectionId || acceptingId === connectionId) return;

    const result = await dispatch(acceptConnection(connectionId));
    if (acceptConnection.fulfilled.match(result)) {
      toast.success("Connection confirmed");
      // The card is already gone; refetch so the next member fills this page.
      dispatch(
        fetchContactsList({ ...latestQueryRef.current, background: true }),
      );
    }
  };

  return (
    <main className="py-6 sm:py-8">
      <Container>
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-deep-blue sm:text-[32px]">
            Contacts Directory
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B] sm:text-[15px]">
            Find laboratory professionals, suppliers and companies across the
            network.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={SEARCH_MAX_LENGTH}
            placeholder="Search by name, laboratory or position..."
            className="flex-1 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          <select
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            aria-label="Filter by country"
            className="rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:min-w-[180px]"
          >
            {COUNTRY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            aria-label="Filter contacts"
            className="rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:min-w-[160px]"
          >
            {FILTER_OPTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-5 text-[13px] text-[#64748B]">
          {showSkeleton
            ? "Loading…"
            : contactsError
              ? "Contacts unavailable"
              : countLabel(filter, total)}
        </p>

        {showSkeleton ? (
          <CardSkeleton
            variant="contact"
            count={GRID_PAGE_SIZE}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          />
        ) : contactsError ? (
          <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#64748B]">Couldn&apos;t load contacts.</p>
            <button
              type="button"
              onClick={loadContacts}
              className="mt-2 text-[14px] font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : cards.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((contact) => (
              <ContactCard
                key={contact.connectionId || contact.id}
                contact={contact}
                profileBasePath={PROFILE_BASE}
                connected={contact.connected}
                pending={contact.pending || connectingId === contact.id}
                incoming={contact.incoming || isRequests}
                accepting={acceptingId === contact.connectionId}
                onConnect={handleConnect}
                onAccept={handleAccept}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#64748B]">
              {(search.trim() || country !== DEFAULT_COUNTRY
                ? FILTERED_EMPTY_MESSAGES
                : EMPTY_MESSAGES)[filter]}
            </p>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      </Container>
    </main>
  );
};

export default ContactsView;
