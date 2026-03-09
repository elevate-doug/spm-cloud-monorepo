/**
 * API Endpoints
 * Centralized location for all API endpoint paths
 */

export const API_ENDPOINTS = {
  ASSEMBLY: {
    GET_BUILDS: '/api/instrumentsetbuilds',
    START_NEW_BUILD: '/api/instrumentsetbuilds/start',
    GET_INSTRUMENTSET: '/api/instrumentsets',
    GET_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}`,
    UPDATE_INCLUDED_QUANTITY: (buildId: string, instrumentId: string) =>
      `/api/instrumentsetbuilds/${buildId}/items/${instrumentId}/included-quantity`,
    UPDATE_MISSING_QUANTITY: (buildId: string, instrumentId: string) =>
      `/api/instrumentsetbuilds/${buildId}/items/${instrumentId}/missing-quantity`,
    PAUSE_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}/pause`,
    RESUME_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}/resume`,
    COMPLETE_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}/complete`,
  },
  TENANT: {
    GET_TENANTS: '/api/tenants',
  },
  USER: {
    LOGIN: '/api/auth/login',
  },
} as const;
