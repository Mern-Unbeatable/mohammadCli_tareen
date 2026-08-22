import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  Activity,
  Building2,
  ChevronLeft,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserPlus,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import FeedPost from '../../components/dashboard/FeedPost';
import ReportPostModal from '../../components/dashboard/ReportPostModal';
import { currentUser, feedPosts } from '../../data/dashboard';
import { getContactById } from '../../data/contacts';
import NotFound from '../error/NotFound';

const InfoTile = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-[#E4E7EC] bg-white p-4 transition-colors hover:border-[#D0D5DD]">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
      <Icon className="h-4 w-4" strokeWidth={2} />
    </div>
    <p className="text-[12px] font-medium leading-none text-[#64748B]">{label}</p>
    <p className="mt-2 text-[14px] font-semibold leading-snug text-deep-blue">{value}</p>
  </div>
);

const ProfileHero = ({ contact, connected, pending, onConnect }) => (
  <Card>
    <div className="relative h-32 overflow-hidden bg-deep-blue sm:h-36">
      <img
        src={contact.coverPhoto || currentUser.coverPhoto}
        alt=""
        className="h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/40 to-transparent" />
    </div>

    <div className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
          <Avatar
            src={contact.avatar}
            alt={contact.name}
            initials={contact.initials}
            size="xl"
            className={`-mt-[4.25rem] shrink-0 border-[3px] border-white sm:-mt-[4.75rem] ${contact.avatarClass}`}
          />

          <div className="min-w-0 sm:pb-0.5">
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-deep-blue sm:text-[28px]">
              {contact.name}
            </h1>
            <p className="mt-1 text-[15px] font-medium text-[#475467]">{contact.title}</p>
            <p className="mt-0.5 text-[14px] text-[#64748B]">{contact.company}</p>
            <p className="mt-1 text-[13px] text-[#98A2B3]">
              {contact.country} · {contact.connections.toLocaleString()} connections
            </p>
          </div>
        </div>

        <div className="flex w-full shrink-0 gap-2 sm:w-auto lg:pt-1">
          <button
            type="button"
            onClick={onConnect}
            disabled={connected || pending}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-[12px] font-semibold transition-colors sm:flex-none ${
              connected
                ? 'bg-green-secondary text-green-primary'
                : pending
                  ? 'bg-green-secondary text-green-primary'
                  : 'bg-primary text-white hover:bg-[#066BB0]'
            }`}
          >
            {connected ? (
              'Connected'
            ) : pending ? (
              <>
                <Clock className="h-3.5 w-3.5" />
                Pending
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                Connect
              </>
            )}
          </button>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-green-primary bg-white px-3.5 py-2 text-[12px] font-semibold text-green-primary transition-colors hover:bg-green-secondary sm:flex-none"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Message
          </button>
        </div>
      </div>
    </div>
  </Card>
);

const EmptyActivity = ({ name }) => (
  <Card>
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Activity className="h-6 w-6" />
      </div>
      <h3 className="text-[16px] font-semibold text-deep-blue">No activity yet</h3>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#64748B]">
        {name} hasn&apos;t shared any posts on Lab Unity. Connect to stay updated when they
        publish questions, insights or updates.
      </p>
    </div>
  </Card>
);

const ContactProfileView = () => {
  const { contactId } = useParams();
  const contact = getContactById(contactId);
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState(false);
  const [reportPost, setReportPost] = useState(null);

  const activity = useMemo(
    () => feedPosts.filter((post) => contact?.postIds.includes(post.id)),
    [contact]
  );

  if (!contact) return <NotFound />;

  const handleConnect = () => {
    if (connected || pending) return;
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setConnected(true);
    }, 900);
  };

  return (
    <>
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-[760px]">
          <Link
            to="/contacts"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to directory
          </Link>

          <div className="space-y-4">
            <ProfileHero
              contact={contact}
              connected={connected}
              pending={pending}
              onConnect={handleConnect}
            />

            <Card>
              <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
                <h2 className="text-[16px] font-bold text-deep-blue">Professional information</h2>
              </div>
              <div className="px-5 py-5 sm:px-6">
                <p className="text-[14px] leading-[1.7] text-[#475467]">{contact.about}</p>
              </div>
            </Card>

            <Card>
              <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
                <h2 className="text-[16px] font-bold text-deep-blue">Contact information</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-3 sm:p-5">
                <InfoTile icon={Building2} label="Laboratory / Company" value={contact.company} />
                <InfoTile icon={MapPin} label="Country" value={contact.country} />
                <InfoTile icon={Mail} label="Email" value={contact.email} />
                <InfoTile icon={Phone} label="Phone" value={contact.phone} />
              </div>
            </Card>

            <section>
              <h2 className="mb-4 px-1 text-[18px] font-bold text-deep-blue">Activity</h2>
              <div className="space-y-4">
                {activity.length > 0 ? (
                  activity.map((post) => (
                    <FeedPost key={post.id} post={post} onReport={setReportPost} />
                  ))
                ) : (
                  <EmptyActivity name={contact.name.split(' ')[0]} />
                )}
              </div>
            </section>
          </div>
        </Container>
      </main>

      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default ContactProfileView;
