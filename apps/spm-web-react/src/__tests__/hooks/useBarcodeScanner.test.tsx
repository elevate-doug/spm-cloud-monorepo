import { render, screen } from '@testing-library/react';
import { useBarcodeScanner, BarcodeScannerOptions } from '../../hooks/useBarcodeScanner';

// Test component that uses the hook
function TestBarcodeInput(props: BarcodeScannerOptions) {
  const { inputRef } = useBarcodeScanner(props);
  return <input ref={inputRef} data-testid="barcode-input" />;
}

describe('useBarcodeScanner Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper to simulate rapid keystrokes (like a barcode scanner)
  function simulateScan(input: HTMLElement, barcode: string, delayMs = 10) {
    barcode.split('').forEach((char) => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      jest.advanceTimersByTime(delayMs);
    });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  }

  describe('Basic Functionality', () => {
    it('should render with inputRef attached', () => {
      const onScan = jest.fn();
      render(<TestBarcodeInput onScan={onScan} />);

      expect(screen.getByTestId('barcode-input')).toBeInTheDocument();
    });

    it('should call onScan when valid barcode is entered followed by Enter', () => {
      const onScan = jest.fn();
      render(<TestBarcodeInput onScan={onScan} />);

      const input = screen.getByTestId('barcode-input');
      simulateScan(input, 'BARCODE123');

      expect(onScan).toHaveBeenCalledWith('BARCODE123');
    });
  });

  describe('Minimum Length Validation', () => {
    it('should call onError for barcode shorter than minLength', () => {
      const onScan = jest.fn();
      const onError = jest.fn();
      render(<TestBarcodeInput onScan={onScan} onError={onError} minLength={4} />);

      const input = screen.getByTestId('barcode-input');
      simulateScan(input, 'ABC'); // Only 3 chars

      expect(onScan).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(expect.stringContaining('minimum'));
    });

    it('should respect custom minLength', () => {
      const onScan = jest.fn();
      render(<TestBarcodeInput onScan={onScan} minLength={8} />);

      const input = screen.getByTestId('barcode-input');
      simulateScan(input, 'ABCD1234'); // Exactly 8 chars

      expect(onScan).toHaveBeenCalledWith('ABCD1234');
    });

    it('should reject barcode shorter than custom minLength', () => {
      const onScan = jest.fn();
      const onError = jest.fn();
      render(<TestBarcodeInput onScan={onScan} onError={onError} minLength={8} />);

      const input = screen.getByTestId('barcode-input');
      simulateScan(input, 'ABCD123'); // Only 7 chars

      expect(onScan).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(expect.stringContaining('minimum'));
    });
  });

  describe('Enter Key Handling', () => {
    it('should not trigger error on empty Enter press', () => {
      const onScan = jest.fn();
      const onError = jest.fn();
      render(<TestBarcodeInput onScan={onScan} onError={onError} />);

      const input = screen.getByTestId('barcode-input');
      // Just press Enter without any barcode
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onScan).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('Special Characters', () => {
    it('should handle alphanumeric barcodes', () => {
      const onScan = jest.fn();
      render(<TestBarcodeInput onScan={onScan} />);

      const input = screen.getByTestId('barcode-input');
      simulateScan(input, 'ABC123XYZ');

      expect(onScan).toHaveBeenCalledWith('ABC123XYZ');
    });

    it('should handle barcodes with dashes', () => {
      const onScan = jest.fn();
      render(<TestBarcodeInput onScan={onScan} />);

      const input = screen.getByTestId('barcode-input');
      simulateScan(input, 'SET-001-A');

      expect(onScan).toHaveBeenCalledWith('SET-001-A');
    });
  });

  describe('Enabled/Disabled', () => {
    it('should not process input when disabled', () => {
      const onScan = jest.fn();
      render(<TestBarcodeInput onScan={onScan} enabled={false} />);

      const input = screen.getByTestId('barcode-input');
      simulateScan(input, 'BARCODE123');

      expect(onScan).not.toHaveBeenCalled();
    });
  });

  describe('Slow Typing Detection', () => {
    it('should reset buffer if typing is too slow (human typing)', () => {
      const onScan = jest.fn();
      render(<TestBarcodeInput onScan={onScan} maxTimeBetweenKeys={50} />);

      const input = screen.getByTestId('barcode-input');

      // Type first part quickly
      'BAR'.split('').forEach((char) => {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
        jest.advanceTimersByTime(10);
      });

      // Wait too long (simulate human pause)
      jest.advanceTimersByTime(100);

      // Type second part quickly
      'CODE'.split('').forEach((char) => {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
        jest.advanceTimersByTime(10);
      });

      // Press Enter - should only get 'CODE' since buffer was reset
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      // Buffer was reset after pause, so only 'CODE' (4 chars) would be scanned
      expect(onScan).toHaveBeenCalledWith('CODE');
    });
  });
});
