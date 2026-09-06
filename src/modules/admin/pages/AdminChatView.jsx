import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import MessagesPageContent from '@/shared/pages/messages/MessagesPageContent';

const AdminChatView = () => (
  <PanelPage className="flex h-[calc(100dvh-5.5rem)] flex-col lg:h-[calc(100dvh-3rem)]">
    <PanelPageHeader
      title="Chat"
      subtitle="Monitor and respond to platform conversations."
    />
    <div className="flex min-h-0 flex-1 flex-col">
      <MessagesPageContent variant="panel" />
    </div>
  </PanelPage>
);

export default AdminChatView;
