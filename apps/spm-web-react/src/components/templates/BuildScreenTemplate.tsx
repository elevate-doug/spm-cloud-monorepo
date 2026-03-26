import React from "react";
import { Button } from "@steris-spm/lingo";
import Card from "../card";
import type { BuildItem, InstrumentItem } from "../../hooks/useBuildScreen";

export interface BuildScreenTemplateProps {
    assemblyBuild: BuildItem | null | undefined;
    isLoading: boolean;
    error: Error | null;
    assemblyComments: string;
    onAssemblyCommentsChange: (value: string) => void;
    barcodeValue: string;
    onBarcodeChange: (value: string) => void;
    inputHighlight: boolean;
    lastScannedId: string | null;
    canComplete: boolean;
    isSaving: boolean;
    groupedInstruments: Record<string, InstrumentItem[]>;
    setInputRefs: (element: HTMLInputElement | null) => void;
    onFormSubmit: (e: React.FormEvent) => void;
    onCountUpdate: (data: { instrumentId: string; column: "included" | "missing"; changeBy: 1 | -1 }) => void;
    onPause: () => void;
    onComplete: () => void;
    onExit: () => void;
}

const MinusSvg = () => (
    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

const PlusSvg = () => (
    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const BuildScreenTemplate: React.FC<BuildScreenTemplateProps> = ({
    assemblyBuild,
    isLoading,
    assemblyComments,
    onAssemblyCommentsChange,
    barcodeValue,
    onBarcodeChange,
    inputHighlight,
    lastScannedId,
    canComplete,
    isSaving,
    groupedInstruments,
    setInputRefs,
    onFormSubmit,
    onCountUpdate,
    onPause,
    onComplete,
    onExit,
}) => {
    const isComplete = assemblyBuild?.isComplete ?? false;
    const columns = ["Manufacturer", "Product #1", "Instrument / comment", "Required", "Included", "Missing"];

    return (
        <div className="flex h-full flex-col gap-4">
            {/* Action buttons */}
            <div className="flex items-center justify-end min-h-[40px]">
                {isSaving && (
                    <div className="mr-auto p-2 flex gap-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Saving Updates</span>
                    </div>
                )}
                {assemblyBuild && (
                    <div className="flex gap-3">
                        {isComplete ? (
                            <Button mode="contained" onPress={onExit}>
                                Exit
                            </Button>
                        ) : (
                            <>
                                <Button mode="contained-warning" onPress={onPause}>
                                    Pause
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={onComplete}
                                    disabled={!canComplete}
                                    customStyle={{ backgroundColor: canComplete ? '#16a34a' : undefined }}
                                >
                                    Complete
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Barcode Scanner Input */}
            <Card extra="w-full p-4">
                <form onSubmit={onFormSubmit} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                        onChange={(e) => onBarcodeChange(e.target.value)}
                        autoFocus
                        className={`flex h-10 flex-1 items-center rounded-lg border bg-white/0 px-4 text-sm outline-none border-gray-200 focus:border-brand-500 dark:!border-white/10 dark:text-white dark:focus:border-brand-400 transition-all ${inputHighlight ? "scan-highlight-success" : ""}`}
                    />
                    <Button
                        mode="contained"
                        onPress={() => onFormSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    >
                        Add
                    </Button>
                </form>
            </Card>

            {/* Instruments Table */}
            <Card extra="w-full flex-1 px-4 pb-4">
                <div className="h-full overflow-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-white dark:bg-navy-800">
                            <tr className="border-b border-gray-200 dark:border-navy-600">
                                {columns.map((col) => (
                                    <th
                                        key={col}
                                        className={`py-3 pr-4 text-left first:pl-2 ${col === "Required" || col === "Included" || col === "Missing" ? "text-center" : ""}`}
                                    >
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                            {col}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Loading scan...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                Object.entries(groupedInstruments).map(([groupName, items]) => (
                                    <React.Fragment key={groupName}>
                                        <tr className="bg-gray-50 dark:bg-navy-700">
                                            <td colSpan={columns.length} className="py-2 pl-2 text-sm font-bold text-navy-700 dark:text-white">
                                                {groupName}
                                            </td>
                                        </tr>
                                        {items.map((item) => {
                                            const itemComplete = item.included >= item.required;
                                            const isJustScanned = lastScannedId === item.id;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={`border-b border-gray-100 transition-all duration-300 dark:border-navy-600 ${
                                                        isJustScanned
                                                            ? "bg-green-100 dark:bg-green-900/30"
                                                            : itemComplete
                                                                ? "bg-green-50/50 dark:bg-green-900/10"
                                                                : "hover:bg-gray-50 dark:hover:bg-navy-700/50"
                                                    }`}
                                                >
                                                    <td className="py-2.5 pl-2 pr-4">
                                                        <p className="text-sm text-navy-700 dark:text-white">{item.manufacturer}</p>
                                                    </td>
                                                    <td className="py-2.5 pr-4">
                                                        <p className={`text-sm ${itemComplete ? "text-green-600 dark:text-green-400 font-medium" : "text-navy-700 dark:text-white"}`}>
                                                            {item.productNumber}
                                                        </p>
                                                    </td>
                                                    <td className="py-2.5 pr-4">
                                                        <p className="text-sm text-navy-700 dark:text-white">{item.instrumentComment}</p>
                                                    </td>
                                                    <td className="py-2.5 pr-4 text-center">
                                                        <p className="text-sm text-navy-700 dark:text-white">{item.required}</p>
                                                    </td>
                                                    {/* Included column */}
                                                    <td className="py-2.5 pr-4 group">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {!isComplete && (
                                                                <button
                                                                    onClick={() => onCountUpdate({ instrumentId: item.id, column: "included", changeBy: -1 })}
                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                    aria-label="Decrement included"
                                                                >
                                                                    <MinusSvg />
                                                                </button>
                                                            )}
                                                            <span className={`px-2 py-0.5 rounded min-w-[28px] text-center text-sm font-medium ${
                                                                itemComplete
                                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                    : item.included > 0
                                                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                                        : "text-navy-700 dark:text-white"
                                                            }`}>
                                                                {item.included}
                                                            </span>
                                                            {!isComplete && (
                                                                <button
                                                                    onClick={() => onCountUpdate({ instrumentId: item.id, column: "included", changeBy: 1 })}
                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                    aria-label="Increment included"
                                                                >
                                                                    <PlusSvg />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    {/* Missing column */}
                                                    <td className="py-2.5 pr-4 group">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {!isComplete && (
                                                                <button
                                                                    onClick={() => onCountUpdate({ instrumentId: item.id, column: "missing", changeBy: -1 })}
                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                    aria-label="Decrement missing"
                                                                >
                                                                    <MinusSvg />
                                                                </button>
                                                            )}
                                                            <span className={`px-2 py-0.5 rounded min-w-[28px] text-center text-sm ${
                                                                item.missing > 0
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium"
                                                                    : "text-navy-700 dark:text-white"
                                                            }`}>
                                                                {item.missing}
                                                            </span>
                                                            {!isComplete && (
                                                                <button
                                                                    onClick={() => onCountUpdate({ instrumentId: item.id, column: "missing", changeBy: 1 })}
                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                    aria-label="Increment missing"
                                                                >
                                                                    <PlusSvg />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                ))
                            )}
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
                        onChange={(e) => onAssemblyCommentsChange(e.target.value)}
                        placeholder="Enter assembly comments..."
                        rows={3}
                        className="flex-1 rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400 resize-none"
                    />
                </div>
            </Card>
        </div>
    );
};

export default BuildScreenTemplate;
