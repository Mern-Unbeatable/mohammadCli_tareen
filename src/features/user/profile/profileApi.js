import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";
import { unwrapUser } from "@/api/unwrapApiData";
import { tokenService } from "@/api/cookies";

/**
 * User profile HTTP helpers — no Redux. Used by profileThunks.
 * Uses USER.PROFILE endpoints (`/users/me`, `/users/me/password`, `/users/:id`).
 */

export async function getProfile() {
  const response = await crudService.get(API_ENDPOINTS.USER.PROFILE.ME);
  const user = unwrapUser(response) || unwrapApiData(response);
  if (!user) {
    throw new Error("Invalid profile response");
  }
  tokenService.setUser(user);
  return user;
}

export async function updateProfile(payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.PROFILE.UPDATE,
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
    API_ENDPOINTS.USER.PROFILE.CHANGE_PASSWORD,
    input,
  );
  return unwrapApiData(response) ?? response;
}

export async function getMemberProfile(userId) {
  const response = await crudService.get(
    API_ENDPOINTS.USER.PROFILE.DETAILS(userId),
  );
  return unwrapUser(response) || unwrapApiData(response) || response;
}

export { getApiErrorMessage };
