/**
 * User search feature public API.
 *
 * - searchApi     → HTTP
 * - searchThunks  → async actions
 * - searchSlice   → state + sync reducers
 * - searchMappers → result models
 */

export { default as userSearchReducer } from "./searchSlice";
export { clearSearchError, clearSearchResults } from "./searchSlice";
export { fetchGlobalSearch } from "./searchThunks";
export { toSearchResultsModel } from "./searchMappers";
export * as searchApi from "./searchApi";
