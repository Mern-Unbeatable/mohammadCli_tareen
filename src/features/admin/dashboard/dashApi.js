import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Admin dashboard HTTP helpers — no Redux. Used by dashThunks.
 */

// ═══════════════════════════════════════════════════════════════════════
// Dashboard KPIs
// ═══════════════════════════════════════════════════════════════════════
export async function getDashboardStats() {
  const response = await crudService.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  const data = unwrapApiData(response) || response;
  return Array.isArray(data?.stats)
    ? data.stats
    : Array.isArray(data)
      ? data
      : [];
}

// ═══════════════════════════════════════════════════════════════════════
// Statistics charts
// ═══════════════════════════════════════════════════════════════════════
export async function getStatistics(yearArg) {
  const year =
    typeof yearArg === "number"
      ? yearArg
      : yearArg?.year || new Date().getFullYear();
  const response = await crudService.get(API_ENDPOINTS.ADMIN.STATISTICS, {
    year,
  });
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
