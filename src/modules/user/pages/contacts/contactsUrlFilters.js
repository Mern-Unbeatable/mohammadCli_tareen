import { COUNTRY_OPTIONS } from "@/features/user/contacts";
import { PAGE_PARAM } from "@/shared/hooks/usePageParam";

export const FILTER_PARAM = "filter";
export const COUNTRY_PARAM = "country";
export const SEARCH_PARAM = "q";

export const FILTER_IDS = ["people", "requests", "connected"];
export const DEFAULT_FILTER = "people";
export const DEFAULT_COUNTRY = COUNTRY_OPTIONS[0];
/** Matches the API's `search` max length. */
export const SEARCH_MAX_LENGTH = 200;

export const parseFilterParam = (value) =>
  FILTER_IDS.includes(value) ? value : DEFAULT_FILTER;

export const parseCountryParam = (value) =>
  COUNTRY_OPTIONS.includes(value) ? value : DEFAULT_COUNTRY;

export const parseSearchParam = (value) =>
  typeof value === "string" ? value.slice(0, SEARCH_MAX_LENGTH) : "";

const DEFAULTS = {
  [FILTER_PARAM]: DEFAULT_FILTER,
  [COUNTRY_PARAM]: DEFAULT_COUNTRY,
  [SEARCH_PARAM]: "",
};

/**
 * Apply filter changes to the query string and go back to page 1.
 * Default values are dropped so `/contacts?page=1` stays the canonical URL.
 */
export const applyFilterChanges = (params, changes) => {
  const next = new URLSearchParams(params);
  Object.entries(changes).forEach(([key, value]) => {
    if (value == null || value === DEFAULTS[key]) next.delete(key);
    else next.set(key, value);
  });
  next.set(PAGE_PARAM, "1");
  return next;
};

/** Drop filter params whose values aren't valid; returns null when nothing changes. */
export const withoutInvalidFilters = (params) => {
  const next = new URLSearchParams(params);
  let changed = false;
  const filter = params.get(FILTER_PARAM);
  if (filter !== null && parseFilterParam(filter) !== filter) {
    next.delete(FILTER_PARAM);
    changed = true;
  }
  const country = params.get(COUNTRY_PARAM);
  if (country !== null && parseCountryParam(country) !== country) {
    next.delete(COUNTRY_PARAM);
    changed = true;
  }
  const search = params.get(SEARCH_PARAM);
  if (search !== null && parseSearchParam(search) !== search) {
    next.set(SEARCH_PARAM, parseSearchParam(search));
    changed = true;
  }
  return changed ? next : null;
};
