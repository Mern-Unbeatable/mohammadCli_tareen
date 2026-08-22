import { NavLink, Outlet } from 'react-router';
import { LayoutDashboard, LogOut, Users } from 'lucide-react';
import Container from '@/components/ui/Container';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
];

const AdminLayout = () => (
  <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
    <header className="border-b border-[#E4E7EC] bg-white">
      <Container className="flex h-14 items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
            Lab Unity
          </p>
          <h1 className="text-[16px] font-bold text-deep-blue">Admin Console</h1>
        </div>
        <NavLink
          to="/login"
          className="inline-flex items-center gap-2 rounded-lg border border-[#E4E7EC] px-3 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </NavLink>
      </Container>
    </header>

    <Container className="flex flex-1 gap-6 py-6 lg:py-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <nav className="rounded-xl border border-[#E4E7EC] bg-white p-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors last:mb-0 ${
                  isActive
                    ? 'bg-secondary text-primary'
                    : 'text-[#475467] hover:bg-[#F9FAFB] hover:text-deep-blue'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </Container>
  </div>
);

export default AdminLayout;
