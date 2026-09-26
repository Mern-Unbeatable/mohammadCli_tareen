import { useState } from 'react';
import { useSearchParams } from 'react-router';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs';
import MessagesContainer from '@/shared/pages/messages/MessagesContainer';
import ChatModerationPanel from '@/modules/admin/components/chat/ChatModerationPanel';

const TABS = [
  { id: 'inbox', label: 'My conversations' },
  { id: 'moderation', label: 'Moderation' },
];

const AdminChatView = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('inbox');
  // Deep links (notifications, "Message" on a user profile) always target the inbox.
  const activeTab =
    searchParams.has('conversation') || searchParams.has('user') ? 'inbox' : tab;

  return (
    <PanelPage className="flex h-[calc(100dvh-5.5rem)] flex-col lg:h-[calc(100dvh-3rem)]">
      <PanelPageHeader
        title="Chat"
        subtitle="Message members and moderate platform conversations."
        action={
          <SegmentedTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setTab}
            ariaLabel="Chat sections"
          />
        }
      />
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {activeTab === 'inbox' ? (
          <MessagesContainer variant="panel" />
        ) : (
          <ChatModerationPanel />
        )}
      </div>
    </PanelPage>
  );
};

export default AdminChatView;
