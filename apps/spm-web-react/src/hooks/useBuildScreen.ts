import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/toast";
import { useBarcodeScanner } from "./useBarcodeScanner";
import { useDatabaseConnection } from "./useDatabaseConnection";
import { assemblyService } from "../api/services/assemblyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InstrumentSetBuild, InstrumentSetBuildItem } from "../types/assembly";

export interface BuildItem {
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

export interface InstrumentItem {
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
    group: item.groupName ?? "Instruments",
});

const mapInstrumentSetBuildToBuildItem = (build: InstrumentSetBuild): BuildItem => ({
    ...build,
    isComplete: build.status === 2,
    items: build.items.map(mapInstrumentSetBuildItemToInstrumentItem),
});

export interface UseBuildScreenReturn {
    buildId: string | undefined;
    assemblyBuild: BuildItem | null | undefined;
    isLoading: boolean;
    error: Error | null;
    assemblyComments: string;
    setAssemblyComments: (value: string) => void;
    barcodeValue: string;
    setBarcodeValue: (value: string) => void;
    inputHighlight: boolean;
    lastScannedId: string | null;
    canComplete: boolean;
    isSaving: boolean;
    groupedInstruments: Record<string, InstrumentItem[]>;
    setInputRefs: (element: HTMLInputElement | null) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    handleCountUpdate: (data: { instrumentId: string; column: "included" | "missing"; changeBy: 1 | -1 }) => void;
    handlePause: () => void;
    handleComplete: () => void;
    handleExit: () => void;
}

export function useBuildScreen(setPageTitle: (title: string) => void): UseBuildScreenReturn {
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
        queryKey: ["build", buildId],
        queryFn: async () => {
            if (!buildId) return null;
            const assembly = await assemblyService.getBuild(buildId);
            if (!assembly) return null;

            if (assembly.status != 2) {
                await assemblyService.resumeBuild(buildId);
            }

            const build = mapInstrumentSetBuildToBuildItem(assembly);
            setPageTitle(`${build.name} - ${build.barcode}`);
            const sumRequired = assembly.items.reduce((sum, inst) => sum + inst.expectedQuantity, 0);
            const sumInBuild = assembly.items.reduce((sum, inst) => sum + inst.includedQuantity + inst.missingQuantity, 0);
            setCanComplete(sumRequired === sumInBuild);

            return build;
        },
    });

    const countUpdateMutation = useMutation({
        mutationFn: (data: { instrumentId: string; column: "included" | "missing"; changeBy: 1 | -1; completeMessage?: string; isBarcodeScan?: boolean }) => {
            if (!assemblyBuild) throw "Scan not found";
            const instrument = assemblyBuild.items.find((i) => i.id === data.instrumentId || i.barcode === data.instrumentId);
            if (!instrument) throw "Instrument not found";

            const newValue = instrument[data.column] + data.changeBy;
            if (newValue < 0 || newValue > instrument.required)
                throw `${instrument.instrumentComment} already complete (${instrument.included + instrument.missing}/${instrument.required})`;
            if (!data.completeMessage) {
                data.completeMessage = `Set ${instrument.instrumentComment} (${newValue}/${instrument.required})`;
            }

            if (data.column === "included") {
                return assemblyService.updateIncludedQuantity(assemblyBuild.id, data.instrumentId, newValue);
            } else {
                return assemblyService.updateMissingQuantity(assemblyBuild.id, data.instrumentId, newValue);
            }
        },
        onMutate: ({ instrumentId }) => {
            setLastScannedId(instrumentId);
        },
        onSuccess: (_data, variables) => {
            if (variables.completeMessage) {
                showToast(variables.completeMessage, "success");
            }
            setBarcodeValue("");
            return queryClient.invalidateQueries({ queryKey: ["build", buildId] });
        },
        onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : err;
            setBarcodeValue("");
            showToast(errorMessage, "error");
        },
        onSettled: () => {
            setTimeout(() => setLastScannedId(null), 1500);
            setTimeout(() => setInputHighlight(false), 500);
        },
    });

    const pauseMutation = useMutation({
        mutationFn: () => {
            if (!assemblyBuild) throw "Scan not found";
            return assemblyService.pauseBuild(assemblyBuild.id);
        },
        onMutate: () => {
            showToast("Pausing the build", "info");
        },
        onSuccess: () => {
            navigate("/admin/assembly");
        },
        onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : err;
            showToast(errorMessage, "error");
        },
    });

    const completeMutation = useMutation({
        mutationFn: () => {
            if (!assemblyBuild) throw "Scan not found";
            return assemblyService.completeBuild(assemblyBuild.id);
        },
        onMutate: () => {
            showToast("Completing the build", "info");
        },
        onSuccess: () => {
            navigate("/admin/assembly");
        },
        onError: (err) => {
            const errorMessage = err instanceof Error ? err.message : err;
            showToast(errorMessage, "error");
        },
    });

    const handleBarcodeScanned = useCallback(
        async (barcode: string) => {
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
            setLastScannedId(instrument.id);
            setInputHighlight(true);

            await countUpdateMutation.mutateAsync({
                instrumentId: instrument.id,
                column: "included",
                changeBy: 1,
                isBarcodeScan: true,
            });
        },
        [assemblyBuild, countUpdateMutation, showToast]
    );

    const { inputRef: scannerInputRef } = useBarcodeScanner({
        onScan: handleBarcodeScanned,
        onError: (err) => showToast(err, "error"),
        minLength: 4,
    });

    const setInputRefs = useCallback(
        (element: HTMLInputElement | null) => {
            (scannerInputRef as React.RefObject<HTMLInputElement | null>).current = element;
            (barcodeInputRef as React.RefObject<HTMLInputElement | null>).current = element;
        },
        [scannerInputRef]
    );

    const handleFormSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (barcodeValue.trim()) {
                handleBarcodeScanned(barcodeValue.trim());
            }
        },
        [barcodeValue, handleBarcodeScanned]
    );

    const groupedInstruments = useMemo(() => {
        const groups: Record<string, InstrumentItem[]> = {};
        if (!assemblyBuild) return groups;
        assemblyBuild.items.forEach((item) => {
            if (!groups[item.group]) groups[item.group] = [];
            groups[item.group].push(item);
        });
        return groups;
    }, [assemblyBuild]);

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

    return {
        buildId,
        assemblyBuild,
        isLoading,
        error: error as Error | null,
        assemblyComments,
        setAssemblyComments,
        barcodeValue,
        setBarcodeValue,
        inputHighlight,
        lastScannedId,
        canComplete,
        isSaving: countUpdateMutation.isPending,
        groupedInstruments,
        setInputRefs,
        handleFormSubmit,
        handleCountUpdate: (data) => countUpdateMutation.mutate(data),
        handlePause: () => pauseMutation.mutate(),
        handleComplete: () => completeMutation.mutate(),
        handleExit: () => navigate("/admin/assembly"),
    };
}
