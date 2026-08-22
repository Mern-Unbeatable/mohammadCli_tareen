import { useState } from 'react';
import { Check } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { suggestedPeople, marketplaceItems, jobItems } from '../../data/dashboard';

const SectionTitle = ({ children }) => (
  <h3 className="px-4 pt-4 text-[14px] font-bold text-deep-blue">{children}</h3>
);

const PeopleYouMayKnow = ({ people }) => {
  const [connected, setConnected] = useState({});
  const [pending, setPending] = useState({});

  const handleConnect = (id) => {
    if (connected[id]) return;
    setPending((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setPending((prev) => ({ ...prev, [id]: false }));
      setConnected((prev) => ({ ...prev, [id]: true }));
    }, 900);
  };

  return (
    <Card>
      <SectionTitle>People you may know</SectionTitle>
      <ul className="divide-y divide-[#E4E7EC]">
        {people.map(({ id, initials, name, company, avatar }) => {
          const isConnected = connected[id];
          const isPending = pending[id];

          return (
            <li key={id} className="flex items-center gap-3 px-4 py-3">
              <Avatar src={avatar} alt={name} initials={initials} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-deep-blue">{name}</p>
                <p className="truncate text-[12px] text-[#64748B]">{company}</p>
              </div>
              <button
                type="button"
                onClick={() => handleConnect(id)}
                disabled={isConnected || isPending}
                className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors ${
                  isConnected
                    ? 'border-green-primary bg-green-secondary text-green-primary'
                    : isPending
                      ? 'border-[#D0D5DD] text-[#98A2B3]'
                      : 'border-primary text-primary hover:bg-secondary'
                }`}
              >
                {isConnected ? (
                  <>
                    <Check className="h-3 w-3" />
                    Connected
                  </>
                ) : isPending ? (
                  'Pending…'
                ) : (
                  'Connect'
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

const MarketplaceList = ({ items }) => (
  <Card>
    <SectionTitle>Latest in the marketplace</SectionTitle>
    <ul className="divide-y divide-[#E4E7EC]">
      {items.map(({ id, title, meta, price }) => (
        <li key={id} className="px-4 py-3">
          <p className="text-[13px] font-semibold text-deep-blue">{title}</p>
          <p className="mt-0.5 text-[12px] text-[#64748B]">{meta}</p>
          <p className="mt-1 text-[13px] font-bold text-primary">{price}</p>
        </li>
      ))}
    </ul>
  </Card>
);

const JobsList = ({ items }) => (
  <Card>
    <SectionTitle>Jobs for you</SectionTitle>
    <ul className="divide-y divide-[#E4E7EC]">
      {items.map(({ id, title, company, location, type }) => (
        <li key={id} className="px-4 py-3">
          <p className="text-[13px] font-semibold text-deep-blue">{title}</p>
          <p className="mt-0.5 text-[12px] text-[#64748B]">
            {company} · {location}
          </p>
          <Badge variant="fulltime" className="mt-2 normal-case">
            {type}
          </Badge>
        </li>
      ))}
    </ul>
  </Card>
);

const RightSidebar = () => (
  <div className="hidden w-[280px] shrink-0 xl:block">
    <div className="sticky top-[70px] space-y-3">
      <PeopleYouMayKnow people={suggestedPeople} />
      <MarketplaceList items={marketplaceItems} />
      <JobsList items={jobItems} />
    </div>
  </div>
);

export default RightSidebar;
