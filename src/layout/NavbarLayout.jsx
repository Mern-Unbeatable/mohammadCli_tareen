import { Link } from 'react-router';
import logo from '../assets/logo.png';

const navLinks = [
  { label: 'Platform', to: '/', active: true },
  { label: 'Community', to: '/community' },
  { label: 'Marketplace', to: '/marketplace' },
];

const NavbarLayout = () => {
  return (
    <nav className="w-full bg-white">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-6 lg:h-[76px] lg:gap-4 lg:px-8 xl:h-[84px]">
        <div className="flex items-center gap-10 lg:gap-8 xl:gap-14">
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="Lab Unity"
              className="h-[38px] w-auto object-contain lg:h-[42px] xl:h-[48px]"
            />
          </Link>

          <ul className="flex items-center gap-8 lg:gap-6 xl:gap-10">
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

        <div className="flex items-center gap-6 lg:gap-5 xl:gap-8">
          <Link
            to="/login"
            className="text-[15px] font-normal leading-none text-deep-blue transition-colors hover:text-primary xl:text-[16px]"
          >
            Log in
          </Link>
          <Link
            to="/join"
            className="rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium leading-none text-white transition-opacity hover:opacity-90 lg:px-6 lg:py-2.5 lg:text-[14px] xl:px-8 xl:py-3 xl:text-[15px]"
          >
            Join Lab Unity
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLayout;
