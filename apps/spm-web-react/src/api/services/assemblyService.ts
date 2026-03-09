/**
 * Assembly Service
 * API calls for assembly-related operations
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../../constants/api/endpoints';
import type { RecentScan, InstrumentSetBuild, InstrumentSet } from '../../types/assembly';

export const assemblyService = {
    /**
     * Get recent assembly scans
     */
    getRecentScans: async (): Promise<RecentScan[]> => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 30);

        // YYYY-MM-DD
        const dateOnly = threeDaysAgo.toISOString().slice(0, 10);

        const url = `${API_ENDPOINTS.ASSEMBLY.RECENT_SCANS}?since=${dateOnly}`;
        console.log(`Making call to ${url}`);
        const response = await apiClient.get<RecentScan[]>(url);
        console.log('Received data:', response.data);

        return response.data;
    },

    getPausedBuilds: async (): Promise<RecentScan[]> => {
        const url = `${API_ENDPOINTS.ASSEMBLY.RECENT_SCANS}?status=1`;
        console.log(`Making call to ${url}`);
        const response = await apiClient.get<RecentScan[]>(url);
        console.log('Received data:', response.data);

        return response.data;
    },

    getLatestInstrumentSetBuildForBarcode: async (barcode: string): Promise<InstrumentSetBuild | null> => {
        const url = `${API_ENDPOINTS.ASSEMBLY.GET_BUILDS}?barcode=${barcode}&count=1`;
        console.log(`Making call to ${url}`);
        const response = await apiClient.get<InstrumentSetBuild[]>(url);
        console.log('Received data:', response.data);

        return response.data[0] ?? null;
    },

    startNewBuild: async (instrumentSetBarcode: string): Promise<InstrumentSetBuild | null> => {
        // first check for an instrumentset (not build) with this barcode
        const setUrl = `${API_ENDPOINTS.ASSEMBLY.GET_INSTRUMENTSET}?barcode=${instrumentSetBarcode}`;
        console.log(`Making call to ${setUrl}`);
        const instrumentSet = await apiClient.get<InstrumentSet[]>(setUrl);

        if (!instrumentSet.data?.length) {
            // TODO: log error?  Notify user?
            return null;
        }
        const url = `${API_ENDPOINTS.ASSEMBLY.START_NEW_BUILD}`;
        const data = { // todo: obviously these need to come from somewhere not hard-coded
            userId: "37",
            locationId: "1",
            type: 0,
            itemId: instrumentSet.data[0].id
        };
        console.log(`Making call to ${url}`);
        const response = await apiClient.post<InstrumentSetBuild>(url, data);
        console.log('Received data:', response.data);
        return response.data;
    },

    getInstrumentSetBuilds: async(): Promise<InstrumentSetBuild[]> => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // YYYY-MM-DD
        const dateOnly = thirtyDaysAgo.toISOString().slice(0, 10);

        const url = `${API_ENDPOINTS.ASSEMBLY.GET_BUILDS}?since=${dateOnly}`;
        console.log(`Making call to ${url}`);
        const response = await apiClient.get<InstrumentSetBuild[]>(url);
        console.log('Received data:', response.data);

        return response.data;
    },

    /**
     * Get build status by ID
     */
    getBuild: async (buildId: string): Promise<InstrumentSetBuild> => {
        const response = await apiClient.get<InstrumentSetBuild>(API_ENDPOINTS.ASSEMBLY.GET_BUILD(buildId));
        return response.data;
    },


    async updateIncludedQuantity(
        buildId: string,
        instrumentId: string,
        newIncludedQuantity: number
    ): Promise<InstrumentSetBuild> {
        const res = await apiClient.put(
            `/api/instrumentsetbuilds/${buildId}/items/${instrumentId}/included-quantity`,
            newIncludedQuantity, // body
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return res.data;
    },

    async updateMissingQuantity(
        buildId: string,
        instrumentId: string,
        newMissingQuantity: number
    ): Promise<InstrumentSetBuild> {
        const res = await apiClient.put(
            `/api/instrumentsetbuilds/${buildId}/items/${instrumentId}/missing-quantity`,
            newMissingQuantity, // body
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return res.data;
    },

    /**
     * Add an item to an existing build
     */
    addToBuild: async (buildId: string, barcode: string): Promise<void> => {
        await apiClient.put(API_ENDPOINTS.ASSEMBLY.ADD_TO_BUILD(buildId), { barcode });
    },

    /**
     * Complete an assembly build
     */
    pauseBuild: async (buildId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.ASSEMBLY.PAUSE_BUILD(buildId));
    },

    resumeBuild: async (buildId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.ASSEMBLY.RESUME_BUILD(buildId));
    },
    /**
     * Complete an assembly build
     */
    completeBuild: async (buildId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.ASSEMBLY.COMPLETE_BUILD(buildId));
    },
};

export default assemblyService;
