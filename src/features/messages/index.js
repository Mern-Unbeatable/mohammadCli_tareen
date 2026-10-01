/**
 * Messaging feature public API (shared by User, Supplier and Admin).
 *
 * - messagesApi     → HTTP
 * - messagesThunks  → async actions
 * - messagesSlice   → state + sync reducers (incl. realtime events)
 * - messagesMappers → conversation / message UI models
 * - realtime        → Socket.IO client + hook
 */

export { default as messagesReducer } from "./messagesSlice";
export {
  clearMessagesError,
  setActiveConversation,
  resetMessages,
  messageReceived,
  messageRemoved,
  conversationRemoved,
  conversationReadByOther,
  presenceSet,
  presenceChanged,
} from "./messagesSlice";
export {
  fetchConversations,
  fetchConversation,
  fetchThread,
  markConversationRead,
  fetchRecipients,
  startDirect,
  createGroup,
  sendMessage,
  deleteMessage,
  leaveConversation,
  renameGroup,
  addParticipants,
  removeParticipant,
  fetchUnreadSummary,
} from "./messagesThunks";
export {
  toConversationModel,
  toMessageModel,
  formatMessageTime,
  formatBubbleTime,
  attachmentSummary,
  isImageAttachment,
  isSeenByOther,
} from "./messagesMappers";
export { useMessagesSocket, queryPresence } from "./realtime";
export { useUnreadMessages } from "./useUnreadMessages";
export * as messagesApi from "./messagesApi";
