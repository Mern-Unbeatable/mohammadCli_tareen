import { useEffect, useRef, useState } from 'react';
import { CreditCard, LogOut, User } from 'lucide-react';
import { Link } from 'react-router';
import Avatar from '@/components/ui/Avatar';
import { currentUser } from '@/modules/user/data/dashboard';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <Avatar
          src={currentUser.avatar}
          alt={currentUser.name}
          initials={currentUser.initials}
          size="sm"
          className="bg-[#FEF3C7] text-[#B45309]"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[290px] overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          <div className="border-b border-[#E4E7EC] px-4 py-4">
            <p className="text-[15px] font-bold text-deep-blue">{currentUser.name}</p>
            <p className="mt-1 text-[12px] leading-snug text-[#64748B]">
              {currentUser.title} · {currentUser.company}
            </p>
          </div>

          <div className="border-b border-[#E4E7EC] px-4 py-3">
            <div className="rounded-lg bg-[#FEF9E6] px-3.5 py-3">
              <p className="text-[13px] font-semibold text-deep-blue">
                Free trial · {currentUser.trialDaysLeft} days left
              </p>
              <Link
                to="/subscription"
                onClick={close}
                className="mt-1 inline-block text-[12px] font-semibold text-primary hover:underline"
              >
                View membership plans
              </Link>
            </div>
          </div>

          <ul className="py-1">
            <li>
              <Link
                to="/profile"
                role="menuitem"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB]"
              >
                <User className="h-[18px] w-[18px] text-[#64748B]" strokeWidth={1.8} />
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/subscription"
                role="menuitem"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB]"
              >
                <CreditCard className="h-[18px] w-[18px] text-[#64748B]" strokeWidth={1.8} />
                Subscription
              </Link>
            </li>
          </ul>

          <div className="border-t border-[#E4E7EC]">
            <Link
              to="/login"
              role="menuitem"
              onClick={close}
              className="flex items-center gap-3 bg-[#FEF2F2] px-4 py-3 text-[13px] font-semibold text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
              Log out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
