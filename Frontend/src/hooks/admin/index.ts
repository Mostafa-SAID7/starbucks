/**
 * Admin Hooks Index
 * Exports all admin-related hooks
 */

export { useAdminUsers } from './useAdminUsers';
export { useAdminAnalytics } from './useAdminAnalytics';
export { useAdminCategories } from './useAdminCategories';
export { useAdminModeration } from './useAdminModeration';
export { useAdminMonitoring } from './useAdminMonitoring';

export type { UseAdminUsersReturn } from './useAdminUsers';
// Return types are inferred from the hooks; no separate type exports needed
export type { UseAdminModerationReturn } from './useAdminModeration';
export type { UseAdminMonitoringReturn } from './useAdminMonitoring';
