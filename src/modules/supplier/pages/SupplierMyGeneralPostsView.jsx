import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import GeneralPageContent from '@/shared/pages/general/GeneralPageContent';

const SupplierMyGeneralPostsView = () => (
  <PanelPage>
    <GeneralPageContent basePath="/supplier/general" activeView="mine" />
  </PanelPage>
);

export default SupplierMyGeneralPostsView;
