import Card from '@/components/ui/Card';
import { currentUser } from '@/modules/user/data/dashboard';

export {
  InfoTile,
  ContactInfoCard,
  ProfessionalInfoCard,
} from '@/components/data-display/ProfileHero/ProfileHero';
export { default as ProfileHero } from '@/components/data-display/ProfileHero/ProfileHero';

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
