const Card = ({ className = '', children, ...props }) => (
  <div
    className={`overflow-hidden rounded-xl border border-[#E4E7EC] bg-white ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
