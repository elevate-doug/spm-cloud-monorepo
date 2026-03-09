import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api/endpoints';

/**
 * Tenant Management Service
 * Handles orgs/tenant selection and storage
 */

export interface Tenant {
    id: string;
    name: string;
    displayName: string;
}

class TenantService {
    /**
     * Get all tenants
     */
    listTenants(): Promise<Tenant[]> {
        const url = API_ENDPOINTS.TENANT.GET_TENANTS;
        return apiClient.get<Tenant[]>(url).then(({ data }) => data);
    }
}

// Export singleton instance
export const tenantService = new TenantService();