import { useState } from 'react';
import Container from '@/components/ui/Container';
import ContactCard from '@/components/data-display/ContactCard/ContactCard';
import { contacts, countries } from '@/modules/user/data/contacts';

const ContactsView = () => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('All countries');
  const [connected, setConnected] = useState({});
  const [pending, setPending] = useState({});

  const filtered = contacts.filter((contact) => {
    const q = query.trim().toLowerCase();
    const matchesCountry = country === 'All countries' || contact.country === country;
    const matchesQuery =
      !q ||
      contact.name.toLowerCase().includes(q) ||
      contact.company.toLowerCase().includes(q) ||
      contact.title.toLowerCase().includes(q);
    return matchesCountry && matchesQuery;
  });

  const handleConnect = (id) => {
    if (connected[id] || pending[id]) return;
    setPending((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setPending((prev) => ({ ...prev, [id]: false }));
      setConnected((prev) => ({ ...prev, [id]: true }));
    }, 900);
  };

  return (
    <main className="py-6 sm:py-8">
      <Container>
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-deep-blue sm:text-[32px]">
            Contacts Directory
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B] sm:text-[15px]">
            Find laboratory professionals, suppliers and companies across the network.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
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

        <p className="mb-5 text-[13px] text-[#64748B]">
          {filtered.length} member{filtered.length === 1 ? '' : 's'} found
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              connected={Boolean(connected[contact.id])}
              pending={Boolean(pending[contact.id] || contact.pending)}
              onConnect={handleConnect}
            />
          ))}
        </div>
      </Container>
    </main>
  );
};

export default ContactsView;
