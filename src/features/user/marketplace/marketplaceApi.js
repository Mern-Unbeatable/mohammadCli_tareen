import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * User marketplace HTTP helpers — no Redux. Used by marketplaceThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let listingsData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 8,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    listingsData = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    listingsData = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    listingsData = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && listingsData.length) {
    metaData = {
      ...metaData,
      total: listingsData.length,
      totalPages: Math.max(
        1,
        Math.ceil(listingsData.length / (metaData.pageSize || 8)),
      ),
    };
  }

  return { data: listingsData, meta: metaData };
};

export async function getListingsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 8,
    sort: "desc",
    ...params,
  };
  if (!query.search) delete query.search;
  if (!query.category) delete query.category;
  if (query.mine === undefined || query.mine === null) delete query.mine;
  if (query.saved === undefined || query.saved === null) delete query.saved;

  const response = await crudService.get(
    API_ENDPOINTS.USER.MARKETPLACE.LIST,
    query,
  );
  return parseListResponse(response, query);
}

export async function getListingById(listingId) {
  const response = await crudService.get(
    API_ENDPOINTS.USER.MARKETPLACE.DETAILS(listingId),
  );
  return unwrapApiData(response) || response;
}

export async function createListing(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.MARKETPLACE.CREATE,
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function updateListing(listingId, payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.MARKETPLACE.UPDATE(listingId),
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function deleteListing(listingId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.MARKETPLACE.DELETE(listingId),
  );
  return { listingId, data: unwrapApiData(response) ?? response };
}

export async function toggleSaveListing(listingId) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.MARKETPLACE.SAVE(listingId),
  );
  const data = unwrapApiData(response) || response;
  return {
    listingId,
    isSaved: data?.isSaved ?? data?.saved ?? true,
    data,
  };
}

export async function enquireListing(listingId, message) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.MARKETPLACE.ENQUIRE(listingId),
    { message },
  );
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
