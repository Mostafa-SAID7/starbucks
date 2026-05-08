# Starbucks Egypt Backend API

A comprehensive ASP.NET Core Web API backend for the Starbucks Egypt application, built with Clean Architecture principles.

## 🏗️ Architecture

This project follows Clean Architecture with the following layers:

- **Domain**: Core business entities and enums
- **Application**: Business logic, CQRS commands/queries, DTOs, and interfaces
- **Infrastructure**: Data access, external services, and infrastructure concerns
- **API**: Controllers, middleware, and presentation layer

## 🚀 Features

### Core Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Menu Management**: Comprehensive menu system with categories, subcategories, and items
- **Location Services**: Store finder with filtering capabilities
- **Order Management**: Complete order processing system
- **User Management**: User profiles and loyalty program integration

### Technical Features
- **Clean Architecture**: Separation of concerns with dependency inversion
- **CQRS Pattern**: Command Query Responsibility Segregation using MediatR
- **Caching**: Redis integration for performance optimization
- **Logging**: Structured logging with Serilog
- **Rate Limiting**: API rate limiting for security and performance
- **Health Checks**: Monitoring endpoints for database and Redis
- **Security**: Comprehensive security headers and CORS configuration
- **Validation**: FluentValidation for input validation
- **Documentation**: Swagger/OpenAPI documentation

## 🛠️ Technology Stack

- **Framework**: ASP.NET Core 9.0
- **Database**: Entity Framework Core with SQL Server
- **Cache**: Redis with StackExchange.Redis
- **Authentication**: JWT Bearer tokens
- **Logging**: Serilog
- **Validation**: FluentValidation
- **Mapping**: Mapster
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- .NET 9.0 SDK
- SQL Server (LocalDB for development)
- Redis (optional, can use Docker)
- Docker & Docker Compose (for containerized deployment)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Backend
```

### 2. Setup Database
```bash
# Update connection string in appsettings.json
# Run migrations (when created)
dotnet ef database update --project src/StarbucksEgypt.Infrastructure --startup-project src/StarbucksEgypt.API
```

### 3. Setup Redis (Optional)
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis locally
```

### 4. Run the Application
```bash
# Development
dotnet run --project src/StarbucksEgypt.API

# Or using Docker Compose
docker-compose up -d
```

### 5. Access the API
- **API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000 (in development)
- **Health Checks**: http://localhost:5000/health

## 📁 Project Structure

```
Backend/
├── src/
│   ├── StarbucksEgypt.API/           # Presentation layer
│   │   ├── Controllers/              # API controllers
│   │   ├── Services/                 # API-specific services
│   │   ├── Program.cs               # Application entry point
│   │   └── appsettings.json         # Configuration
│   ├── StarbucksEgypt.Application/   # Application layer
│   │   ├── Common/                   # Shared application logic
│   │   ├── DTOs/                     # Data transfer objects
│   │   ├── Features/                 # CQRS commands and queries
│   │   └── Interfaces/               # Application interfaces
│   ├── StarbucksEgypt.Domain/        # Domain layer
│   │   ├── Entities/                 # Domain entities
│   │   ├── Enums/                    # Domain enumerations
│   │   └── Common/                   # Shared domain logic
│   └── StarbucksEgypt.Infrastructure/ # Infrastructure layer
│       ├── Data/                     # Database context and configurations
│       └── Services/                 # External service implementations
├── docker-compose.yml               # Docker composition
└── README.md                        # This file
```

## 🔧 Configuration

### Environment Variables
- `ConnectionStrings__DefaultConnection`: SQL Server connection string
- `ConnectionStrings__Redis`: Redis connection string
- `Jwt__Secret`: JWT signing secret (minimum 32 characters)
- `Jwt__Issuer`: JWT issuer
- `Jwt__Audience`: JWT audience

### Rate Limiting
Configure rate limits in `appsettings.json`:
```json
{
  "IpRateLimiting": {
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 100
      }
    ]
  }
}
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Menu
- `GET /api/menu/categories` - Get all menu categories
- `GET /api/menu/categories/{slug}` - Get category by slug
- `GET /api/menu/items/{id}` - Get menu item details
- `GET /api/menu/search` - Search menu items

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/{id}` - Get location by ID
- `GET /api/locations/cities/{city}` - Get locations by city
- `GET /api/locations/nearby` - Find nearby locations

### Health & Monitoring
- `GET /health` - Health check endpoint

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse and DDoS
- **CORS**: Configured for frontend origins
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Input Validation**: FluentValidation for all inputs
- **SQL Injection Protection**: Entity Framework parameterized queries

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale the API service
docker-compose up -d --scale api=3
```

### Production Considerations
- Update connection strings for production databases
- Configure proper JWT secrets
- Set up SSL certificates
- Configure logging levels
- Set up monitoring and alerting

## 🧪 Testing

```bash
# Run unit tests (when implemented)
dotnet test

# Run integration tests (when implemented)
dotnet test --filter Category=Integration
```

## 📝 Development Guidelines

### Adding New Features
1. Create domain entities in the Domain layer
2. Add DTOs in the Application layer
3. Implement CQRS commands/queries
4. Add controllers in the API layer
5. Update database configurations if needed

### Database Migrations
```bash
# Add migration
dotnet ef migrations add MigrationName --project src/StarbucksEgypt.Infrastructure --startup-project src/StarbucksEgypt.API

# Update database
dotnet ef database update --project src/StarbucksEgypt.Infrastructure --startup-project src/StarbucksEgypt.API
```

## 🤝 Contributing

1. Follow Clean Architecture principles
2. Use CQRS pattern for business operations
3. Add proper validation and error handling
4. Include unit tests for new features
5. Update documentation

## 📄 License

This project is proprietary software for Starbucks Egypt.

## 📞 Support

For technical support or questions, contact the development team.