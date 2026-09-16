import { createSlice } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchThread,
  startDirect,
  createGroup,
  sendMessage,
  deleteMessage,
  leaveConversation,
} from "./messagesThunks";

const initialState = {
  conversations: [],
  conversationsMeta: { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  activeConversationId: null,
  messages: [],
  messagesMeta: { page: 1, pageSize: 50, total: 0, totalPages: 1 },
  conversationsLoading: false,
  messagesLoading: false,
  sending: false,
  actionLoading: false,
  error: null,
};

const upsertConversation = (state, conversation) => {
  if (!conversation?.id) return;
  const index = state.conversations.findIndex(
    (row) => row.id === conversation.id,
  );
  if (index >= 0) state.conversations[index] = conversation;
  else state.conversations = [conversation, ...state.conversations];
};

const messagesSlice = createSlice({
  name: "userMessages",
  initialState,
  reducers: {
    clearMessagesError: (state) => {
      state.error = null;
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload || null;
      if (!action.payload) {
        state.messages = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.conversationsLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        state.conversations = action.payload.data;
        state.conversationsMeta = action.payload.meta;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.conversationsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchThread.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchThread.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.activeConversationId = action.payload.conversationId;
        state.messages = action.payload.data;
        state.messagesMeta = action.payload.meta;
      })
      .addCase(fetchThread.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })
      .addCase(startDirect.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(startDirect.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertConversation(state, action.payload);
        if (action.payload?.id) {
          state.activeConversationId = action.payload.id;
        }
      })
      .addCase(startDirect.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(createGroup.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertConversation(state, action.payload);
        if (action.payload?.id) {
          state.activeConversationId = action.payload.id;
        }
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const { conversationId, message } = action.payload;
        if (message?.id && state.activeConversationId === conversationId) {
          state.messages = [...state.messages, message];
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { messageId } = action.payload;
        state.messages = state.messages.filter((msg) => msg.id !== messageId);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(leaveConversation.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(leaveConversation.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { conversationId } = action.payload;
        state.conversations = state.conversations.filter(
          (c) => c.id !== conversationId,
        );
        if (state.activeConversationId === conversationId) {
          state.activeConversationId = null;
          state.messages = [];
        }
      })
      .addCase(leaveConversation.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessagesError, setActiveConversation } =
  messagesSlice.actions;
export default messagesSlice.reducer;
