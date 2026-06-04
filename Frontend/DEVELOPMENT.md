# Development Setup Guide

## Environment Configuration

This project supports multiple development scenarios:

### Option 1: Full Stack Development (Frontend + Backend)

**Prerequisites:**
- .NET 9.0 SDK installed
- SQL Server or SQLite database configured

**Setup:**

1. **Start the Backend:**
   ```bash
   cd Backend/src/Starbucks.API
   dotnet run
   ```
   The backend will run on `http://localhost:8080`

2. **Configure Frontend:**
   
   The `.env.development` file is already configured to use `localhost:8080`:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

3. **Start the Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5000`

### Option 2: Frontend-Only Development (Using Production API)

If you don't want to run the backend locally, you can use the production API:

1. **Update `.env.local`:**
   
   Edit `Frontend/.env.local` and uncomment the production API line:
   ```env
   # VITE_API_URL=http://localhost:8080/api
   VITE_API_URL=http://starbucks.runasp.net/api
   ```

2. **Start the Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

### Option 3: Quick Switch Between Environments

Use `.env.local` (not tracked by git) for your personal setup:

**For Local Backend:**
```env
# Frontend/.env.local
VITE_API_URL=http://localhost:8080/api
```

**For Production Backend:**
```env
# Frontend/.env.local
VITE_API_URL=http://starbucks.runasp.net/api
```

## Environment Files Explained

| File | Purpose | Committed to Git? |
|------|---------|-------------------|
| `.env.example` | Template for environment variables | ✅ Yes |
| `.env.development` | Development defaults | ✅ Yes |
| `.env.production` | Production configuration | ✅ Yes |
| `.env.local` | Personal local overrides | ❌ No (gitignored) |

## Priority Order

Vite loads environment files in this order (later files override earlier ones):
1. `.env.development` (or `.env.production` for builds)
2. `.env.local`

## Verifying Your Setup

After starting the dev server, check the console output:
- If you see proxy errors (`ECONNREFUSED`), the backend is not running
- Either start the backend or switch to production API in `.env.local`

## Production Build

For production builds:
```bash
npm run build
```

This uses `.env.production` which points to `http://starbucks.runasp.net/api`

## Common Issues

### Issue: API proxy errors in development

**Solution:** Either:
1. Start the backend: `cd Backend/src/Starbucks.API && dotnet run`
2. Or use production API in `.env.local`

### Issue: CORS errors

**Solution:** Make sure the backend has CORS configured for `http://localhost:5000`

### Issue: Changes to .env files not taking effect

**Solution:** Restart the dev server (`Ctrl+C` then `npm run dev`)
