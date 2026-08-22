import { useState } from 'react';
import { Check, Clock, Mail, RotateCcw, Shield } from 'lucide-react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import { currentUser } from '../../data/dashboard';
import { billingPlans, membershipFeatures } from '../../data/subscription';

const SubscriptionView = () => {
  const [cycle, setCycle] = useState('monthly');
  const plan = billingPlans[cycle];

  return (
    <main className="py-6 sm:py-10">
      <Container className="max-w-[920px]">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F5D78E] bg-[#FEF9E6] px-3 py-1 text-[12px] font-semibold text-[#B8860B]">
          <Clock className="h-3.5 w-3.5" />
          Free trial ends in {currentUser.trialDaysLeft} days
        </span>

        <h1 className="mt-5 text-[28px] font-bold leading-tight text-deep-blue sm:text-[34px]">
          Choose your billing cycle
        </h1>
        <p className="mt-2 text-[15px] text-[#64748B]">
          One plan. Full access. Pick how you want to pay.
        </p>

        <div className="mt-6 inline-flex w-full max-w-[360px] rounded-xl bg-[#F3F4F6] p-1 sm:w-auto">
          {Object.values(billingPlans).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setCycle(option.id)}
              className={`flex-1 rounded-lg px-6 py-2.5 text-[13px] font-semibold transition-all sm:min-w-[140px] ${
                cycle === option.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-[#64748B] hover:text-deep-blue'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Card className="mt-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b border-[#E4E7EC] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <span className="inline-flex rounded-md bg-[#E67E22] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Lab Unity Membership
              </span>

              <p className="mt-5 text-[36px] font-bold leading-none text-deep-blue sm:text-[42px]">
                {plan.price}
                <span className="text-[18px] font-semibold text-[#64748B]"> / {plan.period}</span>
              </p>
              <p className="mt-3 text-[14px] text-[#64748B]">
                No long-term commitment. Cancel anytime.
              </p>

              <ul className="mt-5 space-y-2.5">
                <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                  <Shield className="h-4 w-4 shrink-0 text-primary" />
                  Secure payment
                </li>
                <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                  <RotateCcw className="h-4 w-4 shrink-0 text-primary" />
                  Cancel anytime
                </li>
                <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Invoice provided
                </li>
                <li className="flex items-center gap-2 text-[12px] text-[#64748B]">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  support@labunity.com
                </li>
              </ul>

              <button
                type="button"
                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#066BB0]"
              >
                {plan.subscribeLabel}
              </button>
              <p className="mt-3 text-center text-[12px] text-primary">
                No commitment — Cancel anytime from settings
              </p>
            </div>

            <div className="bg-secondary p-6 sm:p-8">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Everything Included
              </h2>
              <ul className="mt-4 space-y-3">
                {membershipFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-primary" strokeWidth={2.5} />
                    <span className="text-[13px] leading-snug text-[#475467]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </Container>
    </main>
  );
};

export default SubscriptionView;
