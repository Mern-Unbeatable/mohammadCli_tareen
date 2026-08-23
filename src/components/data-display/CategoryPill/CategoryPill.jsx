const CATEGORY_STYLES = {
  'product showcase': 'bg-secondary text-primary',
  'service offering': 'bg-green-secondary text-green-primary',
  'promotional offer': 'bg-[#FEF3E8] text-[#E67E22]',
  'webinar/event': 'bg-pink-secondary text-pink-light',
};

const CategoryPill = ({ label, className = '' }) => {
  const key = String(label || '').trim().toLowerCase();
  const styles = CATEGORY_STYLES[key] || 'bg-[#F3F4F6] text-[#64748B]';

  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${styles} ${className}`}
    >
      {label}
    </span>
  );
};

export default CategoryPill;
