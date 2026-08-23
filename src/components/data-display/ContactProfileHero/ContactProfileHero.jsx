import { Clock, MessageCircle, UserPlus } from 'lucide-react';
import { Link } from 'react-router';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import { currentUser } from '@/modules/user/data/dashboard';

const ContactProfileHero = ({
  contact,
  connected = false,
  pending = false,
  onConnect,
  onMessage,
  messageHref,
  coverPhoto,
}) => (
  <Card>
    <div className="relative h-32 overflow-hidden bg-deep-blue sm:h-36">
      <img
        src={coverPhoto || contact.coverPhoto || currentUser.coverPhoto}
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
            className={`-mt-[4.25rem] shrink-0 border-[3px] border-white sm:-mt-[4.75rem] ${contact.avatarClass || ''}`}
          />

          <div className="min-w-0 sm:pb-0.5">
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-deep-blue sm:text-[28px]">
              {contact.name}
            </h1>
            <p className="mt-1 text-[15px] font-medium text-[#475467]">{contact.title}</p>
            <p className="mt-0.5 text-[14px] text-[#64748B]">{contact.company}</p>
            <p className="mt-1 text-[13px] text-[#98A2B3]">
              {contact.country} · {contact.connections?.toLocaleString?.() ?? 0} connections
            </p>
          </div>
        </div>

        <div className="flex w-full shrink-0 gap-2 sm:w-auto lg:pt-1">
          <button
            type="button"
            onClick={onConnect}
            disabled={connected || pending}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-[12px] font-semibold transition-colors sm:flex-none ${
              connected || pending
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
          {messageHref ? (
            <Link
              to={messageHref}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-green-primary bg-white px-3.5 py-2 text-[12px] font-semibold text-green-primary transition-colors hover:bg-green-secondary sm:flex-none"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Message
            </Link>
          ) : (
            <button
              type="button"
              onClick={onMessage}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-green-primary bg-white px-3.5 py-2 text-[12px] font-semibold text-green-primary transition-colors hover:bg-green-secondary sm:flex-none"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  </Card>
);

export default ContactProfileHero;
