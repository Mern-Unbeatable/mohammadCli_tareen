import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import MessagesPageContent from '@/shared/pages/messages/MessagesPageContent';
import NewMessageModal from '@/shared/pages/messages/NewMessageModal';
import CreateGroupModal from '@/shared/pages/messages/CreateGroupModal';
import ConversationInfoModal from '@/shared/pages/messages/ConversationInfoModal';
import { useAuth } from '@/shared/auth/useAuth';
import {
  addParticipants,
  clearMessagesError,
  conversationReadByOther,
  conversationRemoved,
  createGroup,
  deleteMessage,
  fetchConversation,
  fetchConversations,
  fetchRecipients,
  fetchThread,
  isSeenByOther,
  leaveConversation,
  markConversationRead,
  messageReceived,
  messageRemoved,
  messagesApi,
  presenceChanged,
  presenceSet,
  queryPresence,
  removeParticipant,
  renameGroup,
  resetMessages,
  sendMessage,
  setActiveConversation,
  startDirect,
  toConversationModel,
  toMessageModel,
  useMessagesSocket,
} from '@/features/messages';

const SEARCH_DEBOUNCE_MS = 300;
/** Fallback refresh while the realtime connection is down. */
const POLL_INTERVAL_MS = 20000;
const DESKTOP_QUERY = '(min-width: 1280px)';

const typeForTab = (tab) => (tab === 'groups' ? 'group' : 'direct');

const removeParam = (setSearchParams, name) =>
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev);
      next.delete(name);
      return next;
    },
    { replace: true },
  );

/**
 * API-backed messenger shared by User, Supplier and Admin inboxes.
 * Supports `?conversation=<id>` (open a thread) and `?user=<id>` (start a chat).
 */
const MessagesContainer = ({ variant = 'dashboard' }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationParam = searchParams.get('conversation');
  const userParam = searchParams.get('user');

  const {
    conversations,
    conversationsMeta,
    conversationsLoading,
    conversationsLoadingMore,
    activeConversationId,
    activeDetail,
    messages,
    messagesHasMore,
    messagesLoading,
    olderLoading,
    recipients,
    recipientsLoading,
    onlineUserIds,
    sending,
    actionLoading,
    error,
  } = useSelector((state) => state.messages);

  const [tab, setTab] = useState('messages');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [mobilePanel, setMobilePanel] = useState('list');
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const type = typeForTab(tab);
  const socketRef = useRef(null);
  const hasConnectedRef = useRef(false);

  useEffect(() => () => dispatch(resetMessages()), [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(fetchConversations({ type, search, page: 1 }));
  }, [dispatch, type, search]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearMessagesError());
  }, [error, dispatch]);

  // Desktop: open the newest conversation of the current tab when nothing is selected.
  useEffect(() => {
    if (conversationsLoading || activeConversationId || conversations.length === 0) return;
    const first = conversations[0];
    if (Boolean(first.isGroup) !== (type === 'group')) return;
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    dispatch(setActiveConversation(first.id));
    dispatch(fetchThread({ conversationId: first.id }));
  }, [conversationsLoading, activeConversationId, conversations, type, dispatch]);

  // Deep link from notifications: ?conversation=<id>
  useEffect(() => {
    if (!conversationParam) return;
    const id = conversationParam;
    removeParam(setSearchParams, 'conversation');
    dispatch(setActiveConversation(id));
    dispatch(fetchConversation(id)).then((result) => {
      if (!fetchConversation.fulfilled.match(result)) {
        toast.error('That conversation is no longer available');
        dispatch(setActiveConversation(null));
        return;
      }
      setTab(result.payload.isGroup ? 'groups' : 'messages');
      setMobilePanel('chat');
      dispatch(fetchThread({ conversationId: id }));
    });
  }, [conversationParam, dispatch, setSearchParams]);

  const refreshVisible = useCallback(() => {
    dispatch(fetchConversations({ type, search, page: 1, silent: true }));
    if (activeConversationId) {
      dispatch(fetchThread({ conversationId: activeConversationId, silent: true }));
    }
  }, [dispatch, type, search, activeConversationId]);

  const { connected } = useMessagesSocket({
    connect: (instance) => {
      socketRef.current = instance;
      // Catch up on anything missed while disconnected.
      if (hasConnectedRef.current) refreshVisible();
      hasConnectedRef.current = true;
    },
    'message:new': ({ conversationId, message }) => {
      const known = conversations.some((c) => c.id === conversationId);
      dispatch(messageReceived({ conversationId, message, currentUserId }));
      if (!known) dispatch(fetchConversation(conversationId));
      if (
        conversationId === activeConversationId &&
        message?.senderId !== currentUserId &&
        document.visibilityState === 'visible'
      ) {
        dispatch(markConversationRead(conversationId));
      }
    },
    'message:deleted': (payload) => {
      dispatch(messageRemoved(payload));
      dispatch(fetchConversation(payload.conversationId));
    },
    'conversation:new': ({ conversationId }) => {
      dispatch(fetchConversation(conversationId));
    },
    'conversation:updated': ({ conversationId }) => {
      dispatch(fetchConversation(conversationId));
    },
    'conversation:removed': ({ conversationId }) => {
      if (conversationId === activeConversationId) {
        toast.info('This conversation is no longer available');
        setInfoOpen(false);
        setMobilePanel('list');
      }
      dispatch(conversationRemoved(conversationId));
    },
    'conversation:read': (payload) => dispatch(conversationReadByOther(payload)),
    'presence:update': (payload) => dispatch(presenceChanged(payload)),
  });

  useEffect(() => {
    if (connected) return undefined;
    const timer = setInterval(refreshVisible, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [connected, refreshVisible]);

  const activeRaw =
    conversations.find((c) => c.id === activeConversationId) ||
    (activeDetail?.id === activeConversationId ? activeDetail : null);

  const presenceKey = useMemo(() => {
    const ids = new Set(
      conversations.filter((c) => !c.isGroup && c.otherUserId).map((c) => c.otherUserId),
    );
    (activeRaw?.participants || []).forEach((p) => {
      if (p.id !== currentUserId) ids.add(p.id);
    });
    return Array.from(ids).sort().join(',');
  }, [conversations, activeRaw, currentUserId]);

  useEffect(() => {
    if (!connected || !presenceKey) return undefined;
    let cancelled = false;
    queryPresence(socketRef.current, presenceKey.split(',')).then((ids) => {
      if (!cancelled) dispatch(presenceSet(ids));
    });
    return () => {
      cancelled = true;
    };
  }, [connected, presenceKey, dispatch]);

  const onlineSet = useMemo(() => new Set(onlineUserIds), [onlineUserIds]);

  const chats = useMemo(
    () =>
      conversations
        .map((c) => toConversationModel(c, { onlineUserIds: onlineSet }))
        .filter(Boolean),
    [conversations, onlineSet],
  );

  const messageModels = useMemo(
    () => messages.map((m) => toMessageModel(m, currentUserId)).filter(Boolean),
    [messages, currentUserId],
  );

  const activeModel = activeRaw
    ? toConversationModel(activeRaw, { onlineUserIds: onlineSet })
    : null;
  const activeChat = activeModel ? { ...activeModel, messages: messageModels } : null;
  const seen = isSeenByOther(activeRaw, messageModels, currentUserId);

  const handleSearchRecipients = useCallback(
    (term) => dispatch(fetchRecipients({ search: term, include: userParam || undefined })),
    [dispatch, userParam],
  );

  const openChat = (id) => {
    if (id !== activeConversationId) {
      dispatch(setActiveConversation(id));
      dispatch(fetchThread({ conversationId: id }));
    }
    setMobilePanel('chat');
  };

  const handleTabChange = (nextTab) => {
    if (nextTab === tab) return;
    setTab(nextTab);
    setQuery('');
    setSearch('');
    setMobilePanel('list');
    dispatch(setActiveConversation(null));
  };

  const handleSend = async ({ body, attachments }) => {
    if (!activeConversationId) return false;
    const result = await dispatch(
      sendMessage({ conversationId: activeConversationId, body, attachments }),
    );
    return sendMessage.fulfilled.match(result);
  };

  const handleUploadFile = async (file) => {
    try {
      return await messagesApi.uploadAttachment(file);
    } catch (err) {
      toast.error(messagesApi.getApiErrorMessage(err, `Could not upload ${file.name}`));
      return null;
    }
  };

  const openFreshThread = (conversationId, nextTab) => {
    setTab(nextTab);
    setMobilePanel('chat');
    if (conversationId) dispatch(fetchThread({ conversationId }));
  };

  const closeNewMessage = () => {
    setNewMessageOpen(false);
    if (userParam) removeParam(setSearchParams, 'user');
  };

  const handleStartDirect = async ({ recipientId, message }) => {
    const result = await dispatch(startDirect({ participantId: recipientId, message }));
    if (!startDirect.fulfilled.match(result)) return false;
    openFreshThread(result.payload?.id, 'messages');
    return true;
  };

  const handleCreateGroup = async ({ name, members }) => {
    const result = await dispatch(createGroup({ name, participantIds: members }));
    if (!createGroup.fulfilled.match(result)) return false;
    openFreshThread(result.payload?.id, 'groups');
    return true;
  };

  const handleConfirmDelete = async () => {
    const messageId = pendingDeleteId;
    setPendingDeleteId(null);
    if (!activeConversationId || !messageId) return;
    await dispatch(deleteMessage({ conversationId: activeConversationId, messageId }));
  };

  const handleConfirmLeave = async () => {
    if (!activeConversationId) return;
    const result = await dispatch(leaveConversation(activeConversationId));
    setConfirmLeave(false);
    if (leaveConversation.fulfilled.match(result)) {
      toast.success('You left the group');
      setInfoOpen(false);
      setMobilePanel('list');
    }
  };

  const runGroupAction = async (thunk, arg) => {
    const result = await dispatch(thunk(arg));
    return thunk.fulfilled.match(result);
  };

  const hasMoreChats =
    (conversationsMeta?.page ?? 1) < (conversationsMeta?.totalPages ?? 1);

  return (
    <>
      <MessagesPageContent
        variant={variant}
        tab={tab}
        onTabChange={handleTabChange}
        chats={chats}
        activeChat={activeChat}
        activeChatId={activeConversationId}
        onSelectChat={openChat}
        query={query}
        onSearchChange={setQuery}
        onSend={handleSend}
        sending={sending}
        onUploadFile={handleUploadFile}
        showNewMessageButton={tab === 'messages'}
        onNewMessage={() => setNewMessageOpen(true)}
        showCreateGroupButton={tab === 'groups'}
        onCreateGroup={() => setGroupModalOpen(true)}
        onLeave={() => setConfirmLeave(true)}
        onDeleteMessage={setPendingDeleteId}
        onOpenInfo={() => setInfoOpen(true)}
        loading={conversationsLoading}
        threadLoading={messagesLoading}
        hasMoreMessages={messagesHasMore}
        olderLoading={olderLoading}
        onLoadOlder={() =>
          dispatch(
            fetchThread({
              conversationId: activeConversationId,
              before: messages[0]?.time,
            }),
          )
        }
        hasMoreChats={hasMoreChats}
        loadingMoreChats={conversationsLoadingMore}
        onLoadMoreChats={() =>
          dispatch(
            fetchConversations({
              type,
              search,
              page: (conversationsMeta?.page ?? 1) + 1,
            }),
          )
        }
        seen={seen}
        mobilePanel={mobilePanel}
        onMobileBack={() => setMobilePanel('list')}
      />

      <NewMessageModal
        open={newMessageOpen || Boolean(userParam)}
        onClose={closeNewMessage}
        onSend={handleStartDirect}
        recipients={recipients}
        recipientsLoading={recipientsLoading}
        onSearchRecipients={handleSearchRecipients}
        initialRecipientId={userParam}
        submitting={actionLoading}
      />

      <CreateGroupModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreate={handleCreateGroup}
        recipients={recipients}
        recipientsLoading={recipientsLoading}
        onSearchRecipients={handleSearchRecipients}
        submitting={actionLoading}
      />

      <ConversationInfoModal
        open={infoOpen}
        conversation={activeModel}
        currentUserId={currentUserId}
        onlineUserIds={onlineSet}
        onClose={() => setInfoOpen(false)}
        onRename={(name) =>
          runGroupAction(renameGroup, { conversationId: activeConversationId, name })
        }
        onAddMembers={(participantIds) =>
          runGroupAction(addParticipants, {
            conversationId: activeConversationId,
            participantIds,
          })
        }
        onRemoveMember={(userId) =>
          runGroupAction(removeParticipant, {
            conversationId: activeConversationId,
            userId,
          })
        }
        onLeave={() => setConfirmLeave(true)}
        recipients={recipients}
        recipientsLoading={recipientsLoading}
        onSearchRecipients={handleSearchRecipients}
        busy={actionLoading}
      />

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Delete message?"
        description="This removes the message for everyone in the conversation."
        confirmLabel="Delete"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmModal
        open={confirmLeave}
        title="Leave group?"
        description="You will stop receiving messages from this group. Rejoining requires the owner to add you again."
        confirmLabel="Leave"
        confirming={actionLoading}
        onClose={() => setConfirmLeave(false)}
        onConfirm={handleConfirmLeave}
      />
    </>
  );
};

export default MessagesContainer;
