# TanStack Query Migration Guide

This guide explains how to add new queries, query keys, and configure cache behavior in the Starbucks Egypt React application.

## Table of Contents

1. [Adding New Queries](#adding-new-queries)
2. [Adding New Query Keys](#adding-new-query-keys)
3. [Configuring Cache Behavior](#configuring-cache-behavior)
4. [Common Patterns](#common-patterns)
5. [Code Examples](#code-examples)
6. [Best Practices](#best-practices)

## Adding New Queries

### Step 1: Add Fetch Function

First, add your fetch function to `src/lib/fetchers.ts`:

```typescript
// Add to existing fetchers object or create new category
export const newDataFetchers = {
  fetchNewData: async (): Promise<NewDataType> => {
    await simulateDelay();

    try {
      // Import from centralized data layer
      const { newData } = await import("@/data");
      return newData;
    } catch (error) {
      throw new FetchError(
        `Failed to fetch new data: ${error instanceof Error ? error.message : "Unknown error"}`,
        404,
      );
    }
  },

  fetchNewDataById: async (id: string): Promise<NewDataItem> => {
    await simulateDelay();

    try {
      const { newData } = await import("@/data");
      const item = newData.items.find((item: NewDataItem) => item.id === id);

      if (!item) {
        throw new FetchError(`New data item with id "${id}" not found`, 404);
      }

      return item;
    } catch (error) {
      throw new FetchError(
        `Failed to fetch new data item: ${error instanceof Error ? error.message : "Unknown error"}`,
        404,
      );
    }
  },
};
```

### Step 2: Add Query Keys

Add your query keys to `src/lib/queryKeys.ts`:

```typescript
export const queryKeys = {
  // ... existing keys

  // New data queries
  newData: {
    all: () => ["newData"] as const,
    byId: (id: string) => ["newData", "item", id] as const,
    byCategory: (category: string) =>
      ["newData", "category", category] as const,
    filtered: (filters: Record<string, unknown>) =>
      ["newData", "filtered", filters] as const,
  },
} as const;
```

### Step 3: Create Custom Hook

Create a new hook file `src/hooks/queries/useNewData.ts`:

```typescript
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { newDataFetchers } from "@/lib/fetchers";
import { NewDataType, NewDataItem } from "@/types";

/**
 * Hook to fetch all new data
 */
export function useNewData(): UseQueryResult<NewDataType, Error> {
  return useQuery({
    queryKey: queryKeys.newData.all(),
    queryFn: newDataFetchers.fetchNewData,
    staleTime: 30 * 60 * 1000, // 30 minutes - adjust based on data freshness needs
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch new data by ID
 */
export function useNewDataById(
  id: string | undefined,
): UseQueryResult<NewDataItem, Error> {
  return useQuery({
    queryKey: queryKeys.newData.byId(id!),
    queryFn: () => newDataFetchers.fetchNewDataById(id!),
    enabled: !!id, // Only run query if ID is provided
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

/**
 * Hook to fetch new data by category with optional filtering
 */
export function useNewDataByCategory(
  category: string,
  filters?: Record<string, unknown>,
): UseQueryResult<NewDataItem[], Error> {
  return useQuery({
    queryKey: filters
      ? queryKeys.newData.filtered({ category, ...filters })
      : queryKeys.newData.byCategory(category),
    queryFn: async () => {
      const data = await newDataFetchers.fetchNewData();
      let items = data.categories[category] || [];

      // Apply filters if provided
      if (filters) {
        items = items.filter((item) => {
          return Object.entries(filters).every(
            ([key, value]) => item[key] === value,
          );
        });
      }

      return items;
    },
    enabled: !!category,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
```

### Step 4: Export Hook

Add your hook to `src/hooks/queries/index.ts`:

```typescript
// ... existing exports
export * from "./useNewData";
```

### Step 5: Use in Components

Use your new hook in components:

```typescript
import { useNewData, useNewDataById } from "@/hooks/queries";
import { NewDataSkeleton } from "@/components/skeletons";
import { QueryErrorBoundary } from "@/components/error/QueryErrorBoundary";

function NewDataPage() {
  const { data, isLoading, error, refetch } = useNewData();

  if (isLoading) {
    return <NewDataSkeleton />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Failed to load data: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <QueryErrorBoundary>
      <div className="new-data-page">
        {/* Render your data */}
        {data?.items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </QueryErrorBoundary>
  );
}
```

## Adding New Query Keys

### Key Structure Guidelines

Follow the established pattern for consistency:

```typescript
export const queryKeys = {
  // Entity name (singular)
  entityName: {
    // All items of this entity
    all: () => ["entityName"] as const,

    // Items by specific criteria
    byId: (id: string) => ["entityName", "item", id] as const,
    byCategory: (category: string) =>
      ["entityName", "category", category] as const,
    byStatus: (status: string) => ["entityName", "status", status] as const,

    // Filtered or complex queries
    filtered: (filters: Record<string, unknown>) =>
      ["entityName", "filtered", filters] as const,
    search: (query: string) => ["entityName", "search", query] as const,

    // Related data
    related: (id: string) => ["entityName", "related", id] as const,
    metadata: () => ["entityName", "metadata"] as const,
  },
} as const;
```

### Key Naming Conventions

1. **Use descriptive names**: `byCategory` instead of `cat`
2. **Be consistent**: Always use the same pattern across entities
3. **Include parameters**: Keys should include all parameters that affect the query
4. **Use `as const`**: Ensures TypeScript type inference works correctly

### Hierarchical Keys

Structure keys hierarchically for easy invalidation:

```typescript
// Good - hierarchical structure
["products", "category", "electronics", "brand", "apple"];

// This allows invalidating:
// - All products: ["products"]
// - All electronics: ["products", "category", "electronics"]
// - All Apple electronics: ["products", "category", "electronics", "brand", "apple"]
```

## Configuring Cache Behavior

### Stale Time Guidelines

Choose stale time based on data characteristics:

| Data Type          | Stale Time    | Use Case                         |
| ------------------ | ------------- | -------------------------------- |
| Real-time data     | 0-30 seconds  | Live prices, notifications       |
| Frequently updated | 1-5 minutes   | User activity, comments          |
| Moderately updated | 15-30 minutes | Product listings, search results |
| Rarely updated     | 1-24 hours    | Static content, configuration    |
| Very stable        | 24+ hours     | Terms of service, help content   |

### Cache Configuration Examples

```typescript
// Real-time data
export function useLiveData() {
  return useQuery({
    queryKey: queryKeys.live.data(),
    queryFn: fetchLiveData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

// Frequently updated data
export function useUserActivity() {
  return useQuery({
    queryKey: queryKeys.user.activity(),
    queryFn: fetchUserActivity,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Static content
export function useStaticContent() {
  return useQuery({
    queryKey: queryKeys.content.static(),
    queryFn: fetchStaticContent,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}
```

### Advanced Cache Configuration

```typescript
// Conditional queries
export function useConditionalData(shouldFetch: boolean) {
  return useQuery({
    queryKey: queryKeys.conditional.data(),
    queryFn: fetchConditionalData,
    enabled: shouldFetch, // Only run when condition is met
    staleTime: 10 * 60 * 1000,
  });
}

// Dependent queries
export function useDependentData(userId: string | undefined) {
  const userQuery = useQuery({
    queryKey: queryKeys.user.byId(userId!),
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });

  const userDataQuery = useQuery({
    queryKey: queryKeys.userData.byUserId(userId!),
    queryFn: () => fetchUserData(userId!),
    enabled: !!userId && !!userQuery.data, // Wait for user data first
  });

  return { userQuery, userDataQuery };
}

// Infinite queries for pagination
export function useInfiniteData() {
  return useInfiniteQuery({
    queryKey: queryKeys.data.infinite(),
    queryFn: ({ pageParam = 0 }) => fetchDataPage(pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
}
```

## Common Patterns

### 1. List and Detail Pattern

```typescript
// List query
export function useProductList() {
  return useQuery({
    queryKey: queryKeys.products.all(),
    queryFn: fetchProducts,
    staleTime: 15 * 60 * 1000,
  });
}

// Detail query with prefetching
export function useProduct(id: string) {
  const queryClient = useQueryClient();

  // Prefetch related products
  useEffect(() => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.related(id),
        queryFn: () => fetchRelatedProducts(id),
        staleTime: 30 * 60 * 1000,
      });
    }
  }, [id, queryClient]);

  return useQuery({
    queryKey: queryKeys.products.byId(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}
```

### 2. Search Pattern

```typescript
export function useSearch(query: string, filters: SearchFilters) {
  return useQuery({
    queryKey: queryKeys.search.results({ query, ...filters }),
    queryFn: () => performSearch(query, filters),
    enabled: query.length >= 3, // Only search with 3+ characters
    staleTime: 5 * 60 * 1000,
    // Debounce search queries
    refetchOnWindowFocus: false,
  });
}

// Usage with debouncing
function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useSearch(debouncedQuery, filters);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <div>Searching...</div>}
      {data && <SearchResults results={data} />}
    </div>
  );
}
```

### 3. Optimistic Updates Pattern

```typescript
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onMutate: async (updatedProduct) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.products.byId(updatedProduct.id),
      });

      // Snapshot previous value
      const previousProduct = queryClient.getQueryData(
        queryKeys.products.byId(updatedProduct.id),
      );

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.products.byId(updatedProduct.id),
        updatedProduct,
      );

      return { previousProduct };
    },
    onError: (err, updatedProduct, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(
          queryKeys.products.byId(updatedProduct.id),
          context.previousProduct,
        );
      }
    },
    onSettled: (data, error, updatedProduct) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.byId(updatedProduct.id),
      });
    },
  });
}
```

## Code Examples

### Complete Feature Implementation

Here's a complete example of adding a new "Reviews" feature:

#### 1. Types (`src/types/reviews.ts`)

```typescript
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface ReviewFilters {
  rating?: number;
  sortBy?: "newest" | "oldest" | "helpful";
}
```

#### 2. Fetchers (`src/lib/fetchers.ts`)

```typescript
export const reviewFetchers = {
  fetchReviews: async (productId: string): Promise<ReviewsData> => {
    await simulateDelay();

    try {
      const { reviews } = await import("@/data");
      const productReviews = reviews.filter((r) => r.productId === productId);

      return {
        reviews: productReviews,
        averageRating:
          productReviews.reduce((sum, r) => sum + r.rating, 0) /
          productReviews.length,
        totalReviews: productReviews.length,
      };
    } catch (error) {
      throw new FetchError(
        `Failed to fetch reviews: ${error instanceof Error ? error.message : "Unknown error"}`,
        404,
      );
    }
  },

  fetchReview: async (reviewId: string): Promise<Review> => {
    await simulateDelay();

    try {
      const { reviews } = await import("@/data");
      const review = reviews.find((r) => r.id === reviewId);

      if (!review) {
        throw new FetchError(`Review with id "${reviewId}" not found`, 404);
      }

      return review;
    } catch (error) {
      throw new FetchError(
        `Failed to fetch review: ${error instanceof Error ? error.message : "Unknown error"}`,
        404,
      );
    }
  },
};
```

#### 3. Query Keys (`src/lib/queryKeys.ts`)

```typescript
export const queryKeys = {
  // ... existing keys

  reviews: {
    all: () => ["reviews"] as const,
    byProduct: (productId: string) =>
      ["reviews", "product", productId] as const,
    byId: (reviewId: string) => ["reviews", "review", reviewId] as const,
    filtered: (productId: string, filters: ReviewFilters) =>
      ["reviews", "product", productId, "filtered", filters] as const,
  },
} as const;
```

#### 4. Hooks (`src/hooks/queries/useReviews.ts`)

```typescript
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { reviewFetchers } from "@/lib/fetchers";
import { ReviewsData, Review, ReviewFilters } from "@/types/reviews";

export function useReviews(
  productId: string | undefined,
): UseQueryResult<ReviewsData, Error> {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId!),
    queryFn: () => reviewFetchers.fetchReviews(productId!),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useReview(
  reviewId: string | undefined,
): UseQueryResult<Review, Error> {
  return useQuery({
    queryKey: queryKeys.reviews.byId(reviewId!),
    queryFn: () => reviewFetchers.fetchReview(reviewId!),
    enabled: !!reviewId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useFilteredReviews(
  productId: string | undefined,
  filters: ReviewFilters,
): UseQueryResult<Review[], Error> {
  return useQuery({
    queryKey: queryKeys.reviews.filtered(productId!, filters),
    queryFn: async () => {
      const data = await reviewFetchers.fetchReviews(productId!);
      let reviews = data.reviews;

      // Apply filters
      if (filters.rating) {
        reviews = reviews.filter((r) => r.rating === filters.rating);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "newest":
          reviews.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case "oldest":
          reviews.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          break;
        case "helpful":
          reviews.sort((a, b) => b.helpful - a.helpful);
          break;
      }

      return reviews;
    },
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
  });
}
```

#### 5. Component Usage

```typescript
import { useReviews, useFilteredReviews } from "@/hooks/queries";
import { QueryErrorBoundary } from "@/components/error/QueryErrorBoundary";

function ProductReviews({ productId }: { productId: string }) {
  const [filters, setFilters] = useState<ReviewFilters>({});

  const { data: reviewsData, isLoading, error } = useReviews(productId);
  const { data: filteredReviews } = useFilteredReviews(productId, filters);

  if (isLoading) return <ReviewsSkeleton />;
  if (error) return <div>Error loading reviews: {error.message}</div>;

  return (
    <QueryErrorBoundary>
      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Reviews ({reviewsData?.totalReviews})</h3>
          <div className="rating">
            Average: {reviewsData?.averageRating.toFixed(1)} ⭐
          </div>
        </div>

        <ReviewFilters filters={filters} onChange={setFilters} />

        <div className="reviews-list">
          {filteredReviews?.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </QueryErrorBoundary>
  );
}
```

## Best Practices

### 1. Query Key Design

- **Be specific**: Include all parameters that affect the query result
- **Be consistent**: Use the same naming patterns across the app
- **Be hierarchical**: Structure keys for easy invalidation

```typescript
// ✅ Good - specific and hierarchical
queryKeys.products.filtered({
  category: "electronics",
  brand: "apple",
  inStock: true,
})[
  // ❌ Bad - too generic
  ("products", "filtered")
];
```

### 2. Error Handling

- Always wrap components with `QueryErrorBoundary`
- Provide meaningful error messages
- Include retry functionality

```typescript
// ✅ Good
<QueryErrorBoundary>
  <ProductList />
</QueryErrorBoundary>

// ✅ Good - custom error handling
if (error) {
  return (
    <div className="error-state">
      <p>Failed to load products: {error.message}</p>
      <button onClick={() => refetch()}>Try Again</button>
    </div>
  );
}
```

### 3. Loading States

- Use skeleton components for better UX
- Match skeleton structure to actual content
- Consider progressive loading for complex data

```typescript
// ✅ Good - specific skeleton
if (isLoading) return <ProductListSkeleton />;

// ❌ Bad - generic loading
if (isLoading) return <div>Loading...</div>;
```

### 4. Cache Optimization

- Set appropriate stale times based on data characteristics
- Use prefetching for predictable navigation patterns
- Implement proper cache invalidation

```typescript
// ✅ Good - prefetch on hover
const handleProductHover = (productId: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.products.byId(productId),
    queryFn: () => fetchProduct(productId),
  });
};
```

### 5. Performance

- Use `enabled` option for conditional queries
- Implement proper dependency arrays
- Consider using `select` for data transformation

```typescript
// ✅ Good - conditional query
const { data } = useQuery({
  queryKey: queryKeys.user.profile(userId),
  queryFn: () => fetchUserProfile(userId),
  enabled: !!userId && isAuthenticated,
});

// ✅ Good - data selection
const { data: productNames } = useQuery({
  queryKey: queryKeys.products.all(),
  queryFn: fetchProducts,
  select: (data) => data.map((product) => product.name),
});
```

This migration guide provides a comprehensive foundation for extending the TanStack Query implementation. Follow these patterns and examples to maintain consistency and best practices across the application.
