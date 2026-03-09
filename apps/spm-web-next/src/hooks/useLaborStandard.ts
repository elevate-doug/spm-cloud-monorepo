"use client";

import { useSyncExternalStore } from "react";
import { laborStandardService } from "@/lib/labor-standard";

/**
 * Hook to read the ALS value.
 * re renders when the value changes.
 */
export function useLaborStandard(): number {
  return useSyncExternalStore(
    (callback) => laborStandardService.subscribe(callback),
    () => laborStandardService.getSnapshot(),
    () => laborStandardService.getServerSnapshot()
  );
}
