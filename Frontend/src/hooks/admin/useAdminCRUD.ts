/**
 * Generic Admin CRUD Hook
 * Consolidates common CRUD patterns used across all admin hooks
 * Eliminates 200+ lines of duplicate code
 */

import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '@/hooks/common/usePagination';
import { PagedResult } from '@/types/common/pagination';

export interface UseAdminCRUDOptions {
  pageSize?: number;
  refetchInterval?: number;
}

export interface UseAdminCRUDReturn<T, CreateDto, UpdateDto> {
  // Data
  items: T[];
  selectedItem: T | null;
  
  // Pagination
  pagination: any;
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
  loadItems: (pageNumber?: number, pageSize?: number) => Promise<void>;
  loadItemDetails: (id: string) => Promise<void>;
  createItem: (data: CreateDto) => Promise<void>;
  updateItem: (id: string, data: UpdateDto) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

/**
 * Generic Admin CRUD Hook
 * Handles all common CRUD operations for admin resources
 */
export function useAdminCRUD<T extends { id: string }, CreateDto, UpdateDto>(
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
  options: UseAdminCRUDOptions = {}
): UseAdminCRUDReturn<T, CreateDto, UpdateDto> {
  const { pageSize: initialPageSize = 20, refetchInterval } = options;
  
  const queryClient = useQueryClient();
  const pagination = usePagination(initialPageSize);
  
  // State
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Queries
  const { data: listData, isLoading } = useQuery({
    queryKey: ['admin-items', pagination.pageNumber, pagination.pageSize],
    queryFn: () => fetchList(pagination.pageNumber, pagination.pageSize),
    refetchInterval,
  });

  // Update items when list data changes
  useMemo(() => {
    if (listData) {
      setItems(listData.items);
      pagination.setTotalCount(listData.totalCount);
    }
  }, [listData]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDto }) =>
      update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      setSelectedItem(null);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to update item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      setSelectedItem(null);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to delete item');
    },
  });

  // Actions
  const selectItem = useCallback((item: T | null) => {
    setSelectedItem(item);
  }, []);

  const loadItems = useCallback(
    async (pageNumber: number = 1, pageSize: number = initialPageSize) => {
      try {
        pagination.goToPage(pageNumber);
        pagination.setPageSize(pageSize);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load items');
      }
    },
    [pagination, initialPageSize]
  );

  const loadItemDetails = useCallback(
    async (id: string) => {
      try {
        setIsLoadingDetails(true);
        const details = await fetchDetails(id);
        setSelectedItem(details);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load item details');
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
      } catch (err: any) {
        setError(err.message || 'Failed to create item');
        throw err;
      }
    },
    [createMutation]
  );

  const updateItemHandler = useCallback(
    async (id: string, data: UpdateDto) => {
      try {
        await updateMutation.mutateAsync({ id, data });
      } catch (err: any) {
        setError(err.message || 'Failed to update item');
        throw err;
      }
    },
    [updateMutation]
  );

  const deleteItemHandler = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        setError(err.message || 'Failed to delete item');
        throw err;
      }
    },
    [deleteMutation]
  );

  return {
    items,
    selectedItem,
    pagination,
    goToPage: pagination.goToPage,
    setPageSize: pagination.setPageSize,
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
