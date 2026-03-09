import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/card";
import { useToast } from "../../../components/toast";
import { useBarcodeScanner } from "../../../hooks/useBarcodeScanner";
import { useDatabaseConnection } from "../../../hooks/useDatabaseConnection";
import { assemblyService } from "../../../api/services/assemblyService";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { InstrumentSetBuild, InstrumentSetBuildItem } from "../../../types/assembly";
import type { ComponentProperties } from "../../../types/componentProperties";

interface BuildItem {
    id: string;
    instrumentSetJourneyId: string | null;
    items: InstrumentItem[];
    isComplete: boolean;
    name: string;
    buildDate: Date | null;
    barcode: string;
    user: string;
    location: string;
    currentStage: number;
}
interface InstrumentItem {
    id: string;
    barcode: string;
  manufacturer: string;
  productNumber: string;
  instrumentComment: string;
  required: number;
  included: number;
  missing: number;
  group: string;
}

const mapInstrumentSetBuildItemToInstrumentItem = (item: InstrumentSetBuildItem): InstrumentItem => ({
    id: item.instrumentId,
    barcode: item.barcode,
    manufacturer: item.manufacturer ?? "unknown mfg",
    productNumber: item.barcode,
    instrumentComment: item.instrumentName,
    required: item.expectedQuantity,
    included: item.includedQuantity,
    missing: item.missingQuantity,
    group: item.groupName ?? "Instruments"
});
const mapInstrumentSetBuildToBuildItem = (build: InstrumentSetBuild): BuildItem => ({
    ...build,
    isComplete: build.status === 2,
    items: build.items.map(mapInstrumentSetBuildItemToInstrumentItem)
});

const columnHelper = createColumnHelper<InstrumentItem>();

const BuildScreen: React.FC<ComponentProperties> = (props: ComponentProperties) => {
    const { id: buildId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [assemblyComments, setAssemblyComments] = useState("");
    const [barcodeValue, setBarcodeValue] = useState("");
    const [inputHighlight, setInputHighlight] = useState(false);
    const [lastScannedId, setLastScannedId] = useState<string | null>(null);
    const [canComplete, setCanComplete] = useState(false);
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    const { isLoading, error, data: assemblyBuild } = useQuery({
        queryKey: ['build', buildId],
        queryFn: async () => {
            if (!buildId) {
                return null;
            }
            const assembly = await assemblyService.getBuild(buildId);
            if (!assembly) {
                return null;
            }

            // if build is not complete, resume
            if (assembly.status != 2) {
                await assemblyService.resumeBuild(buildId);
            }

            const build = mapInstrumentSetBuildToBuildItem(assembly);
            props.setPageTitle(`${build.name} - ${build.barcode}`);
            const sumRequired = assembly.items.reduce((sum, inst) => sum + inst.expectedQuantity, 0);
            const sumInBuild = assembly.items.reduce((sum, inst) => sum + inst.includedQuantity + inst.missingQuantity, 0);

            setCanComplete(sumRequired === sumInBuild);

            return build;
        }
    });

    // Handle change for Included or Missing columns
    const handleCountUpdate = useMutation({
        mutationFn: (data: { instrumentId: string, column: 'included' | 'missing', changeBy: 1 | -1, completeMessage?: string, isBarcodeScan?: boolean }) => {
            if (!assemblyBuild) throw 'Scan not found';
            const instrument = assemblyBuild.items.find(i => i.id === data.instrumentId || i.barcode === data.instrumentId);
            if (!instrument) throw 'Instrument not found';

            const newValue = instrument[data.column] + data.changeBy;
            if (newValue < 0 || newValue > instrument.required) throw `${instrument.instrumentComment} already complete (${instrument.included + instrument.missing}/${instrument.required})`;
            if (!data.completeMessage) {
                data.completeMessage = `Set ${instrument.instrumentComment} (${newValue}/${instrument.required})`;
            }

            if (data.column === 'included') {
                return assemblyService.updateIncludedQuantity(
                    assemblyBuild.id,
                    data.instrumentId,
                    newValue);
            } else {
                return assemblyService.updateMissingQuantity(
                    assemblyBuild.id,
                    data.instrumentId,
                    newValue);
            }
        },
        onMutate: ({ instrumentId }) => {
            setLastScannedId(instrumentId);
        },
        onSuccess: (_data, variables) => {
            if (variables.completeMessage) {
                showToast(variables.completeMessage, 'success');
            }
            setBarcodeValue("");
            return queryClient.invalidateQueries({
                queryKey: ['build', buildId]
            });
        },
        onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : err;
            setBarcodeValue("");
            showToast(errorMessage, "error");
        },
        onSettled: () => {
            setTimeout(() => setLastScannedId(null), 1500);
            setTimeout(() => setInputHighlight(false), 500);
        }
    });

    const handlePause = useMutation({
        mutationFn: () => {
            if (!assemblyBuild) throw 'Scan not found';

            return assemblyService.pauseBuild(assemblyBuild.id);
        },
        onMutate: () => {
            showToast('Pausing the build', 'info');
        },
        onSuccess: () => {
            navigate('/admin/assembly');
        },
        onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : err;

            showToast(errorMessage, "error");
        }
    });

    const handleComplete = useMutation({
        mutationFn: () => {
            if (!assemblyBuild) throw 'Scan not found';

            return assemblyService.completeBuild(assemblyBuild.id);
        },
        onMutate: () => {
            showToast('Completing the build', 'info');
        },
        onSuccess: () => {
            navigate('/admin/assembly');
        },
        onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : err;

            showToast(errorMessage, "error");
        }
    });

    // Handle barcode scan - find instrument and increment included count    
    const handleBarcodeScanned = useCallback(async (barcode: string) => {
        // Find instrument by product number (case-insensitive)
        if (!assemblyBuild) return;

        const instrumentIndex = assemblyBuild.items.findIndex(
            (item) => item.barcode.toLowerCase() === barcode.toLowerCase()
        );

        if (instrumentIndex === -1) {
            showToast(`Instrument not found: ${barcode}`, "error");
            setBarcodeValue("");
            setInputHighlight(true);
            setTimeout(() => setInputHighlight(false), 500);
            return;
        }

        const instrument = assemblyBuild.items[instrumentIndex];
        // Highlight the scanned row
        setLastScannedId(instrument.id);
        // Trigger input highlight animation
        setInputHighlight(true);

        await handleCountUpdate.mutateAsync({ instrumentId: instrument.id, column: 'included', changeBy: 1, isBarcodeScan: true });
    }, [assemblyBuild, handleCountUpdate, showToast]);

    // Setup barcode scanner hook
    const { inputRef: scannerInputRef } = useBarcodeScanner({
        onScan: handleBarcodeScanned,
        onError: (error) => showToast(error, "error"),
        minLength: 4,
    });

    // Combine refs for the barcode input
    const setInputRefs = useCallback((element: HTMLInputElement | null) => {
        (scannerInputRef as React.RefObject<HTMLInputElement | null>).current = element;
        (barcodeInputRef as React.RefObject<HTMLInputElement | null>).current = element;
    }, [scannerInputRef]);

    // Handle manual form submission
    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (barcodeValue.trim()) {
            handleBarcodeScanned(barcodeValue.trim());
        }
    }, [barcodeValue, handleBarcodeScanned]);

    const columns = useMemo(() => [
        columnHelper.accessor("manufacturer", {
            id: "manufacturer",
            header: () => (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Manufacturer
                </p>
            ),
            cell: (info) => (
                <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>
            ),
        }),
        columnHelper.accessor("productNumber", {
            id: "productNumber",
            header: () => (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Product #1
                </p>
            ),
            cell: (info) => (
                <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>
            ),
        }),
        columnHelper.accessor("instrumentComment", {
            id: "instrumentComment",
            header: () => (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Instrument / comment
                </p>
            ),
            cell: (info) => (
                <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>
            ),
        }),
        columnHelper.accessor("required", {
            id: "required",
            header: () => (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Required
                </p>
            ),
            cell: (info) => (
                <p className="text-sm text-navy-700 dark:text-white text-center">
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("included", {
            id: "included",
            header: () => (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Included
                </p>
            ),
            cell: (info) => {
                const value = info.getValue();
                const itemId = info.row.original.id;
                const isComplete = value === info.row.original.required;

                return (
                    <div className="flex items-center justify-center gap-1 text-sm text-navy-700 dark:text-white group">
                        {!assemblyBuild?.isComplete && (
                            <button
                                onClick={() => handleCountUpdate.mutate({ instrumentId: itemId, column: 'included', changeBy: -1 })}
                                className="opacity-100 transition-opacity duration-150 p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
                                aria-label="Decrement included"
                            >
                                <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
                                </svg>
                            </button>
                        )}
                        <span className={`px-2 py-0.5 rounded min-w-[28px] text-center ${isComplete ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                value > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''
                            }`}>
                            {value}
                        </span>
                        {!assemblyBuild?.isComplete && (
                            <button
                                onClick={() => handleCountUpdate.mutate({ instrumentId: itemId, column: 'included', changeBy: 1 })}
                                className="opacity-100 transition-opacity duration-150 p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
                                aria-label="Increment included"
                            >
                                <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                </svg>
                            </button>
                        )}
                    </div>
                );
            },
        }),
        columnHelper.accessor("missing", {
            id: "missing",
            header: () => (
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Missing
                </p>
            ),
            cell: (info) => {
                const value = info.getValue();
                const itemId = info.row.original.id;

                return (
                    <div className="flex items-center justify-center gap-1 text-sm text-navy-700 dark:text-white group">
                        {!assemblyBuild?.isComplete && (
                            <button
                                onClick={() => handleCountUpdate.mutate({ instrumentId: itemId, column: 'missing', changeBy: -1 })}
                                className="opacity-100 transition-opacity duration-150 p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
                                aria-label="Decrement missing"
                            >
                                <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
                                </svg>
                            </button>
                        )}
                        <span className={`px-2 py-0.5 rounded min-w-[28px] text-center ${value > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''
                            }`}>
                            {value}
                        </span>
                        {!assemblyBuild?.isComplete && (
                            <button
                                onClick={() => handleCountUpdate.mutate({ instrumentId: itemId, column: 'missing', changeBy: 1 })}
                                className="opacity-100 transition-opacity duration-150 p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
                                aria-label="Increment missing"
                            >
                                <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                </svg>
                            </button>
                        )}
                    </div>
                );
            },
        }),
    ], [handleCountUpdate, assemblyBuild?.isComplete]);

    const groupedInstruments = useMemo(() => {
        const groups: Record<string, InstrumentItem[]> = {};
        if (!assemblyBuild) return groups;
        assemblyBuild.items.forEach(item => {
            if (!groups[item.group]) groups[item.group] = [];
            groups[item.group].push(item);
        });
        return groups;
    }, [assemblyBuild]);

    const table = useReactTable({
        data: assemblyBuild?.items ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        if (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch scan";
            showToast(errorMessage);
        }
    }, [showToast, error]);

    // Auto-focus barcode input when database reconnects
    const dbStatus = useDatabaseConnection();
    const prevDbStatusRef = useRef(dbStatus);
    useEffect(() => {
        const wasDisconnected = prevDbStatusRef.current === "disconnected" || prevDbStatusRef.current === "reconnecting";
        if (wasDisconnected && dbStatus === "connected") {
            barcodeInputRef.current?.focus();
        }
        prevDbStatusRef.current = dbStatus;
    }, [dbStatus]);

    return (
        <div className="flex h-full flex-col gap-4">
            {/* Action buttons */}
            <div className="flex items-center justify-end min-h-[40px]">
                {handleCountUpdate.isPending ? (
                    <div className="mr-auto p-2 flex gap-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Saving Updates
                        </span>
                    </div>) : null}
                {assemblyBuild && (
                    <div className="flex gap-3">
                        {assemblyBuild.isComplete ? (
                            <button
                                onClick={() => navigate('/admin/assembly')}
                                type='button'
                                className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700"
                            >
                                Exit
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => handlePause.mutate()}
                                    type='button'
                                    className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700"
                                >
                                    Pause
                                </button>
                                <button
                                    onClick={() => handleComplete.mutate()}
                                    type='button'
                                    disabled={!canComplete}
                                    className={`rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition duration-200 hover:bg-green-700 active:bg-green-800 ${!canComplete && 'disabled:cursor-not-allowed disabled:opacity-50'}`}
                                >
                                    Complete
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Barcode Scanner Input - Always visible */}
            <Card extra="w-full p-4">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                            />
                        </svg>
                        <span className="text-sm font-medium">Scan instrument:</span>
                    </div>
                    <input
                        ref={setInputRefs}
                        type="text"
                        placeholder="Scan or enter product number..."
                        value={barcodeValue}
                        onChange={(e) => setBarcodeValue(e.target.value)}
                        autoFocus
                        className={`flex h-10 flex-1 items-center rounded-lg border bg-white/0 px-4 text-sm outline-none border-gray-200 focus:border-brand-500 dark:!border-white/10 dark:text-white dark:focus:border-brand-400 transition-all ${inputHighlight ? "scan-highlight-success" : ""
                            }`}
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700"
                    >
                        Add
                    </button>
                </form>
            </Card>

            {/* Instruments Table */}
            <Card extra="w-full flex-1 px-4 pb-4">
                <div className="h-full overflow-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-white dark:bg-navy-800">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr
                                    key={headerGroup.id}
                                    className="border-b border-gray-200 dark:border-navy-600"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="py-3 pr-4 text-left first:pl-2"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Loading scan...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : Object.entries(groupedInstruments).map(([groupName, items]) => (
                                <React.Fragment key={groupName}>
                                    {/* Group Header Row */}
                                    <tr className="bg-gray-50 dark:bg-navy-700">
                                        <td
                                            colSpan={columns.length}
                                            className="py-2 pl-2 text-sm font-bold text-navy-700 dark:text-white"
                                        >
                                            {groupName}
                                        </td>
                                    </tr>
                                    {/* Group Items */}
                                    {items.map((item) => {
                                        const isComplete = item.included >= item.required;
                                        const isJustScanned = lastScannedId === item.id;

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`border-b border-gray-100 transition-all duration-300 dark:border-navy-600 ${isJustScanned
                                                        ? "bg-green-100 dark:bg-green-900/30"
                                                        : isComplete
                                                            ? "bg-green-50/50 dark:bg-green-900/10"
                                                            : "hover:bg-gray-50 dark:hover:bg-navy-700/50"
                                                    }`}
                                            >
                                                <td className="py-2.5 pl-2 pr-4">
                                                    <p className="text-sm text-navy-700 dark:text-white">
                                                        {item.manufacturer}
                                                    </p>
                                                </td>
                                                <td className="py-2.5 pr-4">
                                                    <p className={`text-sm ${isComplete
                                                            ? "text-green-600 dark:text-green-400 font-medium"
                                                            : "text-navy-700 dark:text-white"
                                                        }`}>
                                                        {item.productNumber}
                                                    </p>
                                                </td>
                                                <td className="py-2.5 pr-4">
                                                    <p className="text-sm text-navy-700 dark:text-white">
                                                        {item.instrumentComment}
                                                    </p>
                                                </td>
                                                <td className="py-2.5 pr-4 text-center">
                                                    <p className="text-sm text-navy-700 dark:text-white">
                                                        {item.required}
                                                    </p>
                                                </td>
                                                <td className="py-2.5 pr-4 group">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {!assemblyBuild?.isComplete && (
                                                            <button
                                                                onClick={() => handleCountUpdate.mutate({ instrumentId: item.id, column: 'included', changeBy: -1 })}
                                                                className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                aria-label="Decrement included"
                                                            >
                                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        <span className={`px-2 py-0.5 rounded min-w-[28px] text-center text-sm font-medium ${isComplete
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                : item.included > 0
                                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                                    : "text-navy-700 dark:text-white"
                                                            }`}>
                                                            {item.included}
                                                        </span>
                                                        {!assemblyBuild?.isComplete && (
                                                            <button
                                                                onClick={() => handleCountUpdate.mutate({ instrumentId: item.id, column: 'included', changeBy: 1 })}
                                                                className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                aria-label="Increment included"
                                                            >
                                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 pr-4 group">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {!assemblyBuild?.isComplete && (
                                                            <button
                                                                onClick={() => handleCountUpdate.mutate({ instrumentId: item.id, column: 'missing', changeBy: -1 })}
                                                                className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                aria-label="Decrement missing"
                                                            >
                                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        <span className={`px-2 py-0.5 rounded min-w-[28px] text-center text-sm ${item.missing > 0
                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium"
                                                                : "text-navy-700 dark:text-white"
                                                            }`}>
                                                            {item.missing}
                                                        </span>
                                                        {!assemblyBuild?.isComplete && (
                                                            <button
                                                                onClick={() => handleCountUpdate.mutate({ instrumentId: item.id, column: 'missing', changeBy: 1 })}
                                                                className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                aria-label="Increment missing"
                                                            >
                                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Assembly Comments */}
            <Card extra="w-full p-4">
                <div className="flex items-start gap-4">
                    <label
                        htmlFor="assemblyComments"
                        className="text-sm font-medium text-navy-700 dark:text-white whitespace-nowrap pt-2"
                    >
                        Assembly
                        <br />
                        comments:
                    </label>
                    <textarea
                        id="assemblyComments"
                        value={assemblyComments}
                        onChange={(e) => setAssemblyComments(e.target.value)}
                        placeholder="Enter assembly comments..."
                        rows={3}
                        className="flex-1 rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400 resize-none"
                    />
                </div>
            </Card>
        </div>
    );
};

export default BuildScreen;
