import { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  Briefcase,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Store,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import logo from '../../assets/logo.png';
import Avatar from '../ui/Avatar';
import Container from '../ui/Container';
import ProfileDropdown from './ProfileDropdown';
import { currentUser, navItems } from '../../data/dashboard';

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

const DashboardNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const isNavActive = (item) => {
    if (item.id === 'home') return pathname === '/feed';
    if (item.id === 'contacts') return pathname.startsWith('/contacts');
    if (item.id === 'marketplace') return pathname.startsWith('/marketplace');
    if (item.id === 'recruitment') return pathname.startsWith('/recruitment');
    if (item.id === 'general') return pathname.startsWith('/general');
    if (item.id === 'messages') return pathname.startsWith('/messages');
    if (item.id === 'blogs') return pathname.startsWith('/blogs');
    if (item.id === 'notifications') return pathname.startsWith('/notifications');
    return pathname === item.to;
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-[70] border-b border-[#E4E7EC] bg-white">
        {/* Mobile & tablet */}
        <div className="mx-auto flex h-14 w-full items-center gap-1.5 px-4 sm:gap-2 sm:px-6 xl:hidden">
          <Link to="/feed" className="flex shrink-0 items-center gap-2" onClick={closeMenu}>
            <img src={logo} alt="Lab Unity" className="h-7 w-auto sm:h-8" />
            <span className="hidden text-[16px] font-bold text-deep-blue sm:inline lg:text-[17px]">
              Lab Unity
            </span>
          </Link>

          <div className="hidden flex-1 sm:block" aria-hidden="true" />

          <div className="relative min-w-0 flex-1 sm:w-[200px] sm:flex-none md:w-[240px] lg:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search professionals, products, jobs"
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F3F4F6] py-2 pl-9 pr-3 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 sm:py-2.5 sm:pl-10 sm:text-[14px]"
            />
          </div>

          <Link
            to="/messages"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#64748B] hover:bg-[#F9FAFB] sm:h-10 sm:w-10"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep-blue hover:bg-[#F9FAFB] sm:h-10 sm:w-10"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop */}
        <Container className="hidden h-[62px] items-center gap-4 xl:flex xl:gap-6">
          <Link to="/feed" className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="Lab Unity" className="h-8 w-auto" />
            <span className="text-[17px] font-bold text-deep-blue">Lab Unity</span>
          </Link>

          <div className="relative mx-auto max-w-[420px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              placeholder="Search professionals, products, jobs..."
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-2 pl-10 pr-4 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <nav className="flex items-center gap-0.5">
            {navItems.map(({ id, label, icon, to }) => {
              const Icon = iconMap[icon];
              const active = isNavActive({ id, to });
              return (
                <Link
                  key={id}
                  to={to}
                  className={`flex min-w-[68px] flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
                    active
                      ? 'text-primary'
                      : 'text-[#64748B] hover:bg-[#F9FAFB] hover:text-deep-blue'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mx-1 h-8 w-px shrink-0 bg-[#E4E7EC]" aria-hidden="true" />

          <ProfileDropdown />
        </Container>
      </header>

      {/* Mobile menu — only mount when open so closed layers never cover the header */}
      {menuOpen && (
        <>
          <div
            aria-hidden="false"
            onClick={closeMenu}
            className="fixed inset-0 z-[60] bg-[#0A1A44]/50 xl:hidden"
          />

          <div className="fixed inset-x-0 top-14 bottom-0 z-[65] overflow-y-auto bg-white xl:hidden">
            <Container className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-4 sm:pb-4">
              <div className="mb-4 flex items-center gap-3 border-b border-[#E4E7EC] pb-4">
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  initials={currentUser.initials}
                  size="md"
                  className="bg-[#FEF3C7] text-[#B45309]"
                />
                <div>
                  <p className="text-[14px] font-semibold text-deep-blue">{currentUser.name}</p>
                  <p className="text-[12px] text-[#64748B]">
                    {currentUser.title} · {currentUser.company}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-2 gap-2">
                {navItems.map(({ id, label, icon, to }) => {
                  const Icon = iconMap[icon];
                  const active = isNavActive({ id, to });
                  return (
                    <li key={id}>
                      <Link
                        to={to}
                        onClick={closeMenu}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] font-medium transition-colors ${
                          active
                            ? 'bg-secondary text-primary'
                            : 'text-[#475467] hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 border-t border-[#E4E7EC] pt-4">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-3 text-[14px] font-semibold text-[#475467] transition-colors hover:border-[#D0D5DD] hover:bg-[#F9FAFB]"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </Link>
              </div>
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardNavbar;
