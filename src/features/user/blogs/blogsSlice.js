import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogs,
  fetchLatestBlogs,
  fetchBlogBySlug,
} from "./blogsThunks";

const initialState = {
  blogs: [],
  blogsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  latestBlogs: [],
  selectedBlog: null,
  blogsLoading: false,
  latestLoading: false,
  selectedBlogLoading: false,
  error: null,
};

const blogsSlice = createSlice({
  name: "userBlogs",
  initialState,
  reducers: {
    clearBlogsError: (state) => {
      state.error = null;
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.blogsLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogsLoading = false;
        state.blogs = action.payload.data;
        state.blogsMeta = action.payload.meta;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.blogsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchLatestBlogs.pending, (state) => {
        state.latestLoading = true;
      })
      .addCase(fetchLatestBlogs.fulfilled, (state, action) => {
        state.latestLoading = false;
        state.latestBlogs = action.payload.data;
      })
      .addCase(fetchLatestBlogs.rejected, (state, action) => {
        state.latestLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.selectedBlogLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.selectedBlogLoading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.selectedBlogLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogsError, clearSelectedBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
