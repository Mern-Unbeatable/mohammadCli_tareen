import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import MessagesContainer from '@/shared/pages/messages/MessagesContainer';

const SupplierMessagesView = () => (
  <PanelPage className="flex h-[calc(100dvh-5.5rem)] flex-col lg:h-[calc(100dvh-3rem)]">
    <MessagesContainer variant="panel" />
  </PanelPage>
);

export default SupplierMessagesView;
