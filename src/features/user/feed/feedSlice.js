import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFeed,
  fetchPostDetails,
  createPost,
  updatePost,
  removePost,
  addComment,
  removeComment,
  reactToPost,
  likeComment,
} from "./feedThunks";

const initialState = {
  posts: [],
  postsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  selectedPost: null,
  postsLoading: false,
  selectedPostLoading: false,
  saving: false,
  deleting: false,
  commenting: false,
  reactingId: null,
  likingCommentId: null,
  error: null,
};

const upsertPost = (state, post) => {
  if (!post?.id) return;
  const index = state.posts.findIndex((row) => row.id === post.id);
  if (index >= 0) state.posts[index] = post;
  else state.posts = [post, ...state.posts];
  if (state.selectedPost?.id === post.id) state.selectedPost = post;
};

const feedSlice = createSlice({
  name: "userFeed",
  initialState,
  reducers: {
    clearFeedError: (state) => {
      state.error = null;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.postsLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload.data;
        state.postsMeta = action.payload.meta;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostDetails.pending, (state) => {
        state.selectedPostLoading = true;
        state.error = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.selectedPostLoading = false;
        state.selectedPost = action.payload;
        upsertPost(state, action.payload);
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.selectedPostLoading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.saving = false;
        upsertPost(state, action.payload);
        if (action.payload?.id) {
          state.postsMeta = {
            ...state.postsMeta,
            total: (state.postsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.saving = false;
        upsertPost(state, action.payload);
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removePost.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.deleting = false;
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.postId,
        );
        if (state.selectedPost?.id === action.payload.postId) {
          state.selectedPost = null;
        }
      })
      .addCase(removePost.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.commenting = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commenting = false;
        const { postId, comment } = action.payload;
        const parentId =
          comment?.parentCommentId ?? action.payload.parentCommentId ?? null;

        const commentExists = (list = []) =>
          list.some(
            (row) =>
              row.id === comment.id ||
              commentExists(row.replies),
          );

        const insertIntoTree = (list = []) =>
          list.map((row) => {
            if (row.id === parentId) {
              const replies = Array.isArray(row.replies) ? row.replies : [];
              return {
                ...row,
                replyCount: (row.replyCount ?? replies.length) + 1,
                replies: [comment, ...replies],
              };
            }
            if (!Array.isArray(row.replies) || row.replies.length === 0) {
              return row;
            }
            return { ...row, replies: insertIntoTree(row.replies) };
          });

        const insertComment = (post) => {
          if (!post || post.id !== postId || !comment?.id) return post;
          const comments = Array.isArray(post.comments) ? post.comments : [];
          if (commentExists(comments)) return post;

          const nextCount =
            (post.stats?.comments ?? post.commentCount ?? 0) + 1;

          if (parentId) {
            return {
              ...post,
              comments: insertIntoTree(comments),
              commentCount: nextCount,
              stats: {
                ...(post.stats || {}),
                comments: nextCount,
              },
            };
          }

          return {
            ...post,
            comments: [
              {
                ...comment,
                replies: comment.replies ?? [],
                replyCount: comment.replyCount ?? 0,
              },
              ...comments,
            ],
            commentCount: nextCount,
            stats: {
              ...(post.stats || {}),
              comments: nextCount,
            },
          };
        };
        state.posts = state.posts.map(insertComment);
        state.selectedPost = insertComment(state.selectedPost);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commenting = false;
        state.error = action.payload;
      })
      .addCase(removeComment.pending, (state) => {
        state.commenting = true;
        state.error = null;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.commenting = false;
        const { postId, commentId } = action.payload;
        const stripComment = (post) => {
          if (!post || post.id !== postId) return post;
          let removed = 0;

          const countTree = (node) =>
            1 +
            (Array.isArray(node.replies)
              ? node.replies.reduce((sum, child) => sum + countTree(child), 0)
              : 0);

          const stripTree = (list = []) =>
            list
              .map((row) => {
                if (row.id === commentId) {
                  removed = countTree(row);
                  return null;
                }
                if (!Array.isArray(row.replies) || row.replies.length === 0) {
                  return row;
                }
                const nextReplies = stripTree(row.replies);
                if (nextReplies.length === row.replies.length) return row;
                return {
                  ...row,
                  replies: nextReplies,
                  replyCount: nextReplies.length,
                };
              })
              .filter(Boolean);

          const nextComments = stripTree(post.comments);
          const nextCount = Math.max(
            0,
            (post.stats?.comments ?? post.commentCount ?? 0) - removed,
          );
          return {
            ...post,
            comments: nextComments,
            commentCount: nextCount,
            stats: {
              ...(post.stats || {}),
              comments: nextCount,
            },
          };
        };
        state.posts = state.posts.map(stripComment);
        state.selectedPost = stripComment(state.selectedPost);
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.commenting = false;
        state.error = action.payload;
      })
      .addCase(reactToPost.pending, (state, action) => {
        state.reactingId = action.meta.arg?.postId || null;
        state.error = null;
      })
      .addCase(reactToPost.fulfilled, (state, action) => {
        state.reactingId = null;
        const { postId, data } = action.payload;
        const myReaction =
          data?.myReaction !== undefined
            ? data.myReaction
            : data?.reacted
              ? data?.type ?? null
              : data?.reacted === false
                ? null
                : undefined;
        const reactionCount =
          data?.reactionCount ?? data?.stats?.reactions ?? undefined;

        const applyReaction = (post) => {
          if (!post || post.id !== postId) return post;

          const nextMyReaction =
            myReaction !== undefined ? myReaction : post.myReaction;
          const nextCount =
            reactionCount !== undefined
              ? reactionCount
              : (post.stats?.reactions ?? post.reactionCount ?? 0);

          return {
            ...post,
            myReaction: nextMyReaction,
            reactionCount: nextCount,
            reactionCounts: data?.reactionCounts ?? post.reactionCounts,
            stats: {
              ...(post.stats || {}),
              reactions: nextCount,
            },
          };
        };
        state.posts = state.posts.map(applyReaction);
        state.selectedPost = applyReaction(state.selectedPost);
      })
      .addCase(reactToPost.rejected, (state, action) => {
        state.reactingId = null;
        state.error = action.payload;
      })
      .addCase(likeComment.pending, (state, action) => {
        state.likingCommentId = action.meta.arg?.commentId || null;
        state.error = null;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.likingCommentId = null;
        const { postId, commentId, data } = action.payload;
        const liked = Boolean(data?.liked ?? data?.isLiked);
        const likeCount =
          data?.likeCount ??
          (typeof data?.likesCount === "number" ? data.likesCount : undefined);

        const applyLike = (post) => {
          if (!post || post.id !== postId) return post;

          const patchTree = (list = []) =>
            list.map((comment) => {
              const next =
                comment.id === commentId
                  ? {
                      ...comment,
                      liked,
                      isLiked: liked,
                      likeCount:
                        likeCount !== undefined
                          ? likeCount
                          : Math.max(
                              0,
                              (comment.likeCount ?? 0) + (liked ? 1 : -1),
                            ),
                    }
                  : comment;
              if (!Array.isArray(comment.replies) || comment.replies.length === 0) {
                return next;
              }
              return { ...next, replies: patchTree(comment.replies) };
            });

          return {
            ...post,
            comments: patchTree(post.comments),
          };
        };
        state.posts = state.posts.map(applyLike);
        state.selectedPost = applyLike(state.selectedPost);
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.likingCommentId = null;
        state.error = action.payload;
      });
  },
});

export const { clearFeedError, clearSelectedPost } = feedSlice.actions;
export default feedSlice.reducer;
