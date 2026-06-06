# Starbucks Egypt — Digital Platform

A bilingual (Arabic/English) customer-facing web portal for Starbucks Egypt, built with React 19 + Vite + Tailwind CSS v4.

## Architecture

- **Frontend** (`/Frontend`): React 19 SPA — the active Replit app. Runs on port 5000.
- **Backend** (`/Backend`): .NET 9 Clean Architecture API — not running on Replit (requires SQL Server / Redis). The frontend gracefully falls back to mock data when the API is unavailable.
- **Dashboard** (`/dashboard`): Angular 19 admin portal — not running on Replit.

## Running the app

The "Start application" workflow runs `cd Frontend && npm run dev`, serving the React frontend on port 5000.

## Key notes

- The Vite dev server is configured with `host: "0.0.0.0"` and `allowedHosts: true` for Replit compatibility.
- API calls proxy to `http://localhost:8080` (the .NET backend). When the backend is absent, the app falls back to mock menu data automatically.
- Sentry DSN (`YOUR_SENTRY_DSN_HERE`) is a placeholder — replace it in `Frontend/src/main.tsx` with a real DSN if error tracking is needed.
- Google Maps API key is read from the `GOOGLE_API_KEY` environment secret.

## User preferences

- Keep existing project structure: Frontend / Backend / dashboard directories.
