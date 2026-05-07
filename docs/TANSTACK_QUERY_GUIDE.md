# TanStack Query Developer Guide

This guide provides comprehensive documentation for the TanStack Query v5+ implementation in the Starbucks Egypt React application.

## Table of Contents

1. [Overview](#overview)
2. [Setup and Configuration](#setup-and-configuration)
3. [Query Key Factory](#query-key-factory)
4. [Custom Hooks API](#custom-hooks-api)
5. [Cache Configuration](#cache-configuration)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Development Tools](#development-tools)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Overview

The application uses TanStack Query v5+ for:

- **Data Fetching**: Replacing static JSON imports with dynamic queries
- **Caching**: Intelligent caching with configurable stale times
- **Background Updates**: Automatic refetching and synchronization
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Loading States**: Consistent loading and skeleton states
- **Offline Support**: Cached data availability when offline

### Key Benefits

- **Performance**: Reduced bundle size, faster page loads, intelligent caching
- **User Experience**: Smooth loading states, error recovery, offline support
- **Developer Experience**: Type-safe queries, devtools integration, consistent patterns
- **Maintainability**: Centralized data layer, reusable hooks, clear separation of concerns

## Setup and Configuration

### Query Client Configuration

The global QueryClient is configured in `src/lib/queryClient.ts`:

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache Configuration
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection

      // Retry Configuration
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch Configuration
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: false, // Don't refetch on component mount if data is fresh

      // Error Handling
      throwOnError: false, // Handle errors in components
    },
    mutations: {
      retry: 1,
      throwOnError: false,
    },
  },
});
```

### Provider Setup

The QueryClientProvider is set up in `src/App.tsx`:

```typescript
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

## Query Key Factory

The Query Key Factory in `src/lib/queryKeys.ts` provides centralized, type-safe query key management:

### Structure

```typescript
export const queryKeys = {
  // Menu queries
  menu: {
    all: () => ["menu"] as const,
    categories: () => ["menu", "categories"] as const,
    byCategory: (categoryId: string) =>
      ["menu", "category", categoryId] as const,
    items: () => ["menu", "items"] as const,
    byItem: (categoryId: string, itemId: string) =>
      ["menu", "item", categoryId, itemId] as const,
    allergyInfo: () => ["menu", "allergyInfo"] as const,
  },

  // Page queries
  pages: {
    all: () => ["pages"] as const,
    bySlug: (slug: string) => ["pages", slug] as const,
  },

  // Location queries
  locations: {
    all: () => ["locations"] as const,
    byRegion: (region: string) => ["locations", "region", region] as const,
    byGovernorate: (governorate: string) =>
      ["locations", "governorate", governorate] as const,
  },

  // Contact queries
  contact: {
    all: () => ["contact"] as const,
    byType: (type: string) => ["contact", type] as const,
  },

  // Featured content queries
  featured: {
    cards: () => ["featured", "cards"] as const,
    hero: () => ["featured", "hero"] as const,
    statement: () => ["featured", "statement"] as const,
  },

  // Navigation queries
  navigation: {
    config: () => ["navigation", "config"] as const,
  },
} as const;
```

### Usage

```typescript
import { queryKeys } from "@/lib/queryKeys";

// Use in hooks
const { data } = useQuery({
  queryKey: queryKeys.menu.byCategory("beverages"),
  queryFn: () => fetchMenuCategory("beverages"),
});

// Use for invalidation
queryClient.invalidateQueries({
  queryKey: queryKeys.menu.all(),
});
```

### Benefits

- **Type Safety**: TypeScript ensures correct query key structure
- **Consistency**: Standardized naming across the application
- **Maintainability**: Centralized key management
- **Invalidation**: Easy cache invalidation patterns

## Custom Hooks API

### Menu Hooks (`src/hooks/queries/useMenuData.ts`)

#### `useMenuData()`

Fetches the complete menu data.

```typescript
const { data, isLoading, error, refetch } = useMenuData();

// Returns: MenuData | undefined
// Stale Time: 1 hour
// Use Case: Main menu page, navigation
```

#### `useMenuCategory(categoryId: string)`

Fetches data for a specific menu category.

```typescript
const { data, isLoading, error } = useMenuCategory("beverages");

// Returns: MenuCategory | undefined
// Stale Time: 1 hour
// Use Case: Category pages, filtered views
```

#### `useMenuItem(categoryId: string, itemId: string)`

Fetches data for a specific menu item.

```typescript
const { data, isLoading, error } = useMenuItem("beverages", "latte");

// Returns: MenuItem | undefined
// Stale Time: 1 hour
// Use Case: Item detail pages
```

### Page Hooks (`src/hooks/queries/usePageData.ts`)

#### `usePageData(slug: string)`

Fetches data for generic pages.

```typescript
const { data, isLoading, error } = usePageData("about-us");

// Returns: PageData | undefined
// Stale Time: 24 hours
// Use Case: Static pages, CMS content
```

### Location Hooks (`src/hooks/queries/useLocationData.ts`)

#### `useLocations()`

Fetches all location data.

```typescript
const { data, isLoading, error } = useLocations();

// Returns: LocationData[] | undefined
// Stale Time: 30 minutes
// Use Case: Store locator, location listings
```

### Contact Hooks (`src/hooks/queries/useContactData.ts`)

#### `useContactInfo()`

Fetches contact information.

```typescript
const { data, isLoading, error } = useContactInfo();

// Returns: ContactInfo | undefined
// Stale Time: 24 hours
// Use Case: Contact pages, footer
```

### Featured Content Hooks (`src/hooks/queries/useFeaturedData.ts`)

#### `useFeaturedCards()`

Fetches featured card content.

```typescript
const { data, isLoading, error } = useFeaturedCards();

// Returns: FeaturedCard[] | undefined
// Stale Time: 24 hours
// Use Case: Homepage, promotional content
```

### Navigation Hooks (`src/hooks/queries/useNavigationData.ts`)

#### `useNavigation()`

Fetches navigation and footer configuration data.

```typescript
const { data, isLoading, error } = useNavigation();

// Returns: NavigationData | undefined
// Stale Time: 24 hours
// Use Case: Header and Footer navigation
```

## Cache Configuration

### Stale Time Strategy

Different data types have different freshness requirements:

| Data Type        | Stale Time | Rationale                       |
| ---------------- | ---------- | ------------------------------- |
| Menu Data        | 1 hour     | Menu items change infrequently  |
| Page Content     | 24 hours   | Static content, rarely updated  |
| Locations        | 30 minutes | Store hours may change          |
| Contact Info     | 24 hours   | Contact details are stable      |
| Featured Content | 24 hours   | Marketing content updates daily |
| Navigation       | 24 hours   | Navigation structure is stable  |

### Cache Invalidation

The cache invalidation system in `src/lib/cacheInvalidation.ts` provides:

```typescript
import { cacheInvalidation } from "@/lib/cacheInvalidation";

// Invalidate specific data
await cacheInvalidation.menuUpdated("beverages");
await cacheInvalidation.pageUpdated("about-us");

// Batch invalidation
await cacheInvalidation.batchUpdate([
  { type: "menu", options: { categoryId: "beverages" } },
  { type: "featured" },
]);

// Cleanup stale data
await cacheInvalidation.cleanupStale();
```

### Performance Optimization

#### Prefetching

Prefetching improves perceived performance:

```typescript
// In MenuPage - prefetch category on hover
const queryClient = useQueryClient();

const handleCategoryHover = (categoryId: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.menu.byCategory(categoryId),
    queryFn: () => menuFetchers.fetchMenuCategory(categoryId),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
```

#### Bundle Optimization

The `src/lib/bundleOptimization.ts` provides:

- **Lazy Loading**: Code splitting for better performance
- **Tree Shaking**: Selective imports to reduce bundle size
- **Bundle Analysis**: Development tools for size monitoring

## Error Handling

### Error Boundaries

The `QueryErrorBoundary` component provides comprehensive error handling:

```typescript
import { QueryErrorBoundary } from "@/components/error/QueryErrorBoundary";

<QueryErrorBoundary>
  <YourComponent />
</QueryErrorBoundary>
```

### Error Types

The error system distinguishes between:

- **Network Errors**: Connection issues, offline state
- **Timeout Errors**: Request timeouts
- **Server Errors**: 5xx status codes
- **Not Found Errors**: 404 status codes
- **Unauthorized Errors**: 401/403 status codes

### Error Recovery

All query hooks include automatic retry logic:

```typescript
const { data, isLoading, error, refetch } = useMenuData();

// Manual retry
const handleRetry = () => {
  refetch();
};
```

## Development Tools

### React Query Devtools

Enabled in development mode:

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

{import.meta.env.DEV && (
  <ReactQueryDevtools
    initialIsOpen={false}
    position="bottom"
    buttonPosition="bottom-right"
  />
)}
```

### Performance Dashboard

The `PerformanceDashboard` component provides real-time metrics:

- Cache hit rates
- Query performance
- Bundle size monitoring
- Performance targets

### Performance Monitoring

The `performanceMonitor` utility tracks:

```typescript
import { performanceMonitor } from "@/lib/performanceMonitor";

// Measure page load
performanceMonitor.startMeasure("page-load", "HomePage");
// ... page loads
performanceMonitor.endMeasure("page-load", "HomePage");

// Track cache metrics
performanceMonitor.recordCacheMetric("menu-data", true); // cache hit
```

## Best Practices

### 1. Query Key Consistency

Always use the Query Key Factory:

```typescript
// ✅ Good
const queryKey = queryKeys.menu.byCategory(categoryId);

// ❌ Bad
const queryKey = ["menu", "category", categoryId];
```

### 2. Error Handling

Wrap components with error boundaries:

```typescript
// ✅ Good
<QueryErrorBoundary>
  <MenuPage />
</QueryErrorBoundary>

// ❌ Bad - no error handling
<MenuPage />
```

### 3. Loading States

Always handle loading states:

```typescript
// ✅ Good
if (isLoading) return <MenuSkeleton />;
if (error) return <ErrorFallback error={error} />;
return <MenuContent data={data} />;

// ❌ Bad - no loading state
return <MenuContent data={data} />;
```

### 4. Stale Time Configuration

Use appropriate stale times:

```typescript
// ✅ Good - frequent updates
useQuery({
  queryKey: queryKeys.locations.all(),
  queryFn: fetchLocations,
  staleTime: 30 * 60 * 1000, // 30 minutes
});

// ✅ Good - static content
useQuery({
  queryKey: queryKeys.pages.bySlug("about-us"),
  queryFn: () => fetchPage("about-us"),
  staleTime: 24 * 60 * 60 * 1000, // 24 hours
});
```

### 5. Prefetching

Prefetch likely-needed data:

```typescript
// ✅ Good - prefetch on hover
const handleHover = (categoryId: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.menu.byCategory(categoryId),
    queryFn: () => fetchMenuCategory(categoryId),
  });
};
```

## Troubleshooting

### Common Issues

#### 1. Data Not Updating

**Problem**: Data doesn't update after changes.

**Solution**: Check cache invalidation:

```typescript
// Invalidate specific data
queryClient.invalidateQueries({
  queryKey: queryKeys.menu.byCategory(categoryId),
});

// Or refetch manually
refetch();
```

#### 2. Infinite Loading

**Problem**: Component shows loading state indefinitely.

**Solution**: Check error handling and network connectivity:

```typescript
// Add error logging
if (error) {
  console.error("Query error:", error);
  return <ErrorFallback error={error} />;
}
```

#### 3. Memory Leaks

**Problem**: Memory usage increases over time.

**Solution**: Use proper cleanup:

```typescript
// Automatic cleanup is configured in queryClient.ts
// Manual cleanup if needed
queryClient.clear();
```

#### 4. Stale Data

**Problem**: Data appears outdated.

**Solution**: Adjust stale time or force refetch:

```typescript
// Reduce stale time
staleTime: (5 * 60 * 1000, // 5 minutes
  // Or force refetch
  refetch());
```

### Debug Tools

#### 1. React Query Devtools

Use the devtools to inspect:

- Query states
- Cache contents
- Network requests
- Performance metrics

#### 2. Performance Dashboard

Monitor in development:

- Cache hit rates
- Query performance
- Bundle size

#### 3. Console Logging

Enable detailed logging:

```typescript
// In development
if (import.meta.env.DEV) {
  console.log("Query state:", { data, isLoading, error });
}
```

### Performance Optimization

#### 1. Reduce Bundle Size

- Use selective imports
- Enable tree shaking
- Lazy load components

#### 2. Optimize Cache

- Set appropriate stale times
- Use prefetching strategically
- Clean up unused queries

#### 3. Monitor Performance

- Track cache hit rates
- Measure page load times
- Monitor bundle size

## Migration Notes

### From Static Imports

The migration from static JSON imports to TanStack Query provides:

1. **Better Performance**: Reduced initial bundle size
2. **Dynamic Loading**: Data loaded on demand
3. **Caching**: Intelligent caching reduces network requests
4. **Error Handling**: Comprehensive error recovery
5. **Loading States**: Consistent loading experiences

### Backward Compatibility

The migration maintains 100% UI/UX parity:

- All pages render identically
- RTL/LTR support preserved
- Dark mode functionality intact
- Animation behavior unchanged

## Conclusion

This TanStack Query implementation provides a robust, performant, and maintainable data layer for the Starbucks Egypt React application. The combination of intelligent caching, comprehensive error handling, and development tools creates an excellent developer and user experience.

For additional help or questions, refer to the [TanStack Query documentation](https://tanstack.com/query/latest) or consult the team's internal documentation.
