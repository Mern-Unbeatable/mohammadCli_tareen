import { useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination/Pagination';
import ContactCard from '@/components/data-display/ContactCard/ContactCard';
import { contacts, countries } from '@/modules/user/data/contacts';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { GRID_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const PROFILE_BASE = '/supplier/contacts';

const SupplierContactsView = () => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('All countries');
  const [connected, setConnected] = useState({});
  const [pending, setPending] = useState({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((contact) => {
      const matchesCountry = country === 'All countries' || contact.country === country;
      const matchesQuery =
        !q ||
        contact.name.toLowerCase().includes(q) ||
        contact.company.toLowerCase().includes(q) ||
        contact.title.toLowerCase().includes(q);
      return matchesCountry && matchesQuery;
    });
  }, [query, country]);

  const { page, setPage, totalPages, pageItems } = usePaginatedList(filtered, GRID_PAGE_SIZE, [
    query,
    country,
  ]);

  const handleConnect = (id) => {
    if (connected[id] || pending[id]) return;
    setPending((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setPending((prev) => ({ ...prev, [id]: false }));
      setConnected((prev) => ({ ...prev, [id]: true }));
    }, 900);
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
          {countries.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="text-[13px] text-[#64748B]">
        {filtered.length} member{filtered.length === 1 ? '' : 's'} found
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            profileBasePath={PROFILE_BASE}
            connected={Boolean(connected[contact.id])}
            pending={Boolean(pending[contact.id] || contact.pending)}
            onConnect={handleConnect}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-2" />
    </PanelPage>
  );
};

export default SupplierContactsView;
