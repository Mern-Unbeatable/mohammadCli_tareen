import Card from '@/components/ui/Card';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';

const SupplierDashboardView = () => (
  <PanelPage>
    <PanelPageHeader
      title="Supplier Dashboard"
      subtitle="Manage your equipment listings, enquiries and marketplace performance."
    />

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {[
        ['24', 'Active listings'],
        ['8', 'Open enquiries'],
        ['€48.2k', 'Listed inventory value'],
      ].map(([value, label]) => (
        <Card key={label} className="p-4 sm:p-5">
          <p className="text-[24px] font-bold text-deep-blue sm:text-[28px]">{value}</p>
          <p className="mt-1 text-[13px] text-[#64748B]">{label}</p>
        </Card>
      ))}
    </div>
  </PanelPage>
);

export default SupplierDashboardView;
