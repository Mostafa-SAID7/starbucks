# 📂 Project Structure

Detailed folder organization and component categorization.

## Directory Tree

```text
src/
├── assets/              # Static assets (images, logos)
├── components/          # UI components
│   ├── accessibility/  # ARIA and screen reader helpers
│   ├── dev/            # Developer tools and debuggers
│   ├── error/          # Error boundaries and fallback UI
│   ├── layout/         # Shell components (Navbar, Footer, MainLayout)
│   ├── search/         # Global search functionality
│   ├── sections/       # Domain-specific UI sections
│   ├── skeletons/      # Content placeholders
│   ├── ui/             # Atomic primitives (Buttons, Inputs, etc.)
│   └── widgets/        # Floating/fixed tools (Chat, TabBar)
├── constants/           # Global app constants (Timeouts, IDs)
├── contexts/            # React Contexts (Theme, Auth, Language)
├── data/                # Content source (Bilingual JSON)
├── hooks/               # Custom hooks
│   └── queries/        # Server-state logic (TanStack Query)
├── lib/                 # Core configs (i18n, QueryClient, utils)
├── locales/             # i18next UI string translations
├── pages/               # Route-level page components
├── types/               # TypeScript interfaces & declarations
├── App.tsx              # Main routing & provider entry
├── index.css            # Tailwind CSS v4 entry
└── main.tsx             # DOM mount point
```

## Component Architecture

### 1. Atomic UI (`/ui`)
Stateless, theme-driven components following a modified shadcn/ui pattern. These form the base of the design system.

### 2. Layout Shell (`/layout`)
The `MainLayout` wraps the entire application, managing the lifecycle of the `Navbar` and `Footer`.

### 3. Feature Sections (`/sections`)
Larger, often stateful blocks used by `GenericPage` or dedicated pages (e.g., `CategoryGrid`, `HeroSection`).

---
*For the high-level design philosophy, see [ARCHITECTURE.md](ARCHITECTURE.md).*
