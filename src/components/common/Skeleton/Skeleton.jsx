const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-[#E4E7EC] ${className}`} aria-hidden />
);

export default Skeleton;
