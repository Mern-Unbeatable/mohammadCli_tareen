import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { messagesApi } from '@/features/messages';
import { CHAT_SECTIONS, chatPath, chatTargetFor } from '@/shared/constants/chat';
import { useChatRoute } from './useChatRoute';

/**
 * Chat index / unknown-path fallback. Also upgrades legacy query links
 * (`?user=<id>`, `?conversation=<id>`) still stored in older notifications.
 */
const ChatRedirect = () => {
  const { basePath } = useChatRoute();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');
  const conversationId = userId ? null : searchParams.get('conversation');
  const [resolved, setResolved] = useState(null);

  useEffect(() => {
    if (!conversationId) return undefined;
    let cancelled = false;
    messagesApi
      .getConversation(conversationId)
      .then((conversation) => chatTargetFor(conversation))
      .catch(() => {
        toast.error('That conversation is no longer available');
        return null;
      })
      .then((target) => {
        if (!cancelled) setResolved({ conversationId, target });
      });
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  if (userId) {
    return <Navigate to={chatPath(basePath, { section: CHAT_SECTIONS.DIRECT, id: userId })} replace />;
  }
  if (conversationId) {
    if (resolved?.conversationId !== conversationId) return null;
    return <Navigate to={chatPath(basePath, resolved.target ?? undefined)} replace />;
  }
  return <Navigate to={chatPath(basePath)} replace />;
};

export default ChatRedirect;
