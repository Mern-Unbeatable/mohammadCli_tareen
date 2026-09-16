import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGeneralPosts,
  fetchGeneralPostDetails,
  createGeneralPost,
  removeGeneralPost,
} from "./generalThunks";

const initialState = {
  posts: [],
  postsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  selectedPost: null,
  postsLoading: false,
  selectedPostLoading: false,
  saving: false,
  deleting: false,
  error: null,
};

const generalSlice = createSlice({
  name: "userGeneral",
  initialState,
  reducers: {
    clearGeneralError: (state) => {
      state.error = null;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralPosts.pending, (state) => {
        state.postsLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload.data;
        state.postsMeta = action.payload.meta;
      })
      .addCase(fetchGeneralPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchGeneralPostDetails.pending, (state) => {
        state.selectedPostLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralPostDetails.fulfilled, (state, action) => {
        state.selectedPostLoading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchGeneralPostDetails.rejected, (state, action) => {
        state.selectedPostLoading = false;
        state.error = action.payload;
      })
      .addCase(createGeneralPost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createGeneralPost.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload?.id) {
          state.posts = [action.payload, ...state.posts];
          state.postsMeta = {
            ...state.postsMeta,
            total: (state.postsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createGeneralPost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeGeneralPost.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeGeneralPost.fulfilled, (state, action) => {
        state.deleting = false;
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.postId,
        );
        if (state.selectedPost?.id === action.payload.postId) {
          state.selectedPost = null;
        }
      })
      .addCase(removeGeneralPost.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearGeneralError, clearSelectedPost } = generalSlice.actions;
export default generalSlice.reducer;
