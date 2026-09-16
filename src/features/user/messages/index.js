/**
 * User messages feature public API.
 *
 * - messagesApi     → HTTP
 * - messagesThunks  → async actions
 * - messagesSlice   → state + sync reducers
 * - messagesMappers → conversation / message models
 */

export { default as userMessagesReducer } from "./messagesSlice";
export { clearMessagesError, setActiveConversation } from "./messagesSlice";
export {
  fetchConversations,
  fetchThread,
  startDirect,
  createGroup,
  sendMessage,
  deleteMessage,
  leaveConversation,
} from "./messagesThunks";
export {
  toConversationModel,
  toMessageModel,
  formatMessageTime,
} from "./messagesMappers";
export * as messagesApi from "./messagesApi";
