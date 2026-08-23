import {
  ArrowLeft,
  Image as ImageIcon,
  Info,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

const ConversationItem = ({ chat, active, onClick, showOnline = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 border-b border-[#E4E7EC] px-4 py-3.5 text-left transition-colors last:border-b-0 xl:border-b-0 xl:py-3 ${
      active ? 'bg-secondary' : 'bg-white hover:bg-[#F9FAFB]'
    }`}
  >
    <div className="relative shrink-0">
      {chat.avatar ? (
        <Avatar src={chat.avatar} alt={chat.name} initials={chat.initials} size="md" />
      ) : (
        <Avatar initials={chat.initials} size="md" className={chat.avatarClass} />
      )}
      {showOnline ? (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-primary" />
      ) : null}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[14px] font-semibold text-deep-blue">{chat.name}</p>
        <span className="shrink-0 text-[11px] text-[#98A2B3]">{chat.time}</span>
      </div>
      <p className="mt-0.5 truncate text-[12px] text-[#64748B]">{chat.preview}</p>
    </div>

    {chat.unread > 0 ? (
      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#CC1016] px-1.5 text-[10px] font-bold text-white">
        {chat.unread}
      </span>
    ) : null}
  </button>
);

const MessageBubble = ({ message, showAvatar, chat }) => {
  const isMe = message.from === 'me';

  if (isMe) {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[min(85%,420px)] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[13px] leading-relaxed text-white sm:max-w-[min(100%,420px)]">
          {message.text}
        </div>
        <span className="mt-1 px-1 text-[10px] text-[#98A2B3]">{message.time}</span>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      {showAvatar ? (
        chat.avatar ? (
          <Avatar src={chat.avatar} alt={chat.name} initials={chat.initials} size="sm" />
        ) : (
          <Avatar initials={chat.initials} size="sm" className={chat.avatarClass} />
        )
      ) : (
        <div className="w-9 shrink-0" aria-hidden="true" />
      )}
      <div className="max-w-[min(85%,420px)] sm:max-w-[min(100%,420px)]">
        {message.sender ? (
          <p className="mb-1 text-[11px] font-medium text-[#64748B]">{message.sender}</p>
        ) : null}
        <div className="rounded-2xl rounded-bl-sm bg-[#E8ECF0] px-4 py-2.5 text-[13px] leading-relaxed text-[#334155]">
          {message.text}
        </div>
        <span className="mt-1 block px-1 text-[10px] text-[#98A2B3]">{message.time}</span>
      </div>
    </div>
  );
};

/**
 * Two-panel messenger: conversation list + active chat.
 * Parent controls tab, search, draft, and mobile list/chat panel.
 */
const Messenger = ({
  tab = 'messages',
  onTabChange,
  chats = [],
  activeChat,
  activeChatId,
  onSelectChat,
  query = '',
  onSearchChange,
  draft = '',
  onDraftChange,
  onSend,
  showOnlineIndicator = true,
  showCreateGroupButton = false,
  onCreateGroup,
  mobilePanel = 'list',
  onMobileBack,
  className = '',
  heightClass = 'h-[620px]',
}) => {
  const displayChat = activeChat || chats[0];
  const isMobileChat = mobilePanel === 'chat';

  if (!displayChat) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-[#E4E7EC] bg-white p-8 text-[13px] text-[#64748B] ${heightClass} ${className}`}
      >
        No conversations yet.
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-0 w-full flex-col overflow-hidden bg-white xl:grid xl:grid-cols-[340px_minmax(0,1fr)] xl:rounded-2xl xl:border xl:border-[#E4E7EC] ${heightClass} ${className}`}
    >
      <aside
        className={`flex min-h-0 w-full flex-col border-[#E4E7EC] bg-white xl:h-full xl:border-r ${
          isMobileChat ? 'hidden xl:flex' : 'flex flex-1 xl:flex-none'
        }`}
      >
        <div className="shrink-0 border-b border-[#E4E7EC] p-3 sm:p-4">
          <div className="flex rounded-xl bg-[#F3F4F6] p-1">
            {[
              { id: 'messages', label: 'Messages' },
              { id: 'groups', label: 'Groups' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange?.(id)}
                className={`flex-1 rounded-lg px-3 py-2.5 text-[12px] font-semibold transition-all ${
                  tab === id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-[#64748B] hover:text-deep-blue'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-b border-[#E4E7EC] p-3 sm:p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="search"
              value={query}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-full border border-[#E4E7EC] bg-[#F9FAFB] py-2.5 pl-10 pr-4 text-[13px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {showCreateGroupButton ? (
            <button
              type="button"
              onClick={onCreateGroup}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
            >
              <Plus className="h-4 w-4" />
              Create New Group
            </button>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide xl:divide-y xl:divide-[#E4E7EC]">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ConversationItem
                key={chat.id}
                chat={chat}
                active={chat.id === activeChatId}
                onClick={() => onSelectChat?.(chat.id)}
                showOnline={showOnlineIndicator && tab === 'messages'}
              />
            ))
          ) : (
            <p className="px-4 py-10 text-center text-[13px] text-[#64748B]">No conversations found.</p>
          )}
        </div>
      </aside>

      <section
        className={`flex min-h-0 min-w-0 flex-col bg-white xl:h-full ${
          mobilePanel === 'list' ? 'hidden xl:flex' : 'flex flex-1 xl:flex-none'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            {onMobileBack ? (
              <button
                type="button"
                onClick={onMobileBack}
                className="-ml-1 rounded-lg p-2 text-[#64748B] hover:bg-[#F9FAFB] xl:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : null}

            {displayChat.avatar ? (
              <Avatar
                src={displayChat.avatar}
                alt={displayChat.name}
                initials={displayChat.initials}
                size="md"
              />
            ) : (
              <Avatar initials={displayChat.initials} size="md" className={displayChat.avatarClass} />
            )}

            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-deep-blue sm:text-[15px]">
                {displayChat.name}
              </p>
              <p className="truncate text-[11px] text-[#64748B] sm:text-[12px]">
                {displayChat.subtitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              aria-label="Call"
              className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-[#F9FAFB] hover:text-deep-blue"
            >
              <Phone className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Conversation info"
              className="rounded-full p-2 text-[#64748B] transition-colors hover:bg-[#F9FAFB] hover:text-deep-blue"
            >
              <Info className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-white px-3 py-4 scrollbar-hide sm:px-6 sm:py-5">
          {displayChat.messages.map((message, index) => {
            const prev = displayChat.messages[index - 1];
            const showAvatar =
              message.from === 'them' &&
              (!prev || prev.from !== 'them' || prev.sender !== message.sender);
            return (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={showAvatar}
                chat={displayChat}
              />
            );
          })}
        </div>

        <div className="shrink-0 border-t border-[#E4E7EC] bg-white px-3 pb-3 pt-2.5 sm:px-5 sm:py-4">
          <div className="flex items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-[#F3F4F6] py-1.5 pl-2.5 pr-1.5 sm:gap-2 sm:pl-4">
            <button
              type="button"
              aria-label="Attach file"
              className="shrink-0 rounded-full p-1.5 text-[#64748B] hover:text-deep-blue"
            >
              <Paperclip className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Attach image"
              className="shrink-0 rounded-full p-1.5 text-green-primary hover:opacity-80"
            >
              <ImageIcon className="h-[18px] w-[18px]" />
            </button>
            <input
              type="text"
              value={draft}
              onChange={(e) => onDraftChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend?.();
                }
              }}
              placeholder="Write a message..."
              className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3]"
            />
            <button
              type="button"
              aria-label="Send message"
              onClick={onSend}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-[#066BB0]"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Messenger;
