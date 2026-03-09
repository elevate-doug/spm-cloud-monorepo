"use client";

const STORAGE_KEY = "spm_labor_standard";
const DEFAULT_VALUE = 0;

type Listener = () => void;

class LaborStandardService {
  private listeners: Set<Listener> = new Set();

  /** Get current accumulated labor standard */
  getLaborStandard(): number {
    if (typeof window === "undefined") return DEFAULT_VALUE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Error reading labor standard:", error);
    }
    return DEFAULT_VALUE;
  }

  /** Set the labor standard value */
  private setLaborStandard(value: number): void {
    try {
      localStorage.setItem(STORAGE_KEY, value.toString());
      this.notifyListeners();
    } catch (error) {
      console.error("Error saving labor standard:", error);
    }
  }

  /** Increment by a given amount (default +1.0) */
  increment(amount: number = 1.0): void {
    const current = this.getLaborStandard();
    this.setLaborStandard(current + amount);
  }

  /** Reset to zero */
  reset(): void {
    this.setLaborStandard(DEFAULT_VALUE);
  }

  /** Subscribe for useSyncExternalStore */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Get snapshot for useSyncExternalStore */
  getSnapshot(): number {
    return this.getLaborStandard();
  }

  /** Server snapshot for SSR */
  getServerSnapshot(): number {
    return DEFAULT_VALUE;
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const laborStandardService = new LaborStandardService();
