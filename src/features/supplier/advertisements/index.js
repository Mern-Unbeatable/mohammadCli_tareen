/**
 * Supplier advertisements feature public API.
 *
 * - adsApi     → HTTP
 * - adsThunks  → async actions
 * - adsSlice   → state + sync reducers
 * - adsMappers → list/detail/create models
 */

export { default as supplierAdsReducer } from "./adsSlice";
export {
  clearSupplierAdsError,
  clearSelectedSupplierAd,
} from "./adsSlice";
export {
  fetchSupplierAds,
  fetchSupplierAdDetails,
  createSupplierAd,
  updateSupplierAd,
  removeSupplierAd,
} from "./adsThunks";
export {
  statusFilterToApi,
  categoryIdToApi,
  durationIdToDays,
  toAdRowModel,
  toAdDetailModel,
  formToCreatePayload,
  formatUploadDate,
  formatDisplayDate,
  formatPrice,
} from "./adsMappers";
export * as adsApi from "./adsApi";
