/**
 * API Endpoints
 * Centralized location for all API endpoint paths
 */

export const API_ENDPOINTS = {
    ASSEMBLY: {
        GET_BUILDS: '/api/instrumentsetbuilds',
        RECENT_SCANS: '/api/instrumentsetbuilds',
        START_NEW_BUILD: '/api/instrumentsetbuilds/start',
        GET_INSTRUMENTSET: '/api/instrumentsets',
        GET_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}`,
        ADD_TO_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}/add`,
        PAUSE_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}/pause`,
        RESUME_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}/resume`,
        COMPLETE_BUILD: (buildId: string) => `/api/instrumentsetbuilds/${buildId}/complete`,
    },
    HEALTH: '/health',
    TENANT: {
        GET_TENANTS: '/api/tenants',
    },
    USER: {
        LOGIN: '/api/auth/login'
    },
    DATABASE: {
        STATUS_HUB: '/ws/status',
        SIMULATE_DISCONNECT: '/api/cm/simulate/dbdisconnect',
        SIMULATE_CONNECT: '/api/cm/simulate/dbconnect',
    }
} as const;
