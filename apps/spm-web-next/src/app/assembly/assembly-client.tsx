"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import { useToast } from "@/components/toast";
import {
  getLatestBuildForBarcode,
  getInstrumentSetByBarcode,
  startNewBuild,
} from "@/lib/actions/builds";
import type { InstrumentSetBuild } from "@/types/assembly";

interface AssemblyClientProps {
  completedBuilds: InstrumentSetBuild[];
  incompleteBuilds: InstrumentSetBuild[];
}

// Format ISO date string to readable format
const formatDate = (date: Date | string | null): string => {
  if (!date) return "-";
  const dt = typeof date === "string" ? new Date(date) : date;
  try {
    return dt.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const mapStageToString = (stage: number): string => {
  switch (stage) {
    case 0:
      return "Assembling";
    case 1:
      return "Assembled";
    case 3:
      return "LoadedInSterilizer";
    case 4:
      return "Sterilizing";
    case 5:
      return "Sterilized";
    case 6:
      return "InStorage";
    case 7:
      return "InCaseCart";
    case 8:
      return "InUse";
    case 9:
      return "Received";
    default:
      return "Unknown";
  }
};

export default function AssemblyClient({
  completedBuilds,
  incompleteBuilds,
}: AssemblyClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [barcodeValue, setBarcodeValue] = useState("");
  const [inputHighlight, setInputHighlight] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleBarcodeSubmit = useCallback(
    async (barcode: string) => {
      if (!barcode.trim()) {
        showToast("Please enter a barcode", "error");
        return;
      }

      setInputHighlight(true);
      setTimeout(() => setInputHighlight(false), 500);
      showToast(`Processing barcode: ${barcode}`, "success");

      startTransition(async () => {
        try {
          // Check for existing build
          let existingBuild = await getLatestBuildForBarcode(barcode);

          // Create new build if none exists or if latest is completed
          if (!existingBuild || existingBuild.status === 2) {
            const instrumentSet = await getInstrumentSetByBarcode(barcode);

            if (!instrumentSet) {
              showToast(`No instrument set found for barcode: ${barcode}`, "warning");
              setBarcodeValue("");
              return;
            }

            existingBuild = await startNewBuild(instrumentSet.id);
          }

          if (existingBuild) {
            router.push(`/build-screen/${existingBuild.id}`);
          }
        } catch (error) {
          showToast("Failed to process barcode", "error");
          console.error(error);
        }
      });
    },
    [showToast, router]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBarcodeSubmit(barcodeValue);
  };

  const handleRowClick = (id: string) => {
    router.push(`/build-screen/${id}`);
  };

  return (
    <div className="grid h-full grid-cols-1 gap-4">
      {/* Barcode Input */}
      <Card extra="w-full p-4">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter barcode or scan product..."
            value={barcodeValue}
            onChange={(e) => setBarcodeValue(e.target.value)}
            autoFocus
            disabled={isPending}
            className={`flex h-10 w-full items-center justify-center rounded-lg border bg-white/0 px-4 text-sm outline-none border-gray-200 focus:border-brand-500 dark:!border-white/10 dark:text-white dark:focus:border-brand-400 transition-all ${
              inputHighlight ? "scan-highlight-success" : ""
            }`}
          />
          <button
            type="submit"
            disabled={isPending}
            className="linear flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
            Submit
          </button>
        </form>
      </Card>

      {/* Incomplete Builds Table */}
      <Card extra="w-full h-full px-4 pb-3">
        <header className="relative flex items-center justify-between pt-3 pb-2">
          <div className="text-base font-bold text-navy-700 dark:text-white">
            Currently Incomplete Builds
          </div>
        </header>

        <div className="max-h-[400px] overflow-y-auto overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white dark:bg-navy-800">
              <tr className="!border-px !border-gray-400">
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white pr-6">
                    BARCODE
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white pr-6">
                    DESCRIPTION
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    WHEN SCANNED
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    LOCATION
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    SCANNED BY
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    STAGE
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {incompleteBuilds.length > 0 ? (
                incompleteBuilds.map((build) => (
                  <tr
                    key={build.id}
                    onClick={() => handleRowClick(build.id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                  >
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-bold text-navy-700 dark:text-white pr-6">
                        {build.barcode}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white pr-6">
                        {build.name}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {formatDate(build.buildDate)}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {build.location}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {build.user}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {mapStageToString(build.currentStage)}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 text-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    No paused items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Builds Table */}
      <Card extra="w-full h-full px-4 pb-3">
        <header className="relative flex items-center justify-between pt-3 pb-2">
          <div className="text-base font-bold text-navy-700 dark:text-white">
            Recent Builds
          </div>
        </header>

        <div className="mt-3 max-h-[400px] overflow-y-auto overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white dark:bg-navy-800">
              <tr className="!border-px !border-gray-400">
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white pr-6">
                    BARCODE
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white pr-6">
                    DESCRIPTION
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    WHEN SCANNED
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    LOCATION
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    SCANNED BY
                  </p>
                </th>
                <th className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10">
                  <p className="text-xs font-bold text-gray-600 dark:text-white">
                    STAGE
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {completedBuilds.length > 0 ? (
                completedBuilds.map((build) => (
                  <tr
                    key={build.id}
                    onClick={() => handleRowClick(build.id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                  >
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-bold text-navy-700 dark:text-white pr-6">
                        {build.barcode}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white pr-6">
                        {build.name}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {formatDate(build.buildDate)}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {build.location}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {build.user}
                      </p>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-1.5 pr-3">
                      <p className="text-xs font-medium text-navy-700 dark:text-white">
                        {mapStageToString(build.currentStage)}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    No recent scans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
