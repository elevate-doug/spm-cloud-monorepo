import * as signalR from "@microsoft/signalr";
import { userService } from '../../api/services/userService';

/**
 * Labor Standard Service
 * Tracks accumulated labor standard value in localStorage.
 * Includes a subscription mechanism for reactive React components.
 */
const LABOR_STANDARD_STORAGE_KEY = 'spm_labor_standard';
const DEFAULT_VALUE = 0;

type Listener = () => void;

class LaborStandardService {
    private listeners: Set<Listener> = new Set();
    private connection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('/ws/user/laborStandard', {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () => {
                    return userService.getAuthHeader(true) ?? '';
                }
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.registerHandlers();
    }

    private registerHandlers(): void {
        this.connection.on("laborStandardUpdated", (laborStandard: string) => {
            this.setLaborStandard(parseFloat(laborStandard));
            this.notifyListeners();
        });
    }

    public async startConnection(): Promise<void> {
        try {
            if (this.connection.state == signalR.HubConnectionState.Disconnected) {
                await this.connection.start();
            }
        } catch (err) {
            console.error("Error while starting connection: " + err);
            setTimeout(() => this.startConnection(), 5000);
        }
    }

    /**
     * Get the current accumulated labor standard value
     */
    getLaborStandard(): number {
        try {
            const stored = localStorage.getItem(LABOR_STANDARD_STORAGE_KEY);
            if (stored !== null) {
                const parsed = parseFloat(stored);
                if (!isNaN(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error('Error reading labor standard from storage:', error);
        }
        return DEFAULT_VALUE;
    }

    /**
     * Set the accumulated labor standard value
     */
    setLaborStandard(value: number): void {
        try {
            localStorage.setItem(LABOR_STANDARD_STORAGE_KEY, JSON.stringify(value));
            this.notifyListeners();
        } catch (error) {
            console.error('Error saving labor standard to storage:', error);
        }
    }

    /**
     * Subscribe to changes (for useSyncExternalStore)
     */
    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        this.startConnection().then(() => { });
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Get a snapshot of the current value (for useSyncExternalStore)
     */
    getSnapshot(): number {
        return this.getLaborStandard();
    }

    private notifyListeners(): void {
        this.listeners.forEach((listener) => listener());
    }
}

// Export singleton instance
export const laborStandardService = new LaborStandardService();
