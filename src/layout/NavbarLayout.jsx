import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const navLinks = [
  { label: 'Platform', to: '/', active: true },
  { label: 'Community', to: '/community' },
  { label: 'Marketplace', to: '/marketplace' },
];

const NavbarLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-[70] w-full border-b border-[#F0F0F0] bg-white">
        <div className="container mx-auto flex h-[72px] items-center justify-between px-6 lg:h-[76px] lg:px-8 xl:h-[84px]">
          <div className="flex items-center gap-10 lg:gap-8 xl:gap-14">
            <Link to="/" className="shrink-0" onClick={closeMenu}>
              <img
                src={logo}
                alt="Lab Unity"
                className="h-[38px] w-auto object-contain lg:h-[42px] xl:h-[48px]"
              />
            </Link>

            <ul className="hidden items-center gap-8 lg:flex lg:gap-6 xl:gap-10">
              {navLinks.map(({ label, to, active }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className={`text-[15px] leading-none transition-colors xl:text-[16px] ${
                      active
                        ? 'font-medium text-primary'
                        : 'font-normal text-[#6B7280] hover:text-primary'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden items-center gap-6 lg:flex lg:gap-5 xl:gap-8">
            <Link
              to="/login"
              className="text-[15px] font-normal leading-none text-deep-blue transition-colors hover:text-primary xl:text-[16px]"
            >
              Log in
            </Link>
            <Link
              to="/join"
              className="rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium leading-none text-white transition-opacity hover:opacity-90 xl:px-8 xl:py-3 xl:text-[15px]"
            >
              Join Lab Unity
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-deep-blue transition-colors lg:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Backdrop overlay — full screen */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-[#0A1A44]/45 transition-opacity duration-300 ease-out lg:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Mobile menu — fixed full width, slides down from navbar */}
      <div
        className={`fixed left-0 right-0 top-[72px] z-[65] w-full border-b border-[#F0F0F0] bg-white shadow-[0_12px_32px_rgba(10,26,68,0.1)] transition-all duration-300 ease-out lg:hidden ${
          menuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        <div className="px-6 py-5">
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ label, to, active }) => (
              <li key={label}>
                <Link
                  to={to}
                  onClick={closeMenu}
                  className={`block text-[16px] leading-none transition-colors ${
                    active
                      ? 'font-medium text-primary'
                      : 'font-normal text-[#6B7280] hover:text-primary'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 border-t border-[#F0F0F0] pt-5">
            <Link
              to="/login"
              onClick={closeMenu}
              className="text-center text-[15px] font-normal text-deep-blue transition-colors hover:text-primary"
            >
              Log in
            </Link>
            <Link
              to="/join"
              onClick={closeMenu}
              className="rounded-full bg-primary px-6 py-3 text-center text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Join Lab Unity
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarLayout;
