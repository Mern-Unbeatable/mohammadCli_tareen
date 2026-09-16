import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import {
  contactsApi,
  requestContactConnection,
  toContactCardModel,
} from '@/features/user/contacts';
import {
  marketplaceApi,
  toListingCardModel,
} from '@/features/user/marketplace';
import {
  recruitmentApi,
  toJobCardModel,
} from '@/features/user/recruitment';

const SIDEBAR_LIMIT = 3;

const formatPrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num)) return '—';
  return `€${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

const SectionTitle = ({ children }) => (
  <h3 className="px-4 pt-4 text-[14px] font-bold text-deep-blue">{children}</h3>
);

const EmptyRow = ({ message }) => (
  <p className="px-4 py-6 text-center text-[12px] text-[#64748B]">{message}</p>
);

const LoadingRow = () => (
  <div className="flex items-center justify-center gap-2 px-4 py-8 text-[12px] text-[#64748B]">
    <Loader2 className="h-4 w-4 animate-spin text-primary" />
    Loading…
  </div>
);

const PeopleYouMayKnow = ({ people, connectingId, onConnect, loading }) => (
  <Card>
    <SectionTitle>People you may know</SectionTitle>
    {loading && !people.length ? (
      <LoadingRow />
    ) : people.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {people.map((person) => {
          const isConnected = person.connected;
          const isPending =
            person.pending || connectingId === person.id;

          return (
            <li key={person.id} className="flex items-center gap-3 px-4 py-3">
              <Link to={person.to} className="shrink-0">
                <Avatar
                  src={person.avatar}
                  alt={person.name}
                  initials={person.initials}
                  size="sm"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={person.to}
                  className="block truncate text-[13px] font-semibold text-deep-blue hover:text-primary"
                >
                  {person.name}
                </Link>
                <p className="truncate text-[12px] text-[#64748B]">
                  {person.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onConnect(person)}
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
    ) : (
      <EmptyRow message="No suggestions right now." />
    )}
  </Card>
);

const MarketplaceList = ({ items, loading }) => (
  <Card>
    <SectionTitle>Latest in the marketplace</SectionTitle>
    {loading && !items.length ? (
      <LoadingRow />
    ) : items.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {items.map(({ id, title, meta, price, to }) => (
          <li key={id}>
            <Link
              to={to}
              className="block px-4 py-3 transition-colors hover:bg-[#F9FAFB]"
            >
              <p className="text-[13px] font-semibold text-deep-blue hover:text-primary">
                {title}
              </p>
              <p className="mt-0.5 text-[12px] text-[#64748B]">{meta}</p>
              <p className="mt-1 text-[13px] font-bold text-primary">{price}</p>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <EmptyRow message="No listings yet." />
    )}
  </Card>
);

const JobsList = ({ items, loading }) => (
  <Card>
    <SectionTitle>Jobs for you</SectionTitle>
    {loading && !items.length ? (
      <LoadingRow />
    ) : items.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {items.map(({ id, title, company, location, type, to }) => (
          <li key={id}>
            <Link
              to={to}
              className="block px-4 py-3 transition-colors hover:bg-[#F9FAFB]"
            >
              <p className="text-[13px] font-semibold text-deep-blue hover:text-primary">
                {title}
              </p>
              <p className="mt-0.5 text-[12px] text-[#64748B]">
                {[company, location].filter(Boolean).join(' · ')}
              </p>
              {type ? (
                <Badge variant="fulltime" className="mt-2 normal-case">
                  {type}
                </Badge>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <EmptyRow message="No jobs yet." />
    )}
  </Card>
);

const RightSidebar = () => {
  const dispatch = useDispatch();
  const [people, setPeople] = useState([]);
  const [listings, setListings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadPeople = async () => {
      setPeopleLoading(true);
      try {
        const result = await contactsApi.getContactsList({
          page: 1,
          pageSize: 12,
          sort: 'desc',
        });
        if (cancelled) return;
        const mapped = (result.data || [])
          .map(toContactCardModel)
          .filter((c) => c && !c.connected)
          .slice(0, SIDEBAR_LIMIT)
          .map((c) => ({
            ...c,
            to: `/contacts/${c.id}`,
          }));
        setPeople(mapped);
      } catch (err) {
        if (!cancelled) {
          toast.error(
            contactsApi.getApiErrorMessage(err, 'Failed to load suggestions'),
          );
        }
      } finally {
        if (!cancelled) setPeopleLoading(false);
      }
    };

    const loadListings = async () => {
      setListingsLoading(true);
      try {
        const result = await marketplaceApi.getListingsList({
          page: 1,
          pageSize: SIDEBAR_LIMIT,
          sort: 'desc',
        });
        if (cancelled) return;
        const mapped = (result.data || [])
          .map(toListingCardModel)
          .filter(Boolean)
          .map((item) => ({
            id: item.id,
            title: item.title,
            meta: [item.condition, item.location].filter(Boolean).join(' · '),
            price: formatPrice(item.price),
            to: `/marketplace/${item.id}`,
          }));
        setListings(mapped);
      } catch (err) {
        if (!cancelled) {
          toast.error(
            marketplaceApi.getApiErrorMessage(
              err,
              'Failed to load marketplace',
            ),
          );
        }
      } finally {
        if (!cancelled) setListingsLoading(false);
      }
    };

    const loadJobs = async () => {
      setJobsLoading(true);
      try {
        const result = await recruitmentApi.getJobsList({
          page: 1,
          pageSize: SIDEBAR_LIMIT,
          sort: 'desc',
        });
        if (cancelled) return;
        const mapped = (result.data || [])
          .map(toJobCardModel)
          .filter(Boolean)
          .map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company || '—',
            location: job.location || '—',
            type: job.employmentType || null,
            to: `/recruitment/${job.id}`,
          }));
        setJobs(mapped);
      } catch (err) {
        if (!cancelled) {
          toast.error(
            recruitmentApi.getApiErrorMessage(err, 'Failed to load jobs'),
          );
        }
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    };

    loadPeople();
    loadListings();
    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleConnect = async (person) => {
    if (!person?.id || person.connected || person.pending || connectingId) {
      return;
    }
    setConnectingId(person.id);
    const result = await dispatch(requestContactConnection(person.id));
    setConnectingId(null);

    if (requestContactConnection.fulfilled.match(result)) {
      toast.success('Connection request sent');
      setPeople((prev) =>
        prev.map((row) =>
          row.id === person.id ? { ...row, pending: true } : row,
        ),
      );
      return;
    }
    toast.error(result.payload || 'Failed to send connection request');
  };

  return (
    <div className="hidden w-[320px] shrink-0 xl:block">
      <div className="sticky top-[70px] space-y-3">
        <PeopleYouMayKnow
          people={people}
          connectingId={connectingId}
          onConnect={handleConnect}
          loading={peopleLoading}
        />
        <MarketplaceList items={listings} loading={listingsLoading} />
        <JobsList items={jobs} loading={jobsLoading} />
      </div>
    </div>
  );
};

export default RightSidebar;
