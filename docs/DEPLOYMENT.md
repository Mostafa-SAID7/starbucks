<div align="center">

# 🚢 Deployment Guide

**Complete guide for deploying all three applications (Frontend, Dashboard, Backend) and managing live environments.**

</div>

---

## 🚀 Live Production URLs

| Component | Environment | URL |
| :--- | :--- | :--- |
| **✨ Frontend** | Production | [starbucks73.vercel.app](https://starbucks73.vercel.app) |
| **📊 Dashboard** | Production | `https://dashboard.starbucks.eg` |
| **⚙️ Backend API** | Production | [starbucks.runasp.net/api](http://starbucks.runasp.net/api) |
| **📚 Swagger UI** | Swagger | [starbucks.runasp.net/swagger](http://starbucks.runasp.net/swagger) |

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Three-App Architecture](#three-app-architecture)
- [Frontend Deployment](#frontend-deployment)
- [Dashboard Deployment](#dashboard-deployment)
- [Backend Deployment](#backend-deployment)
- [Google OAuth Setup](#google-oauth-setup)
- [Environment Variables](#environment-variables)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Prerequisites

- Node.js 18+ (Frontend & Dashboard)
- .NET SDK 9.0 (Backend)
- npm or yarn
- Git
- Account on deployment platform (Vercel, Netlify, Azure, etc.)
- Google OAuth credentials configured

---

## Three-App Architecture

The Starbucks Egypt platform consists of three separate applications that work together:

```
┌─────────────────────────────────────────────────────────┐
│         Starbucks Egypt - Complete Platform            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (React 19)        Dashboard (Angular 18)     │
│  Port: 5173 / Vercel        Port: 4200 / Netlify      │
│  └─── Google OAuth          └─── Google OAuth         │
│  └─── TanStack Query        └─── HttpClient           │
│                                                        │
│  └──────────────→ Backend API (ASP.NET Core 9.0) ←───┘
│                     Port: 7082 / Azure/AWS
│                     OAuth Handler
│                     Image Server (/api/v1/images/)
│                     JWT Token Issuer
│
└─────────────────────────────────────────────────────────┘
```

---

## Build for Production

### Frontend Build
```bash
cd Frontend
npm install --legacy-peer-deps
npm run build
# Output: dist/
```

### Dashboard Build
```bash
cd Dashboard
npm install
ng build --configuration production
# Output: dist/starbucks-dashboard/
```

### Backend Build
```bash
cd Backend
dotnet restore
dotnet publish -c Release
# Output: bin/Release/net9.0/publish/
```

---

## Frontend Deployment

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Dashboard Deployment

### Deploy to Netlify

Dashboard can be deployed to Netlify using the Angular build output.

#### Option 1: Using Netlify CLI

```bash
cd Dashboard
npm install
ng build --configuration production

# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/starbucks-dashboard
```

#### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build Command**: `npm install && ng build --configuration production`
   - **Publish Directory**: `dist/starbucks-dashboard`
6. Set environment variables:
   - `NODE_VERSION=20`
7. Deploy

#### Option 3: Manual Upload

```bash
cd Dashboard
ng build --configuration production
# Upload dist/starbucks-dashboard/ to Netlify
```

### Environment Configuration for Dashboard

Dashboard requires environment configuration for production:

**Dashboard/src/environments/environment.prod.ts**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.starbucks.eg/api/v1',
  appName: 'Starbucks Egypt Admin',
  enableAnalytics: true,
  logLevel: 'error',
  googleOAuth: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: 'https://dashboard.starbucks.eg/auth/google/callback'
  },
  imageConfig: {
    apiBaseUrl: 'https://api.starbucks.eg/api/v1/images',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 5 * 1024 * 1024
  }
};
```

---

## Backend Deployment

### Option 1: Using Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Option 2: Using Drag & Drop

1. Build the project: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder

### Option 3: Using GitHub Integration

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
6. Click "Deploy site"

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

---

## Deploy with Docker

### Build Docker Image

```bash
# Build the image
docker build -t starbucks-eg-react .

# Run locally
docker run -d -p 3000:80 starbucks-eg-react

# Test
curl http://localhost:3000
```

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Push to Docker Hub

```bash
# Tag the image
docker tag starbucks-eg-react yourusername/starbucks-eg-react:latest

# Login to Docker Hub
docker login

# Push the image
docker push yourusername/starbucks-eg-react:latest
```

### Deploy to Server

```bash
# SSH into your server
ssh user@your-server.com

# Pull the image
docker pull yourusername/starbucks-eg-react:latest

# Run the container
docker run -d \
  --name starbucks-app \
  -p 80:80 \
  --restart unless-stopped \
  yourusername/starbucks-eg-react:latest
```

---

### Deploy to Azure App Service

```bash
cd Backend

# Create Azure App Service
az appservice plan create --name starbucks-api-plan --resource-group starbucks-rg --sku B1

# Create the app
az webapp create --resource-group starbucks-rg --plan starbucks-api-plan --name starbucks-api

# Configure OAuth environment variables
az webapp config appsettings set --resource-group starbucks-rg --name starbucks-api \
  --settings "Authentication__Google__ClientId=YOUR_CLIENT_ID" \
             "Authentication__Google__ClientSecret=YOUR_CLIENT_SECRET"

# Deploy
dotnet publish -c Release
# Use Azure DevOps or GitHub Actions for CI/CD
```

---

## Google OAuth Setup

### Prerequisites
1. Google Cloud Console project created
2. Google+ API enabled
3. OAuth 2.0 credentials (Web application) created
4. Redirect URIs registered for all three apps

### Production Redirect URIs

Register these URIs in [Google Cloud Console](https://console.cloud.google.com/):

```
https://starbucks.eg/auth/google/callback
https://dashboard.starbucks.eg/auth/google/callback
https://api.starbucks.eg/api/v1/auth/google-callback
```

### Configuration by Application

**Backend** (`appsettings.Production.json`):
```json
{
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID",
      "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
    }
  }
}
```

**Frontend** (`.env.production`):
```env
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_GOOGLE_OAUTH_REDIRECT_URI=https://starbucks.eg/auth/google/callback
```

**Dashboard** (`environment.prod.ts`):
```typescript
googleOAuth: {
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  redirectUri: 'https://dashboard.starbucks.eg/auth/google/callback'
}
```

---

## Frontend Deployment (Vercel)

### Environment Variables

#### Frontend (.env.production)
```env
VITE_APP_TITLE=Starbucks Egypt
VITE_API_URL=https://api.starbucks.eg/api/v1
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_OAUTH_REDIRECT_URI=https://starbucks.eg/auth/google/callback
```

#### Dashboard (environment.prod.ts)
```typescript
export const environment = {
  apiUrl: 'https://api.starbucks.eg/api/v1',
  googleOAuth: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: 'https://dashboard.starbucks.eg/auth/google/callback'
  },
  imageConfig: {
    apiBaseUrl: 'https://api.starbucks.eg/api/v1/images'
  }
};
```

#### Backend (appsettings.Production.json)
```json
{
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Your_Production_SQL_Connection_String"
  },
  "Redis": {
    "Connection": "Your_Redis_Connection_String"
  }
}
```

---

## Performance Optimization

### 1. Enable Compression

**Nginx** (already in `nginx.conf`):
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Cache Static Assets

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Optimize Images

```bash
# Install image optimization tools
npm install -D vite-plugin-imagemin

# Add to vite.config.ts
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: { plugins: [{ removeViewBox: false }] }
    })
  ]
})
```

### 4. Code Splitting

Vite automatically handles code splitting. For manual splitting:

```typescript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### 5. Analyze Bundle Size

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({ open: true })
  ]
})

# Build and analyze
npm run build
```

---

## Monitoring & Analytics

### Google Analytics

```typescript
// src/lib/analytics.ts
export const initGA = () => {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_TRACKING_ID}`
  document.head.appendChild(script)
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/react

# src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE
})
```

---

## CI/CD Pipeline

The project includes the following GitHub Actions workflows:

| Workflow | Trigger | Purpose |
|----------|---------|--------|
| `ci.yml` | push/PR to `main`, `develop` | Lint, TypeCheck, Build, Docker |
| `codeql.yml` | push/PR + weekly | Static security analysis |
| `security-audit.yml` | push to package files + weekly | npm vulnerability audit |
| `stale.yml` | daily | Close stale issues/PRs |

Vercel auto-deploys from `main` when the GitHub repo is connected — no manual deploy step required.

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Docker Issues

```bash
# Check logs
docker logs starbucks-app

# Rebuild without cache
docker build --no-cache -t starbucks-eg-react .
```

### Deployment Fails

1. Check environment variables
2. Verify build command
3. Check output directory
4. Review deployment logs

## Checklist Before Deployment

### For All Applications
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] OAuth redirect URIs registered in Google Cloud Console
- [ ] Git repository up to date

### Frontend
- [ ] Images optimized
- [ ] Meta tags updated with OG/Twitter tags
- [ ] Analytics configured
- [ ] Mobile responsive verified
- [ ] Vercel environment variables set

### Dashboard
- [ ] Angular build succeeds
- [ ] OAuth configuration verified
- [ ] Image configuration points to correct API
- [ ] Netlify environment variables set

### Backend
- [ ] Database migrations applied
- [ ] Redis connection configured
- [ ] OAuth credentials set (use secrets/key vault)
- [ ] Static files (images) deployed to wwwroot/
- [ ] Error tracking setup (Sentry)
- [ ] Monitoring configured

---

**Ready to deploy! 🚀**
