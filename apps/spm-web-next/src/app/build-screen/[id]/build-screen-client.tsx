"use client";

import React, { useState, useCallback, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import { useToast } from "@/components/toast";
import {
  updateIncludedQuantity,
  updateMissingQuantity,
  pauseBuild,
  completeBuild,
} from "@/lib/actions/builds";
import { laborStandardService } from "@/lib/labor-standard";
import type { InstrumentSetBuild, InstrumentSetBuildItem } from "@/types/assembly";

interface BuildScreenClientProps {
  build: InstrumentSetBuild;
}

// Group items by groupName
function groupItems(
  items: InstrumentSetBuildItem[]
): Record<string, InstrumentSetBuildItem[]> {
  return items.reduce(
    (acc, item) => {
      const group = item.groupName || "Other";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, InstrumentSetBuildItem[]>
  );
}

export default function BuildScreenClient({ build: initialBuild }: BuildScreenClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [build, setBuild] = useState(initialBuild);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [comments, setComments] = useState("");
  const [isPending, startTransition] = useTransition();

  const isCompleted = build.status === 2;
  const groupedItems = useMemo(() => groupItems(build.items), [build.items]);

  // Check if all items are accounted for
  const isAllAccountedFor = useMemo(() => {
    return build.items.every(
      (item) => item.includedQuantity + item.missingQuantity >= item.expectedQuantity
    );
  }, [build.items]);

  const handleIncrement = useCallback(
    async (instrumentId: string, type: "included" | "missing") => {
      const item = build.items.find((i) => i.instrumentId === instrumentId);
      if (!item) return;

      const newQuantity =
        type === "included" ? item.includedQuantity + 1 : item.missingQuantity + 1;

      startTransition(async () => {
        try {
          const updatedBuild =
            type === "included"
              ? await updateIncludedQuantity(build.id, instrumentId, newQuantity)
              : await updateMissingQuantity(build.id, instrumentId, newQuantity);

          setBuild(updatedBuild);
          showToast(`Set ${item.instrumentName} ${type} to ${newQuantity}`, "success");
        } catch (error) {
          showToast(`Failed to update ${type} quantity`, "error");
          console.error(error);
        }
      });
    },
    [build, showToast]
  );

  const handleDecrement = useCallback(
    async (instrumentId: string, type: "included" | "missing") => {
      const item = build.items.find((i) => i.instrumentId === instrumentId);
      if (!item) return;

      const currentQty = type === "included" ? item.includedQuantity : item.missingQuantity;
      if (currentQty <= 0) return;

      const newQuantity = currentQty - 1;

      startTransition(async () => {
        try {
          const updatedBuild =
            type === "included"
              ? await updateIncludedQuantity(build.id, instrumentId, newQuantity)
              : await updateMissingQuantity(build.id, instrumentId, newQuantity);

          setBuild(updatedBuild);
        } catch (error) {
          showToast(`Failed to update ${type} quantity`, "error");
          console.error(error);
        }
      });
    },
    [build, showToast]
  );

  const handleBarcodeSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!barcodeValue.trim()) return;

      // Find instrument by barcode
      const item = build.items.find(
        (i) => i.barcode.toLowerCase() === barcodeValue.toLowerCase()
      );

      if (item) {
        handleIncrement(item.instrumentId, "included");
        setBarcodeValue("");
        // Increment labor standard on successful barcode scan
        laborStandardService.increment(1.0);
      } else {
        showToast("Instrument not found in this set", "error");
      }
    },
    [barcodeValue, build.items, handleIncrement, showToast]
  );

  const handlePause = useCallback(async () => {
    startTransition(async () => {
      try {
        await pauseBuild(build.id);
        router.push("/assembly");
      } catch (error) {
        showToast("Failed to pause build", "error");
        console.error(error);
      }
    });
  }, [build.id, router, showToast]);

  const handleComplete = useCallback(async () => {
    startTransition(async () => {
      try {
        await completeBuild(build.id);
        router.push("/assembly");
      } catch (error) {
        showToast("Failed to complete build", "error");
        console.error(error);
      }
    });
  }, [build.id, router, showToast]);

  const handleExit = useCallback(() => {
    router.push("/assembly");
  }, [router]);

  return (
    <div className="grid h-full grid-cols-1 gap-4">
      {/* Action Bar */}
      <Card extra="w-full p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Barcode: <span className="font-medium text-navy-700 dark:text-white">{build.barcode}</span>
          </p>
          <div className="flex gap-2">
            {isCompleted ? (
              <button
                onClick={handleExit}
                className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Exit
              </button>
            ) : (
              <>
                <button
                  onClick={handlePause}
                  disabled={isPending}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  Pause
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isPending || !isAllAccountedFor}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete
                </button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Barcode Input */}
      {!isCompleted && (
        <Card extra="w-full p-4">
          <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Scan or enter product number..."
              value={barcodeValue}
              onChange={(e) => setBarcodeValue(e.target.value)}
              disabled={isPending}
              className="flex h-10 w-full items-center justify-center rounded-lg border bg-white/0 px-4 text-sm outline-none border-gray-200 focus:border-brand-500 dark:!border-white/10 dark:text-white dark:focus:border-brand-400"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Submit
            </button>
          </form>
        </Card>
      )}

      {/* Instruments Table */}
      <Card extra="w-full px-4 pb-3">
        <div className="max-h-[500px] overflow-y-auto overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white dark:bg-navy-800">
              <tr className="!border-px !border-gray-400">
                <th className="border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">MANUFACTURER</p>
                </th>
                <th className="border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">PRODUCT #</p>
                </th>
                <th className="border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">INSTRUMENT</p>
                </th>
                <th className="border-b border-gray-200 pb-1.5 pr-3 pt-2 text-center dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">REQUIRED</p>
                </th>
                <th className="border-b border-gray-200 pb-1.5 pr-3 pt-2 text-center dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">INCLUDED</p>
                </th>
                <th className="border-b border-gray-200 pb-1.5 pr-3 pt-2 text-center dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">MISSING</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedItems).map(([groupName, items]) => (
                <React.Fragment key={`group-${groupName}`}>
                  <tr className="bg-gray-100 dark:bg-navy-700">
                    <td colSpan={6} className="py-2 px-2 text-sm font-bold text-navy-700 dark:text-white">
                      {groupName}
                    </td>
                  </tr>
                  {items.map((item) => (
                    <tr key={item.instrumentId} className="border-b border-gray-100 dark:border-white/10">
                      <td className="py-1.5 pr-3 text-xs text-navy-700 dark:text-white">
                        {item.manufacturer || "-"}
                      </td>
                      <td className="py-1.5 pr-3 text-xs text-navy-700 dark:text-white">{item.barcode}</td>
                      <td className="py-1.5 pr-3 text-xs text-navy-700 dark:text-white">{item.instrumentName}</td>
                      <td className="py-1.5 pr-3 text-center text-xs text-navy-700 dark:text-white">
                        {item.expectedQuantity}
                      </td>
                      <td className="py-1.5 pr-3">
                        <div className="flex items-center justify-center gap-1">
                          {!isCompleted && (
                            <button
                              onClick={() => handleDecrement(item.instrumentId, "included")}
                              disabled={isPending || item.includedQuantity <= 0}
                              aria-label="decrement included"
                              className="h-6 w-6 rounded bg-gray-200 text-xs font-bold hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-600 dark:hover:bg-navy-500"
                            >
                              -
                            </button>
                          )}
                          <span className="w-8 text-center text-xs font-medium text-navy-700 dark:text-white">
                            {item.includedQuantity}
                          </span>
                          {!isCompleted && (
                            <button
                              onClick={() => handleIncrement(item.instrumentId, "included")}
                              disabled={isPending}
                              aria-label="increment included"
                              className="h-6 w-6 rounded bg-brand-500 text-xs font-bold text-white hover:bg-brand-600 disabled:opacity-50"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-1.5 pr-3">
                        <div className="flex items-center justify-center gap-1">
                          {!isCompleted && (
                            <button
                              onClick={() => handleDecrement(item.instrumentId, "missing")}
                              disabled={isPending || item.missingQuantity <= 0}
                              aria-label="decrement missing"
                              className="h-6 w-6 rounded bg-gray-200 text-xs font-bold hover:bg-gray-300 disabled:opacity-50 dark:bg-navy-600 dark:hover:bg-navy-500"
                            >
                              -
                            </button>
                          )}
                          <span className="w-8 text-center text-xs font-medium text-navy-700 dark:text-white">
                            {item.missingQuantity}
                          </span>
                          {!isCompleted && (
                            <button
                              onClick={() => handleIncrement(item.instrumentId, "missing")}
                              disabled={isPending}
                              aria-label="increment missing"
                              className="h-6 w-6 rounded bg-red-500 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Comments */}
      <Card extra="w-full p-4">
        <label
          htmlFor="assembly-comments"
          className="block text-sm font-medium text-navy-700 dark:text-white mb-2"
        >
          Assembly Comments
        </label>
        <textarea
          id="assembly-comments"
          aria-label="assembly"
          placeholder="Enter assembly comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={isCompleted}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 disabled:bg-gray-100 dark:!border-white/10 dark:bg-navy-800 dark:text-white dark:disabled:bg-navy-700"
          rows={3}
        />
      </Card>
    </div>
  );
}
