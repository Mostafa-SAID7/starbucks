# 🏗️ Project Architecture

## Overview

Starbucks Egypt React is a full-featured, bilingual (Arabic/English) SPA built with React 19 + TypeScript + Vite. It uses file-based component organisation, data-driven JSON content, React Router v7 for navigation, and i18next for RTL-aware internationalisation.

---

## 📊 Application Tree

```
main.tsx
└── App.tsx  (BrowserRouter + HelmetProvider + I18nProvider)
    ├── MainLayout
    │   ├── Navbar
    │   │   ├── Logo
    │   │   ├── Desktop Nav Links (i18n)
    │   │   ├── Search Modal
    │   │   ├── Auth Modal
    │   │   └── Mobile Drawer
    │   ├── <Outlet />  ──► Page components (see Pages section)
    │   ├── MobileTabBar  (bottom nav on mobile)
    │   ├── ChatWidget
    │   ├── CookieConsent
    │   └── Footer
    │       ├── Multi-column link groups
    │       ├── Accordion (mobile)
    │       └── Country Selector
    └── NotFound (404)
```

---

## 📁 Folder Structure

```
src/
├── components/          # Shared presentational components
│   ├── ui/             # Primitive UI building blocks (shadcn/ui style)
│   │   ├── accordion.tsx
│   │   ├── banner.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── featured-cards.tsx
│   │   ├── hero-banner.tsx
│   │   ├── inner-header.tsx
│   │   ├── modal.tsx
│   │   ├── search-modal.tsx
│   │   ├── textarea.tsx
│   │   ├── tooltip.tsx
│   │   ├── toaster.tsx
│   │   ├── vertical-card.tsx
│   │   └── index.ts    # Barrel exports
│   ├── AllergyInfo.tsx
│   ├── AuthModal.tsx
│   ├── ChatWidget.tsx
│   ├── CookieConsent.tsx
│   ├── FeaturedCards.tsx
│   ├── Footer.tsx
│   ├── InnerHeader.tsx
│   ├── MobileTabBar.tsx
│   ├── Navbar.tsx
│   ├── StatementSection.tsx
│   └── index.ts        # Barrel exports
├── data/               # JSON content files (bilingual ar/en)
│   ├── cookie-notice.json
│   ├── footer.json
│   ├── hero.json
│   ├── navbar.json
│   ├── pages.json
│   └── index.ts        # Re-exports all data
├── layouts/
│   └── MainLayout.tsx  # Persistent shell (Navbar + Footer + widgets)
├── pages/              # Route-level page components
│   ├── AboutUsPage.tsx
│   ├── ContactUsPage.tsx
│   ├── CookieNoticePage.tsx
│   ├── DeliveryPage.tsx
│   ├── GiftCardsPage.tsx
│   ├── HomePage.tsx
│   ├── LocationsPage.tsx
│   ├── MenuCategoryPage.tsx
│   ├── MenuItemPage.tsx
│   ├── NotFound.tsx
│   ├── PrivacyStatementPage.tsx
│   ├── RewardsPage.tsx
│   ├── SustainabilityPage.tsx
│   ├── TermsOfUsePage.tsx
│   └── index.ts        # Barrel exports
├── types/
│   └── index.ts        # Shared TypeScript interfaces & types
├── App.tsx             # Router config + top-level providers
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind directives
```

---

## 🛣️ Routing

Uses **React Router v7** with a single `MainLayout` shell and page-specific `<Outlet />` rendering.

| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/menu` | `MenuCategoryPage` |
| `/menu/:id` | `MenuItemPage` |
| `/rewards` | `RewardsPage` |
| `/gift-cards` | `GiftCardsPage` |
| `/delivery` | `DeliveryPage` |
| `/locations` | `LocationsPage` |
| `/about-us` | `AboutUsPage` |
| `/contact-us` | `ContactUsPage` |
| `/sustainability` | `SustainabilityPage` |
| `/privacy-statement` | `PrivacyStatementPage` |
| `/terms-of-use` | `TermsOfUsePage` |
| `/cookie-notice` | `CookieNoticePage` |
| `*` | `NotFound` |

---

## 🌐 Internationalisation (i18n)

- **Library**: `i18next` + `react-i18next`
- **Languages**: Arabic (`ar`) and English (`en`)
- **Direction**: `document.dir` toggled between `rtl` / `ltr` on language switch
- **Content**: All page copy lives in `/src/data/*.json` with `ar` / `en` keys
- **SEO**: `react-helmet-async` manages `<html lang>` and `<title>` per page

---

## 🎨 Design System

### Colors
```js
starbucks: {
  green: '#006241',   // Primary brand
  dark:  '#1e3932',   // Hover / dark green
  gold:  '#cba258',   // Accent
  cream: '#f9f5f0',   // Light background
}
```

### Typography
- **Font**: Cairo (Google Fonts) — supports Arabic & Latin scripts
- **Weights**: 300 400 500 600 700 800
- **Direction**: Automatic via `dir` attribute

### Animations
All animations use **Framer Motion**:

| Pattern | Usage |
|---------|-------|
| `initial / animate` | Entrance animations |
| `whileInView` | Scroll-triggered reveals |
| `whileHover` | Interactive hover effects |
| `AnimatePresence` | Conditional mount/unmount |
| `layout` | Smooth layout transitions |

---

## 📦 Data Flow

```
JSON Data Files  →  src/data/index.ts  →  Component props
i18n language    →  data[lang]         →  Rendered text
User interaction →  useState / events  →  UI updates
React Router     →  URL change         →  Page swap via <Outlet>
```

---

## 🔐 State Management

All state is local — no global store is required at this scale:

| Component | State |
|-----------|-------|
| Navbar | `isOpen` (mobile drawer), `showSearch` |
| Footer | `openSection` (accordion), `showCountries` |
| AuthModal | `tab` (sign-in / register) |
| CookieConsent | `visible`, `showPrefs`, `prefs` |
| ChatWidget | `isOpen`, `messages`, `input` |

---

## 🔧 CI/CD & GitHub Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push/PR to `main`, `develop` | Lint, TypeCheck, Build, Docker |
| `codeql.yml` | push/PR + weekly schedule | Static security analysis |
| `security-audit.yml` | push to `package.json` + weekly | NPM vulnerability audit |
| `stale.yml` | daily schedule | Close stale issues/PRs |
| `dependabot.yml` | weekly | Automated dependency PRs |

---

## 🎯 Performance Optimisations

1. **Code Splitting** — Vite automatic chunk splitting per route
2. **Tree Shaking** — Unused exports eliminated at build time
3. **Image Optimisation** — WebP assets, `loading="lazy"` on off-screen images
4. **Tailwind Purge** — Only used CSS classes included in production bundle
5. **PWA** — `vite-plugin-pwa` adds offline support and installability
6. **Framer Motion** — Hardware-accelerated CSS transforms (no layout thrash)

---

## ✅ Best Practices

1. ✅ **Component Composition** — Small, single-responsibility components
2. ✅ **Full TypeScript** — All props, state, and data are typed
3. ✅ **Accessibility** — Semantic HTML, ARIA roles, focus management
4. ✅ **RTL-aware layout** — Logical CSS properties used throughout
5. ✅ **SEO** — Unique `<title>` and `<meta description>` per page
6. ✅ **Data-driven** — Content in JSON; zero hardcoded strings in TSX
7. ✅ **Barrel exports** — Clean imports via `index.ts` files
8. ✅ **Docker** — Multi-stage Nginx build for lean production image
9. ✅ **Automated security** — CodeQL + npm audit on every dependency change
10. ✅ **Documentation** — This `docs/` folder kept in sync with the codebase

---

**Built for scale, accessibility, and maintainability. 🚀**
