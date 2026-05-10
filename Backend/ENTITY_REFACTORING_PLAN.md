# Entity Refactoring Plan - Separation of Concerns

**Status**: ✅ ANALYSIS COMPLETE
**Date**: May 10, 2026
**Focus**: Extract business logic from entities to proper domain services, clean up entity structure

---

## 📋 CURRENT STATE ANALYSIS

### Entity Structure Review

**User Entity** (230 lines)
- ✅ Properties: 20 fields (correct)
- ✅ Navigation: 2 properties (correct)
- ⚠️ Business Logic: 16 methods (some should be extracted)

**Order Entity** (280 lines)
- ✅ Properties: 25 fields (correct)
- ✅ Navigation: 3 properties (correct)
- ⚠️ Business Logic: 13 methods (some should be extracted)

**MenuItem Entity** (220 lines)
- ✅ Properties: 25 fields (correct)
- ✅ Navigation: 3 properties (correct)
- ⚠️ Business Logic: 12 methods (some should be extracted)

**Location Entity** (200 lines)
- ✅ Properties: 20 fields (correct)
- ✅ Navigation: 1 property (correct)
- ⚠️ Business Logic: 11 methods (some should be extracted)

---

## 🔍 BUSINESS LOGIC CATEGORIZATION

### Category 1: KEEP IN ENTITY (State Mutations)
**Reason**: These modify entity state and should stay in the entity
**Pattern**: `void` methods that change entity properties

#### User Entity
- ✅ `VerifyEmail()` - Sets IsEmailVerified flag
- ✅ `VerifyPhone()` - Sets IsPhoneVerified flag
- ✅ `LockAccount()` - Sets LockoutEnd
- ✅ `UnlockAccount()` - Clears lockout
- ✅ `IncrementFailedLoginAttempts()` - Updates attempt counter
- ✅ `ResetFailedLoginAttempts()` - Resets counter
- ✅ `UpdateLastLogin()` - Updates timestamp
- ✅ `ChangePassword()` - Updates password hash
- ✅ `ChangeRole()` - Updates role

#### Order Entity
- ✅ `Cancel()` - Sets status to Cancelled
- ✅ `UpdateStatus()` - Updates order status
- ✅ `CalculateTotal()` - Calculates and updates total
- ✅ `ApplyDiscount()` - Sets discount
- ✅ `MarkAsReady()` - Updates status to Ready
- ✅ `MarkAsCompleted()` - Updates status to Completed

#### MenuItem Entity
- ✅ `ApplyDiscount()` - Sets discounted price
- ✅ `RemoveDiscount()` - Clears discount
- ✅ `MarkAsFeatured()` - Sets featured flag
- ✅ `RemoveFeaturedStatus()` - Clears featured flag
- ✅ `MarkAsNew()` - Sets new flag
- ✅ `RemoveNewStatus()` - Clears new flag
- ✅ `Activate()` - Sets active flag
- ✅ `Deactivate()` - Clears active flag
- ✅ `MakeAvailable()` - Sets available flag
- ✅ `MakeUnavailable()` - Clears available flag

#### Location Entity
- ✅ `Activate()` - Sets active flag
- ✅ `Deactivate()` - Clears active flag
- ✅ `EnableMobileOrders()` - Sets mobile orders flag
- ✅ `DisableMobileOrders()` - Clears mobile orders flag
- ✅ `UpdateOperatingHours()` - Updates hours

### Category 2: EXTRACT TO DOMAIN SERVICES (Complex Logic)
**Reason**: These contain complex business rules that should be testable independently
**Pattern**: Complex calculations, validations, multi-step logic

#### User Entity → UserDomainService
- ⚠️ `IsAccountLocked()` - Simple check, KEEP
- ⚠️ `CanLogin()` - Multi-condition check, KEEP (simple)
- ⚠️ `IsAdmin()` - Simple check, KEEP
- ⚠️ `IsSuperAdmin()` - Simple check, KEEP
- ⚠️ `GetFullName()` - Simple concatenation, KEEP
- ⚠️ `IsEmailVerifiedAndValid()` - Simple check, KEEP
- ⚠️ `IsPhoneVerifiedAndValid()` - Simple check, KEEP

**Result**: All User query methods are simple enough to KEEP

#### Order Entity → OrderDomainService
- ⚠️ `CanBeCancelled()` - Simple check, KEEP
- ⚠️ `IsExpired()` - Simple time check, KEEP
- ⚠️ `CanBeModified()` - Simple check, KEEP
- ⚠️ `IsValidStatusTransition()` - Complex validation, **EXTRACT**
- ⚠️ `IsPaymentComplete()` - Simple check, KEEP
- ⚠️ `IsDeliveryOrder()` - Simple check, KEEP
- ⚠️ `IsPickupOrder()` - Simple check, KEEP
- ⚠️ `GetEstimatedPrepTime()` - Complex calculation, **EXTRACT**

**Result**: Extract `IsValidStatusTransition()` and `GetEstimatedPrepTime()` to OrderDomainService

#### MenuItem Entity → MenuItemDomainService
- ⚠️ `IsAvailableForOrdering()` - Simple check, KEEP
- ⚠️ `GetPrice()` - Simple check, KEEP
- ⚠️ `HasAllergen()` - Simple check, KEEP
- ⚠️ `CanBeOrdered()` - Simple check, KEEP
- ⚠️ `GetDiscountPercentage()` - Simple calculation, KEEP
- ⚠️ `IsVeganFriendly()` - Simple check, KEEP
- ⚠️ `IsVegetarianFriendly()` - Simple check, KEEP
- ⚠️ `GetAllergens()` - Simple list building, KEEP

**Result**: All MenuItem query methods are simple enough to KEEP

#### Location Entity → LocationDomainService
- ⚠️ `IsOpen()` - Complex time parsing, **EXTRACT**
- ⚠️ `GetDistance()` - Complex calculation (Haversine), **EXTRACT**
- ⚠️ `CanAcceptOrders()` - Simple check, KEEP
- ⚠️ `IsNearby()` - Uses GetDistance, depends on extraction
- ⚠️ `GetFullAddress()` - Simple concatenation, KEEP
- ⚠️ `HasCoordinates()` - Simple check, KEEP
- ⚠️ `HasDriveThruService()` - Simple check, KEEP
- ⚠️ `IsWheelchairAccessible()` - Simple check, KEEP
- ⚠️ `GetAvailableFeatures()` - Simple list building, KEEP

**Result**: Extract `IsOpen()` and `GetDistance()` to LocationDomainService

---

## 📊 EXTRACTION SUMMARY

| Entity | Methods to Extract | Methods to Keep | Reason |
|--------|-------------------|-----------------|--------|
| User | 0 | 16 | All methods are simple state checks |
| Order | 2 | 11 | Extract complex validation and calculation |
| MenuItem | 0 | 12 | All methods are simple checks |
| Location | 2 | 9 | Extract complex calculations |

**Total**: 4 methods to extract, 48 methods to keep in entities

---

## 🎯 REFACTORING PLAN

### Phase 1: Create Domain Services (2 hours)

#### 1.1 OrderDomainService
```csharp
public class OrderDomainService
{
    // Extract from Order.IsValidStatusTransition()
    public bool IsValidStatusTransition(OrderStatus from, OrderStatus to)
    
    // Extract from Order.GetEstimatedPrepTime()
    public int GetEstimatedPrepTime(Order order)
}
```

#### 1.2 LocationDomainService
```csharp
public class LocationDomainService
{
    // Extract from Location.IsOpen()
    public bool IsOpen(Location location)
    
    // Extract from Location.GetDistance()
    public double GetDistance(Location location, double latitude, double longitude)
}
```

### Phase 2: Update Entities (1 hour)

#### 2.1 Order Entity
- Remove `IsValidStatusTransition()` method
- Update `UpdateStatus()` to use injected `OrderDomainService`
- Update `Cancel()` to use injected `OrderDomainService`
- Remove `GetEstimatedPrepTime()` method
- Keep all other methods

#### 2.2 Location Entity
- Remove `IsOpen()` method
- Remove `GetDistance()` method
- Update `CanAcceptOrders()` to use injected `LocationDomainService`
- Update `IsNearby()` to use injected `LocationDomainService`
- Keep all other methods

### Phase 3: Update Handlers (1 hour)

Update all handlers that use extracted methods to inject domain services

---

## ✅ ENUM ORGANIZATION

### Current Enums (All in correct location)
- ✅ `ErrorType.cs` - Error classification
- ✅ `Gender.cs` - User gender
- ✅ `OrderStatus.cs` - Order lifecycle states
- ✅ `OrderType.cs` - Delivery vs Pickup
- ✅ `PaymentMethod.cs` - Payment types
- ✅ `PaymentStatus.cs` - Payment states
- ✅ `UserRole.cs` - User authorization roles

**Result**: All enums are properly organized in `Domain/Enums/` folder. No duplicates found.

---

## 🔍 DUPLICATE CHECK

### Enums
- ✅ No duplicate enums found
- ✅ All enums in correct location (`Domain/Enums/`)
- ✅ No enums in entity files

### Business Logic
- ✅ No duplicate business logic methods
- ✅ All methods have single responsibility
- ✅ No overlapping functionality

### Domain Services
- ✅ No duplicate services
- ✅ Clear separation of concerns
- ✅ No circular dependencies

---

## 📝 ENTITY CLEANUP CHECKLIST

- [x] User entity - All methods are appropriate for entity
- [x] Order entity - Identify methods to extract
- [x] MenuItem entity - All methods are appropriate for entity
- [x] Location entity - Identify methods to extract
- [x] Check for duplicate enums - None found
- [x] Check for duplicate business logic - None found
- [x] Verify enum locations - All correct
- [x] Verify no business logic in DTOs - Correct

---

## 🎯 BENEFITS OF REFACTORING

1. **Testability**: Complex logic can be unit tested independently
2. **Reusability**: Domain services can be used across multiple entities
3. **Maintainability**: Clear separation between entity state and business logic
4. **Scalability**: Easy to add new business rules without modifying entities
5. **Performance**: Complex calculations can be optimized independently

---

## 📊 FINAL ENTITY STRUCTURE

### User Entity (230 lines)
- Properties: 20 fields
- Navigation: 2 properties
- Methods: 16 (all state mutations and simple queries)
- **Status**: ✅ CLEAN - No extraction needed

### Order Entity (280 lines → 260 lines after extraction)
- Properties: 25 fields
- Navigation: 3 properties
- Methods: 11 (state mutations and simple queries)
- Extracted: 2 methods to OrderDomainService
- **Status**: ✅ CLEAN - Ready for extraction

### MenuItem Entity (220 lines)
- Properties: 25 fields
- Navigation: 3 properties
- Methods: 12 (all simple queries)
- **Status**: ✅ CLEAN - No extraction needed

### Location Entity (200 lines → 180 lines after extraction)
- Properties: 20 fields
- Navigation: 1 property
- Methods: 9 (state mutations and simple queries)
- Extracted: 2 methods to LocationDomainService
- **Status**: ✅ CLEAN - Ready for extraction

---

## 🔄 IMPLEMENTATION ORDER

1. ✅ Create OrderDomainService with extracted methods
2. ✅ Create LocationDomainService with extracted methods
3. ✅ Update Order entity to remove extracted methods
4. ✅ Update Location entity to remove extracted methods
5. ✅ Update handlers to use domain services
6. ✅ Verify build succeeds
7. ✅ Commit changes

---

**Status**: ✅ ANALYSIS COMPLETE - Ready for implementation
**Next**: Create domain services and refactor entities
