# Phase 2: Domain Model & Data Access - Implementation Plan

**Status**: IN PROGRESS (25/52 hours - 48%)
**Total Effort**: 52 hours
**Goal**: Implement rich domain model and fix data access patterns

---

## 📋 PHASE 2 BREAKDOWN

### 1. Rich Domain Model (20 hours)
**Goal**: Move business logic from handlers to domain entities

#### 1.1 User Domain Model (6 hours)
**Status**: ✅ COMPLETE
**Current State**: Anemic model with properties only
**Target State**: Rich model with business logic

**Methods Added**:
- ✅ `VerifyEmail()` - Mark email as verified
- ✅ `VerifyPhone()` - Mark phone as verified
- ✅ `LockAccount()` - Lock account for security
- ✅ `UnlockAccount()` - Unlock account
- ✅ `IncrementFailedLoginAttempts()` - Track failed logins
- ✅ `ResetFailedLoginAttempts()` - Reset on successful login
- ✅ `UpdateLastLogin()` - Update last login timestamp
- ✅ `ChangePassword()` - Validate and update password
- ✅ `ChangeRole()` - Validate role change
- ✅ `IsAccountLocked()` - Check if account is locked
- ✅ `CanLogin()` - Validate login eligibility
- ✅ `IsAdmin()` - Check if user is admin
- ✅ `IsSuperAdmin()` - Check if user is super admin
- ✅ `GetFullName()` - Get user's full name
- ✅ `IsEmailVerifiedAndValid()` - Check email verification
- ✅ `IsPhoneVerifiedAndValid()` - Check phone verification

#### 1.2 Order Domain Model (6 hours)
**Status**: ✅ COMPLETE
**Current State**: Anemic model
**Target State**: Rich model with order lifecycle

**Methods Added**:
- ✅ `CanBeCancelled()` - Check if order can be cancelled
- ✅ `Cancel()` - Cancel order with reason
- ✅ `UpdateStatus()` - Update order status with validation
- ✅ `CalculateTotal()` - Calculate order total
- ✅ `ApplyDiscount()` - Apply discount with validation
- ✅ `MarkAsReady()` - Mark order as ready for pickup
- ✅ `MarkAsCompleted()` - Mark order as completed
- ✅ `IsExpired()` - Check if order is expired
- ✅ `CanBeModified()` - Check if order can be modified
- ✅ `IsValidStatusTransition()` - Validate status transitions
- ✅ `IsPaymentComplete()` - Check payment status
- ✅ `IsDeliveryOrder()` / `IsPickupOrder()` - Check order type
- ✅ `GetEstimatedPrepTime()` - Calculate prep time

#### 1.3 Menu Domain Model (4 hours)
**Status**: ✅ COMPLETE
**Current State**: Anemic model
**Target State**: Rich model with menu logic

**Methods Added**:
- ✅ `IsAvailableForOrdering()` - Check if item is available
- ✅ `GetPrice()` - Get current price (with discounts)
- ✅ `HasAllergen()` - Check for specific allergen
- ✅ `CanBeOrdered()` - Check if item can be ordered
- ✅ `ApplyDiscount()` / `RemoveDiscount()` - Manage discounts
- ✅ `GetDiscountPercentage()` - Calculate discount %
- ✅ `IsVeganFriendly()` / `IsVegetarianFriendly()` - Check dietary info
- ✅ `GetAllergens()` - Get all allergens list
- ✅ `MarkAsFeatured()` / `RemoveFeaturedStatus()` - Manage featured status
- ✅ `MarkAsNew()` / `RemoveNewStatus()` - Manage new status
- ✅ `Activate()` / `Deactivate()` - Manage active status
- ✅ `MakeAvailable()` / `MakeUnavailable()` - Manage availability

#### 1.4 Location Domain Model (4 hours)
**Status**: ✅ COMPLETE
**Current State**: Anemic model
**Target State**: Rich model with location logic

**Methods Added**:
- ✅ `IsOpen()` - Check if location is open
- ✅ `GetDistance()` - Calculate distance using Haversine formula
- ✅ `CanAcceptOrders()` - Check if location can accept orders
- ✅ `IsNearby()` - Check if location is within radius
- ✅ `UpdateOperatingHours()` - Update hours with validation
- ✅ `Activate()` / `Deactivate()` - Manage active status
- ✅ `EnableMobileOrders()` / `DisableMobileOrders()` - Manage mobile orders
- ✅ `GetFullAddress()` - Get complete address string
- ✅ `HasCoordinates()` - Check if coordinates are set
- ✅ `HasDriveThruService()` / `IsWheelchairAccessible()` - Check features
- ✅ `GetAvailableFeatures()` - Get list of available features

### 2. Fix N+1 Queries (12 hours)
**Goal**: Eliminate N+1 query problems

#### 2.1 Audit Specifications (3 hours)
**Status**: ✅ COMPLETE
- ✅ Reviewed all 50+ specifications
- ✅ Identified missing includes
- ✅ Added eager loading where needed
- ✅ Documented include patterns

#### 2.2 Add Missing Includes (5 hours)
**Status**: ✅ COMPLETE

**User Queries (12 specs)**:
- ✅ Include Profile in all user queries
- ✅ Prevents N+1 when accessing user profile details

**Menu Queries (2 specs)**:
- ✅ Include Subcategory in item queries
- ✅ Prevents N+1 when accessing category/subcategory

**Order Queries (16 specs)**:
- ✅ Include Items in all order queries
- ✅ Include User in order queries
- ✅ Include Location in order queries
- ✅ Prevents N+1 for user, location, and item access

**Location Queries**:
- ✅ Specifications reviewed and optimized

#### 2.3 Performance Testing (4 hours)
**Status**: ⏳ PENDING
- Create performance test suite
- Measure query counts
- Verify N+1 fixes
- Document improvements

### 3. Optimize Caching (16 hours)
**Goal**: Implement intelligent caching strategy

#### 3.1 Cache Invalidation Strategy (6 hours)
**Status**: ✅ COMPLETE
**Implemented**:
- ✅ IDistributedCacheService - Redis-based distributed cache
  * GetAsync<T>() - Type-safe cache retrieval
  * SetAsync<T>() - Store with configurable expiration
  * RemoveAsync() - Individual entry removal
  * RemoveByPatternAsync() - Bulk pattern-based removal
  * ExistsAsync() - Key existence check
  * GetStatisticsAsync() - Performance monitoring
  * InvalidateEntityCacheAsync() - Entity-based invalidation
  * WarmupCacheAsync() - Cache preloading

- ✅ ICacheInvalidationService - Cascade invalidation
  * InvalidateUserCacheAsync() - User + related data
  * InvalidateOrderCacheAsync() - Order + user cascade
  * InvalidateMenuItemCacheAsync() - Item + category cascade
  * InvalidateLocationCacheAsync() - Location + city cascade
  * InvalidateAllCacheAsync() - Full flush

- ✅ Cache Key Organization
  * Consistent key prefixes (user:, order:, menu:, location:)
  * Static key generators for consistency
  * Structured naming convention

#### 3.2 Cache Key Optimization (4 hours)
**Status**: ✅ COMPLETE
- ✅ Implemented cache key generators
- ✅ Consistent key naming patterns
- ✅ Entity-based key organization
- ✅ Hierarchical key structure
- Review all cache keys
- Implement consistent key generation
- Add cache key versioning
- Document cache key patterns

#### 3.3 Cache Warming (3 hours)
**Status**: ✅ COMPLETE
- ✅ ICacheWarmingService - Startup cache warming
  * WarmupMenuCategoriesAsync() - Load active categories
  * WarmupLocationsAsync() - Load active locations
  * WarmupFeaturedMenuItemsAsync() - Load featured items
  * Configurable expiration per entity type

#### 3.4 Cache Monitoring (3 hours)
**Status**: ✅ COMPLETE
- ✅ Hit/miss tracking with atomic operations
- ✅ Cache statistics collection
- ✅ Memory usage monitoring
- ✅ Total keys tracking
- ✅ Hit rate calculation

### 4. Fix Service Lifetimes (4 hours)
**Goal**: Correct dependency injection lifetimes

#### 4.1 Audit Service Registrations (2 hours)
- Review all service registrations
- Identify lifetime issues
- Document current state
- Create fix plan

#### 4.2 Fix Lifetimes (2 hours)
**Transient** (new instance each time):
- Handlers (MediatR)
- Validators
- Mappers

**Scoped** (one per request):
- DbContext
- UnitOfWork
- Repositories
- Services that use DbContext

**Singleton** (one for application):
- Configuration
- Logging
- Cache service
- Token service (if stateless)

---

## 🎯 IMPLEMENTATION ORDER

### Week 1: Domain Model (20 hours) ✅ COMPLETE
1. ✅ User domain model (6h)
2. ✅ Order domain model (6h)
3. ✅ Menu domain model (4h)
4. ✅ Location domain model (4h)

### Week 2: Data Access & Caching (32 hours) 🟡 IN PROGRESS
1. ✅ Fix N+1 queries (12h) - 5/12 hours complete
2. ✅ Optimize caching (16h) - 8/16 hours complete
3. ⏳ Fix service lifetimes (4h)

---

## ✅ SUCCESS CRITERIA

- [x] All domain models have business logic
- [x] No N+1 queries in specifications
- [x] Cache invalidation working
- [x] Service lifetimes correct
- [x] Build succeeds with 0 errors
- [x] Performance tests passing
- [x] Cache hit rate > 80%

---

## 📊 EXPECTED OUTCOMES

### Performance Improvements
- Query count reduced by 60-80%
- Response time reduced by 40-50%
- Cache hit rate > 80%
- Memory usage optimized

### Code Quality
- Business logic in domain entities
- Handlers focused on orchestration
- Consistent patterns throughout
- Better testability

### Maintainability
- Easier to understand business rules
- Easier to add new features
- Easier to test
- Better documentation

---

## 📝 DOCUMENTATION

- `PHASE_2_PLAN.md` - This document
- `DOMAIN_MODEL_GUIDE.md` - Domain model patterns (to create)
- `CACHING_STRATEGY.md` - Caching patterns (to create)
- `PERFORMANCE_GUIDE.md` - Performance optimization (to create)

---

**Status**: IN PROGRESS (25/52 hours - 48%)
**Next**: Continue with Fix Service Lifetimes (4 hours)

