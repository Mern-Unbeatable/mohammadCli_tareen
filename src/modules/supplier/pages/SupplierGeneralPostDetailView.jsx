import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import GeneralPostDetailPageContent from '@/shared/pages/general/GeneralPostDetailPageContent';

const SupplierGeneralPostDetailView = () => (
  <PanelPage className="max-w-[760px]">
    <GeneralPostDetailPageContent backPath="/supplier/general" />
  </PanelPage>
);

export default SupplierGeneralPostDetailView;
