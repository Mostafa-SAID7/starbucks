# Starbucks Egypt - Test Project

Comprehensive test suite for the Starbucks Egypt backend application.

## Project Structure

```
Starbucks.Tests/
├── Unit/                          # Unit tests
│   ├── Domain/
│   │   └── Services/             # Domain service tests
│   ├── Application/
│   │   ├── Specifications/       # Specification tests
│   │   └── Features/             # Feature handler tests
│   └── Infrastructure/
│       └── Repositories/         # Repository tests
│
├── Integration/                   # Integration tests
│   ├── API/                      # API endpoint tests
│   ├── Services/                 # Service integration tests
│   └── Database/                 # Database operation tests
│
├── E2E/                          # End-to-end tests
│   └── Workflows/                # User workflow tests
│
├── Fixtures/                     # Test fixtures
│   ├── DatabaseFixture.cs        # Database lifecycle management
│   └── WebApplicationFixture.cs  # Web application lifecycle
│
├── Builders/                     # Test data builders
│   ├── UserBuilder.cs
│   ├── OrderBuilder.cs
│   ├── LocationBuilder.cs
│   └── MenuItemBuilder.cs
│
├── Factories/                    # Mock factories
│   └── MockDataFactory.cs        # Mock object creation
│
├── Helpers/                      # Test helpers
│   ├── AssertionHelpers.cs       # Common assertions
│   └── TestDataHelper.cs         # Test data creation
│
└── appsettings.Test.json         # Test configuration
```

## Running Tests

### Run all tests
```bash
dotnet test
```

### Run specific test class
```bash
dotnet test --filter "ClassName"
```

### Run tests with coverage
```bash
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover
```

### Run tests in watch mode
```bash
dotnet watch test
```

## Test Fixtures

### DatabaseFixture
Manages test database lifecycle using in-memory database.

```csharp
public class MyTest : IAsyncLifetime
{
    private readonly DatabaseFixture _fixture = new();
    
    public async Task InitializeAsync() => await _fixture.InitializeAsync();
    public async Task DisposeAsync() => await _fixture.DisposeAsync();
    
    [Fact]
    public async Task MyTest()
    {
        var context = _fixture.GetContext();
        // Test code
    }
}
```

### WebApplicationFixture
Manages test web application lifecycle for API testing.

```csharp
public class ApiTest : IAsyncLifetime
{
    private readonly WebApplicationFixture _fixture = new();
    
    public async Task InitializeAsync() => await _fixture.InitializeAsync();
    public async Task DisposeAsync() => await _fixture.DisposeAsync();
    
    [Fact]
    public async Task MyApiTest()
    {
        var client = _fixture.GetClient();
        var response = await client.GetAsync("/api/users");
        // Assertions
    }
}
```

## Test Builders

### UserBuilder
Creates test User entities with fluent API.

```csharp
var user = new UserBuilder()
    .WithEmail("test@example.com")
    .WithRole(UserRole.Customer)
    .WithVerifiedEmail()
    .AsActive()
    .Build();
```

### OrderBuilder
Creates test Order entities with fluent API.

```csharp
var order = new OrderBuilder()
    .WithUserId(userId)
    .WithLocationId(locationId)
    .WithStatus(OrderStatus.Pending)
    .WithSubtotal(100m)
    .Build();
```

### LocationBuilder
Creates test Location entities with fluent API.

```csharp
var location = new LocationBuilder()
    .WithCity("Cairo")
    .AsActive()
    .WithWifi()
    .WithParking()
    .Build();
```

### MenuItemBuilder
Creates test MenuItem entities with fluent API.

```csharp
var item = new MenuItemBuilder()
    .WithName("Espresso")
    .WithPrice(50m)
    .AsAvailable()
    .AsFeatured()
    .Build();
```

## Mock Factories

### MockDataFactory
Creates mock objects for unit testing.

```csharp
var mockUserRepo = MockDataFactory.CreateMockUserRepository();
var mockCacheService = MockDataFactory.CreateMockCacheService();
var mockUnitOfWork = MockDataFactory.CreateMockUnitOfWorkWithRepositories();
```

## Test Helpers

### AssertionHelpers
Common assertion methods.

```csharp
AssertionHelpers.AssertSuccess(result);
AssertionHelpers.AssertFailure(result, "Expected error message");
AssertionHelpers.AssertValidAuditFields(entity);
AssertionHelpers.AssertSoftDeleted(entity);
```

### TestDataHelper
Test data creation helpers.

```csharp
var user = TestDataHelper.CreateValidUser();
var order = TestDataHelper.CreateValidOrder();
var users = TestDataHelper.CreateValidUsers(5);
var orders = TestDataHelper.CreateValidOrders(10, userId);
```

## Testing Best Practices

### 1. Test Naming
Use descriptive names following the pattern: `MethodName_Condition_ExpectedResult`

```csharp
[Fact]
public void CanBeCancelled_WithPendingStatus_ReturnsTrue()
{
    // Arrange, Act, Assert
}
```

### 2. AAA Pattern
Follow Arrange-Act-Assert pattern for clarity.

```csharp
[Fact]
public async Task CreateOrder_WithValidData_CreatesOrder()
{
    // Arrange
    var user = TestDataHelper.CreateValidUser();
    var service = new OrderService();
    
    // Act
    var result = await service.CreateOrderAsync(user.Id, items);
    
    // Assert
    result.IsSuccess.Should().BeTrue();
}
```

### 3. One Assertion Per Test
Keep tests focused on a single behavior.

```csharp
// ✅ GOOD: Single assertion
[Fact]
public void GetPrice_WithDiscount_ReturnsDiscountedPrice()
{
    var item = new MenuItemBuilder().WithDiscount(10).Build();
    var price = item.GetPrice();
    price.Should().BeLessThan(item.Price);
}

// ❌ BAD: Multiple unrelated assertions
[Fact]
public void TestMenuItem()
{
    var item = new MenuItemBuilder().Build();
    item.Price.Should().BeGreaterThan(0);
    item.IsAvailable.Should().BeTrue();
    item.Name.Should().NotBeEmpty();
}
```

### 4. Use Builders for Complex Data
Use builders instead of magic values.

```csharp
// ✅ GOOD: Clear intent
var user = new UserBuilder()
    .WithEmail("admin@example.com")
    .WithRole(UserRole.Admin)
    .WithVerifiedEmail()
    .Build();

// ❌ BAD: Magic values
var user = new User 
{ 
    Email = "admin@example.com",
    Role = UserRole.Admin,
    IsEmailVerified = true
};
```

### 5. Mock External Dependencies
Mock services and repositories in unit tests.

```csharp
[Fact]
public async Task CreateOrder_CallsRepository()
{
    // Arrange
    var mockRepo = MockDataFactory.CreateMockOrderRepository();
    var service = new OrderService(mockRepo.Object);
    
    // Act
    await service.CreateOrderAsync(userId, items);
    
    // Assert
    mockRepo.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
}
```

## Coverage Targets

| Component | Target | Status |
|-----------|--------|--------|
| Domain Services | 95% | ⏳ TODO |
| Repositories | 90% | ⏳ TODO |
| Specifications | 85% | ⏳ TODO |
| API Controllers | 80% | ⏳ TODO |
| Overall | 80% | ⏳ TODO |

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Domain service unit tests (60 tests)
- [ ] Achieve 95% coverage on domain services

### Phase 2: Repository & Specification Tests (Week 3-4)
- [ ] Repository unit tests (40 tests)
- [ ] Specification unit tests (30 tests)

### Phase 3: Integration Tests (Week 5-6)
- [ ] API integration tests (30 tests)
- [ ] Service integration tests (20 tests)
- [ ] Database integration tests (20 tests)

### Phase 4: E2E Tests (Week 7)
- [ ] Workflow tests (9 tests)

### Phase 5: CI/CD Integration (Week 8)
- [ ] Test automation
- [ ] Coverage reporting

## Resources

- [xUnit Documentation](https://xunit.net/)
- [Moq Documentation](https://github.com/moq/moq4)
- [FluentAssertions](https://fluentassertions.com/)
- [TestContainers](https://www.testcontainers.org/)

## Contributing

When adding new tests:
1. Follow the project structure
2. Use builders for test data
3. Follow AAA pattern
4. Use descriptive test names
5. Aim for high coverage
6. Keep tests maintainable

---

**Status**: 🎯 TESTING INFRASTRUCTURE COMPLETE
**Next Step**: Implement Phase 1 - Domain Service Unit Tests
**Target**: 232 tests with 80%+ coverage
