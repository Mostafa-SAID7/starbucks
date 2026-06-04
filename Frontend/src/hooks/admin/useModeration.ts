/**
 * Admin Moderation Hook
 * Manages content moderation operations and state
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  moderationService,
} from '@/services/admin';
import { usePagination } from '@/hooks/common/usePagination';
import { UseMutationResult } from '@tanstack/react-query';
import {
  PendingContentDto,
  FlaggedContentDto,
  ModerationHistoryDto,
  ApproveContentRequestDto,
  RejectContentRequestDto,
  FlagContentRequestDto,
  ModerationStatsDto,
} from '@/types/admin/moderation';

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface UseModerationOptions {
  pageSize?: number;
  refetchInterval?: number;
}

export interface UseModerationReturn {
  // Pending content
  pendingContent: PendingContentDto[];
  pendingPagination: Pagination;
  isLoadingPending: boolean;
  pendingError: string | null;
  goToPendingPage: (pageNumber: number) => void;
  setPendingPageSize: (pageSize: number) => void;

  // Flagged content
  flaggedContent: FlaggedContentDto[];
  flaggedPagination: Pagination;
  isLoadingFlagged: boolean;
  flaggedError: string | null;
  goToFlaggedPage: (pageNumber: number) => void;
  setFlaggedPageSize: (pageSize: number) => void;

  // Moderation operations
  approveMutation: UseMutationResult<unknown, Error, ApproveContentRequestDto>;
  rejectMutation: UseMutationResult<unknown, Error, RejectContentRequestDto>;
  flagMutation: UseMutationResult<unknown, Error, FlagContentRequestDto>;

  // Moderation history
  history: ModerationHistoryDto[];
  historyPagination: Pagination | null;
  isLoadingHistory: boolean;
  historyError: string | null;
  loadHistory: (pageNumber?: number, pageSize?: number) => Promise<void>;

  // Moderation stats
  stats: ModerationStatsDto | null;
  isLoadingStats: boolean;
  statsError: string | null;
}

/**
 * Hook for managing admin moderation
 */
export function useModeration(
  options: UseModerationOptions = {}
): UseModerationReturn {
  const { pageSize = 20, refetchInterval = 30000 } = options; // 30 seconds default
  const queryClient = useQueryClient();

  const {
    getPendingContent,
    getFlaggedContent,
    approveContent,
    rejectContent,
    flagContent,
    getModerationHistory,
    getModerationStats,
  } = moderationService;

  const [history, setHistory] = useState<ModerationHistoryDto[]>([]);
  const [historyPagination, setHistoryPagination] = useState<Pagination | null>(null);

  // Pending content pagination
  const {
    items: pendingContent,
    pagination: pendingPagination,
    isLoading: isLoadingPending,
    error: pendingError,
    goToPage: goToPendingPage,
    setPageSize: setPendingPageSize,
  } = usePagination((pageNumber: number, pageSize: number) => getPendingContent(pageNumber, pageSize), {
    initialPageSize: pageSize,
  });

  // Flagged content pagination
  const {
    items: flaggedContent,
    pagination: flaggedPagination,
    isLoading: isLoadingFlagged,
    error: flaggedError,
    goToPage: goToFlaggedPage,
    setPageSize: setFlaggedPageSize,
  } = usePagination((pageNumber: number, pageSize: number) => getFlaggedContent(pageNumber, pageSize), {
    initialPageSize: pageSize,
  });

  // Approve content mutation
  const approveMutation = useMutation({
    mutationFn: (data: ApproveContentRequestDto) => approveContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-content'] });
      queryClient.invalidateQueries({ queryKey: ['admin-moderation-stats'] });
    },
  });

  // Reject content mutation
  const rejectMutation = useMutation({
    mutationFn: (data: RejectContentRequestDto) => rejectContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-content'] });
      queryClient.invalidateQueries({ queryKey: ['admin-moderation-stats'] });
    },
  });

  // Flag content mutation
  const flagMutation = useMutation({
    mutationFn: (data: FlagContentRequestDto) => flagContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-flagged-content'] });
      queryClient.invalidateQueries({ queryKey: ['admin-moderation-stats'] });
    },
  });

  // Load moderation history
  const loadHistory = useCallback(async (pageNumber: number = 1, pageSize: number = 20) => {
    try {
      const result = await getModerationHistory(pageNumber, pageSize);
      setHistory(result.items);
      setHistoryPagination({
        pageNumber: result.pageNumber,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error('Failed to load moderation history:', error);
    }
  }, [getModerationHistory]);

  // Get moderation stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['admin-moderation-stats'],
    queryFn: getModerationStats,
    refetchInterval,
  });

  return {
    pendingContent,
    pendingPagination,
    isLoadingPending,
    pendingError,
    goToPendingPage,
    setPendingPageSize,
    flaggedContent,
    flaggedPagination,
    isLoadingFlagged,
    flaggedError,
    goToFlaggedPage,
    setFlaggedPageSize,
    approveMutation,
    rejectMutation,
    flagMutation,
    history,
    historyPagination,
    isLoadingHistory: false,
    historyError: null,
    loadHistory,
    stats: stats || null,
    isLoadingStats,
    statsError: statsError ? (statsError as Error).message : null,
  };
}
