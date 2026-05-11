/**
 * Generic Admin CRUD Hook
 * Consolidates common CRUD patterns used across all admin hooks
 * Eliminates 200+ lines of duplicate code
 */

import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PagedResult } from '@/types/common/pagination';

export interface UseCRUDOptions {
  pageSize?: number;
  refetchInterval?: number;
  invalidationKeys?: (readonly string[])[]; // Optional keys to invalidate on success (e.g., public keys)
}

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UseCRUDReturn<T, CreateDto, UpdateDto> {
  // Data
  items: T[];
  selectedItem: T | null;

  // Pagination
  pagination: PaginationInfo;
  goToPage: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;

  // Loading & Error States
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;

  // Mutations
  createMutation: any;
  updateMutation: any;
  deleteMutation: any;

  // Actions
  selectItem: (item: T | null) => void;
  loadItems: (pageNumber?: number, pageSize?: number) => void;
  loadItemDetails: (id: string) => Promise<void>;
  createItem: (data: CreateDto) => Promise<void>;
  updateItem: (id: string, data: UpdateDto) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

/**
 * Generic Admin CRUD Hook
 * Handles all common CRUD operations for admin resources
 */
export function useCRUD<T extends { id: string }, CreateDto, UpdateDto>(
  {
    fetchList,
    fetchDetails,
    create,
    update,
    delete: deleteItem,
  }: {
    fetchList: (pageNumber: number, pageSize: number) => Promise<PagedResult<T>>;
    fetchDetails: (id: string) => Promise<T>;
    create: (data: CreateDto) => Promise<T>;
    update: (id: string, data: UpdateDto) => Promise<T>;
    delete: (id: string) => Promise<void>;
  },
  options: UseCRUDOptions = {}
): UseCRUDReturn<T, CreateDto, UpdateDto> {
  const { pageSize: initialPageSize = 20, refetchInterval } = options;

  const queryClient = useQueryClient();

  // Own pagination state — no external hook needed since React Query handles fetching
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);

  // Derived pagination info
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pagination: PaginationInfo = {
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: pageNumber < totalPages,
    hasPreviousPage: pageNumber > 1,
  };

  // State
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // React Query drives fetching — pagination state is just numbers
  const { data: listData, isLoading } = useQuery({
    queryKey: ['admin-items', pageNumber, pageSize],
    queryFn: () => fetchList(pageNumber, pageSize),
    refetchInterval,
  });

  // Update items when list data changes
  useEffect(() => {
    if (listData) {
      setItems(listData.items);
      setTotalCount(listData.totalCount);
    }
  }, [listData]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      // Perform cascade invalidation for related public keys if provided
      if (options.invalidationKeys) {
        options.invalidationKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      setError(null);
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDto }) =>
      update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      // Perform cascade invalidation for related public keys if provided
      if (options.invalidationKeys) {
        options.invalidationKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      setSelectedItem(null);
      setError(null);
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      // Perform cascade invalidation for related public keys if provided
      if (options.invalidationKeys) {
        options.invalidationKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      setSelectedItem(null);
      setError(null);
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    },
  });

  // Actions
  const selectItem = useCallback((item: T | null) => {
    setSelectedItem(item);
  }, []);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPageNumber(newPage);
      }
    },
    [totalPages]
  );

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize);
    setPageNumber(1); // Reset to first page on size change
  }, []);

  const loadItems = useCallback(
    (pg: number = 1, ps: number = initialPageSize) => {
      setPageNumber(pg);
      setPageSizeState(ps);
      setError(null);
    },
    [initialPageSize]
  );

  const loadItemDetails = useCallback(
    async (id: string) => {
      try {
        setIsLoadingDetails(true);
        const details = await fetchDetails(id);
        setSelectedItem(details);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load item details');
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [fetchDetails]
  );

  const createItemHandler = useCallback(
    async (data: CreateDto) => {
      try {
        await createMutation.mutateAsync(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to create item');
        throw err;
      }
    },
    [createMutation]
  );

  const updateItemHandler = useCallback(
    async (id: string, data: UpdateDto) => {
      try {
        await updateMutation.mutateAsync({ id, data });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to update item');
        throw err;
      }
    },
    [updateMutation]
  );

  const deleteItemHandler = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to delete item');
        throw err;
      }
    },
    [deleteMutation]
  );

  return {
    items,
    selectedItem,
    pagination,
    goToPage,
    setPageSize,
    isLoading,
    isLoadingDetails,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
    selectItem,
    loadItems,
    loadItemDetails,
    createItem: createItemHandler,
    updateItem: updateItemHandler,
    deleteItem: deleteItemHandler,
  };
}
