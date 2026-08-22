import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { suggestedPeople, marketplaceItems, jobItems } from '../../data/dashboard';

const SectionTitle = ({ children }) => (
  <h3 className="px-4 pt-4 text-[14px] font-bold text-deep-blue">{children}</h3>
);

const PeopleYouMayKnow = ({ people }) => (
  <Card>
    <SectionTitle>People you may know</SectionTitle>
    <ul className="divide-y divide-[#E4E7EC]">
      {people.map(({ id, initials, name, company }) => (
        <li key={id} className="flex items-center gap-3 px-4 py-3">
          <Avatar initials={initials} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-deep-blue">{name}</p>
            <p className="truncate text-[12px] text-[#64748B]">{company}</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full border border-primary px-3 py-1 text-[12px] font-semibold text-primary hover:bg-secondary"
          >
            Connect
          </button>
        </li>
      ))}
    </ul>
  </Card>
);

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
