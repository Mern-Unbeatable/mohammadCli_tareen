import { Link } from 'react-router';
import { Building2, Mail, MapPin, Pencil, Phone } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';
import { currentUser } from '../../data/dashboard';

export const InfoTile = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-[#E4E7EC] bg-white p-4 transition-colors hover:border-[#D0D5DD]">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
      <Icon className="h-4 w-4" strokeWidth={2} />
    </div>
    <p className="text-[12px] font-medium leading-none text-[#64748B]">{label}</p>
    <p className="mt-2 text-[14px] font-semibold leading-snug text-deep-blue">{value}</p>
  </div>
);

export const ProfileHero = ({ user = currentUser, editHref = '/profile/edit' }) => {
  const isPremium = user.membershipStatus === 'premium';

  return (
    <Card>
      <div className="relative h-32 overflow-hidden bg-deep-blue sm:h-36">
        <img src={user.coverPhoto} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/40 to-transparent" />
      </div>

      <div className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <Avatar
              src={user.avatar}
              alt={user.name}
              initials={user.initials}
              size="xl"
              className="-mt-[4.25rem] shrink-0 border-[3px] border-white sm:-mt-[4.75rem]"
            />

            <div className="min-w-0 sm:pb-0.5">
              <h1 className="text-[24px] font-bold leading-tight tracking-tight text-deep-blue sm:text-[28px]">
                {user.name}
              </h1>
              <p className="mt-1 text-[15px] font-medium text-[#475467]">{user.title}</p>
              <p className="mt-0.5 text-[14px] text-[#64748B]">{user.company}</p>
              <p className="mt-1 text-[13px] text-[#98A2B3]">
                {user.location} · {user.connections.toLocaleString()} connections
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  isPremium
                    ? 'bg-[#FEF3E8] text-[#E67E22]'
                    : 'bg-[#FEF9E6] text-[#B8860B]'
                }`}
              >
                {isPremium ? 'Premium Member' : 'Free trial member'}
              </span>
            </div>
          </div>

          <Link
            to={editHref}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#066BB0] sm:w-auto lg:mt-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit profile
          </Link>
        </div>
      </div>
    </Card>
  );
};

export const ProfessionalInfoCard = ({ user = currentUser, extended = false }) => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <h2 className="text-[16px] font-bold text-deep-blue">Professional information</h2>
    </div>
    <div className="space-y-4 px-5 py-5 sm:px-6">
      <p className="text-[14px] leading-[1.7] text-[#475467]">{user.about}</p>
      {extended && user.aboutExtended ? (
        <p className="text-[14px] leading-[1.7] text-[#475467]">{user.aboutExtended}</p>
      ) : null}
    </div>
  </Card>
);

export const ContactInfoCard = ({ user = currentUser, showProfessional = false }) => (
  <Card className="h-full">
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <h2 className="text-[16px] font-bold text-deep-blue">Contact information</h2>
    </div>
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoTile icon={Building2} label="Laboratory / Company" value={user.company} />
        <InfoTile icon={MapPin} label="Country" value={user.country} />
        <InfoTile icon={Mail} label="Email" value={user.email} />
        <InfoTile icon={Phone} label="Phone" value={user.phone} />
      </div>

      {showProfessional && (
        <div className="mt-5 border-t border-[#E4E7EC] pt-5">
          <h3 className="mb-3 text-[14px] font-bold text-deep-blue">Professional information</h3>
          <div className="space-y-4">
            <p className="text-[14px] leading-[1.7] text-[#475467]">{user.about}</p>
            {user.aboutExtended ? (
              <p className="text-[14px] leading-[1.7] text-[#475467]">{user.aboutExtended}</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  </Card>
);

export const SubscriptionDetailsCard = ({ subscription = currentUser.subscription }) => (
  <Card className="h-full">
    <div className="flex items-center gap-2 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <span className="text-[16px] text-[#E67E22]">👑</span>
      <h2 className="text-[16px] font-bold text-deep-blue">Subscription Details</h2>
    </div>

    <dl className="divide-y divide-[#E4E7EC] px-5 sm:px-6">
      {[
        ['Plan Name', subscription.planName],
        ['Status', subscription.status, true],
        ['Start Date', subscription.startDate],
        ['Renewal Date', subscription.renewalDate],
        ['Amount', subscription.amount],
        ['Billing Cycle', subscription.billingCycle],
        ['Next Payment', subscription.nextPayment],
        ['Payment Method', subscription.paymentMethod],
      ].map(([label, value, isStatus]) => (
        <div key={label} className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-[13px] text-[#64748B]">{label}</dt>
          <dd className="text-right text-[13px] font-semibold text-deep-blue">
            {isStatus ? (
              <span className="inline-flex rounded-full bg-green-secondary px-2.5 py-0.5 text-[11px] font-semibold text-green-primary">
                {value}
              </span>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>

    <div className="border-t border-[#E4E7EC] px-5 py-4 sm:px-6">
      <button
        type="button"
        className="w-full rounded-lg border border-primary px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
      >
        Cancel Subscription
      </button>
    </div>
  </Card>
);
