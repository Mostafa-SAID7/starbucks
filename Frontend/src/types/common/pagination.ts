/**
 * Pagination Types
 * Unified pagination model matching backend PagedResult<T>
 */

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * Helper function to create pagination state
 */
export function createPaginationState(
  pageNumber: number = 1,
  pageSize: number = 20,
  totalCount: number = 0
): PaginationState {
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
  };
}

/**
 * Helper function to check if has previous page
 */
export function hasPreviousPage(pageNumber: number): boolean {
  return pageNumber > 1;
}

/**
 * Helper function to check if has next page
 */
export function hasNextPage(pageNumber: number, totalPages: number): boolean {
  return pageNumber < totalPages;
}
