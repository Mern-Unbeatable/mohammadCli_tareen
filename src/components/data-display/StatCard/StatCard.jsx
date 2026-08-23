import Card from '@/components/ui/Card';

const toneStyles = {
  blue: 'bg-secondary text-primary',
  pink: 'bg-pink-secondary text-pink-light',
  green: 'bg-green-secondary text-green-primary',
  orange: 'bg-[#FEF3E8] text-[#E67E22]',
  purple: 'bg-[#F3E8FF] text-[#7C3AED]',
};

const StatCard = ({ icon: Icon, label, value, tone = 'blue', className = '' }) => (
  <Card className={`p-4 sm:p-5 ${className}`}>
    <div
      className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${toneStyles[tone] || toneStyles.blue}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
    </div>
    <p className="text-[13px] font-medium text-[#64748B] sm:text-[14px] lg:text-[15px]">{label}</p>
    <p className="mt-1 text-[22px] font-bold leading-none text-deep-blue sm:text-[24px] lg:text-[26px]">{value}</p>
  </Card>
);

export default StatCard;
