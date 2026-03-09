import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLaborStandard } from '../../hooks/useLaborStandard';
import { laborStandardService } from '../../api/services/laborStandardService';

// Mock the laborStandardService
vi.mock('../../api/services/laborStandardService', () => ({
  laborStandardService: {
    subscribe: vi.fn((callback: () => void) => {
      // Store the callback so we can trigger updates
      (globalThis as any).__laborStandardCallback = callback;
      return () => {
        (globalThis as any).__laborStandardCallback = null;
      };
    }),
    getSnapshot: vi.fn(() => 0),
    getLaborStandard: vi.fn(() => 0),
    setLaborStandard: vi.fn((value: number) => {
      vi.mocked(laborStandardService.getSnapshot).mockReturnValue(value);
      vi.mocked(laborStandardService.getLaborStandard).mockReturnValue(value);
      // Notify subscribers
      if ((globalThis as any).__laborStandardCallback) {
        (globalThis as any).__laborStandardCallback();
      }
    }),
    startConnection: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('useLaborStandard Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(laborStandardService.getSnapshot).mockReturnValue(0);
    vi.mocked(laborStandardService.getLaborStandard).mockReturnValue(0);
  });

  describe('Initial Value', () => {
    it('should return default value (0) when service returns 0', () => {
      const { result } = renderHook(() => useLaborStandard());
      expect(result.current).toBe(0);
    });

    it('should return stored value from service', () => {
      vi.mocked(laborStandardService.getSnapshot).mockReturnValue(42);

      const { result } = renderHook(() => useLaborStandard());
      expect(result.current).toBe(42);
    });

    it('should handle decimal values', () => {
      vi.mocked(laborStandardService.getSnapshot).mockReturnValue(3.14);

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
      const unsubscribe = vi.fn();
      vi.mocked(laborStandardService.subscribe).mockReturnValue(unsubscribe);

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
      vi.mocked(laborStandardService.getSnapshot).mockReturnValue(50);

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
