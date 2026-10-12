import { Link } from "react-router";
import { Check, Clock, UserPlus, UserRound } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

const ContactCard = ({
  contact,
  profileBasePath = "/contacts",
  connected = false,
  pending = false,
  incoming = false,
  accepting = false,
  onConnect,
  onAccept,
}) => {
  const showConfirm = Boolean(incoming && pending && !connected);

  return (
    <Card className="flex flex-col p-5 text-center">
      <Avatar
        src={contact.avatar}
        alt={contact.name}
        initials={contact.initials}
        size="lg"
        className={`mx-auto ${contact.avatarClass || ""}`}
      />
      <Link
        to={`${profileBasePath}/${contact.id}`}
        className="mt-3 text-[15px] font-semibold text-primary hover:underline"
      >
        {contact.name}
      </Link>
      <p className="mt-1 text-[13px] text-[#475467]">{contact.title}</p>
      <p className="mt-0.5 text-[13px] font-semibold text-deep-blue">
        {contact.company}
      </p>
      <p className="text-[13px] text-[#64748B]">{contact.country}</p>

      <div
        className={`mt-4 grid gap-2 ${connected ? "grid-cols-1" : "grid-cols-2"}`}
      >
        <Link
          to={`${profileBasePath}/${contact.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-[13px] hover:bg-sky-100 font-semibold text-primary transition-opacity hover:opacity-90"
        >
          <UserRound aria-hidden="true" className="h-3.5 w-3.5" />
          View Profile
        </Link>
        {connected ? null : (
          <button
            type="button"
            onClick={() => onConnect?.(contact.id)}
            disabled={pending}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
              pending
                ? "bg-green-secondary text-green-primary"
                : "bg-primary text-white hover:opacity-90"
            }`}
          >
            {pending ? (
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
        )}
      </div>
    </Card>
  );
};

export default ContactCard;
