import { useQuery, UseQueryResult } from '@tanstack/react-query';

/**
 * Hook to fetch localization resources from Backend
 * 
 * Usage:
 * const { data: resources } = useResources('ar');
 * const title = resources?.modules.menu.title;
 */
export function useResources(language = 'en'): UseQueryResult<ResourcesResponse> {
  return useQuery({
    queryKey: ['resources', language],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/v1/resources/localization/${language}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.statusText}`);
      }
      return response.json() as Promise<ResourcesResponse>;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30 days (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to fetch a specific module's resources
 * 
 * Usage:
 * const { data } = useResourceModule('ar', 'menu');
 * const title = data?.resources.title;
 */
export function useResourceModule(
  language = 'en',
  module = 'common'
): UseQueryResult<ModuleResponse> {
  return useQuery({
    queryKey: ['resources', language, module],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/v1/resources/localization/${language}/${module}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch module "${module}": ${response.statusText}`
        );
      }
      return response.json() as Promise<ModuleResponse>;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 30 * 24 * 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to check if resources are available
 */
export function useResourcesHealth(): UseQueryResult<HealthResponse> {
  return useQuery({
    queryKey: ['resources', 'health'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/v1/resources/localization/health`
      );
      if (!response.ok) {
        throw new Error('Resources API is not available');
      }
      return response.json() as Promise<HealthResponse>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: false,
  });
}

/**
 * Helper function to get localized text from resources
 * 
 * Usage:
 * const title = getLocalizedText(resources?.modules.menu, 'title', isRTL);
 */
export function getLocalizedText(
  obj: Record<string, any> | undefined,
  key: string,
  _isRTL?: boolean
): string {
  if (!obj) return '';
  return obj[key] ?? '';
}

// Type Definitions

export interface ResourcesResponse {
  language: string;
  modules: {
    common?: Record<string, any>;
    menu?: Record<string, any>;
    auth?: Record<string, any>;
    checkout?: Record<string, any>;
    locations?: Record<string, any>;
    cart?: Record<string, any>;
    [key: string]: Record<string, any> | undefined;
  };
  timestamp: string;
  cacheVersion: number;
}

export interface ModuleResponse {
  language: string;
  module: string;
  resources: Record<string, any>;
  timestamp: string;
  cacheVersion: number;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'error';
  resourcesPath?: string;
  timestamp: string;
}
