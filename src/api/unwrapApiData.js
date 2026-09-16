/**
<<<<<<< HEAD
 * Unwraps the server success envelope `{ success, data }` (axios already
 * returns response.data from the interceptor).
 */
export function unwrapApiData(payload) {
  if (payload == null) return payload;
  if (Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }
=======
 * API responses are often `{ success, data, meta }` or nested envelopes.
 * Normalize to the inner `data` payload when present.
 */
export function unwrapApiData(payload) {
  if (payload == null) return payload;
  if (typeof payload !== "object") return payload;

  if ("data" in payload && payload.data !== undefined) {
    const inner = payload.data;
    if (inner && typeof inner === "object" && "data" in inner) {
      return inner.data !== undefined ? inner.data : inner;
    }
    return inner;
  }

>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
  return payload;
}

/**
<<<<<<< HEAD
 * Resolves a user object from login/register/me-style payloads.
 */
export function unwrapUser(payload) {
  const data = unwrapApiData(payload);
  if (!data || typeof data !== 'object') return null;
  if (data.user && typeof data.user === 'object') return data.user;
  // /auth/me returns the user object directly in `data`
  if (data.id || data.email || data.role) return data;
=======
 * Prefer a real user object over auth envelopes that also carry tokens.
 */
export function unwrapUser(payload) {
  const data = unwrapApiData(payload) ?? payload;
  if (!data || typeof data !== "object") return null;

  if (data.user && typeof data.user === "object") return data.user;
  if (data.role || data.email || data.id) return data;

  const nested = unwrapApiData(data);
  if (nested && typeof nested === "object") {
    if (nested.user && typeof nested.user === "object") return nested.user;
    if (nested.role || nested.email || nested.id) return nested;
  }

>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
  return null;
}
