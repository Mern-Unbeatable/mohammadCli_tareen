import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import MessagesPageContent from '@/shared/pages/messages/MessagesPageContent';

const SupplierMessagesView = () => (
  <PanelPage className="flex h-[calc(100dvh-5.5rem)] flex-col lg:h-[calc(100dvh-3rem)]">
    <MessagesPageContent variant="panel" />
  </PanelPage>
);

export default SupplierMessagesView;
