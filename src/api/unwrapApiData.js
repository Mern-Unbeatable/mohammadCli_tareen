/**
 * Unwraps the server success envelope `{ success, data }` (axios already
 * returns response.data from the interceptor).
 */
export function unwrapApiData(payload) {
  if (payload == null) return payload;
  if (Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }
  return payload;
}

/**
 * Resolves a user object from login/register/me-style payloads.
 */
export function unwrapUser(payload) {
  const data = unwrapApiData(payload);
  if (!data || typeof data !== 'object') return null;
  if (data.user && typeof data.user === 'object') return data.user;
  // /auth/me returns the user object directly in `data`
  if (data.id || data.email || data.role) return data;
  return null;
}
