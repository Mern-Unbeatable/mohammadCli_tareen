import { createAsyncThunk } from "@reduxjs/toolkit";
import * as feedApi from "./feedApi";

/**
 * User feed async thunks — orchestration only; HTTP in feedApi.
 */

export const fetchFeed = createAsyncThunk(
  "userFeed/fetchFeed",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await feedApi.getFeed(params);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load feed"),
      );
    }
  },
);

export const fetchPostDetails = createAsyncThunk(
  "userFeed/fetchPostDetails",
  async (postId, { rejectWithValue }) => {
    try {
      return await feedApi.getPostById(postId);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to load post"),
      );
    }
  },
);

export const createPost = createAsyncThunk(
  "userFeed/createPost",
  async (payload, { rejectWithValue }) => {
    try {
      return await feedApi.createPost(payload);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to create post"),
      );
    }
  },
);

export const updatePost = createAsyncThunk(
  "userFeed/updatePost",
  async ({ postId, payload }, { rejectWithValue }) => {
    try {
      return await feedApi.updatePost(postId, payload);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to update post"),
      );
    }
  },
);

export const removePost = createAsyncThunk(
  "userFeed/removePost",
  async (postId, { rejectWithValue }) => {
    try {
      return await feedApi.deletePost(postId);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to delete post"),
      );
    }
  },
);

export const addComment = createAsyncThunk(
  "userFeed/addComment",
  async ({ postId, body }, { rejectWithValue }) => {
    try {
      const comment = await feedApi.addComment(postId, body);
      return { postId, comment };
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to add comment"),
      );
    }
  },
);

export const removeComment = createAsyncThunk(
  "userFeed/removeComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      return await feedApi.deleteComment(postId, commentId);
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to delete comment"),
      );
    }
  },
);

export const reactToPost = createAsyncThunk(
  "userFeed/reactToPost",
  async ({ postId, type }, { rejectWithValue }) => {
    try {
      const data = await feedApi.reactToPost(postId, type);
      return { postId, type, data };
    } catch (err) {
      return rejectWithValue(
        feedApi.getApiErrorMessage(err, "Failed to react to post"),
      );
    }
  },
);
