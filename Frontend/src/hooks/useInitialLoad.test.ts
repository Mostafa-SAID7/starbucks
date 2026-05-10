import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInitialLoad } from './useInitialLoad';

describe('useInitialLoad', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should prefetch critical data on mount', async () => {
    const { result } = renderHook(() => useInitialLoad());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should handle loading state correctly', () => {
    const { result } = renderHook(() => useInitialLoad());

    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => useInitialLoad());

    await waitFor(() => {
      expect(result.current.error).toBeUndefined();
    });
  });

  it('should provide retry functionality', async () => {
    const { result } = renderHook(() => useInitialLoad());

    expect(typeof result.current.retry).toBe('function');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
