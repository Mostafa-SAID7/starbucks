# Starbucks Egypt Backend - Architecture Documentation

## 🏗️ Architecture Overview

This backend follows **Clean Architecture** principles with clear separation of concerns across four layers:

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Presentation)                │
│  Controllers, Middleware, Extensions, Configuration          │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   Application Layer                          │
│  Features (CQRS), DTOs, Validators, Interfaces              │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  DbContext, Services, External Integrations                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                     Domain Layer                             │
│  Entities, Enums, Value Objects, Domain Logic               │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

### **StarbucksEgypt.API** (Presentation Layer)
- **Controllers**: Thin controllers that delegate to MediatR
- **Extensions**: Service registration and middleware configuration
- **Services**: API-specific services (CurrentUserService)
- **Configuration**: appsettings.json, launchSettings.json

### **StarbucksEgypt.Application** (Application Layer)
- **Features**: Organized by domain (Auth, Menu, Locations)
  - Commands: Write operations (Register, Login, Logout)
  - Queries: Read operations (GetMenu, GetLocations)
  - Validators: FluentValidation rules
- **DTOs**: Data transfer objects for API contracts
- **Common**: Shared interfaces, models, settings

### **StarbucksEgypt.Infrastructure** (Infrastructure Layer)
- **Data**: DbContext, Entity Configurations, Migrations
- **Services**: Concrete implementations
  - CacheService (Redis)
  - TokenService (JWT)
  - PasswordService (BCrypt)
  - EmailService (stub for SendGrid/SES)
  - DateTimeService (testable time)
  - SoftDeleteService (centralized soft delete)

### **StarbucksEgypt.Domain** (Domain Layer)
- **Entities**: Core business entities (User, MenuItem, Order, Location)
- **Enums**: Domain enumerations (UserRole, OrderStatus)
- **Common**: BaseEntity with audit fields

---

## 🎯 Key Design Patterns

### 1. **CQRS (Command Query Responsibility Segregation)**
- **Commands**: Modify state (Register, Login, CreateOrder)
- **Queries**: Read data (GetMenu, GetLocations)
- Implemented via **MediatR** for clean separation

### 2. **Repository Pattern**
- DbContext acts as Unit of Work
- DbSet<T> acts as repositories
- No additional repository abstraction (EF Core is already an abstraction)

### 3. **Dependency Injection**
- All services registered in `ServiceCollectionExtensions`
- Scoped: Per-request services (DbContext, TokenService)
- Singleton: Stateless services (DateTimeService, Redis)
- Transient: Cheap, stateless services (EmailService)

### 4. **Result Pattern**
- `Result<T>` wraps success/failure responses
- Eliminates exception-driven flow for business logic failures
- Consistent error handling across all features

### 5. **Soft Delete Pattern**
- `ISoftDeleteService` centralizes soft delete logic
- Global query filters automatically exclude deleted entities
- Audit trail preserved (DeletedAt, DeletedBy)

---

## 🔐 Security Implementation

### Authentication & Authorization
- **JWT Bearer Tokens**: Access tokens (1 hour expiry)
- **Refresh Tokens**: Long-lived tokens (7 days) with rotation
- **BCrypt Password Hashing**: Work factor 12
- **Claims-based Authorization**: Role-based access control

### Security Headers
```csharp
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### Rate Limiting
- **Global**: 100 requests/minute, 1000 requests/hour
- **Auth Endpoints**: 5 requests/minute (brute force protection)
- IP-based tracking with AspNetCoreRateLimit

### Input Validation
- **FluentValidation**: Declarative validation rules
- **Model Binding**: Automatic validation on controller actions
- **SQL Injection Protection**: Parameterized queries via EF Core

---

## 📊 Data Layer

### Entity Framework Core
- **Code-First Approach**: Migrations for schema management
- **Global Query Filters**: Automatic soft delete filtering
- **Optimistic Concurrency**: RowVersion for conflict detection
- **Indexes**: Strategic indexing on frequently queried columns

### Audit Trail (BaseEntity)
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
    public byte[] RowVersion { get; set; }
}
```

### Automatic Audit Tracking
- `SaveChangesAsync` override automatically sets:
  - CreatedAt/CreatedBy on insert
  - UpdatedAt/UpdatedBy on update
  - Uses `IDateTimeService` and `ICurrentUserService`

---

## 🚀 Performance Optimization

### Caching Strategy
- **Redis**: Distributed caching for scalability
- **Cache Keys**: Structured naming (e.g., `menu_categories_en`)
- **TTL Strategy**:
  - Menu data: 1 hour
  - Locations: 2 hours
  - Menu items: 30 minutes

### Query Optimization
- **Eager Loading**: `.Include()` for related data
- **Projection**: Select only needed fields
- **Pagination**: Implemented where applicable
- **AsNoTracking**: For read-only queries

### Async/Await
- All I/O operations are async
- CancellationToken support throughout
- Prevents thread pool starvation

---

## 🧪 Testing Strategy

### Testability Features
- **IDateTimeService**: Mock time in tests
- **Dependency Injection**: Easy to mock dependencies
- **Result Pattern**: Predictable return types
- **CQRS**: Isolated handlers for unit testing

### Test Pyramid
```
        ┌─────────────┐
        │   E2E Tests │  (Few)
        └─────────────┘
      ┌─────────────────┐
      │ Integration Tests│  (Some)
      └─────────────────┘
    ┌───────────────────────┐
    │     Unit Tests        │  (Many)
    └───────────────────────┘
```

---

## 📝 Logging & Monitoring

### Serilog Configuration
- **Structured Logging**: JSON-formatted logs
- **Log Levels**: Information (default), Warning (Microsoft/System)
- **Sinks**:
  - Console: Development debugging
  - File: Rolling daily logs
- **Enrichment**: Application name, environment, log context

### Health Checks
- **Liveness Probe** (`/health/live`): Process is running
- **Readiness Probe** (`/health/ready`): Database + Redis connectivity
- **Kubernetes-Ready**: Separate probes for orchestration

---

## 🔄 API Design

### RESTful Principles
- **Resource-Based URLs**: `/api/menu/categories`, `/api/locations`
- **HTTP Verbs**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**:
  - 200 OK: Success
  - 400 Bad Request: Validation errors
  - 401 Unauthorized: Missing/invalid token
  - 404 Not Found: Resource doesn't exist
  - 429 Too Many Requests: Rate limit exceeded
  - 500 Internal Server Error: Unhandled exceptions

### Response Format
```json
{
  "data": { ... },
  "errors": ["error1", "error2"],
  "isSuccess": true
}
```

### Error Handling
- **RFC 7807 ProblemDetails**: Consistent error shape
- **Global Exception Handler**: Catches unhandled exceptions
- **Validation Errors**: Returned as structured errors

---

## 🛠️ Development Workflow

### Running Locally
```bash
# Start dependencies
docker-compose up -d

# Run migrations
dotnet ef database update --project src/StarbucksEgypt.Infrastructure

# Run API
dotnet run --project src/StarbucksEgypt.API
```

### Environment Configuration
- **Development**: `appsettings.Development.json`
- **Production**: `appsettings.Production.json`
- **Secrets**: Use User Secrets or Azure Key Vault

### Database Migrations
```bash
# Add migration
dotnet ef migrations add MigrationName --project src/StarbucksEgypt.Infrastructure

# Update database
dotnet ef database update --project src/StarbucksEgypt.Infrastructure

# Remove last migration
dotnet ef migrations remove --project src/StarbucksEgypt.Infrastructure
```

---

## 📦 Dependencies

### Core Packages
- **ASP.NET Core 10.0**: Web framework
- **Entity Framework Core**: ORM
- **MediatR**: CQRS implementation
- **FluentValidation**: Input validation
- **Mapster**: Object mapping
- **Serilog**: Structured logging

### Infrastructure
- **StackExchange.Redis**: Redis client
- **BCrypt.Net**: Password hashing
- **System.IdentityModel.Tokens.Jwt**: JWT handling
- **AspNetCoreRateLimit**: Rate limiting

---

## 🚦 Production Readiness

### ✅ Implemented
- [x] Clean Architecture
- [x] CQRS with MediatR
- [x] JWT Authentication
- [x] Refresh Token Rotation
- [x] BCrypt Password Hashing
- [x] FluentValidation
- [x] Global Exception Handling
- [x] Structured Logging (Serilog)
- [x] Redis Caching
- [x] Rate Limiting
- [x] Security Headers
- [x] Health Checks
- [x] Soft Delete Pattern
- [x] Audit Trail
- [x] CORS Configuration
- [x] Swagger Documentation
- [x] Docker Support

### 🔄 Recommended Enhancements
- [ ] API Versioning (Microsoft.AspNetCore.Mvc.Versioning)
- [ ] Response Compression
- [ ] Request/Response Logging Middleware
- [ ] Distributed Tracing (OpenTelemetry)
- [ ] Circuit Breaker Pattern (Polly)
- [ ] Background Jobs (Hangfire)
- [ ] Email Service Integration (SendGrid/SES)
- [ ] File Upload Service (Azure Blob/S3)
- [ ] Real-time Notifications (SignalR)
- [ ] GraphQL API (HotChocolate)

---

## 🎓 Best Practices Followed

### Code Quality
- **Single Responsibility**: Each class has one reason to change
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Open/Closed**: Open for extension, closed for modification
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid

### Security
- **Never trust user input**: Validate everything
- **Principle of Least Privilege**: Minimal permissions
- **Defense in Depth**: Multiple security layers
- **Secure by Default**: Security is not optional

### Performance
- **Async all the way**: No blocking calls
- **Cache aggressively**: Reduce database load
- **Index strategically**: Optimize query performance
- **Monitor continuously**: Measure before optimizing

---

## 📚 Additional Resources

### Documentation
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [ASP.NET Core Best Practices](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices)
- [EF Core Performance](https://learn.microsoft.com/en-us/ef/core/performance/)

### Tools
- [Swagger UI](http://localhost:5000) - API documentation
- [Seq](https://datalust.co/seq) - Log aggregation
- [Redis Commander](https://github.com/joeferner/redis-commander) - Redis GUI
- [SQL Server Management Studio](https://aka.ms/ssmsfullsetup) - Database management

---

## 👥 Team Guidelines

### Code Reviews
- Check for security vulnerabilities
- Verify test coverage
- Ensure consistent naming conventions
- Review performance implications
- Validate error handling

### Git Workflow
- Feature branches: `feature/feature-name`
- Bug fixes: `bugfix/bug-name`
- Hotfixes: `hotfix/issue-name`
- Commit messages: Conventional Commits format

### Deployment
- CI/CD pipeline via GitHub Actions
- Automated tests on PR
- Staging deployment on merge to develop
- Production deployment on merge to main

---

## 📞 Support

For questions or issues, contact:
- **Email**: support@starbucks.eg
- **Documentation**: [Internal Wiki]
- **Issue Tracker**: [GitHub Issues]

---

**Last Updated**: 2026-05-09
**Version**: 1.0.0
**Maintainer**: Development Team
