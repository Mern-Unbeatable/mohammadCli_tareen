import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";
import { unwrapUser } from "@/api/unwrapApiData";
import { tokenService } from "@/api/cookies";

/**
 * Supplier profile HTTP helpers — no Redux. Used by profileThunks.
 * Uses SUPPLIER.PROFILE endpoints (`/users/me`, `/users/me/password`).
 */

export async function getProfile() {
  const response = await crudService.get(API_ENDPOINTS.SUPPLIER.PROFILE.ME);
  const user = unwrapUser(response) || unwrapApiData(response);
  if (!user) {
    throw new Error("Invalid profile response");
  }
  tokenService.setUser(user);
  return user;
}

export async function updateProfile(payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.PROFILE.UPDATE,
    payload,
  );
  const user = unwrapUser(response) || unwrapApiData(response) || response;
  if (user?.id || user?.email) {
    tokenService.setUser(user);
  }
  return user;
}

export async function changePassword(input) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.PROFILE.CHANGE_PASSWORD,
    input,
  );
  return unwrapApiData(response) ?? response;
}

export { getApiErrorMessage };
