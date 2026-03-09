import { useSyncExternalStore } from 'react';
import { databaseConnectionService, type DatabaseConnectionStatus } from '../api/services/databaseConnectionService';

/**
 * Hook to read the current database connection status.
 * Re-renders the consuming component whenever the status changes.
 */
export function useDatabaseConnection(): DatabaseConnectionStatus {
    return useSyncExternalStore(
        (callback) => databaseConnectionService.subscribe(callback),
        () => databaseConnectionService.getSnapshot()
    );
}
