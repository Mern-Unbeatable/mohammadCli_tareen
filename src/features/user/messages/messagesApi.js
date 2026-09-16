import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * User messages HTTP helpers — no Redux. Used by messagesThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let rows = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 20,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    rows = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    rows = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    rows = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && rows.length) {
    metaData = {
      ...metaData,
      total: rows.length,
      totalPages: Math.max(
        1,
        Math.ceil(rows.length / (metaData.pageSize || 20)),
      ),
    };
  }

  return { data: rows, meta: metaData };
};

export async function getConversations(params = {}) {
  const query = {
    page: 1,
    pageSize: 20,
    sort: "desc",
    ...params,
  };
  if (!query.search) delete query.search;
  if (!query.type) delete query.type;

  const response = await crudService.get(
    API_ENDPOINTS.USER.MESSAGES.LIST,
    query,
  );
  return parseListResponse(response, query);
}

export async function getThread(conversationId, params = {}) {
  const query = {
    page: 1,
    pageSize: 50,
    sort: "asc",
    ...params,
  };
  const response = await crudService.get(
    API_ENDPOINTS.USER.MESSAGES.THREAD(conversationId),
    query,
  );
  return parseListResponse(response, query);
}

export async function startDirect(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.MESSAGES.DIRECT,
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function createGroup(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.MESSAGES.GROUP,
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function sendMessage(conversationId, body) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.MESSAGES.SEND(conversationId),
    typeof body === "string" ? { body } : body,
  );
  return unwrapApiData(response) || response;
}

export async function deleteMessage(conversationId, messageId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.MESSAGES.DELETE_MESSAGE(conversationId, messageId),
  );
  return {
    conversationId,
    messageId,
    data: unwrapApiData(response) ?? response,
  };
}

export async function leaveConversation(conversationId) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.MESSAGES.LEAVE(conversationId),
  );
  return {
    conversationId,
    data: unwrapApiData(response) ?? response,
  };
}

export { getApiErrorMessage };
