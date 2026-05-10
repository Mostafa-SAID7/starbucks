/**
 * Pagination Hook
 * Reusable hook for handling pagination state and logic
 */

import { useState, useCallback, useEffect } from 'react';
import { PagedResult, PaginationState, createPaginationState } from '@/types/common/pagination';

export interface UsePaginationOptions {
  initialPageSize?: number;
  initialPageNumber?: number;
}

export interface UsePaginationReturn<T> {
  items: T[];
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;
  goToPage: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setPageSize: (pageSize: number) => void;
  setTotalCount: (totalCount: number) => void;
  reset: () => void;
  setData: (data: PagedResult<T>) => void;
}

/**
 * Hook for managing pagination state
 * @param fetchFn - Function to fetch paginated data
 * @param options - Configuration options
 * @returns Pagination state and methods
 */
export function usePagination<T>(
  fetchFn: (pageNumber: number, pageSize: number) => Promise<PagedResult<T>>,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const { initialPageSize = 20, initialPageNumber = 1 } = options;

  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationState>(
    createPaginationState(initialPageNumber, initialPageSize, 0)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(
    async (pageNumber: number, pageSize: number) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFn(pageNumber, pageSize);
        setItems(result.items);
        setPagination(
          createPaginationState(pageNumber, pageSize, result.totalCount)
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn]
  );

  // Initial fetch
  useEffect(() => {
    fetchData(initialPageNumber, initialPageSize);
  }, [initialPageNumber, initialPageSize, fetchData]);

  // Navigation methods
  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
        fetchData(pageNumber, pagination.pageSize);
      }
    },
    [pagination.pageSize, pagination.totalPages, fetchData]
  );

  const goToNextPage = useCallback(() => {
    if (pagination.pageNumber < pagination.totalPages) {
      goToPage(pagination.pageNumber + 1);
    }
  }, [pagination.pageNumber, pagination.totalPages, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (pagination.pageNumber > 1) {
      goToPage(pagination.pageNumber - 1);
    }
  }, [pagination.pageNumber, goToPage]);

  const setPageSize = useCallback(
    (pageSize: number) => {
      fetchData(1, pageSize);
    },
    [fetchData]
  );

  const reset = useCallback(() => {
    fetchData(initialPageNumber, initialPageSize);
  }, [initialPageNumber, initialPageSize, fetchData]);

  const setData = useCallback((data: PagedResult<T>) => {
    setItems(data.items);
    setPagination(
      createPaginationState(data.pageNumber, data.pageSize, data.totalCount)
    );
  }, []);

  return {
    items,
    pagination,
    isLoading,
    error,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setPageSize,
    setTotalCount: (count: number) =>
      setPagination((prev) => ({
        ...prev,
        totalCount: count,
        totalPages: Math.max(1, Math.ceil(count / prev.pageSize)),
      })),
    reset,
    setData,
  };
}
