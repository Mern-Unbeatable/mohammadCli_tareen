import Card from '@/components/ui/Card';

const AdminDashboardView = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-[24px] font-bold text-deep-blue">Admin Dashboard</h2>
      <p className="mt-1 text-[14px] text-[#64748B]">
        Manage platform users, content moderation and system settings.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        ['2,481', 'Total users'],
        ['186', 'Active suppliers'],
        ['12', 'Pending reviews'],
      ].map(([value, label]) => (
        <Card key={label} className="p-5">
          <p className="text-[28px] font-bold text-deep-blue">{value}</p>
          <p className="mt-1 text-[13px] text-[#64748B]">{label}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminDashboardView;
