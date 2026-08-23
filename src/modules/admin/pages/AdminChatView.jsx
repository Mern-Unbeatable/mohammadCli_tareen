import { useEffect, useMemo, useState } from 'react';
import Messenger from '@/components/data-display/Messenger/Messenger';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import PanelPageHeader from '@/shared/layout/PanelLayout/PanelPageHeader';
import { directChats } from '@/modules/user/data/messages';

const AdminChatView = () => {
  const [activeId, setActiveId] = useState(directChats[0].id);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [mobilePanel, setMobilePanel] = useState('list');

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return directChats;
    return directChats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(q) || chat.preview.toLowerCase().includes(q)
    );
  }, [query]);

  const activeChat = directChats.find((chat) => chat.id === activeId) || directChats[0];

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1279px)').matches;
    if (isMobile && mobilePanel === 'chat') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [mobilePanel]);

  return (
    <PanelPage className="flex min-h-0 flex-col">
      <PanelPageHeader
        title="Chat"
        subtitle="Monitor and respond to platform conversations."
      />

      <Messenger
        tab="messages"
        chats={filteredChats}
        activeChat={activeChat}
        activeChatId={activeId}
        onSelectChat={(id) => {
          setActiveId(id);
          setMobilePanel('chat');
        }}
        query={query}
        onSearchChange={setQuery}
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => setDraft('')}
        showOnlineIndicator
        mobilePanel={mobilePanel}
        onMobileBack={() => setMobilePanel('list')}
        heightClass="h-[calc(100dvh-10rem)] min-h-[420px] xl:h-[calc(100vh-11rem)]"
        className="rounded-xl border border-[#E4E7EC] xl:rounded-2xl"
      />
    </PanelPage>
  );
};

export default AdminChatView;
