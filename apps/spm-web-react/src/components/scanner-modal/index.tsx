import React, { useEffect, useRef, useState, useCallback } from "react";
import { useBarcodeScanner } from "../../hooks/useBarcodeScanner";

interface ScannerModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when a barcode is successfully scanned */
  onScan: (barcode: string) => void;
  /** Title displayed in the modal header */
  title?: string;
  /** Description text below the title */
  description?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Minimum barcode length (default: 4) */
  minLength?: number;
}

/**
 * Modal component for barcode scanning.
 * Provides a focused input that detects physical barcode scanner input.
 * 
 * @example
 * ```tsx
 * <ScannerModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onScan={(barcode) => {
 *     console.log('Scanned:', barcode);
 *     setIsModalOpen(false);
 *   }}
 * />
 * ```
 */
const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  title = "Scan Barcode",
  description = "Use your barcode scanner or enter the barcode manually",
  placeholder = "Waiting for scan...",
  minLength = 4,
}) => {
  const [manualValue, setManualValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

  // Define handleClose first since it's used by hooks below
  const handleClose = useCallback(() => {
    setManualValue("");
    setIsScanning(false);
    setScanSuccess(false);
    onClose();
  }, [onClose]);

  const { inputRef: scannerInputRef } = useBarcodeScanner({
    onScan: (barcode) => {
      setIsScanning(true);
      setScanSuccess(true);
      
      // Brief delay for visual feedback
      setTimeout(() => {
        onScan(barcode);
        handleClose();
      }, 300);
    },
    onError: (error) => {
      console.warn("Scanner error:", error);
    },
    minLength,
    enabled: isOpen,
  });

  // Focus the scanner input when modal opens
  useEffect(() => {
    if (isOpen && scannerInputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        scannerInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, scannerInputRef]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClose]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualValue.trim().length >= minLength) {
      onScan(manualValue.trim());
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl
          dark:bg-navy-800 dark:border dark:border-navy-700
          transform transition-all duration-300
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-navy-700 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {description}
          </p>

          {/* Scanner Input (hidden but functional) */}
          <div className="relative mb-4">
            <div
              className={`
                flex items-center justify-center h-24 rounded-xl border-2 border-dashed
                transition-all duration-300
                ${scanSuccess
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : isScanning
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                  : "border-gray-200 bg-gray-50 dark:border-navy-600 dark:bg-navy-700"
                }
              `}
            >
              {scanSuccess ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Scan successful!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {/* Barcode Icon */}
                  <svg
                    className={`w-8 h-8 ${isScanning ? "text-brand-500 animate-pulse" : "text-gray-400 dark:text-gray-500"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                    />
                  </svg>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {placeholder}
                  </span>
                </div>
              )}
            </div>

            {/* Hidden scanner input that captures keystrokes */}
            <input
              ref={scannerInputRef}
              type="text"
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
              aria-label="Barcode scanner input"
              autoComplete="off"
            />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-navy-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 dark:bg-navy-800 dark:text-gray-400">
                or enter manually
              </span>
            </div>
          </div>

          {/* Manual Input */}
          <form onSubmit={handleManualSubmit}>
            <div className="flex gap-2">
              <input
                ref={manualInputRef}
                type="text"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                placeholder="Enter barcode number..."
                className="flex-1 h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm outline-none placeholder:text-gray-400 focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400 transition-colors"
              />
              <button
                type="submit"
                disabled={manualValue.trim().length < minLength}
                className="px-5 h-11 rounded-lg bg-brand-500 text-sm font-medium text-white transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-400 dark:hover:bg-brand-300"
              >
                Submit
              </button>
            </div>
            {manualValue.length > 0 && manualValue.length < minLength && (
              <p className="mt-2 text-xs text-gray-400">
                Minimum {minLength} characters required
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;
