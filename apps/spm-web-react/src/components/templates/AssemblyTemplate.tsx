import { Button } from "@steris-spm/lingo";
import Card from "../card";
import type { BuildTableItem } from "../../hooks/useAssembly";
import { displayValue } from "../../hooks/useAssembly";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

type SortingState = Array<{
    id: string;
    desc: boolean;
}>;

export interface AssemblyTemplateProps {
    barcodeValue: string;
    onBarcodeChange: (value: string) => void;
    pausedSearchValue: string;
    onPausedSearchChange: (value: string) => void;
    sorting: SortingState;
    onSortingChange: (value: SortingState) => void;
    pausedSorting: SortingState;
    onPausedSortingChange: (value: SortingState) => void;
    inputHighlight: boolean;
    setInputRefs: (element: HTMLInputElement | null) => void;
    isLoading: boolean;
    error: Error | null;
    completedBuilds: BuildTableItem[];
    nonCompletedBuilds: BuildTableItem[];
    onFormSubmit: (e: React.FormEvent) => void;
    onRowClick: (id: string | number) => void;
}

const columnHelper = createColumnHelper<BuildTableItem>();

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
            <p className="text-xs font-bold text-gray-600 dark:text-white">WHEN SCANNED</p>
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
            <p className="text-xs font-bold text-gray-600 dark:text-white">LOCATION</p>
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
            <p className="text-xs font-bold text-gray-600 dark:text-white">SCANNED BY</p>
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
            <p className="text-xs font-bold text-gray-600 dark:text-white">PROCESS ACTION</p>
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
            <p className="text-xs font-bold text-gray-600 dark:text-white">ACTIONS</p>
        ),
        cell: () => (
            <div className="flex gap-2">
                <Button mode="text" customTextStyle={{ fontSize: 12, textTransform: 'none' }}>
                    View
                </Button>
            </div>
        ),
    }),
];

const AssemblyTemplate: React.FC<AssemblyTemplateProps> = ({
    barcodeValue,
    onBarcodeChange,
    pausedSearchValue,
    onPausedSearchChange,
    sorting,
    onSortingChange,
    pausedSorting,
    onPausedSortingChange,
    inputHighlight,
    setInputRefs,
    isLoading,
    error,
    completedBuilds,
    nonCompletedBuilds,
    onFormSubmit,
    onRowClick,
}) => {
    const pausedTable = useReactTable({
        data: nonCompletedBuilds,
        columns,
        state: {
            sorting: pausedSorting,
        },
        onSortingChange: onPausedSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const table = useReactTable({
        data: completedBuilds,
        columns,
        state: {
            sorting,
        },
        onSortingChange: onSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="grid h-full grid-cols-1 gap-4">
            {/* Barcode Input - Always available for scanning or manual entry */}
            <Card extra="w-full p-4">
                <form onSubmit={onFormSubmit} className="flex items-center gap-2">
                    <input
                        ref={setInputRefs}
                        type="text"
                        placeholder="Enter barcode or scan product..."
                        value={barcodeValue}
                        onChange={(e) => onBarcodeChange(e.target.value)}
                        autoFocus
                        className={`flex h-10 w-full items-center justify-center rounded-lg border bg-white/0 px-4 text-sm outline-none border-gray-200 focus:border-brand-500 dark:!border-white/10 dark:text-white dark:focus:border-brand-400 transition-all ${inputHighlight ? "scan-highlight-success" : ""}`}
                    />
                    <Button
                        mode="contained"
                        onPress={() => onFormSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    >
                        Submit
                    </Button>
                </form>
            </Card>

            {/* Currently Incomplete Builds Table */}
            <Card extra="w-full h-full px-4 pb-3">
                <header className="relative flex items-center justify-between pt-3 pb-2">
                    <div className="text-base font-bold text-navy-700 dark:text-white">
                        Currently Incomplete Builds
                    </div>
                </header>

                {/* Search Bar */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search paused items..."
                        value={pausedSearchValue}
                        onChange={(e) => onPausedSearchChange(e.target.value)}
                        className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none placeholder:text-gray-400 focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400"
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-scroll xl:overflow-x-hidden">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-navy-800">
                            {pausedTable.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10"
                                        >
                                            <div className="items-center justify-between text-xs text-gray-200">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: " 🔼",
                                                    desc: " 🔽",
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {pausedTable.getRowModel().rows.length > 0 ? (
                                pausedTable.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => onRowClick(row.original.id)}
                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="min-w-[120px] border-white/0 py-1.5 pr-3"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
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

            {/* Recent Builds Table */}
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
                            <Button
                                mode="text"
                                onPress={() => window.location.reload()}
                                customTextStyle={{ fontSize: 12, textTransform: 'none' }}
                            >
                                Try again
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="sticky top-0 z-10 bg-white dark:bg-navy-800">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="cursor-pointer border-b border-gray-200 pb-1.5 pr-3 pt-2 text-start dark:border-white/10"
                                            >
                                                <div className="items-center justify-between text-xs text-gray-200">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: " 🔼",
                                                        desc: " 🔽",
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
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
                                                    Loading recent scans...
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            onClick={() => onRowClick(row.original.id)}
                                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className="min-w-[120px] border-white/0 py-1.5 pr-3"
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
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

export default AssemblyTemplate;
