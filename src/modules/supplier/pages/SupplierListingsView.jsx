import Card from '@/components/ui/Card';

const SupplierListingsView = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-[24px] font-bold text-deep-blue">My Listings</h2>
      <p className="mt-1 text-[14px] text-[#64748B]">
        Create, edit and track your marketplace equipment listings.
      </p>
    </div>

    <Card className="p-6">
      <p className="text-[14px] text-[#64748B]">
        Supplier listing management will be implemented here.
      </p>
    </Card>
  </div>
);

export default SupplierListingsView;
