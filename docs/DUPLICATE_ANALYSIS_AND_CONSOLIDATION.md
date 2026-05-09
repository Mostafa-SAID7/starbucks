# Duplicate Code Analysis & Consolidation Strategy

**Date:** May 9, 2026  
**Status:** Analysis Complete  
**Priority:** High - Consolidation required before admin panel implementation

---

## Executive Summary

Comprehensive analysis of the Starbucks Egypt codebase identified **6 major duplicate patterns** across backend and frontend layers. This document outlines each duplicate, its impact, and the consolidation strategy.

---

## 1. PAGINATION DUPLICATES

### Issue
**Backend has TWO pagination implementations:**
- `PagedResult<T>` (Backend/src/StarbucksEgypt.Application/Common/Models/PagedResult.cs)
- `PaginatedList<T>` (Backend/src/StarbucksEgypt.Application/Common/Models/PaginatedList.cs)

Both implement identical logic:
```csharp
// PagedResult<T>
public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
public bool HasPreviousPage => PageNumber > 1;
public bool HasNextPage => PageNumber < TotalPages;

// PaginatedList<T> - IDENTICAL
public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
public bool HasPreviousPage => PageNumber > 1;
public bool HasNextPage => PageNumber < TotalPages;
```

**Frontend has NO pagination utility:**
- Pagination handled ad-hoc in API responses
- No reusable pagination model

### Impact
- ⚠️ Code duplication in backend
- ⚠️ Inconsistent pagination across API responses
- ⚠️ Frontend lacks type-safe pagination handling
- ⚠️ Difficult to maintain pagination logic

### Consolidation Strategy

**Backend:**
1. Keep `PagedResult<T>` as the single source of truth
2. Delete `PaginatedList<T>` completely
3. Update all usages to use `PagedResult<T>`
4. Add factory method for easy creation:
   ```csharp
   public static PagedResult<T> Create(List<T> items, int totalCount, int pageNumber, int pageSize)
   {
       return new PagedResult<T>
       {
           Items = items,
           TotalCount = totalCount,
           PageNumber = pageNumber,
           PageSize = pageSize
       };
   }
   ```

**Frontend:**
1. Create matching TypeScript interface:
   ```typescript
   export interface PagedResult<T> {
     items: T[];
     totalCount: number;
     pageNumber: number;
     pageSize: number;
     totalPages: number;
     hasPreviousPage: boolean;
     hasNextPage: boolean;
   }
   ```
2. Create reusable pagination hook:
   ```typescript
   export function usePagination<T>(
     fetchFn: (page: number, pageSize: number) => Promise<PagedResult<T>>,
     initialPageSize: number = 20
   ) {
     // Pagination logic
   }
   ```

**Files to Delete:**
- `Backend/src/StarbucksEgypt.Application/Common/Models/PaginatedList.cs`

**Files to Create:**
- `Frontend/src/types/common/pagination.ts`
- `Frontend/src/hooks/common/usePagination.ts`

---

## 2. ERROR HANDLING DUPLICATES

### Issue
**Backend and Frontend implement error handling independently:**

**Backend (Result Pattern):**
```csharp
public class Result<T> : Result
{
    public T? Data { get; private set; }
    public bool IsSuccess { get; private set; }
    public string[] Errors { get; private set; }
}
```

**Frontend (AppError Pattern):**
```typescript
export class AppError extends Error {
    public type: ErrorType;
    public statusCode?: number;
    public context?: Record<string, unknown>;
}
```

Both implement error classification but differently:
- Backend: IsSuccess boolean + Errors array
- Frontend: ErrorType enum (NETWORK, TIMEOUT, SERVER, NOT_FOUND, UNAUTHORIZED, GENERAL)

### Impact
- ⚠️ Inconsistent error handling across layers
- ⚠️ Frontend must manually convert backend errors to AppError
- ⚠️ Error types not standardized
- ⚠️ Difficult to handle errors consistently

### Consolidation Strategy

**Backend (Keep):**
- Keep Result<T> pattern as-is
- Add error type classification:
  ```csharp
  public enum ErrorType
  {
      Validation = 0,
      NotFound = 1,
      Unauthorized = 2,
      Forbidden = 3,
      Conflict = 4,
      Server = 5,
      Timeout = 6,
      Network = 7,
      General = 8
  }
  
  public class Result<T> : Result
  {
      public ErrorType? ErrorType { get; private set; }
  }
  ```

**Frontend (Keep):**
- Keep AppError class
- Create error mapping utility:
  ```typescript
  export function mapBackendErrorToAppError(
    backendError: BackendErrorResponse
  ): AppError {
    const errorType = mapErrorType(backendError.errorType);
    return new AppError(
      backendError.message,
      errorType,
      backendError.statusCode
    );
  }
  ```

**Files to Create:**
- `Backend/src/StarbucksEgypt.Domain/Enums/ErrorType.cs`
- `Frontend/src/lib/errorMapping.ts`

---

## 3. CACHE MANAGEMENT DUPLICATES

### Issue
**Backend and Frontend implement caching independently:**

**Backend (Redis-based):**
```csharp
// Backend/src/StarbucksEgypt.Infrastructure/Services/CacheService.cs
public class CacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    
    public async Task<T?> GetAsync<T>(string key)
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration)
    public async Task RemoveAsync(string key)
}
```

**Frontend (In-memory Map-based):**
```typescript
// Frontend/src/services/api/cache.ts
export class ApiCache {
    private cache = new Map<string, CacheEntry>();
    
    get(key: string): unknown | null
    set(key: string, value: unknown): void
    remove(key: string): void
}
```

**Cache Invalidation:**
- Backend: `CacheInvalidationService` with Redis pub/sub
- Frontend: Manual cache invalidation in React Query

### Impact
- ⚠️ Different caching strategies (Redis vs In-memory)
- ⚠️ Cache invalidation not synchronized
- ⚠️ Difficult to maintain cache consistency
- ⚠️ No unified cache invalidation strategy

### Consolidation Strategy

**Backend (Keep):**
- Keep Redis-based caching for server-side
- Enhance CacheInvalidationService with event publishing

**Frontend (Keep):**
- Keep React Query for client-side caching
- Use React Query's invalidation for consistency

**Create Unified Strategy:**
1. Document cache layers:
   - Backend: Redis (server-side, persistent)
   - Frontend: React Query (client-side, session-based)
2. Create cache invalidation events:
   ```csharp
   public class CacheInvalidatedEvent
   {
       public string CacheKey { get; set; }
       public DateTime Timestamp { get; set; }
   }
   ```
3. Publish events on data mutations
4. Frontend subscribes via WebSocket/SignalR for real-time invalidation

**Files to Create:**
- `Backend/src/StarbucksEgypt.Domain/Events/CacheInvalidatedEvent.cs`
- `Frontend/src/lib/cacheInvalidationStrategy.ts`

---

## 4. API SERVICE LAYER DUPLICATES

### Issue
**Frontend has TWO API service implementations:**

**Old Implementation (Deprecated):**
```typescript
// Frontend/src/services/api/ApiService.ts
export class ApiService {
    async request<T>(config: RequestConfig): Promise<ServiceResponse<T>>
    async get<T>(url: string, params?: Record<string, string>)
    async post<T>(url: string, data?: unknown)
    // ... more methods
}
```

**New Implementation (Preferred):**
```typescript
// Frontend/src/lib/api.ts
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig): Promise<T>
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
    delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T>
    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
}
```

### Impact
- ⚠️ Code duplication in frontend
- ⚠️ Confusion about which API service to use
- ⚠️ Maintenance burden (two implementations to update)
- ⚠️ Inconsistent API response handling

### Consolidation Strategy

**Action: Remove deprecated ApiService**

1. Audit all imports of ApiService:
   ```bash
   grep -r "from '@/services/api/ApiService'" Frontend/src/
   grep -r "import.*ApiService" Frontend/src/
   ```

2. Update all usages to use centralized api client:
   ```typescript
   // Before
   import { ApiService } from '@/services/api/ApiService';
   const apiService = new ApiService();
   const response = await apiService.get('/users');
   
   // After
   import { api } from '@/lib/api';
   const response = await api.get('/users');
   ```

3. Delete deprecated files:
   - `Frontend/src/services/api/ApiService.ts`
   - `Frontend/src/services/api/config.ts` (if only used by ApiService)
   - `Frontend/src/services/api/cache.ts` (if only used by ApiService)
   - `Frontend/src/services/api/retry.ts` (if only used by ApiService)

4. Consolidate functionality into `Frontend/src/lib/api.ts`:
   - Retry logic
   - Cache handling
   - Interceptors

**Files to Delete:**
- `Frontend/src/services/api/ApiService.ts`
- `Frontend/src/services/api/config.ts`
- `Frontend/src/services/api/cache.ts`
- `Frontend/src/services/api/retry.ts`

**Files to Update:**
- `Frontend/src/lib/api.ts` (add retry and cache logic if needed)

---

## 5. TOKEN MANAGEMENT DUPLICATES

### Issue
**Backend and Frontend implement token management independently:**

**Backend (TokenService):**
```csharp
// Backend/src/StarbucksEgypt.Infrastructure/Services/TokenService.cs
public class TokenService : ITokenService
{
    public string GenerateAccessToken(User user)
    public string GenerateRefreshToken()
    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    public bool ValidateRefreshToken(string token, User user)
}
```

**Frontend (Interceptor):**
```typescript
// Frontend/src/lib/api.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      // ... token refresh logic
    }
  }
);
```

### Impact
- ⚠️ Token refresh logic duplicated
- ⚠️ No unified token lifecycle management
- ⚠️ Difficult to implement token rotation
- ⚠️ Security concerns with token storage

### Consolidation Strategy

**Backend (Keep):**
- Keep TokenService for token generation and validation
- Add token rotation support:
  ```csharp
  public class TokenRotationService : ITokenRotationService
  {
      public async Task<TokenRotationResult> RotateTokenAsync(string oldRefreshToken)
      public async Task RevokeTokenAsync(string refreshToken)
  }
  ```

**Frontend (Keep):**
- Keep token refresh in interceptor
- Add token rotation support:
  ```typescript
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const result = await authApi.rotateToken(refreshToken);
        localStorage.setItem('auth_token', result.accessToken);
        localStorage.setItem('refresh_token', result.refreshToken);
      }
    }
  );
  ```

**Create Unified Documentation:**
- `docs/TOKEN_LIFECYCLE.md` - Token generation, refresh, rotation, revocation
- `docs/TOKEN_SECURITY.md` - Security best practices

---

## 6. VALIDATION DUPLICATES

### Issue
**Backend has validation, Frontend has none:**

**Backend (FluentValidation):**
```csharp
// Backend/src/StarbucksEgypt.Application/Features/Auth/Validators/
public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
    }
}
```

**Frontend:**
- No centralized validation
- Validation logic scattered in components
- No shared validation schemas

### Impact
- ⚠️ Validation logic not synchronized
- ⚠️ Frontend doesn't validate before sending to backend
- ⚠️ Inconsistent validation rules
- ⚠️ Poor user experience (errors only on server response)

### Consolidation Strategy

**Backend (Keep):**
- Keep FluentValidation for server-side validation
- Export validation rules as metadata

**Frontend (Create):**
1. Create Zod schemas matching backend validators:
   ```typescript
   // Frontend/src/lib/validation/schemas.ts
   import { z } from 'zod';
   
   export const loginSchema = z.object({
     email: z.string().email('Invalid email'),
     password: z.string().min(8, 'Password must be at least 8 characters'),
   });
   
   export const registerSchema = z.object({
     email: z.string().email('Invalid email'),
     password: z.string().min(8, 'Password must be at least 8 characters'),
     firstName: z.string().min(1).max(100),
     lastName: z.string().min(1).max(100),
   });
   ```

2. Create validation hooks:
   ```typescript
   export function useFormValidation<T>(schema: ZodSchema) {
     return (data: T) => {
       try {
         schema.parse(data);
         return { valid: true, errors: {} };
       } catch (error) {
         if (error instanceof ZodError) {
           return { valid: false, errors: error.flatten().fieldErrors };
         }
       }
     };
   }
   ```

3. Use in forms:
   ```typescript
   const { errors, validate } = useFormValidation(loginSchema);
   
   const handleSubmit = (data) => {
     if (!validate(data).valid) return;
     // Submit to backend
   };
   ```

**Files to Create:**
- `Frontend/src/lib/validation/schemas.ts`
- `Frontend/src/hooks/common/useFormValidation.ts`

---

## Consolidation Checklist

### Priority 1 (Critical - Do First)
- [ ] Delete `PaginatedList<T>` from backend
- [ ] Create `PagedResult<T>` interface in frontend
- [ ] Delete deprecated `ApiService.ts` from frontend
- [ ] Update all imports to use centralized `api` client

### Priority 2 (High - Do Second)
- [ ] Add `ErrorType` enum to backend
- [ ] Create error mapping utility in frontend
- [ ] Create validation schemas in frontend
- [ ] Create `usePagination` hook in frontend

### Priority 3 (Medium - Do Third)
- [ ] Enhance `CacheInvalidationService` in backend
- [ ] Create cache invalidation strategy document
- [ ] Add token rotation support to backend
- [ ] Add token rotation support to frontend

### Priority 4 (Low - Do Last)
- [ ] Create comprehensive documentation
- [ ] Add integration tests
- [ ] Performance testing
- [ ] Security audit

---

## Impact Summary

### Before Consolidation
- ❌ 6 major duplicate patterns
- ❌ Inconsistent error handling
- ❌ Duplicate pagination logic
- ❌ Two API service implementations
- ❌ No frontend validation
- ❌ Difficult to maintain

### After Consolidation
- ✅ Single source of truth for each pattern
- ✅ Consistent error handling across layers
- ✅ Unified pagination model
- ✅ Single API service implementation
- ✅ Shared validation schemas
- ✅ Easy to maintain and extend

---

## Timeline

**Week 1:**
- Priority 1 consolidation
- Update all imports
- Delete deprecated files

**Week 2:**
- Priority 2 consolidation
- Create validation schemas
- Create pagination hook

**Week 3:**
- Priority 3 consolidation
- Enhance cache strategy
- Add token rotation

**Week 4:**
- Priority 4 consolidation
- Documentation
- Testing and audit

---

## Files Summary

### Files to Delete
1. `Backend/src/StarbucksEgypt.Application/Common/Models/PaginatedList.cs`
2. `Frontend/src/services/api/ApiService.ts`
3. `Frontend/src/services/api/config.ts`
4. `Frontend/src/services/api/cache.ts`
5. `Frontend/src/services/api/retry.ts`

### Files to Create
1. `Backend/src/StarbucksEgypt.Domain/Enums/ErrorType.cs`
2. `Backend/src/StarbucksEgypt.Infrastructure/Services/TokenRotationService.cs`
3. `Frontend/src/types/common/pagination.ts`
4. `Frontend/src/hooks/common/usePagination.ts`
5. `Frontend/src/lib/validation/schemas.ts`
6. `Frontend/src/hooks/common/useFormValidation.ts`
7. `Frontend/src/lib/errorMapping.ts`
8. `Frontend/src/lib/cacheInvalidationStrategy.ts`

### Files to Update
1. `Backend/src/StarbucksEgypt.Application/Common/Models/Result.cs`
2. `Frontend/src/lib/api.ts`
3. All files importing `PaginatedList<T>` or `ApiService`

---

**Status:** Ready for implementation  
**Next Step:** Begin Priority 1 consolidation
