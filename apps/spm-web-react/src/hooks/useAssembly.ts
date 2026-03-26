import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/toast";
import { useBarcodeScanner } from "./useBarcodeScanner";
import { assemblyService } from "../api/services/assemblyService";
import type { InstrumentSetBuild } from "../types/assembly";
import { useQuery } from "@tanstack/react-query";

type SortingState = Array<{
    id: string;
    desc: boolean;
}>;

export interface BuildTableItem {
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
        return "—";
    }
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
        default: return "Unknown";
    }
};

const mapInstrumentSetBuildToTableItem = (build: InstrumentSetBuild): BuildTableItem => {
    return {
        id: build.id,
        barcode: build.barcode,
        description: build.name,
        whenScanned: formatDate(build.buildDate),
        location: build.location,
        scannedBy: build.user,
        processAction: mapStageToString(build.currentStage),
    };
};

export { displayValue };

export interface UseAssemblyReturn {
    barcodeValue: string;
    setBarcodeValue: (value: string) => void;
    pausedSearchValue: string;
    setPausedSearchValue: (value: string) => void;
    sorting: SortingState;
    setSorting: (value: SortingState) => void;
    pausedSorting: SortingState;
    setPausedSorting: (value: SortingState) => void;
    inputHighlight: boolean;
    setInputRefs: (element: HTMLInputElement | null) => void;
    isLoading: boolean;
    error: Error | null;
    completedBuilds: BuildTableItem[];
    nonCompletedBuilds: BuildTableItem[];
    handleFormSubmit: (e: React.FormEvent) => void;
    handleRowClick: (id: string | number) => void;
}

export function useAssembly(setPageTitle: (title: string) => void): UseAssemblyReturn {
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
        setPageTitle("Assembly");
        mainInputRef.current?.focus();

        const handleFocus = () => mainInputRef.current?.focus();
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const { isLoading, error, data } = useQuery({
        queryKey: ["recentScans"],
        queryFn: async () => {
            const builds = await assemblyService.getInstrumentSetBuilds();
            const completed = builds.filter((b) => b.status === 2);
            const notCompleted = builds.filter((b) => b.status !== 2);

            return {
                completedBuilds: completed.map(mapInstrumentSetBuildToTableItem),
                nonCompletedBuilds: notCompleted.map(mapInstrumentSetBuildToTableItem),
            };
        },
    });

    useEffect(() => {
        if (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to fetch recent scans";
            showToast(errorMessage);
        }
    }, [error, showToast]);

    // Handle barcode submission (from scanner or manual entry)
    const handleBarcodeSubmit = useCallback(
        async (barcode: string) => {
            if (!barcode.trim()) {
                showToast("Please enter a barcode", "error");
                return;
            }

            // Trigger highlight animation
            setInputHighlight(true);
            setTimeout(() => setInputHighlight(false), 500);

            showToast(`Processing barcode: ${barcode}`, "success");

            // see if this is an existing barcode
            let existingBuild =
                await assemblyService.getLatestInstrumentSetBuildForBarcode(barcode);

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
        },
        [showToast, navigate]
    );

    // Handle barcode scan from physical scanner
    const handleBarcodeScanned = useCallback(
        (barcode: string) => {
            setBarcodeValue(barcode);
            handleBarcodeSubmit(barcode);
        },
        [handleBarcodeSubmit]
    );

    // Setup barcode scanner for the main input field
    const { inputRef: scannerInputRef } = useBarcodeScanner({
        onScan: handleBarcodeScanned,
        onError: (err) => {
            showToast(err, "error");
        },
        minLength: 4,
    });

    // Combine refs for the main input
    const setInputRefs = useCallback(
        (element: HTMLInputElement | null) => {
            (scannerInputRef as React.RefObject<HTMLInputElement | null>).current = element;
            (mainInputRef as React.RefObject<HTMLInputElement | null>).current = element;
        },
        [scannerInputRef]
    );

    // Handle form submission (Enter key or button click)
    const handleFormSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            handleBarcodeSubmit(barcodeValue);
        },
        [barcodeValue, handleBarcodeSubmit]
    );

    const handleRowClick = (id: string | number) => {
        navigate(`/admin/build-screen/${id}`);
    };

    return {
        barcodeValue,
        setBarcodeValue,
        pausedSearchValue,
        setPausedSearchValue,
        sorting,
        setSorting,
        pausedSorting,
        setPausedSorting,
        inputHighlight,
        setInputRefs,
        isLoading,
        error: error as Error | null,
        completedBuilds: data?.completedBuilds ?? [],
        nonCompletedBuilds: data?.nonCompletedBuilds ?? [],
        handleFormSubmit,
        handleRowClick,
    };
}
