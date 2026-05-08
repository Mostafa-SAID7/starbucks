# 🏗️ System Design

Visual flow and application logic diagrams.

## Application Hierarchy
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

## Data Lifecycle Flow
```mermaid
sequenceDiagram
    participant UI as Component
    participant Q as TanStack Query
    participant F as Fetcher
    participant D as JSON Data
    
    UI->>Q: useQuery(key)
    Note over Q: 1. Search Memory Cache
    alt Data found & fresh
        Q-->>UI: return cached data
    else Data stale or missing
        Q->>F: trigger fetcher()
        F->>D: async import(json)
        D-->>F: return data[lang]
        F-->>Q: return typed result
        Q->>Q: Commit to Cache
        Q-->>UI: trigger re-render
    end
```

## Route Resolution Logic
1. **Request:** User hits `/en/menu`.
2. **Layout:** `MainLayout` detects `lang` change, triggers `i18next.changeLanguage()`.
3. **Pillars:** `document.dir` flips to `ltr`; CSS logical properties adjust layout.
4. **Content:** `MenuPage` fetches data via `useQuery(['menu'])`.
5. **SEO:** `react-helmet-async` injects `<title>Starbucks Menu</title>`.

---
*For folder organization, see [STRUCTURE.md](STRUCTURE.md).*
