/**
 * User feed feature public API.
 *
 * - feedApi     → HTTP
 * - feedThunks  → async actions
 * - feedSlice   → state + sync reducers
 * - feedMappers → post card models
 */

export { default as userFeedReducer } from "./feedSlice";
export { clearFeedError, clearSelectedPost } from "./feedSlice";
export {
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
export {
  toFeedPostModel,
  formatRelativeTime,
} from "./feedMappers";
export * as feedApi from "./feedApi";
export { getApiErrorMessage } from "@/api";
