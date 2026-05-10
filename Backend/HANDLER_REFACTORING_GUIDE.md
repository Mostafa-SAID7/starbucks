# Handler Refactoring Guide - Phase 1

**Goal**: Eliminate EF Core coupling and architectural weaknesses by refactoring all handlers to use repositories and specifications.

**Focus Areas**:
1. ✅ No duplicate code - use specifications consistently
2. ✅ Very clear implementation - follow patterns exactly
3. ✅ Fix architectural weaknesses - eliminate direct DbContext access

---

## Architectural Weaknesses Being Fixed

### 1. **EF Core Abstractions in Application Layer** ❌ → ✅
**Before**: Handlers directly access `_context.Users`, `_context.Orders`, etc.
```csharp
// ❌ BAD: Direct DbContext access
var user = await _context.Users
    .AsNoTracking()
    .Include(u => u.Profile)
    .FirstOrDefaultAsync(u => u.Email == email);
```

**After**: Use repositories with specifications
```csharp
// ✅ GOOD: Repository abstraction
var spec = new UserByEmailSpecification(email);
var user = await _userRepository.GetSingleAsync(spec);
```

### 2. **Anemic Domain Model** ❌ → ✅
**Before**: Business logic scattered in handlers
**After**: Business logic in domain entities, handlers orchestrate

### 3. **N+1 Query Problems** ❌ → ✅
**Before**: Multiple queries in loops
**After**: Specifications with eager loading via `.Include()`

### 4. **Inconsistent Query Patterns** ❌ → ✅
**Before**: Each handler writes its own query logic
**After**: Reusable specifications (50+ patterns created)

---

## Handler Refactoring Pattern

### Template for All Handlers

```csharp
// ✅ CORRECT PATTERN
public class YourCommandHandler : IRequestHandler<YourCommand, Result<YourResponse>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<YourCommandHandler> _logger;

    public YourCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<YourCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<YourResponse>> Handle(
        YourCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // 1. Validate input
            if (string.IsNullOrWhiteSpace(request.Email))
                return Result<YourResponse>.Failure("Email is required");

            // 2. Use repository with specification
            var spec = new UserByEmailSpecification(request.Email);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

            if (user == null)
                return Result<YourResponse>.Failure("User not found");

            // 3. Business logic
            user.DoSomething();

            // 4. Persist changes
            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 5. Map and return
            var response = _mapper.Map<YourResponse>(user);
            return Result<YourResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in YourCommandHandler");
            return Result<YourResponse>.Failure("An error occurred");
        }
    }
}
```

---

## Key Rules for Refactoring

### ✅ DO:
1. **Use IUnitOfWork** - Inject `IUnitOfWork`, not `IApplicationDbContext`
2. **Use Specifications** - Use existing 50+ specifications, don't write queries
3. **One repository per entity** - `_unitOfWork.Users`, `_unitOfWork.Orders`, etc.
4. **Consistent error handling** - Return `Result<T>` with meaningful messages
5. **Logging** - Log errors and important operations
6. **Validation first** - Validate input before database operations
7. **Transactions for multi-step operations** - Use `BeginTransactionAsync()` / `CommitTransactionAsync()`

### ❌ DON'T:
1. **Direct DbContext access** - Never use `_context.Users.Where(...)`
2. **AsNoTracking() in handlers** - Repository handles this
3. **Include() in handlers** - Specifications handle eager loading
4. **Duplicate query logic** - Use existing specifications
5. **Multiple queries in loops** - Use specifications with proper includes
6. **Hardcoded strings** - Use constants or enums
7. **Swallow exceptions** - Log and return meaningful errors

---

## Handlers to Refactor (Priority Order)

### Priority 1: Authentication (Critical Path)
- [ ] LoginCommandHandler
- [ ] RegisterCommandHandler
- [ ] LogoutCommandHandler
- [ ] RefreshTokenCommandHandler

### Priority 2: User Management
- [ ] GetUserByIdQueryHandler
- [ ] GetUsersQueryHandler
- [ ] UpdateUserCommandHandler
- [ ] DeleteUserCommandHandler

### Priority 3: Menu Operations
- [ ] GetMenuCategoriesQueryHandler
- [ ] GetMenuItemsQueryHandler
- [ ] GetMenuCategoryBySlugQueryHandler
- [ ] SearchMenuItemsQueryHandler

### Priority 4: Orders
- [ ] CreateOrderCommandHandler
- [ ] GetOrdersQueryHandler
- [ ] UpdateOrderStatusCommandHandler
- [ ] CancelOrderCommandHandler

### Priority 5: Locations
- [ ] GetLocationsQueryHandler
- [ ] GetNearbyLocationsQueryHandler
- [ ] GetLocationBySlugQueryHandler

---

## Example Refactoring: LoginCommandHandler

### BEFORE (❌ Architectural Weakness)
```csharp
public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IPasswordService _passwordService;

    public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // ❌ PROBLEM 1: Direct DbContext access
        var user = await _context.Users
            .AsNoTracking()
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsDeleted);

        if (user == null)
            return Result<LoginResponse>.Failure("Invalid credentials");

        // ❌ PROBLEM 2: No validation
        // ❌ PROBLEM 3: No error handling
        // ❌ PROBLEM 4: No logging
        
        var isPasswordValid = _passwordService.VerifyPassword(request.Password, user.PasswordHash);
        if (!isPasswordValid)
            return Result<LoginResponse>.Failure("Invalid credentials");

        // ❌ PROBLEM 5: Direct context update
        user.LastLoginAt = DateTime.UtcNow;
        user.FailedLoginAttempts = 0;
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _tokenService.GenerateToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // ❌ PROBLEM 6: Another direct context update
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<LoginResponse>.Success(new LoginResponse
        {
            AccessToken = token,
            RefreshToken = refreshToken,
            User = new UserDto { Id = user.Id, Email = user.Email }
        });
    }
}
```

### AFTER (✅ Clean Architecture)
```csharp
public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IPasswordService _passwordService;
    private readonly IMapper _mapper;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        IPasswordService passwordService,
        IMapper mapper,
        ILogger<LoginCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _passwordService = passwordService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<LoginResponse>> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // ✅ STEP 1: Validate input
            if (string.IsNullOrWhiteSpace(request.Email))
                return Result<LoginResponse>.Failure("Email is required");

            if (string.IsNullOrWhiteSpace(request.Password))
                return Result<LoginResponse>.Failure("Password is required");

            // ✅ STEP 2: Use repository with specification (no duplicate code)
            var spec = new UserByEmailSpecification(request.Email);
            var user = await _unitOfWork.Users.GetSingleAsync(spec, cancellationToken);

            if (user == null)
            {
                _logger.LogWarning("Login attempt with non-existent email: {Email}", request.Email);
                return Result<LoginResponse>.Failure("Invalid credentials");
            }

            // ✅ STEP 3: Check if account is locked
            if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow)
            {
                _logger.LogWarning("Login attempt on locked account: {UserId}", user.Id);
                return Result<LoginResponse>.Failure("Account is locked. Try again later.");
            }

            // ✅ STEP 4: Verify password
            var isPasswordValid = _passwordService.VerifyPassword(request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                // ✅ STEP 5: Update failed login attempts
                user.FailedLoginAttempts++;
                user.LastFailedLoginAt = DateTime.UtcNow;

                // Lock account after 5 failed attempts
                if (user.FailedLoginAttempts >= 5)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                    _logger.LogWarning("Account locked due to failed login attempts: {UserId}", user.Id);
                }

                await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                _logger.LogWarning("Failed login attempt for user: {UserId}", user.Id);
                return Result<LoginResponse>.Failure("Invalid credentials");
            }

            // ✅ STEP 6: Reset failed attempts and update last login
            user.FailedLoginAttempts = 0;
            user.LastFailedLoginAt = null;
            user.LockoutEnd = null;
            user.LastLoginAt = DateTime.UtcNow;

            // ✅ STEP 7: Generate tokens
            var accessToken = _tokenService.GenerateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // ✅ STEP 8: Update refresh token (single update, not multiple)
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            user.RefreshTokenVersion++;
            user.RefreshTokenIssuedAt = DateTime.UtcNow;

            // ✅ STEP 9: Single transaction for all updates
            await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("User logged in successfully: {UserId}", user.Id);

            // ✅ STEP 10: Map and return
            var response = new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = _mapper.Map<UserDto>(user)
            };

            return Result<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in LoginCommandHandler");
            return Result<LoginResponse>.Failure("An error occurred during login");
        }
    }
}
```

### Key Improvements:
1. ✅ **No duplicate code** - Uses `UserByEmailSpecification` consistently
2. ✅ **Very clear** - Each step is labeled and logical
3. ✅ **Fixes weaknesses**:
   - No direct DbContext access
   - Single transaction (not multiple SaveChanges)
   - Proper error handling and logging
   - Account lockout logic
   - Consistent patterns

---

## Refactoring Checklist

For each handler:
- [ ] Replace `_context` with `_unitOfWork`
- [ ] Replace direct queries with specifications
- [ ] Add input validation
- [ ] Add try-catch with logging
- [ ] Use single transaction for multi-step operations
- [ ] Remove duplicate query logic
- [ ] Add meaningful error messages
- [ ] Test with existing tests
- [ ] Verify build succeeds

---

## Specifications Available (Use These!)

### User Specifications
- `UserByEmailSpecification` - Get user by email
- `UserByPhoneSpecification` - Get user by phone
- `UsersByRoleSpecification` - Get users by role
- `VerifiedUsersSpecification` - Get verified users
- `UsersWithFailedLoginsSpecification` - Get users with failed logins
- `LockedOutUsersSpecification` - Get locked out users

### Menu Specifications
- `MenuItemsByCategorySpecification` - Items by category
- `MenuItemsBySubcategorySpecification` - Items by subcategory
- `MenuItemsSearchSpecification` - Search items
- `AvailableMenuItemsSpecification` - Available items
- `FeaturedMenuItemsSpecification` - Featured items
- `ActiveMenuCategoriesSpecification` - Active categories
- `MenuCategoryBySlugSpecification` - Category by slug

### Order Specifications
- `OrdersByUserSpecification` - Orders by user
- `OrdersByStatusSpecification` - Orders by status
- `PendingOrdersSpecification` - Pending orders
- `CompletedOrdersSpecification` - Completed orders
- `OrdersByLocationSpecification` - Orders by location
- `RecentOrdersSpecification` - Recent orders

### Location Specifications
- `LocationsByCitySpecification` - Locations by city
- `LocationsByGovernorateSpecification` - Locations by governorate
- `ActiveLocationsSpecification` - Active locations
- `LocationsWithCoordinatesSpecification` - Locations with coordinates

---

## Next Steps

1. **Start with Priority 1** - Authentication handlers (LoginCommandHandler, RegisterCommandHandler, etc.)
2. **Follow the pattern exactly** - Use the template provided
3. **Test each handler** - Verify existing tests still pass
4. **Commit after each handler** - Small, focused commits
5. **Build verification** - Ensure 0 errors after each change

---

## Success Criteria

✅ All handlers refactored
✅ No direct DbContext access in handlers
✅ All specifications used consistently
✅ No duplicate query logic
✅ Build succeeds with 0 errors
✅ All existing tests pass
✅ Clear, readable code with proper error handling

