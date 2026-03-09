import { useSyncExternalStore } from 'react';
import { laborStandardService } from '../api/services/laborStandardService';

/**
 * Hook to read the accumulated labor standard value.
 * Re-renders the consuming component whenever the value changes.
 */
export function useLaborStandard(): number {
    return useSyncExternalStore(
        (callback) => laborStandardService.subscribe(callback),
        () => laborStandardService.getSnapshot()
    );
}
