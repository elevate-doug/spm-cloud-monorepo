import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/card";
import { useToast } from "../../../components/toast";
import { useBarcodeScanner } from "../../../hooks/useBarcodeScanner";
import { assemblyService } from "../../../api/services/assemblyService";
import type { InstrumentSetBuild } from "../../../types/assembly";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import type { ComponentProperties } from "../../../types/componentProperties";

type SortingState = Array<{
    id: string;
    desc: boolean;
}>;

interface BuildTableItem {
    id: string;
    barcode: string;
    description: string;
    whenScanned: string;
    location: string;
    scannedBy: string;
    processAction: string;
}

// Helper to display null/undefined values
const displayValue = (value: string | null | undefined): string => {
    return value ?? "—";
};

// Format ISO date string to readable format
const formatDate = (date: Date | string | null): string => {
    if (!date) {
        return "-";
    }
    const dt = typeof date === 'string' ? new Date(date) : date;
    try {
        return dt.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "—";
    }
};

const mapStatusToString = (status: number): string => {
    switch (status) {
        case 0:
            return "In Process";
        case 1:
            return "Paused";
        case 2:
            return "Completed";
        default:
            return "Unknown";
    };
};

const mapStageToString = (stage: number): string => {
    switch (stage) {
        case 0: return "Assembling";
        case 1: return "Assembled";
        case 3: return "LoadedInSterilizer";
        case 4: return "Sterilizing";
        case 5: return "Sterilized";
        case 6: return "InStorage";
        case 7: return "InCaseCart";
        case 8: return "InUse";
        case 9: return "Received";
        default:
            return "Unknown";
    };

};

// Map API response to table format
const mapInstrumentSetBuildToTableItem = (build: InstrumentSetBuild): BuildTableItem => {    
    return {
        id: build.id,
        barcode: build.barcode,
        description: build.name,
        whenScanned: formatDate(build.buildDate),
        location: build.location,
        scannedBy: build.user,
        processAction: mapStageToString(build.currentStage)
    };
};

const columnHelper = createColumnHelper<BuildTableItem>();
//const pausedColumnHelper = createColumnHelper<PausedItem>();

// Column definitions for Recently Scanned table
const columns = [
    columnHelper.accessor("barcode", {
        id: "barcode",
        header: () => (
            <p className="text-xs font-bold text-gray-600 dark:text-white pr-6">BARCODE</p>
        ),
        cell: (info) => (
            <p className="text-xs font-bold text-navy-700 dark:text-white pr-6">
                {displayValue(info.getValue())}
            </p>
        ),
    }),
    columnHelper.accessor("description", {
        id: "description",
        header: () => (
            <p className="text-xs font-bold text-gray-600 dark:text-white pr-6">DESCRIPTION</p>
        ),
        cell: (info) => (
            <p className="text-xs font-medium text-navy-700 dark:text-white pr-6">
                {displayValue(info.getValue())}
            </p>
        ),
    }),
    columnHelper.accessor("whenScanned", {
        id: "whenScanned",
        header: () => (
            <p className="text-xs font-bold text-gray-600 dark:text-white">
                WHEN SCANNED
            </p>
        ),
        cell: (info) => (
            <p className="text-xs font-medium text-navy-700 dark:text-white">
                {displayValue(info.getValue())}
            </p>
        ),
    }),
    columnHelper.accessor("location", {
        id: "location",
        header: () => (
            <p className="text-xs font-bold text-gray-600 dark:text-white">
                LOCATION
            </p>
        ),
        cell: (info) => (
            <p className="text-xs font-medium text-navy-700 dark:text-white">
                {displayValue(info.getValue())}
            </p>
        ),
    }),
    columnHelper.accessor("scannedBy", {
        id: "scannedBy",
        header: () => (
            <p className="text-xs font-bold text-gray-600 dark:text-white">
                SCANNED BY
            </p>
        ),
        cell: (info) => (
            <p className="text-xs font-medium text-navy-700 dark:text-white">
                {displayValue(info.getValue())}
            </p>
        ),
    }),
    columnHelper.accessor("processAction", {
        id: "processAction",
        header: () => (
            <p className="text-xs font-bold text-gray-600 dark:text-white">
                PROCESS ACTION
            </p>
        ),
        cell: (info) => (
            <p className="text-xs font-medium text-navy-700 dark:text-white">
                {displayValue(info.getValue())}
            </p>
        ),
    }),
    columnHelper.display({
        id: "actions",
        header: () => (
            <p className="text-xs font-bold text-gray-600 dark:text-white">
                ACTIONS
            </p>
        ),
        cell: () => (
            <div className="flex gap-2">
                <button className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-white">
                    View
                </button>
            </div>
        ),
    }),
];

const Assembly: React.FC<ComponentProperties> = (props: ComponentProperties) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [barcodeValue, setBarcodeValue] = useState("");
    const [pausedSearchValue, setPausedSearchValue] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pausedSorting, setPausedSorting] = useState<SortingState>([]);
    const [inputHighlight, setInputHighlight] = useState(false);
    const mainInputRef = useRef<HTMLInputElement>(null);

    // Keep barcode input focused — on mount (covers back-navigation) and on window focus
    useEffect(() => {
        props.setPageTitle('Assembly');
        mainInputRef.current?.focus();

        const handleFocus = () => mainInputRef.current?.focus();
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const { isLoading, error, data } = useQuery({
        queryKey: ['recentScans'],
        queryFn: async () => {
            const builds = await assemblyService.getInstrumentSetBuilds();
            const completed = builds.filter(b => b.status === 2);
            const notCompleted = builds.filter(b => b.status !== 2);

            const mappedCompleted = completed.map((build) =>
                mapInstrumentSetBuildToTableItem(build)
            );

            const mappedNotCompleted = notCompleted.map((build) =>
                mapInstrumentSetBuildToTableItem(build)
            );

            return {
                completedBuilds: mappedCompleted,
                nonCompletedBuilds: mappedNotCompleted
            };
        }
    });
    useEffect(() => {
        if (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch recent scans";
            showToast(errorMessage);
        }
    }, [error, showToast]);

    // Handle barcode submission (from scanner or manual entry)
    const handleBarcodeSubmit = useCallback(async (barcode: string) => {
        if (!barcode.trim()) {
            showToast("Please enter a barcode", "error");
            return;
        }

        // Trigger highlight animation
        setInputHighlight(true);
        setTimeout(() => setInputHighlight(false), 500);

        // Show success toast
        showToast(`Processing barcode: ${barcode}`, "success");

        console.log("Barcode submitted:", barcode);

        // see if this is an existing barcode
        let existingBuild = await assemblyService.getLatestInstrumentSetBuildForBarcode(barcode);

        // create a new build if one doesn't exist *or* if the latest is completed
        if (existingBuild == null || existingBuild.status == 2) {
            existingBuild = await assemblyService.startNewBuild(barcode);
        }

        if (existingBuild != null) {
            navigate(`/admin/build-screen/${existingBuild.id}`);
        } else {
            showToast(`No instrument set found for barcode: ${barcode}`, "warning");
            setBarcodeValue("");
        }
    }, [showToast, navigate]);

    // Handle barcode scan from physical scanner
    const handleBarcodeScanned = useCallback((barcode: string) => {
        setBarcodeValue(barcode);
        // Auto-submit when scanned from physical scanner
        handleBarcodeSubmit(barcode);
    }, [handleBarcodeSubmit]);

    // Setup barcode scanner for the main input field
    const { inputRef: scannerInputRef } = useBarcodeScanner({
        onScan: handleBarcodeScanned,
        onError: (error) => {
            showToast(error, "error");
        },
        minLength: 4,
    });

    // Combine refs for the main input
    const setInputRefs = useCallback((element: HTMLInputElement | null) => {
        // Set the scanner ref
        (scannerInputRef as React.RefObject<HTMLInputElement | null>).current = element;
        // Set our local ref
        (mainInputRef as React.RefObject<HTMLInputElement | null>).current = element;
    }, [scannerInputRef]);

    // Handle form submission (Enter key or button click)
    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        handleBarcodeSubmit(barcodeValue);
    }, [barcodeValue, handleBarcodeSubmit]);

    const handleRowClick = (id: string | number) => {
        navigate(`/admin/build-screen/${id}`);
    };

    const pausedTable = useReactTable({
        data: data?.nonCompletedBuilds ?? [],
        columns,
        state: {
            sorting: pausedSorting,
        },
        onSortingChange: setPausedSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const table = useReactTable({
        data: data?.completedBuilds ?? [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="grid h-full grid-cols-1 gap-4">
            {/* Barcode Input - Always available for scanning or manual entry */}
            <Card extra="w-full p-4">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <input
                        ref={setInputRefs}
                        type="text"
                        placeholder="Enter barcode or scan product..."
                        value={barcodeValue}
                        onChange={(e) => setBarcodeValue(e.target.value)}
                        autoFocus
                        className={`flex h-10 w-full items-center justify-center rounded-lg border bg-white/0 px-4 text-sm outline-none border-gray-200 focus:border-brand-500 dark:!border-white/10 dark:text-white dark:focus:border-brand-400 transition-all ${inputHighlight ? "scan-highlight-success" : ""
                            }`}
                    />
                    <button
                        type="submit"
                        className="linear flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
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

            {/* Currently Paused Table */}
            <Card extra="w-full h-full px-4 pb-3">
                <header className="relative flex items-center justify-between pt-3 pb-2">
                    <div className="text-base font-bold text-navy-700 dark:text-white">
                        Currently Incomplete Builds
                    </div>
                </header>

                {/* Search Bar - Minimalistic */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search paused items..."
                        value={pausedSearchValue}
                        onChange={(e) => setPausedSearchValue(e.target.value)}
                        className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none placeholder:text-gray-400 focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400"
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-scroll xl:overflow-x-hidden">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-navy-800">
                            {pausedTable.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10"
                                            >
                                                <div className="items-center justify-between text-xs text-gray-200">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: " 🔼",
                                                        desc: " 🔽",
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {pausedTable.getRowModel().rows.length > 0 ? (
                                pausedTable.getRowModel().rows.map((row) => {
                                    return (
                                        <tr
                                            key={row.id}
                                            onClick={() => handleRowClick(row.original.id)}
                                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                return (
                                                    <td
                                                        key={cell.id}
                                                        className="min-w-[120px] border-white/0 py-1.5 pr-3"
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
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

            {/* Scanned Items Table */}
            <Card extra="w-full h-full px-4 pb-3">
                <header className="relative flex items-center justify-between pt-3 pb-2">
                    <div className="text-base font-bold text-navy-700 dark:text-white">
                        Recent Builds
                    </div>
                    {isLoading && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
                    )}
                </header>

                <div className="mt-3 max-h-[400px] overflow-y-auto overflow-x-scroll xl:overflow-x-hidden">
                    {error ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-red-500 dark:text-red-400">{error.message}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 text-xs text-brand-500 hover:text-brand-600"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="sticky top-0 z-10 bg-white dark:bg-navy-800">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10"
                                                >
                                                    <div className="items-center justify-between text-xs text-gray-200">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: " 🔼",
                                                            desc: " 🔽",
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                </th>
                                            );
                                        })}
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
                                                    Loading recent scans...
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => {
                                        return (
                                            <tr
                                                key={row.id}
                                                onClick={() => handleRowClick(row.original.id)}
                                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                                            >
                                                {row.getVisibleCells().map((cell) => {
                                                    return (
                                                        <td
                                                            key={cell.id}
                                                            className="min-w-[120px] border-white/0 py-1.5 pr-3"
                                                        >
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="py-8 text-center text-xs text-gray-500 dark:text-gray-400"
                                        >
                                            No recent scans found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Assembly;
