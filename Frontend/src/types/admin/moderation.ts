/**
 * Admin Content Moderation Types
 */

export interface PendingContentDto {
  id: string;
  contentType: string;
  contentId: string;
  userId: string;
  userName: string;
  content: string;
  submittedAt: string;
  status: string;
  reportCount: number;
}

export interface FlaggedContentDto {
  id: string;
  contentType: string;
  contentId: string;
  userId: string;
  userName: string;
  content: string;
  flagReason: string;
  flagCount: number;
  firstFlaggedAt: string;
  lastFlaggedAt: string;
  status: string;
}

export interface ModerationHistoryDto {
  id: string;
  contentType: string;
  contentId: string;
  userId: string;
  userName: string;
  moderatorId: string;
  moderatorName: string;
  action: string;
  reason?: string;
  actionDate: string;
}

export interface ApproveContentRequestDto {
  contentId: string;
  notes?: string;
}

export interface RejectContentRequestDto {
  contentId: string;
  reason: string;
}

export interface FlagContentRequestDto {
  contentId: string;
  reason: string;
  description?: string;
}

export interface ModerationStatsDto {
  pendingCount: number;
  flaggedCount: number;
  approvedCount: number;
  rejectedCount: number;
  averageResolutionTime: number;
  flagReasonCounts?: Record<string, number>;
}
