import {
  Bell,
  BookOpen,
  Briefcase,
  Home,
  LayoutGrid,
  MessageSquare,
  Search,
  Store,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import logo from '../../assets/logo.png';
import Avatar from '../ui/Avatar';
import Container from '../ui/Container';

const iconMap = {
  home: Home,
  contacts: Users,
  marketplace: Store,
  recruitment: Briefcase,
  general: LayoutGrid,
  messages: MessageSquare,
  blogs: BookOpen,
  notifications: Bell,
};

const DashboardNavbar = ({ navItems }) => (
  <header className="sticky top-0 z-40 border-b border-[#E4E7EC] bg-white">
    <Container className="flex h-[62px] items-center gap-4 lg:gap-6">
      <Link to="/feed" className="flex shrink-0 items-center gap-2">
        <img src={logo} alt="Lab Unity" className="h-8 w-auto" />
        <span className="hidden text-[17px] font-bold text-deep-blue sm:inline">
          Lab Unity
        </span>
      </Link>

      <div className="relative mx-auto hidden max-w-[420px] flex-1 lg:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
        <input
          type="search"
          placeholder="Search professionals, products, jobs..."
          className="w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-2 pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <nav className="hidden items-center gap-0.5 xl:flex">
        {navItems.map(({ id, label, icon, active }) => {
          const Icon = iconMap[icon];
          return (
            <button
              key={id}
              type="button"
              className={`flex min-w-[68px] flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-[#64748B] hover:bg-[#F9FAFB] hover:text-deep-blue'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <Avatar initials="A" size="sm" className="bg-[#FEF3C7] text-[#B45309]" />
    </Container>
  </header>
);

export default DashboardNavbar;
