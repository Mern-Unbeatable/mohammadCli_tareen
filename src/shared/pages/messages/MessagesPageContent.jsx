import { useEffect, useMemo, useState } from 'react';
import Container from '@/components/ui/Container';
import Messenger from '@/components/data-display/Messenger/Messenger';
import CreateGroupModal from '@/shared/pages/messages/CreateGroupModal';
import NewMessageModal from '@/shared/pages/messages/NewMessageModal';
import { useLayoutChrome } from '@/shared/context/LayoutChromeContext';
import { directChats, groupChats } from '@/modules/user/data/messages';

/**
 * Shared messenger shell.
 * When `conversations` is passed, behaves as controlled (API-backed).
 * When omitted, falls back to demo data (Supplier/Admin keep working).
 */
const MessagesPageContent = ({
  variant = 'dashboard',
  conversations,
  messages,
  loading = false,
  activeConversationId,
  onSelectConversation,
  onSend: onSendProp,
  onStartDirect,
  onCreateGroup,
  onLeave,
  onDeleteMessage,
}) => {
  const isControlled = conversations !== undefined;
  const { setBottomNavHidden } = useLayoutChrome();
  const [tab, setTab] = useState('messages');
  const [query, setQuery] = useState('');
  const [activeDirectId, setActiveDirectId] = useState(directChats[0]?.id);
  const [activeGroupId, setActiveGroupId] = useState(groupChats[0]?.id);
  const [draft, setDraft] = useState('');
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState('list');

  const demoChats = tab === 'messages' ? directChats : groupChats;

  const controlledChats = useMemo(() => {
    if (!isControlled) return [];
    const list = conversations || [];
    return list.filter((chat) =>
      tab === 'groups' ? Boolean(chat.isGroup) : !chat.isGroup,
    );
  }, [isControlled, conversations, tab]);

  const chats = isControlled ? controlledChats : demoChats;

  const activeId = isControlled
    ? activeConversationId || chats[0]?.id
    : tab === 'messages'
      ? activeDirectId
      : activeGroupId;

  const setActiveId = tab === 'messages' ? setActiveDirectId : setActiveGroupId;
  const isMobileChat = mobilePanel === 'chat';
  const isPanel = variant === 'panel';

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (chat) =>
        chat.name?.toLowerCase().includes(q) ||
        chat.preview?.toLowerCase().includes(q),
    );
  }, [chats, query]);

  const baseChat =
    chats.find((chat) => chat.id === activeId) || chats[0] || null;

  const activeChat = useMemo(() => {
    if (!baseChat) return null;
    if (!isControlled) return baseChat;
    const threadMessages = (messages || []).map((msg) => ({
      ...msg,
      text: msg.text || msg.body || '',
    }));
    return { ...baseChat, messages: threadMessages };
  }, [baseChat, isControlled, messages]);

  useEffect(() => {
    if (isPanel) return undefined;

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
  }, [mobilePanel, setBottomNavHidden, isPanel]);

  const openChat = (id) => {
    if (isControlled) {
      onSelectConversation?.(id);
    } else {
      setActiveId(id);
    }
    setMobilePanel('chat');
  };

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    setQuery('');
    setMobilePanel('list');
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    if (onSendProp) {
      onSendProp(draft.trim());
    }
    setDraft('');
  };

  const handleNewMessage = ({ recipientId, message }) => {
    if (onStartDirect) {
      onStartDirect({ recipientId, message });
      setTab('messages');
      setMobilePanel('chat');
      return;
    }
    if (recipientId) {
      setActiveDirectId(recipientId);
      setTab('messages');
      setMobilePanel('chat');
    }
  };

  const handleCreateGroup = (payload) => {
    if (onCreateGroup) {
      onCreateGroup(payload);
      setTab('groups');
      setMobilePanel('chat');
      return;
    }
    setGroupModalOpen(false);
  };

  const messenger = (
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
      showNewMessageButton={tab === 'messages'}
      onNewMessage={() => setNewMessageOpen(true)}
      showCreateGroupButton={tab === 'groups'}
      onCreateGroup={() => setGroupModalOpen(true)}
      onLeave={onLeave}
      onDeleteMessage={onDeleteMessage}
      loading={loading}
      mobilePanel={mobilePanel}
      onMobileBack={() => setMobilePanel('list')}
      heightClass={isPanel ? 'h-full min-h-0' : 'h-full xl:h-[680px]'}
    />
  );

  return (
    <>
      {isPanel ? (
        <div className="flex min-h-0 flex-1 flex-col">{messenger}</div>
      ) : (
        <main
          className={`fixed inset-x-0 top-14 z-20 flex flex-col overflow-hidden bg-[#F3F4F6] xl:static xl:z-auto xl:block xl:overflow-visible xl:py-8 ${
            isMobileChat
              ? 'bottom-0'
              : 'bottom-[calc(3.5rem+env(safe-area-inset-bottom))] sm:bottom-0'
          }`}
        >
          <Container className="flex h-full min-h-0 flex-col max-xl:!px-0">{messenger}</Container>
        </main>
      )}

      <CreateGroupModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreate={handleCreateGroup}
      />

      <NewMessageModal
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
        onSend={handleNewMessage}
      />
    </>
  );
};

export default MessagesPageContent;
