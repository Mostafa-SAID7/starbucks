# Starbucks Egypt - Enterprise Full-Stack Application

A modern, enterprise-grade full-stack application for Starbucks Egypt, featuring a React frontend with ASP.NET Core backend, built with scalability, security, and maintainability in mind.

## 🏗️ Architecture Overview

This application follows **Clean Architecture** principles with clear separation of concerns:

### Frontend (React + TypeScript)
- **Modern React 19** with TypeScript for type safety
- **TanStack Query** for server state management
- **Zustand** for client state management
- **i18next** for internationalization (Arabic/English)
- **Tailwind CSS** with shadcn/ui for styling
- **Vite** for build tooling and development

### Backend (ASP.NET Core)
- **Clean Architecture** with Domain, Application, Infrastructure, and API layers
- **Entity Framework Core** with SQL Server
- **JWT Authentication** with role-based authorization
- **Redis** for caching and session management
- **Serilog** for structured logging
- **FluentValidation** for input validation
- **Swagger/OpenAPI** for API documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- .NET 9 SDK
- SQL Server (or Docker)
- Redis (or Docker)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd starbucks-egypt
   ```

2. **Start Backend Services**
   ```bash
   cd Backend
   docker-compose up -d  # Starts SQL Server & Redis
   dotnet restore
   dotnet run --project src/StarbucksEgypt.API
   ```

3. **Start Frontend**
   ```bash
   cd Frontend
   npm install --legacy-peer-deps
   cp .env.example .env
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger

## 📁 Project Structure

```
starbucks-egypt/
├── Backend/                          # ASP.NET Core Backend
│   ├── src/
│   │   ├── StarbucksEgypt.API/       # Presentation Layer
│   │   ├── StarbucksEgypt.Application/ # Application Layer (CQRS)
│   │   ├── StarbucksEgypt.Domain/    # Domain Layer (Entities)
│   │   └── StarbucksEgypt.Infrastructure/ # Infrastructure Layer
│   ├── docker-compose.yml           # Development services
│   └── Dockerfile                   # Backend containerization
├── Frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utilities and configurations
│   │   ├── contexts/                # React contexts
│   │   └── test/                    # Test utilities and mocks
│   ├── public/                      # Static assets
│   └── docs/                        # Documentation
└── README.md                        # This file
```

## 🔧 Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Customer, Employee, Manager, Admin, SuperAdmin)
- Secure password hashing with BCrypt
- Session management with Redis

### 🌍 Internationalization
- Full Arabic and English support
- RTL/LTR layout switching
- Localized content management
- Bilingual data structures

### 📱 Progressive Web App
- Service Worker for offline functionality
- App-like experience on mobile devices
- Push notifications support
- Installable on devices

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark/Light theme support
- Smooth animations with Framer Motion
- Accessible components following WCAG guidelines

### ⚡ Performance Optimizations
- Code splitting and lazy loading
- Image optimization and caching
- Bundle size optimization
- Redis caching for API responses

### 🧪 Testing Strategy
- Unit tests with Vitest and React Testing Library
- Integration tests for API endpoints
- E2E tests with Playwright (planned)
- 80%+ code coverage requirement

### 📊 Monitoring & Observability
- Structured logging with Serilog
- Health checks for dependencies
- Performance monitoring
- Error tracking and reporting

## 🛠️ Development

### Frontend Development

```bash
cd Frontend

# Development server
npm run dev

# Run tests
npm run test
npm run test:coverage
npm run test:ui

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Backend Development

```bash
cd Backend

# Restore packages
dotnet restore

# Run development server
dotnet run --project src/StarbucksEgypt.API

# Run tests
dotnet test

# Build for production
dotnet build --configuration Release

# Database migrations
dotnet ef migrations add <MigrationName> --project src/StarbucksEgypt.Infrastructure
dotnet ef database update --project src/StarbucksEgypt.Infrastructure
```

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Environment Variables**
   ```bash
   VITE_API_URL=https://api.starbucks.eg/api
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_ERROR_REPORTING=true
   ```

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node Version: 20

### Backend Deployment (Azure/AWS)

1. **Environment Variables**
   ```bash
   ConnectionStrings__DefaultConnection=<sql-server-connection>
   ConnectionStrings__Redis=<redis-connection>
   JwtSettings__SecretKey=<jwt-secret>
   JwtSettings__Issuer=https://api.starbucks.eg
   ```

2. **Docker Deployment**
   ```bash
   docker build -t starbucks-egypt-api .
   docker run -p 5000:5000 starbucks-egypt-api
   ```

## 🔒 Security

### Frontend Security
- Content Security Policy (CSP) headers
- XSS protection
- CSRF protection
- Secure token storage
- Input validation and sanitization

### Backend Security
- JWT with secure secrets
- Rate limiting
- SQL injection protection via EF Core
- CORS configuration
- Security headers
- Input validation with FluentValidation

## 📈 Performance

### Frontend Performance
- Bundle size: < 2MB gzipped
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Backend Performance
- API response time: < 200ms (95th percentile)
- Database query optimization
- Redis caching for frequently accessed data
- Connection pooling

## 🧪 Testing

### Frontend Tests
```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test AuthModal.test.tsx

# Run tests in watch mode
npm run test:watch
```

### Backend Tests
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test tests/StarbucksEgypt.Application.Tests
```

## 📚 API Documentation

The API is fully documented with Swagger/OpenAPI:
- **Development**: http://localhost:5000/swagger
- **Production**: https://api.starbucks.eg/swagger

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

#### Menu
- `GET /api/menu/categories` - Get all menu categories
- `GET /api/menu/categories/{id}` - Get specific category
- `GET /api/menu/items/{id}` - Get menu item details
- `GET /api/menu/search` - Search menu items

#### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/nearby` - Get nearby locations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript/C# coding conventions
- Write tests for new features
- Maintain 80%+ code coverage
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core authentication system
- ✅ Menu browsing functionality
- ✅ Location finder
- ✅ Responsive design
- ✅ Internationalization

### Phase 2 (Next)
- 🔄 Order management system
- 🔄 Payment integration
- 🔄 Loyalty program
- 🔄 Push notifications
- 🔄 Admin dashboard

### Phase 3 (Future)
- 📋 Real-time order tracking
- 📋 Mobile app (React Native)
- 📋 Advanced analytics
- 📋 AI-powered recommendations
- 📋 Microservices architecture

---

**Built with ❤️ by the Starbucks Egypt Development Team**