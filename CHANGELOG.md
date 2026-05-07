# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html)

---

## [2.1.0] — 2026-05-08

### Added
- 🧹 **Unified Data Architecture** — Consolidated all structural data sources into a single, type-safe `src/data/` directory.
- 🧭 **Unified Navigation Hook** — Created `useNavigation()` to merge redundant navbar and footer fetching logic.
- 📋 **Centralized Query Factory** — Optimized `src/lib/queryKeys.ts` with consolidated navigation configuration keys.

### Changed
- 🚀 **Tailwind CSS v4** — Re-migrated the entire project to Tailwind CSS v4 for modern features and performance.
- 📋 **Global Documentation Audit** — Comprehensive refresh of all `docs/*.md` and `README.md` to reflect the latest architectural standards.
- 🧹 **Clean Code Implementation** — Removed legacy fetcher aliases and redundant JSON file imports across components.

### Fixed
- 🌍 **Localization Consistency** — Eliminated remaining hardcoded strings in `HomePage.tsx` with proper `i18next` translations.
- 🔗 **Broken Documentation Links** — Removed stale references to non-existent README files in `docs/`.

---

## [2.0.0] — 2026-05-03

### Added
- 🌍 **Full i18n** — Arabic (RTL) + English (LTR) via i18next + react-i18next
- 🌑 **Dark Mode** — System-aware + manual toggle across all pages
- 📱 **PWA Support** — Offline-ready via vite-plugin-pwa
- 🧭 **React Router v7** — Full multi-page SPA routing
- 📄 **14 pages** — Menu, Rewards, Gift Cards, Delivery, Locations, About, Contact, Sustainability, Privacy, Terms, Cookie Notice, 404
- 🔍 **Search Modal** — Global search UI component
- 🔐 **Auth Modal** — Sign in / Sign up flow
- 💬 **Chat Widget** — AI support chat widget
- 🍪 **Cookie Consent** — GDPR-compliant banner with per-category preferences
- 📲 **Mobile Tab Bar** — Bottom navigation for mobile users
- 🛡️ **Security Workflows** — `security-audit.yml` (npm audit) + `stale.yml`
- 🤖 **Dependabot** — Weekly npm + GitHub Actions dependency updates
- 🔒 **CodeQL** — Static security analysis on push + weekly schedule
- 🐛 **Allergy Info component** — Dietary info display
- 📝 **SEO** — Per-page `<title>` and `<meta>` via react-helmet-async
- 🍞 **Toast notifications** — via Sonner

### Changed
- ⬆️ Upgraded Tailwind CSS from v4 → **v3.4.19** (stability fix)
- 🔧 Replaced `npm ci` with `npm install --legacy-peer-deps` in CI + Dockerfile
- 🐳 Dockerfile now copies `.npmrc` to resolve peer dependency conflicts
- 🧹 Fixed `useEffect` unused import in `CookieConsent.tsx`
- 📋 Fully rewrote `docs/ARCHITECTURE.md` to reflect current structure
- 📋 Updated `docs/PROJECT_SUMMARY.md` status to **PRODUCTION READY**
- 📋 README.md redesigned as a clean, styled hub with links to all docs

### Fixed
- Docker build failing due to out-of-sync `package-lock.json`
- GitHub Actions failing due to removed `vercel-action` (no token configured)
- ESLint error: unused `useEffect` import in `CookieConsent.tsx`

---

## [1.0.0] — 2026-05-02

### Added
- ✨ Initial release — React 19 + TypeScript + Vite + Tailwind CSS
- 🎯 Navbar (sticky, mobile drawer)
- 🖼️ Hero Banner with Framer Motion animations
- 📝 Statement Section
- 🎴 Featured Cards grid
- 🦶 Footer (multi-column + accordion mobile + country selector)
- 🎭 Framer Motion animations throughout
- 🧩 shadcn/ui component library (Button, Card, Sheet, Dialog, etc.)
- 🌐 RTL support
- 📱 Fully responsive, mobile-first design
- 🐳 Docker + Docker Compose + Nginx configuration
- 🔄 GitHub Actions CI/CD (`ci.yml`, `codeql.yml`)
- 📚 Documentation in `docs/`
- 📄 MIT License

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| **2.1.0** | 2026-05-08 | Tailwind v4, Data Centralization, Documentation Audit |
| **2.0.0** | 2026-05-03 | Full SPA, i18n, dark mode, PWA, 14 pages |
| **1.0.0** | 2026-05-02 | Initial release |

---

[2.1.0]: https://github.com/Mostafa-SAID7/starbucks/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Mostafa-SAID7/starbucks/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Mostafa-SAID7/starbucks/releases/tag/v1.0.0
[Unreleased]: https://github.com/Mostafa-SAID7/starbucks/compare/v2.1.0...HEAD
