import { renderHook, act } from '@testing-library/react';
import { useLaborStandard } from '../../hooks/useLaborStandard';
import { laborStandardService } from '../../api/services/laborStandardService';

// Mock the laborStandardService
jest.mock('../../api/services/laborStandardService', () => ({
  laborStandardService: {
    subscribe: jest.fn((callback: () => void) => {
      // Store the callback so we can trigger updates
      (globalThis as any).__laborStandardCallback = callback;
      return () => {
        (globalThis as any).__laborStandardCallback = null;
      };
    }),
    getSnapshot: jest.fn(() => 0),
    getLaborStandard: jest.fn(() => 0),
    setLaborStandard: jest.fn((value: number) => {
      (laborStandardService.getSnapshot as jest.Mock).mockReturnValue(value);
      (laborStandardService.getLaborStandard as jest.Mock).mockReturnValue(value);
      // Notify subscribers
      if ((globalThis as any).__laborStandardCallback) {
        (globalThis as any).__laborStandardCallback();
      }
    }),
    startConnection: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('useLaborStandard Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (laborStandardService.getSnapshot as jest.Mock).mockReturnValue(0);
    (laborStandardService.getLaborStandard as jest.Mock).mockReturnValue(0);
  });

  describe('Initial Value', () => {
    it('should return default value (0) when service returns 0', () => {
      const { result } = renderHook(() => useLaborStandard());
      expect(result.current).toBe(0);
    });

    it('should return stored value from service', () => {
      (laborStandardService.getSnapshot as jest.Mock).mockReturnValue(42);

      const { result } = renderHook(() => useLaborStandard());
      expect(result.current).toBe(42);
    });

    it('should handle decimal values', () => {
      (laborStandardService.getSnapshot as jest.Mock).mockReturnValue(3.14);

      const { result } = renderHook(() => useLaborStandard());
      expect(result.current).toBe(3.14);
    });
  });

  describe('Subscription', () => {
    it('should subscribe to laborStandardService', () => {
      renderHook(() => useLaborStandard());
      expect(laborStandardService.subscribe).toHaveBeenCalled();
    });

    it('should unsubscribe on unmount', () => {
      const unsubscribe = jest.fn();
      (laborStandardService.subscribe as jest.Mock).mockReturnValue(unsubscribe);

      const { unmount } = renderHook(() => useLaborStandard());
      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Value Updates', () => {
    it('should update when service value changes', () => {
      const { result, rerender } = renderHook(() => useLaborStandard());

      expect(result.current).toBe(0);

      act(() => {
        laborStandardService.setLaborStandard(100);
      });

      rerender();
      expect(result.current).toBe(100);
    });

    it('should reflect incremental updates', () => {
      const { result, rerender } = renderHook(() => useLaborStandard());

      act(() => {
        laborStandardService.setLaborStandard(1);
      });
      rerender();
      expect(result.current).toBe(1);

      act(() => {
        laborStandardService.setLaborStandard(2);
      });
      rerender();
      expect(result.current).toBe(2);

      act(() => {
        laborStandardService.setLaborStandard(3);
      });
      rerender();
      expect(result.current).toBe(3);
    });
  });

  describe('Multiple Hooks', () => {
    it('should work with multiple hook instances', () => {
      (laborStandardService.getSnapshot as jest.Mock).mockReturnValue(50);

      const { result: result1 } = renderHook(() => useLaborStandard());
      const { result: result2 } = renderHook(() => useLaborStandard());

      expect(result1.current).toBe(50);
      expect(result2.current).toBe(50);
    });
  });

  describe('External Store Pattern', () => {
    it('should use getSnapshot for current value', () => {
      renderHook(() => useLaborStandard());
      expect(laborStandardService.getSnapshot).toHaveBeenCalled();
    });
  });
});
