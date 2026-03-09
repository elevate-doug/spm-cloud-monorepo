import React, { useEffect, useRef, useState } from "react";
import { databaseConnectionService, type DatabaseConnectionStatus } from "../../api/services/databaseConnectionService";
import { useDatabaseConnection } from "../../hooks/useDatabaseConnection";

interface ConnectionStatusProviderProps {
    children: React.ReactNode;
}

/**
 * Provider that manages the database connection lifecycle and
 * renders a status banner when the connection is unhealthy.
 * Place at the root of the app so every page benefits automatically.
 */
export function ConnectionStatusProvider({ children }: ConnectionStatusProviderProps) {
    useEffect(() => {
        databaseConnectionService.startConnection();
        return () => {
            databaseConnectionService.stopConnection();
        };
    }, []);

    return (
        <>
            {children}
            <ConnectionStatusOverlay />
        </>
    );
}

function ConnectionStatusOverlay() {
    const status = useDatabaseConnection();
    const prevStatusRef = useRef<DatabaseConnectionStatus>(status);
    const [showSuccess, setShowSuccess] = useState(false);
    const successTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        const wasDisconnected = prevStatusRef.current === "reconnecting" || prevStatusRef.current === "disconnected";
        if (wasDisconnected && status === "connected") {
            setShowSuccess(true);
            successTimerRef.current = setTimeout(() => setShowSuccess(false), 3000);
        } else if (status !== "connected") {
            clearTimeout(successTimerRef.current);
            setShowSuccess(false);
        }
        prevStatusRef.current = status;
        return () => clearTimeout(successTimerRef.current);
    }, [status]);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2">
            <SimulationButton />
            {(status === "disconnected" || status === "reconnecting") && (
                <ConnectionStatusBanner status={status} />
            )}
            {showSuccess && <SuccessBanner onDone={() => setShowSuccess(false)} />}
        </div>
    );
}

/**
 * Single button that toggles between disconnect/reconnect with loading feedback.
 */
function SimulationButton() {
    const status = useDatabaseConnection();
    const [pendingTarget, setPendingTarget] = useState<DatabaseConnectionStatus | null>(null);

    const isConnected = status === "connected";
    const loading = pendingTarget !== null;

    // Clear loading once the status reaches the target (or any change after the call).
    useEffect(() => {
        if (pendingTarget !== null && status === pendingTarget) {
            setPendingTarget(null);
        }
    }, [status, pendingTarget]);

    const handleClick = async () => {
        const target: DatabaseConnectionStatus = isConnected ? "disconnected" : "connected";
        setPendingTarget(target);
        try {
            if (isConnected) {
                await databaseConnectionService.killConnection();
            } else {
                await databaseConnectionService.forceReconnect();
            }
        } catch {
            setPendingTarget(null);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`
                px-3 py-2 rounded-lg border shadow-sm
                text-xs font-medium
                transition-colors duration-200
                ${loading
                    ? "cursor-wait opacity-70 bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                    : isConnected
                        ? "cursor-pointer bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        : "cursor-pointer bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300"
                }
            `}
        >
            {loading
                ? (isConnected ? "Disconnecting..." : "Reconnecting...")
                : (isConnected ? "Disconnect Database" : "Reconnect Database")
            }
        </button>
    );
}

function ConnectionStatusBanner({ status }: { status: DatabaseConnectionStatus }) {
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        timerRef.current = setTimeout(() => setIsVisible(true), 10);
        return () => {
            clearTimeout(timerRef.current);
            setIsVisible(false);
        };
    }, []);

    const isReconnecting = status === "reconnecting";

    return (
        <div
            role="status"
            aria-live="polite"
            className={`
                flex items-center gap-2.5 px-4 py-2.5 rounded-lg border shadow-lg
                text-sm font-medium
                transition-all duration-300 ease-out
                ${isReconnecting
                    ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
                    : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
                }
                ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }
            `}
        >
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span
                    className={`
                        absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping
                        ${isReconnecting ? "bg-amber-400" : "bg-red-400"}
                    `}
                />
                <span
                    className={`
                        relative inline-flex h-2.5 w-2.5 rounded-full
                        ${isReconnecting ? "bg-amber-500" : "bg-red-500"}
                    `}
                />
            </span>
            <span>
                {isReconnecting
                    ? "Reconnecting to database..."
                    : "Database connection lost"
                }
            </span>
        </div>
    );
}

function SuccessBanner({ onDone }: { onDone: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const enterTimeout = setTimeout(() => setIsVisible(true), 10);
        const exitTimeout = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onDone, 300);
        }, 2700);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(exitTimeout);
        };
    }, [onDone]);

    return (
        <div
            role="status"
            aria-live="polite"
            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg border shadow-lg
                text-sm font-medium
                transition-all duration-300 ease-out
                bg-green-50 border-green-200 text-green-800
                dark:bg-green-900/20 dark:border-green-800 dark:text-green-300
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
            `}
        >
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white text-xs font-bold flex-shrink-0">
                ✓
            </span>
            <span>Database connection restored</span>
        </div>
    );
}

export default ConnectionStatusProvider;
