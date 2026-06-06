<div align="center">

# 🏗️ Architecture & Design

**Detailed technical overview of the Starbucks Egypt engineering patterns, system design, and project structure.**

</div>

---

## 1. State Management Strategy

The application employs a **Dual-State** architecture to separate local UI interactions from persistent server data:

### Server State (TanStack Query)
- **Source of Truth:** Asynchronous data from the Backend API.
- **Logic:** Custom hooks in `src/hooks/queries/` wrap `useQuery` to provide typed, cached data.
- **Caching:** We use a stale-while-revalidate strategy. Static content (About, Sustainability) is cached for 24h, while dynamic content (Menu) is cached for 1h.

### UI State (Context & Hooks)
- **Navigation:** Managed via `useNavigation` to sync route changes with UI elements.
- **Theme:** `useTheme` manages the Light/Dark mode preference in `localStorage`.
- **Language:** `i18next` context handles the global `ar`/`en` toggle.
- **Global State:** `Zustand` is used for client-side state like shopping cart and user preferences.

---

## 2. The "Bilingual Data" Pattern

To avoid duplicated logic for Arabic and English, all data follows a **Normalized Bilingual Schema**:

```typescript
interface BilingualData<T> {
  en: T;
  ar: T;
}
```

- **Fetching:** Component requests data via `useQuery`.
- **Resolution:** The UI resolves content using `data[i18n.language]`.
- **Fallback:** If a language key is missing, the system defaults to English to prevent blank screens.

---

## 3. System Design Diagrams

### Application Hierarchy
```mermaid
graph TD
    A[main.tsx] --> B[App.tsx]
    B --> C[MainLayout]
    C --> D[Navbar]
    C --> E[Outlet / Page Components]
    C --> F[Footer]
    E --> G[HomePage]
    E --> H[MenuPage]
    E --> I[LocationsPage]
```

### Data Lifecycle Flow
```mermaid
sequenceDiagram
    participant UI as Component
    participant Q as TanStack Query
    participant F as API Service
    participant B as Backend API
    
    UI->>Q: useQuery(key)
    Note over Q: 1. Search Memory Cache
    alt Data found & fresh
        Q-->>UI: return cached data
    else Data stale or missing
        Q->>F: trigger fetcher()
        F->>B: async GET /api/v1/...
        B-->>F: return JSON result
        F-->>Q: return typed result
        Q->>Q: Commit to Cache
        Q-->>UI: trigger re-render
    end
```

---

## 5. Image Management Architecture

### Image Centralization Strategy
All product and content images are served through the Backend API to provide:
- **Single Source of Truth**: All images stored in `Backend/src/Starbucks.API/wwwroot/images/`
- **Unified Access**: Images served via `/api/v1/images/*` endpoints
- **Performance**: Static file caching via `UseStaticFiles()` middleware
- **SEO**: Proper meta tags with local image URLs

### Image Flow Diagram
```mermaid
graph LR
    A[Frontend/Dashboard] -->|Request Image| B[Backend API]
    B -->|UseStaticFiles Middleware| C[wwwroot/images/]
    C -->|Serve Static File| B
    B -->|Return Image| A
    D[MenuCategorySeeder] -->|Update Image Paths| B
```

### Image Organization
```
Backend/wwwroot/images/
├── home/              (Homepage images)
├── menu/              (Menu category images)
├── statics/           (Static page content)
├── sustainability/    (Sustainability content)
└── [Other Categories]
```

---

## 6. Authentication & OAuth Architecture

### Three-Layer OAuth Implementation
```mermaid
graph TD
    A[Google OAuth] -->|Credentials| B[Backend: appsettings.OAuth.json]
    A -->|Client ID| C[Frontend: .env]
    A -->|Client ID| D[Dashboard: environment.ts]
    B -->|JWT Token| C
    B -->|JWT Token| D
```

### Configuration by Layer
1. **Backend** (`appsettings.OAuth.json`):
   - Stores Google Client ID and Secret
   - Validates OAuth tokens
   - Issues JWT tokens to Frontend/Dashboard

2. **Frontend** (`.env.production`):
   - Google OAuth Client ID
   - Redirect URI: `http://localhost:5173/auth/google/callback`
   - Uses Google Sign-In button

3. **Dashboard** (`environment.ts`):
   - Google OAuth Client ID
   - Redirect URI: `http://localhost:4200/auth/google/callback`
   - Uses Angular OAuth service

---

## 7. Project Structure (Updated)

### Frontend Directory Tree
```text
src/
├── assets/              # Static assets (images, logos)
├── components/          # UI components
│   ├── accessibility/   # ARIA and screen reader helpers
│   ├── layout/          # Shell components (Navbar, Footer, MainLayout)
│   ├── sections/        # Domain-specific UI sections
│   ├── skeletons/       # Content placeholders
│   └── ui/              # Atomic primitives (Buttons, Inputs, etc.)
├── constants/           # Global app constants
├── contexts/            # React Contexts (Theme, Auth, Language)
├── hooks/               # Custom hooks & TanStack queries
├── lib/                 # Core configs (i18n, QueryClient)
├── pages/               # Route-level page components
├── services/            # API services and configurations
└── types/               # TypeScript interfaces
```

### Backend Architecture
The backend follows **Clean Architecture** with four distinct layers:
1. **Domain:** Enterprise logic and entities.
2. **Application:** Business logic, CQRS (MediatR), and DTOs.
3. **Infrastructure:** Data access (EF Core), Redis, OAuth, and external services.
4. **API:** Entry point, controllers, middleware, and static file serving (`wwwroot/images/`).

**Key Services**:
- `FilesController`: Handles image requests and file operations
- `TokenService`: JWT token generation and validation
- `AuthController`: OAuth flow and user authentication

---

<div align="center">
  <b>Related Documents</b> <br/>
  <a href="DEVELOPMENT.md">DEVELOPMENT.md</a> &nbsp;&bull;&nbsp; <a href="FEATURES.md">FEATURES.md</a>
</div>
