import { Link } from 'react-router';
import { Clock, UserPlus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';

const ContactCard = ({ contact, connected = false, pending = false, onConnect }) => (
  <Card className="flex flex-col p-5 text-center">
    <Avatar
      src={contact.avatar}
      alt={contact.name}
      initials={contact.initials}
      size="lg"
      className={`mx-auto ${contact.avatarClass || ''}`}
    />
    <Link
      to={`/contacts/${contact.id}`}
      className="mt-3 text-[15px] font-semibold text-primary hover:underline"
    >
      {contact.name}
    </Link>
    <p className="mt-1 text-[13px] text-[#475467]">{contact.title}</p>
    <p className="mt-0.5 text-[13px] font-semibold text-deep-blue">{contact.company}</p>
    <p className="text-[13px] text-[#64748B]">{contact.country}</p>

    <div className="mt-4 grid grid-cols-2 gap-2">
      <Link
        to={`/contacts/${contact.id}`}
        className="rounded-md bg-pink-secondary px-3 py-2 text-[13px] font-semibold text-pink-light transition-opacity hover:opacity-90"
      >
        Profile
      </Link>
      <button
        type="button"
        onClick={() => onConnect?.(contact.id)}
        disabled={connected || pending}
        className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
          connected || pending
            ? 'bg-green-secondary text-green-primary'
            : 'bg-primary text-white hover:opacity-90'
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
    </div>
  </Card>
);

export default ContactCard;
