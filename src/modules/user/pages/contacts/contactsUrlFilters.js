import { COUNTRY_OPTIONS } from "@/features/user/contacts";
import {
  SEARCH_MAX_LENGTH,
  SEARCH_PARAM,
  createUrlFilters,
  parseOptionParam,
  parseSearchParam,
} from "@/shared/utils/urlFilters";

export { SEARCH_MAX_LENGTH, SEARCH_PARAM, parseSearchParam };

export const FILTER_PARAM = "filter";
export const COUNTRY_PARAM = "country";

export const FILTER_IDS = ["people", "requests", "connected"];
export const DEFAULT_FILTER = "people";
export const DEFAULT_COUNTRY = COUNTRY_OPTIONS[0];

export const parseFilterParam = (value) =>
  parseOptionParam(value, FILTER_IDS, DEFAULT_FILTER);

export const parseCountryParam = (value) =>
  parseOptionParam(value, COUNTRY_OPTIONS, DEFAULT_COUNTRY);

const contactsFilters = createUrlFilters({
  [FILTER_PARAM]: { parse: parseFilterParam, fallback: DEFAULT_FILTER },
  [COUNTRY_PARAM]: { parse: parseCountryParam, fallback: DEFAULT_COUNTRY },
  [SEARCH_PARAM]: { parse: parseSearchParam, fallback: "" },
});

export const applyFilterChanges = contactsFilters.apply;
export const withoutInvalidFilters = contactsFilters.normalize;
