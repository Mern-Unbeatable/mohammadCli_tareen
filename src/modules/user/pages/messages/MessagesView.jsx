import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MessagesPageContent from '@/shared/pages/messages/MessagesPageContent';
import { useAuth } from '@/shared/auth/useAuth';
import {
  fetchConversations,
  fetchThread,
  startDirect,
  createGroup,
  sendMessage,
  deleteMessage,
  leaveConversation,
  setActiveConversation,
  clearMessagesError,
  toConversationModel,
  toMessageModel,
} from '@/features/user/messages';

const MessagesView = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversationId,
    conversationsLoading,
    messagesLoading,
    error,
  } = useSelector((state) => state.userMessages);

  useEffect(() => {
    dispatch(clearMessagesError());
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (activeConversationId || !conversations?.length) return;
    const firstId = conversations[0]?.id;
    if (!firstId) return;
    dispatch(setActiveConversation(firstId));
    dispatch(fetchThread({ conversationId: firstId }));
  }, [dispatch, conversations, activeConversationId]);

  const mappedConversations = useMemo(
    () => (conversations || []).map(toConversationModel).filter(Boolean),
    [conversations],
  );

  const mappedMessages = useMemo(
    () =>
      (messages || [])
        .map((msg) => {
          const model = toMessageModel(msg, user?.id);
          if (!model) return null;
          return { ...model, text: model.body };
        })
        .filter(Boolean),
    [messages, user?.id],
  );

  const handleSelectConversation = (id) => {
    dispatch(setActiveConversation(id));
    dispatch(fetchThread({ conversationId: id }));
  };

  const handleSend = async (body) => {
    if (!activeConversationId || !body?.trim()) return;
    const result = await dispatch(
      sendMessage({ conversationId: activeConversationId, body: body.trim() }),
    );
    if (sendMessage.rejected.match(result)) {
      toast.error(result.payload || 'Failed to send message');
    }
  };

  const handleStartDirect = async ({ recipientId, message }) => {
    if (!recipientId || !message?.trim()) {
      toast.error('Recipient and message are required');
      return;
    }
    const result = await dispatch(
      startDirect({ participantId: recipientId, message: message.trim() }),
    );
    if (startDirect.fulfilled.match(result)) {
      const conversationId = result.payload?.id;
      if (conversationId) {
        dispatch(setActiveConversation(conversationId));
        dispatch(fetchThread({ conversationId }));
      }
      dispatch(fetchConversations());
      return;
    }
    toast.error(result.payload || 'Failed to start conversation');
  };

  const handleCreateGroup = async ({ name, members }) => {
    if (!name?.trim() || !members?.length) {
      toast.error('Group name and members are required');
      return;
    }
    const result = await dispatch(
      createGroup({ name: name.trim(), participantIds: members }),
    );
    if (createGroup.fulfilled.match(result)) {
      const conversationId = result.payload?.id;
      if (conversationId) {
        dispatch(setActiveConversation(conversationId));
        dispatch(fetchThread({ conversationId }));
      }
      dispatch(fetchConversations());
      return;
    }
    toast.error(result.payload || 'Failed to create group');
  };

  const handleLeave = async () => {
    if (!activeConversationId) return;
    const result = await dispatch(leaveConversation(activeConversationId));
    if (leaveConversation.fulfilled.match(result)) {
      toast.success('Left conversation');
      return;
    }
    toast.error(result.payload || 'Failed to leave conversation');
  };

  const handleDeleteMessage = async (messageId) => {
    if (!activeConversationId || !messageId) return;
    const result = await dispatch(
      deleteMessage({ conversationId: activeConversationId, messageId }),
    );
    if (deleteMessage.rejected.match(result)) {
      toast.error(result.payload || 'Failed to delete message');
    }
  };

  return (
    <MessagesPageContent
      variant="dashboard"
      conversations={mappedConversations}
      messages={mappedMessages}
      loading={conversationsLoading || messagesLoading}
      activeConversationId={activeConversationId}
      onSelectConversation={handleSelectConversation}
      onSend={handleSend}
      onStartDirect={handleStartDirect}
      onCreateGroup={handleCreateGroup}
      onLeave={handleLeave}
      onDeleteMessage={handleDeleteMessage}
    />
  );
};

export default MessagesView;
