/**
 * Admin Moderation Service
 * Handles all content moderation API calls
 */

import { api } from '@/lib/api';
import { PagedResult } from '@/types/common/pagination';
import {
  PendingContentDto,
  FlaggedContentDto,
  ModerationHistoryDto,
  ApproveContentRequestDto,
  RejectContentRequestDto,
  FlagContentRequestDto,
  ModerationStatsDto,
} from '@/types/admin/moderation';

/**
 * Get pending content for moderation
 */
export const getPendingContent = async (
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PagedResult<PendingContentDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  return api.get(`/admin/moderation/pending?${params.toString()}`);
};

/**
 * Get flagged content
 */
export const getFlaggedContent = async (
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PagedResult<FlaggedContentDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  return api.get(`/admin/moderation/flagged?${params.toString()}`);
};

/**
 * Approve content
 */
export const approveContent = async (
  data: ApproveContentRequestDto
): Promise<{ message: string }> => {
  return api.post('/admin/moderation/approve', data);
};

/**
 * Reject content
 */
export const rejectContent = async (
  data: RejectContentRequestDto
): Promise<{ message: string }> => {
  return api.post('/admin/moderation/reject', data);
};

/**
 * Flag content for review
 */
export const flagContent = async (
  data: FlagContentRequestDto
): Promise<{ message: string }> => {
  return api.post('/admin/moderation/flag', data);
};

/**
 * Get moderation history
 */
export const getModerationHistory = async (
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PagedResult<ModerationHistoryDto>> => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());

  return api.get(`/admin/moderation/history?${params.toString()}`);
};

/**
 * Get moderation statistics
 */
export const getModerationStats = async (): Promise<ModerationStatsDto> => {
  return api.get('/admin/moderation/stats');
};

export const adminModerationService = {
  getPendingContent,
  getFlaggedContent,
  approveContent,
  rejectContent,
  flagContent,
  getModerationHistory,
  getModerationStats,
};
