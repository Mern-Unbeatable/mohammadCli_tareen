const sizes = {
  sm: 'h-9 w-9 text-[12px]',
  md: 'h-11 w-11 text-[13px]',
  lg: 'h-14 w-14 text-[16px]',
  xl: 'h-[104px] w-[104px] text-[28px]',
};

const Avatar = ({ initials, src, alt = '', size = 'md', className = '' }) => (
  <div
    className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F3FB] font-semibold text-primary ${sizes[size]} ${className}`}
  >
    {src ? (
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : (
      initials
    )}
  </div>
);

export default Avatar;
