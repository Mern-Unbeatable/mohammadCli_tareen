import Card from '@/components/ui/Card';

const SupplierDashboardView = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-[24px] font-bold text-deep-blue">Supplier Dashboard</h2>
      <p className="mt-1 text-[14px] text-[#64748B]">
        Manage your equipment listings, enquiries and marketplace performance.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        ['24', 'Active listings'],
        ['8', 'Open enquiries'],
        ['€48.2k', 'Listed inventory value'],
      ].map(([value, label]) => (
        <Card key={label} className="p-5">
          <p className="text-[28px] font-bold text-deep-blue">{value}</p>
          <p className="mt-1 text-[13px] text-[#64748B]">{label}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default SupplierDashboardView;
