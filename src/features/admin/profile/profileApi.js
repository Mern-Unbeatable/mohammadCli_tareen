import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";
import { unwrapUser } from "@/api/unwrapApiData";
import { tokenService } from "@/api/cookies";

/**
 * Admin profile HTTP helpers — no Redux. Used by profileThunks.
 * Uses ADMIN.PROFILE endpoints (`/users/me`, `/users/me/password`).
 */

// ═══════════════════════════════════════════════════════════════════════
// Current admin user
// ═══════════════════════════════════════════════════════════════════════
export async function getProfile() {
  const response = await crudService.get(API_ENDPOINTS.ADMIN.PROFILE.ME);
  const user = unwrapUser(response) || unwrapApiData(response);
  if (!user) {
    throw new Error("Invalid profile response");
  }
  tokenService.setUser(user);
  return user;
}

// ═══════════════════════════════════════════════════════════════════════
// Update name fields
// ═══════════════════════════════════════════════════════════════════════
export async function updateProfile(payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.ADMIN.PROFILE.UPDATE,
    payload,
  );
  const user = unwrapUser(response) || unwrapApiData(response) || response;
  if (user?.id || user?.email) {
    tokenService.setUser(user);
  }
  return user;
}

// ═══════════════════════════════════════════════════════════════════════
// Change password
// ═══════════════════════════════════════════════════════════════════════
export async function changePassword(input) {
  const response = await crudService.patch(
    API_ENDPOINTS.ADMIN.PROFILE.CHANGE_PASSWORD,
    input,
  );
  return unwrapApiData(response) ?? response;
}

export { getApiErrorMessage };
