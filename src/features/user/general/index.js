/**
 * User general feature public API.
 *
 * - generalApi     → HTTP
 * - generalThunks  → async actions
 * - generalSlice   → state + sync reducers
 * - generalMappers → card / detail / form models
 */

export { default as userGeneralReducer } from "./generalSlice";
export { clearGeneralError, clearSelectedPost } from "./generalSlice";
export {
  fetchGeneralPosts,
  fetchGeneralPostDetails,
  createGeneralPost,
  removeGeneralPost,
} from "./generalThunks";
export {
  GENERAL_CATEGORY_OPTIONS,
  categoryToApi,
  toGeneralPostModel,
  formToCreatePayload,
  formatPostDate,
  formatDisplayDate,
} from "./generalMappers";
export * as generalApi from "./generalApi";
