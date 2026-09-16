import { createAsyncThunk } from "@reduxjs/toolkit";
import * as messagesApi from "./messagesApi";

/**
 * User messages async thunks — orchestration only; HTTP in messagesApi.
 */

export const fetchConversations = createAsyncThunk(
  "userMessages/fetchConversations",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await messagesApi.getConversations(params);
    } catch (err) {
      return rejectWithValue(
        messagesApi.getApiErrorMessage(err, "Failed to load conversations"),
      );
    }
  },
);

export const fetchThread = createAsyncThunk(
  "userMessages/fetchThread",
  async ({ conversationId, ...params }, { rejectWithValue }) => {
    try {
      const result = await messagesApi.getThread(conversationId, params);
      return { conversationId, ...result };
    } catch (err) {
      return rejectWithValue(
        messagesApi.getApiErrorMessage(err, "Failed to load messages"),
      );
    }
  },
);

export const startDirect = createAsyncThunk(
  "userMessages/startDirect",
  async (payload, { rejectWithValue }) => {
    try {
      return await messagesApi.startDirect(payload);
    } catch (err) {
      return rejectWithValue(
        messagesApi.getApiErrorMessage(err, "Failed to start conversation"),
      );
    }
  },
);

export const createGroup = createAsyncThunk(
  "userMessages/createGroup",
  async (payload, { rejectWithValue }) => {
    try {
      return await messagesApi.createGroup(payload);
    } catch (err) {
      return rejectWithValue(
        messagesApi.getApiErrorMessage(err, "Failed to create group"),
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "userMessages/sendMessage",
  async ({ conversationId, body }, { rejectWithValue }) => {
    try {
      const message = await messagesApi.sendMessage(conversationId, body);
      return { conversationId, message };
    } catch (err) {
      return rejectWithValue(
        messagesApi.getApiErrorMessage(err, "Failed to send message"),
      );
    }
  },
);

export const deleteMessage = createAsyncThunk(
  "userMessages/deleteMessage",
  async ({ conversationId, messageId }, { rejectWithValue }) => {
    try {
      return await messagesApi.deleteMessage(conversationId, messageId);
    } catch (err) {
      return rejectWithValue(
        messagesApi.getApiErrorMessage(err, "Failed to delete message"),
      );
    }
  },
);

export const leaveConversation = createAsyncThunk(
  "userMessages/leaveConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      return await messagesApi.leaveConversation(conversationId);
    } catch (err) {
      return rejectWithValue(
        messagesApi.getApiErrorMessage(err, "Failed to leave conversation"),
      );
    }
  },
);
