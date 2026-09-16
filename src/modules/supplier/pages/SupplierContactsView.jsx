import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import ContactCard from "@/components/data-display/ContactCard/ContactCard";
import {
  fetchContactsList,
  requestContactConnection,
  clearContactsError,
  COUNTRY_OPTIONS,
  toContactCardModel,
} from "@/features/supplier/contacts";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const PROFILE_BASE = "/supplier/contacts";

const buildContactsQuery = ({ page, search, country }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: "desc",
  };
  const q = search?.trim();
  if (q) params.search = q;
  if (country && country !== "All countries") params.country = country;
  return params;
};

const SupplierContactsView = () => {
  const dispatch = useDispatch();
  const {
    contacts,
    contactsMeta,
    contactsLoading,
    connectingId,
    error,
  } = useSelector((state) => state.supplierContacts);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [country, setCountry] = useState("All countries");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, country]);

  useEffect(() => {
    dispatch(clearContactsError());
    dispatch(
      fetchContactsList(
        buildContactsQuery({
          page,
          search: debouncedQuery,
          country,
        }),
      ),
    );
  }, [dispatch, page, debouncedQuery, country]);

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

  const handleConnect = async (id) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.connected || card.pending || connectingId === id) return;

    const result = await dispatch(requestContactConnection(id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success("Connection request sent");
    }
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Contacts Directory"
        subtitle="Find laboratory professionals, suppliers and companies across the network."
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, laboratory or position..."
          className="flex-1 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-[14px] text-deep-blue outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 sm:min-w-[180px]"
        >
          {COUNTRY_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="text-[13px] text-[#64748B]">
        {total} member{total === 1 ? "" : "s"} found
      </p>

      {contactsLoading && !cards.length ? (
        <CardSkeleton
          variant="contact"
          count={GRID_PAGE_SIZE}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      ) : cards.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              profileBasePath={PROFILE_BASE}
              connected={contact.connected}
              pending={
                contact.pending || connectingId === contact.id
              }
              onConnect={handleConnect}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
          <p className="text-[14px] text-[#64748B]">
            No members match your search.
          </p>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-2"
      />
    </PanelPage>
  );
};

export default SupplierContactsView;
