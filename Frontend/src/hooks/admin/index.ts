/**
 * Admin Hooks Index
 * Exports all admin-related hooks
 */

export * from './useUsers';
export * from './useAnalytics';
export * from './useCategories';
export * from './useModeration';
export * from './useMonitoring';
export * from './useCRUD';

export { useUsers as useAdminUsers } from './useUsers';
export { useAnalytics as useAdminAnalytics } from './useAnalytics';
export { useCategories as useAdminCategories } from './useCategories';
export { useModeration as useAdminModeration } from './useModeration';
export { useMonitoring as useAdminMonitoring } from './useMonitoring';
export { useCRUD as useAdminCRUD } from './useCRUD';
