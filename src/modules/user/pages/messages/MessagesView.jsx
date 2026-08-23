import { useEffect, useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import Messenger from '@/components/data-display/Messenger/Messenger';
import CreateGroupModal from '@/modules/user/components/messages/CreateGroupModal';
import { useLayoutChrome } from '@/shared/context/LayoutChromeContext';
import { directChats, groupChats } from '@/modules/user/data/messages';

const MessagesView = () => {
  const { setBottomNavHidden } = useLayoutChrome();
  const [tab, setTab] = useState('messages');
  const [query, setQuery] = useState('');
  const [activeDirectId, setActiveDirectId] = useState(directChats[0].id);
  const [activeGroupId, setActiveGroupId] = useState(groupChats[0].id);
  const [draft, setDraft] = useState('');
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState('list');

  const chats = tab === 'messages' ? directChats : groupChats;
  const activeId = tab === 'messages' ? activeDirectId : activeGroupId;
  const setActiveId = tab === 'messages' ? setActiveDirectId : setActiveGroupId;
  const isMobileChat = mobilePanel === 'chat';

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(q) || chat.preview.toLowerCase().includes(q)
    );
  }, [chats, query]);

  const activeChat = chats.find((chat) => chat.id === activeId) || chats[0];

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1279px)');

    const syncLayout = () => {
      const isMobile = media.matches;
      setBottomNavHidden(isMobile && mobilePanel === 'chat');
      document.documentElement.style.overflow = isMobile ? 'hidden' : '';
      document.body.style.overflow = isMobile ? 'hidden' : '';
    };

    syncLayout();
    media.addEventListener('change', syncLayout);

    return () => {
      media.removeEventListener('change', syncLayout);
      setBottomNavHidden(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [mobilePanel, setBottomNavHidden]);

  const openChat = (id) => {
    setActiveId(id);
    setMobilePanel('chat');
  };

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setQuery('');
    setMobilePanel('list');
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    setDraft('');
  };

  return (
    <>
      <main
        className={`fixed inset-x-0 top-14 z-20 flex flex-col overflow-hidden bg-[#F3F4F6] xl:static xl:z-auto xl:block xl:overflow-visible xl:py-8 ${
          isMobileChat
            ? 'bottom-0'
            : 'bottom-[calc(3.5rem+env(safe-area-inset-bottom))] sm:bottom-0'
        }`}
      >
        <Container className="flex h-full min-h-0 flex-col max-xl:!px-0">
          <Messenger
            tab={tab}
            onTabChange={handleTabChange}
            chats={filteredChats}
            activeChat={activeChat}
            activeChatId={activeId}
            onSelectChat={openChat}
            query={query}
            onSearchChange={setQuery}
            draft={draft}
            onDraftChange={setDraft}
            onSend={handleSend}
            showOnlineIndicator={tab === 'messages'}
            showCreateGroupButton={tab === 'groups'}
            onCreateGroup={() => setGroupModalOpen(true)}
            mobilePanel={mobilePanel}
            onMobileBack={() => setMobilePanel('list')}
            heightClass="h-full xl:h-[680px]"
          />
        </Container>
      </main>

      <CreateGroupModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreate={() => setGroupModalOpen(false)}
      />
    </>
  );
};

export default MessagesView;
