# 🚢 Deployment Guide

Complete guide for deploying the Starbucks Egypt React application to various platforms.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Build for Production](#build-for-production)
- [Deploy to Vercel](#deploy-to-vercel)
- [Deploy to Netlify](#deploy-to-netlify)
- [Deploy with Docker](#deploy-with-docker)
- [Deploy to AWS](#deploy-to-aws)
- [Environment Variables](#environment-variables)
- [Performance Optimization](#performance-optimization)

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Account on deployment platform

---

## Build for Production

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build locally
npm run preview
```

The build output will be in the `dist/` folder.

---

## Deploy to Vercel

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

---

## Deploy to Netlify

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

## Deploy to AWS

### AWS S3 + CloudFront

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create S3 bucket**:
   ```bash
   aws s3 mb s3://starbucks-eg-react
   ```

3. **Upload files**:
   ```bash
   aws s3 sync dist/ s3://starbucks-eg-react --delete
   ```

4. **Configure bucket for static hosting**:
   ```bash
   aws s3 website s3://starbucks-eg-react \
     --index-document index.html \
     --error-document index.html
   ```

5. **Create CloudFront distribution** (optional for CDN)

### AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

---

## Environment Variables

### Production Environment Variables

Create `.env.production`:

```env
VITE_APP_TITLE=Starbucks Egypt
VITE_API_URL=https://api.production.com
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Platform-Specific Setup

#### Vercel
```bash
vercel env add VITE_API_URL production
```

#### Netlify
```bash
netlify env:set VITE_API_URL "https://api.production.com"
```

#### Docker
```dockerfile
ENV VITE_API_URL=https://api.production.com
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

The project includes GitHub Actions workflows:

- **CI Pipeline** (`.github/workflows/ci.yml`): Runs on every push
- **Deploy Pipeline** (`.github/workflows/deploy.yml`): Deploys on main branch
- **Security Scan** (`.github/workflows/codeql.yml`): Weekly security analysis

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

---

## Checklist Before Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] Images optimized
- [ ] Meta tags updated
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Performance tested
- [ ] Mobile responsive verified

---

**Ready to deploy! 🚀**
