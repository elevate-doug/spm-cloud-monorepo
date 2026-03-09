import { useEffect, useRef, useCallback } from "react";

export interface BarcodeScannerOptions {
  /** Callback fired when a barcode is successfully scanned */
  onScan: (barcode: string) => void;
  /** Callback fired on scan error (e.g., barcode too short) */
  onError?: (error: string) => void;
  /** Minimum barcode length to be considered valid (default: 4) */
  minLength?: number;
  /** Maximum time in ms between keystrokes to count as scanner input (default: 50) */
  maxTimeBetweenKeys?: number;
  /** Whether to prevent default behavior on scanner input (default: true) */
  preventDefault?: boolean;
  /** Whether the scanner is enabled (default: true) */
  enabled?: boolean;
}

interface BarcodeScannerReturn {
  /** Ref to attach to the input element */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Manually reset the scanner buffer */
  reset: () => void;
}

/**
 * Hook to detect barcode scanner input (rapid keystrokes followed by Enter).
 * Detects rapid keystrokes (<50ms apart) and distinguishes it
 * from normal human typing.
 */
export function useBarcodeScanner(options: BarcodeScannerOptions): BarcodeScannerReturn {
  const {
    onScan,
    onError,
    minLength = 4,
    maxTimeBetweenKeys = 50,
    preventDefault = true,
    enabled = true,
  } = options;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bufferRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    bufferRef.current = "";
    lastKeyTimeRef.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const now = Date.now();
      const timeSinceLastKey = now - lastKeyTimeRef.current;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // If too much time has passed, reset the buffer (human typing or pause)
      if (timeSinceLastKey > maxTimeBetweenKeys && bufferRef.current.length > 0) {
        if (lastKeyTimeRef.current !== 0) {
          reset();
        }
      }

      lastKeyTimeRef.current = now;

      // Handle Enter key - potential end of barcode scan
      if (event.key === "Enter") {
        const barcode = bufferRef.current.trim();

        if (barcode.length >= minLength) {
          // Valid barcode detected
          if (preventDefault) {
            event.preventDefault();
            event.stopPropagation();
          }
          onScan(barcode);
          reset();
          return;
        } else if (barcode.length > 0 && barcode.length < minLength) {
          onError?.(`Barcode too short (minimum ${minLength} characters)`);
          reset();
          return;
        }
        // If buffer is empty, let Enter behave normally
        reset();
        return;
      }

      // Only capture printable characters
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        bufferRef.current += event.key;

        // Set a timeout to reset the buffer if no more keys come
        // This handles the case where scanning is interrupted
        timeoutRef.current = setTimeout(() => {
          reset();
        }, maxTimeBetweenKeys * 3);
      }
    };

    const inputElement = inputRef.current;

    if (inputElement) {
      // Listen on the specific input element
      inputElement.addEventListener("keydown", handleKeyDown);
      return () => {
        inputElement.removeEventListener("keydown", handleKeyDown);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, maxTimeBetweenKeys, minLength, onScan, onError, preventDefault, reset]);

  return {
    inputRef,
    reset,
  };
}

export default useBarcodeScanner;
