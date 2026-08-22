import { Briefcase, Package, Users } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import { currentUser, quickLinks } from '../../data/dashboard';

const iconMap = {
  package: Package,
  briefcase: Briefcase,
  users: Users,
};

const ProfileCard = () => (
  <Card className="text-center">
    <div className="h-16 overflow-hidden">
      <img
        src={currentUser.coverPhoto}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
    <div className="-mt-8 px-4 pb-4">
      <Avatar
        src={currentUser.avatar}
        alt={currentUser.name}
        initials={currentUser.initials}
        size="lg"
        className="mx-auto border-4 border-white bg-[#E8F3FB]"
      />
      <h2 className="mt-3 text-[15px] font-bold text-deep-blue">{currentUser.name}</h2>
      <p className="mt-0.5 text-[13px] text-[#64748B]">{currentUser.title}</p>
      <p className="text-[12px] text-[#98A2B3]">
        {currentUser.company} · {currentUser.location}
      </p>
      <div className="mt-3 border-t border-[#E4E7EC] pt-3 flex items-center justify-between">
        <p className="text-[12px] text-[#64748B]">Connections</p>
        <p className="text-[15px] font-bold text-primary">{currentUser.connections}</p>
      </div>
    </div>
  </Card>
);

const TrialCard = () => {
  const progress =
    ((currentUser.trialDaysTotal - currentUser.trialDaysLeft) /
      currentUser.trialDaysTotal) *
    100;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-deep-blue">Free trial</p>
        <span className="text-[12px] text-[#64748B]">
          {currentUser.trialDaysLeft} of {currentUser.trialDaysTotal} days remaining
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${100 - progress}%` }}
        />
      </div>
      <button
        type="button"
        className="mt-3 w-full rounded-md border border-primary py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
      >
        View plans
      </button>
    </Card>
  );
};

const QuickLinksCard = () => (
  <Card className="p-2">
    {quickLinks.map(({ id, label, icon }) => {
      const Icon = iconMap[icon];
      return (
        <button
          key={id}
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB]"
        >
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </button>
      );
    })}
  </Card>
);

const LeftSidebar = () => (
  <div className="hidden w-60 shrink-0 lg:block">
    <div className="sticky top-[70px] space-y-3">
      <ProfileCard />
      <TrialCard />
      <QuickLinksCard />
    </div>
  </div>
);

export default LeftSidebar;
