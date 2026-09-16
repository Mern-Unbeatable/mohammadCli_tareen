import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { Briefcase, Package, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import { quickLinks } from '@/modules/user/data/dashboard';
import { toProfilePageUser } from '@/features/user/profile';

const iconMap = {
  package: Package,
  briefcase: Briefcase,
  users: Users,
};

const ProfileCard = ({ user }) => {
  if (!user) {
    return (
      <Card className="px-4 py-8 text-center text-[13px] text-[#64748B]">
        Loading profile…
      </Card>
    );
  }

  return (
    <Card className="text-center">
      <Link to="/profile" className="block">
        <div className="h-16 overflow-hidden bg-[#E8F3FB]">
          {user.coverPhoto ? (
            <img
              src={user.coverPhoto}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="-mt-8 px-4 pb-4">
          <Avatar
            src={user.avatar}
            alt={user.name}
            initials={user.initials}
            size="lg"
            className="mx-auto border-4 border-white bg-[#E8F3FB]"
          />
          <h2 className="mt-3 text-[15px] font-bold text-deep-blue transition-colors hover:text-primary">
            {user.name}
          </h2>
          <p className="mt-0.5 text-[13px] text-[#64748B]">{user.title}</p>
          <p className="text-[12px] text-[#98A2B3]">
            {[user.company, user.location].filter(Boolean).join(' · ')}
          </p>
        </div>
      </Link>
      <div className="mx-4 mb-4 flex items-center justify-between border-t border-[#E4E7EC] pt-3">
        <p className="text-[12px] text-[#64748B]">Connections</p>
        <p className="text-[15px] font-bold text-primary">{user.connections}</p>
      </div>
    </Card>
  );
};

const TrialCard = ({ user }) => {
  if (!user || user.membershipStatus !== 'trial') return null;

  const total = user.trialDaysTotal || 90;
  const left = user.trialDaysLeft ?? 0;
  const progress = Math.min(100, Math.max(0, ((total - left) / total) * 100));

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-deep-blue">Free trial</p>
        <span className="text-[12px] text-[#64748B]">
          {left} of {total} days remaining
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E4E7EC]">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${100 - progress}%` }}
        />
      </div>
      <Link
        to="/subscription"
        className="mt-3 flex w-full items-center justify-center rounded-md border border-primary py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
      >
        View plans
      </Link>
    </Card>
  );
};

const QuickLinksCard = () => (
  <Card className="p-2">
    {quickLinks.map(({ id, label, icon, to }) => {
      const Icon = iconMap[icon];
      return (
        <Link
          key={id}
          to={to}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB] hover:text-deep-blue"
        >
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </Link>
      );
    })}
  </Card>
);

const LeftSidebar = () => {
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = toProfilePageUser(user);

  return (
    <div className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-[70px] space-y-3">
        <ProfileCard user={profileUser} />
        <TrialCard user={profileUser} />
        <QuickLinksCard />
      </div>
    </div>
  );
};

export default LeftSidebar;
