import * as signalR from "@microsoft/signalr";
import { API_ENDPOINTS } from '../../constants/api/endpoints';
import { userService } from './userService';
import apiClient from '../client';

/**
 * Database Connection Service
 * Monitors database connectivity status via a SignalR hub at /ws/status.
 * Listens for "DatabaseConnected" and "DatabaseDisconnected" events.
 * Exposes subscribe/getSnapshot for useSyncExternalStore compatibility.
 */

export type DatabaseConnectionStatus = "connected" | "disconnected" | "reconnecting";

type Listener = () => void;

class DatabaseConnectionService {
    private listeners: Set<Listener> = new Set();
    private connection: signalR.HubConnection;
    private status: DatabaseConnectionStatus = "connected";
    private hasConnected = false;
    private optimisticTimer: ReturnType<typeof setTimeout> | undefined;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(API_ENDPOINTS.DATABASE.STATUS_HUB, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => {
                    return userService.getAuthHeader(true) ?? '';
                }
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.registerHandlers();
        this.registerConnectionEvents();
    }

    private registerHandlers(): void {
        this.connection.on("DatabaseConnected", () => {
            this.setStatus("connected");
        });

        this.connection.on("DatabaseDisconnected", () => {
            this.setStatus("disconnected");
        });
    }

    private registerConnectionEvents(): void {
        this.connection.onreconnecting(() => {
            if (this.hasConnected) {
                this.setStatus("reconnecting");
            }
        });

        this.connection.onreconnected(() => {
            // Hub reconnected — wait for a DatabaseConnected event
            // to confirm DB status rather than assuming connected.
        });

        this.connection.onclose(() => {
            if (this.hasConnected) {
                this.setStatus("disconnected");
            }
            setTimeout(() => this.startConnection(), 5000);
        });
    }

    public async startConnection(): Promise<void> {
        try {
            if (this.connection.state === signalR.HubConnectionState.Disconnected) {
                // Only show "reconnecting" if we've connected before;
                // on initial load, stay optimistic until the hub tells us otherwise.
                if (this.hasConnected) {
                    this.setStatus("reconnecting");
                }
                await this.connection.start();
                this.hasConnected = true;
                // "DatabaseConnected" fires at startup, so status
                // will be set to "connected" via the handler.
            }
        } catch (err) {
            console.error("Database status hub connection failed:", err);
            if (this.hasConnected) {
                this.setStatus("disconnected");
            }
            setTimeout(() => this.startConnection(), 5000);
        }
    }

    public async stopConnection(): Promise<void> {
        try {
            await this.connection.stop();
        } catch (err) {
            console.error("Error stopping database status hub:", err);
        }
    }

    /**
     * Simulate a database disconnect via the API.
     * The hub will fire a "DatabaseDisconnected" event in response.
     * Falls back to an optimistic status update if SignalR doesn't deliver the event.
     */
    public async killConnection(): Promise<void> {
        await apiClient.put(API_ENDPOINTS.DATABASE.SIMULATE_DISCONNECT);
        this.applyOptimisticStatus("disconnected");
    }

    /**
     * Simulate a database reconnect via the API.
     * The hub will fire a "DatabaseConnected" event in response.
     * Falls back to an optimistic status update if SignalR doesn't deliver the event.
     */
    public async forceReconnect(): Promise<void> {
        await apiClient.put(API_ENDPOINTS.DATABASE.SIMULATE_CONNECT);
        this.applyOptimisticStatus("connected");
    }

    /**
     * If SignalR hasn't already delivered the expected status within a
     * short window, apply it optimistically so the UI stays in sync.
     */
    private applyOptimisticStatus(expected: DatabaseConnectionStatus): void {
        clearTimeout(this.optimisticTimer);
        this.optimisticTimer = setTimeout(() => {
            if (this.status !== expected) {
                this.setStatus(expected);
            }
        }, 2000);
    }

    private setStatus(status: DatabaseConnectionStatus): void {
        if (this.status !== status) {
            this.status = status;
            this.notifyListeners();
        }
    }

    /**
     * Subscribe to status changes (for useSyncExternalStore)
     */
    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Get a snapshot of the current status (for useSyncExternalStore)
     */
    getSnapshot(): DatabaseConnectionStatus {
        return this.status;
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener());
    }
}

export const databaseConnectionService = new DatabaseConnectionService();
