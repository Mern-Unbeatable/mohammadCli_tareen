import Card from '@/components/ui/Card';

const AdminUsersView = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-[24px] font-bold text-deep-blue">Users</h2>
      <p className="mt-1 text-[14px] text-[#64748B]">
        Review and manage registered laboratory professionals.
      </p>
    </div>

    <Card className="p-6">
      <p className="text-[14px] text-[#64748B]">
        User management table will be implemented here.
      </p>
    </Card>
  </div>
);

export default AdminUsersView;
