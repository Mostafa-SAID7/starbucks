<div align="center">

# 🛠️ Development Guide

**Guidelines for setting up the development environment, technology stack, and coding standards.**

</div>

---

## 1. Prerequisites

Before starting, ensure your local machine is equipped with the following:

- **Node.js**: v20 or higher
- **.NET SDK**: v9.0 or higher
- **SQL Server**: Local instance or Docker container
- **Redis**: Local instance or Docker container (optional for dev)
- **Git**: For version control

---

## 2. Quick Start

### 0. Prerequisites Setup
Ensure you have Google OAuth credentials configured:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create or select a project
- Get OAuth 2.0 credentials (Web application)
- Set redirect URIs for all three applications (see OAuth Configuration section below)

### 1. Clone & Prepare
```bash
git clone <repository-url>
cd starbucks-eg-react
```

### 2. Backend Setup
```bash
cd Backend

# Start infrastructure via Docker
docker-compose up -d

# Build and Run
dotnet restore
dotnet run --project src/Starbucks.API
```
> The API runs on `https://localhost:7082` by default.
> Static images are served from `/api/v1/images/` endpoints.

### 3. Frontend Setup
```bash
cd Frontend
npm install --legacy-peer-deps
cp .env.example .env
# Update VITE_GOOGLE_OAUTH_CLIENT_ID in .env with your credentials
npm run dev
```
> The UI runs on `http://localhost:5173` by default.

### 4. Dashboard Setup
```bash
cd Dashboard
npm install
# environment.ts and environment.prod.ts are pre-configured with OAuth
ng serve
```
> The Dashboard runs on `http://localhost:4200` by default.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **State Management**: TanStack Query (Server), Zustand (Client)
- **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **Form Handling**: React Hook Form + Zod
- **i18n**: i18next
- **Authentication**: Google OAuth 2.0

### Dashboard
- **Framework**: Angular 18+
- **Language**: TypeScript
- **Styling**: Angular Material + Tailwind CSS
- **HTTP Client**: HttpClient
- **Authentication**: Google OAuth 2.0
- **Environment Configuration**: environment.ts, environment.prod.ts

### Backend
- **Framework**: ASP.NET Core 9.0
- **Database**: SQL Server (EF Core)
- **Caching**: Redis
- **Patterns**: CQRS with MediatR, Repository Pattern, Clean Architecture
- **Validation**: FluentValidation
- **Logging**: Serilog
- **Authentication**: JWT + Google OAuth 2.0
- **Static Files**: wwwroot/images/ served via UseStaticFiles middleware

---

## 6. Image Management

### Image Storage & Structure
All product and content images are centralized in the Backend:

**Storage Location**: `Backend/src/Starbucks.API/wwwroot/images/`

**Organization**:
```
wwwroot/images/
├── home/              # Homepage images
│   ├── banner/        # Hero section backgrounds
│   ├── deliver.webp
│   └── record.webp
├── menu/              # Menu category images
│   ├── drinks.webp
│   ├── food.webp
│   └── Menu.webp
├── statics/           # Static page images
├── sustainability/    # Sustainability initiative images
├── logo.png
└── favicon.svg
```

### Serving Images
- Backend serves static files via `UseStaticFiles()` middleware
- All images accessible via `/api/v1/images/*` endpoints
- Frontend references images using relative paths: `/api/v1/images/menu/drinks.webp`
- Dashboard configured with `imageConfig.apiBaseUrl` in environment files

### Image Optimization
- Supported formats: JPG, JPEG, PNG, WebP
- Max file size: 5MB
- WebP format preferred for performance
- SEO meta tags include OG and Twitter image tags pointing to `/api/v1/images/logo.png`

### Configuration
**Frontend** (`src/`): Uses relative paths `/api/v1/images/*`
**Dashboard** (`environment.ts`):
```typescript
imageConfig: {
  apiBaseUrl: 'http://localhost:8080/api/v1/images',
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  maxFileSize: 5 * 1024 * 1024 // 5MB
}
```

---

## 7. Google OAuth Configuration

### Setup Steps
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:

**Development Redirect URIs**:
```
http://localhost:5173/auth/google/callback       (Frontend)
http://localhost:4200/auth/google/callback       (Dashboard)
http://localhost:8080/api/v1/auth/google-callback (Backend)
```

**Production Redirect URIs**:
```
https://starbucks.eg/auth/google/callback
https://dashboard.starbucks.eg/auth/google/callback
https://api.starbucks.eg/api/v1/auth/google-callback
```

### Implementation
- **Backend**: Credentials in `appsettings.OAuth.json`
- **Frontend**: Client ID in `.env.production` as `VITE_GOOGLE_OAUTH_CLIENT_ID`
- **Dashboard**: Client ID and redirect URI in `environment.ts` and `environment.prod.ts`

---

<div align="center">
  <b>Related Documents</b> <br/>
  <a href="ARCHITECTURE.md">ARCHITECTURE.md</a> &nbsp;&bull;&nbsp; <a href="FEATURES.md">FEATURES.md</a>
</div>
