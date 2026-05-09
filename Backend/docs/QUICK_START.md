# Quick Start Guide - Starbucks Egypt Backend

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- .NET 10.0 SDK
- SQL Server (LocalDB or full instance)
- Redis (via Docker or local install)
- Visual Studio 2022 or VS Code

### 1. Clone and Setup
```bash
cd Backend
dotnet restore
```

### 2. Start Dependencies
```bash
# Start Redis via Docker
docker-compose up -d

# Or start Redis locally
redis-server
```

### 3. Update Database
```bash
dotnet ef database update --project src/Starbucks.Infrastructure --startup-project src/Starbucks.API
```

### 4. Run the API
```bash
cd src/Starbucks.API
dotnet run
```

### 5. Open Swagger
Navigate to: `http://localhost:5000`

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── Starbucks.API/           # Controllers, Middleware
│   ├── Starbucks.Application/   # Features, DTOs, Validators
│   ├── Starbucks.Infrastructure/# DbContext, Services
│   └── Starbucks.Domain/        # Entities, Enums
├── docker-compose.yml                # Redis, SQL Server
└── README.md
```

---

## 🔑 Key Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Menu
```http
GET  /api/menu/categories
GET  /api/menu/items/{id}
```

### Locations
```http
GET  /api/locations
GET  /api/locations/cities/{city}
```

### Health Checks
```http
GET  /health/live    # Liveness probe
GET  /health/ready   # Readiness probe (DB + Redis)
```

---

## 🧪 Testing Endpoints

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+201234567890",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "dateOfBirth": "1990-01-01",
    "preferredLanguage": "en",
    "acceptTerms": true,
    "acceptMarketing": false
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### 3. Get Menu (with token)
```bash
curl -X GET http://localhost:5000/api/menu/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🛠️ Common Tasks

### Add a New Feature

1. **Create Command/Query**
```csharp
// Application/Features/Orders/Commands/CreateOrderCommand.cs
public record CreateOrderCommand(CreateOrderRequest Request) 
    : IRequest<Result<OrderDto>>;

public class CreateOrderCommandHandler 
    : IRequestHandler<CreateOrderCommand, Result<OrderDto>>
{
    private readonly IApplicationDbContext _context;
    
    public CreateOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<Result<OrderDto>> Handle(
        CreateOrderCommand request, 
        CancellationToken cancellationToken)
    {
        // Implementation
    }
}
```

2. **Create Validator**
```csharp
// Application/Features/Orders/Validators/CreateOrderRequestValidator.cs
public class CreateOrderRequestValidator 
    : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("Order must contain at least one item.");
    }
}
```

3. **Add Controller Endpoint**
```csharp
// API/Controllers/OrdersController.cs
[HttpPost]
public async Task<IActionResult> CreateOrder(
    [FromBody] CreateOrderRequest request)
{
    var result = await _mediator.Send(new CreateOrderCommand(request));
    
    if (!result.IsSuccess)
        return BadRequest(new { errors = result.Errors });
    
    return Ok(result.Data);
}
```

### Add a Database Migration

```bash
# Add migration
dotnet ef migrations add AddOrderTable \
  --project src/Starbucks.Infrastructure \
  --startup-project src/Starbucks.API

# Update database
dotnet ef database update \
  --project src/Starbucks.Infrastructure \
  --startup-project src/Starbucks.API

# Rollback migration
dotnet ef database update PreviousMigrationName \
  --project src/Starbucks.Infrastructure \
  --startup-project src/Starbucks.API
```

### Add a New Service

1. **Create Interface**
```csharp
// Application/Common/Interfaces/INotificationService.cs
public interface INotificationService
{
    Task SendAsync(string userId, string message, 
        CancellationToken cancellationToken = default);
}
```

2. **Implement Service**
```csharp
// Infrastructure/Services/NotificationService.cs
public class NotificationService : INotificationService
{
    public async Task SendAsync(string userId, string message, 
        CancellationToken cancellationToken = default)
    {
        // Implementation
    }
}
```

3. **Register Service**
```csharp
// API/Extensions/ServiceCollectionExtensions.cs
services.AddScoped<INotificationService, NotificationService>();
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check connection string in appsettings.json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=StarbucksEgyptDb;..."

# Test connection
dotnet ef database update --project src/Starbucks.Infrastructure --startup-project src/Starbucks.API
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker ps | grep redis

# Start Redis
docker-compose up -d redis

# Test Redis connection
redis-cli ping
```

### Migration Issues
```bash
# Drop database and recreate
dotnet ef database drop --project src/Starbucks.Infrastructure --startup-project src/Starbucks.API
dotnet ef database update --project src/Starbucks.Infrastructure --startup-project src/Starbucks.API

# Remove last migration
dotnet ef migrations remove --project src/Starbucks.Infrastructure --startup-project src/Starbucks.API
```

### Port Already in Use
```bash
# Change port in launchSettings.json
"applicationUrl": "http://localhost:5001"

# Or kill process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 📊 Monitoring

### View Logs
```bash
# Console logs (real-time)
dotnet run --project src/Starbucks.API

# File logs
tail -f src/Starbucks.API/logs/starbucks-api-*.txt
```

### Check Health
```bash
# Liveness (is process running?)
curl http://localhost:5000/health/live

# Readiness (is DB + Redis connected?)
curl http://localhost:5000/health/ready
```

### Monitor Redis
```bash
# Connect to Redis CLI
docker exec -it redis redis-cli

# View all keys
KEYS *

# Get cache value
GET menu_categories_en

# Monitor commands
MONITOR
```

---

## 🔐 Security Notes

### JWT Configuration
- **Access Token**: 1 hour expiry
- **Refresh Token**: 7 days expiry with rotation
- **Secret**: Stored in appsettings.json (move to Key Vault in production)

### Rate Limiting
- **Global**: 100 requests/minute
- **Auth Endpoints**: 5 requests/minute

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character (@$!%*?&)

---

## 📚 Useful Commands

### Build
```bash
dotnet build
dotnet build --configuration Release
```

### Run
```bash
dotnet run --project src/Starbucks.API
dotnet watch run --project src/Starbucks.API  # Hot reload
```

### Test
```bash
dotnet test
dotnet test --logger "console;verbosity=detailed"
```

### Clean
```bash
dotnet clean
rm -rf **/bin **/obj
```

### Publish
```bash
dotnet publish -c Release -o ./publish
```

---

## 🌐 Environment Variables

### Development
```bash
export ASPNETCORE_ENVIRONMENT=Development
export ConnectionStrings__DefaultConnection="Server=..."
export Jwt__Secret="your-secret-key"
```

### Production
```bash
export ASPNETCORE_ENVIRONMENT=Production
export ConnectionStrings__DefaultConnection="Server=..."
export Jwt__Secret="your-production-secret"
```

---

## 📖 Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Code Review Summary](./CODE_REVIEW_SUMMARY.md)
- [API Documentation](http://localhost:5000) (Swagger)
- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [EF Core Documentation](https://learn.microsoft.com/en-us/ef/core/)

---

## 🆘 Getting Help

### Common Issues
1. **"Cannot connect to database"** → Check connection string
2. **"Redis connection failed"** → Start Redis via docker-compose
3. **"Migration failed"** → Drop database and recreate
4. **"Port in use"** → Change port or kill process

### Support Channels
- **Email**: dev-team@starbucks.eg
- **Slack**: #backend-support
- **Documentation**: [Internal Wiki]

---

**Last Updated**: 2026-05-09  
**Version**: 1.0.0
