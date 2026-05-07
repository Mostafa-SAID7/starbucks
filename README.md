<div align="center">

<img src="public/favicon.svg" alt="Starbucks Logo" width="100" height="100">

# ☕ Starbucks Egypt — React Clone

> A pixel-perfect, bilingual (Arabic/English) clone of the official Starbucks Egypt website.

[![CI](https://github.com/Mostafa-SAID7/starbucks/actions/workflows/ci.yml/badge.svg)](https://github.com/Mostafa-SAID7/starbucks/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Mostafa-SAID7/starbucks/actions/workflows/codeql.yml/badge.svg)](https://github.com/Mostafa-SAID7/starbucks/actions/workflows/codeql.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-006241)](LICENSE)

**[🌐 Live Demo](https://starbucks-eg-react.vercel.app)** &nbsp;•&nbsp;
**[📚 Docs](docs/)** &nbsp;•&nbsp;
**[🐛 Report Bug](https://github.com/Mostafa-SAID7/starbucks/issues)** &nbsp;•&nbsp;
**[✨ Request Feature](https://github.com/Mostafa-SAID7/starbucks/issues)**

</div>

---

## 📖 About

**Starbucks Egypt** is a full-stack-ready, production-grade frontend built as a faithful recreation of [www.starbucks.eg](https://www.starbucks.eg). It demonstrates how to build a real-world, enterprise-scale React application complete with internationalisation, accessibility, dark mode, PWA support, and a full CI/CD pipeline.

### What this project covers

- **Bilingual UX** — seamless switching between Arabic (right-to-left) and English (left-to-right), with all copy stored in structured JSON data files.
- **14 pages** — Home, full Menu with category and item views, Rewards, Gift Cards, Delivery, Locations, About, Contact, Sustainability, Privacy, Terms, and Cookie Notice.
- **Persistent shell** — Sticky Navbar, Footer, Cookie Consent banner, Auth Modal, Search Modal, AI Chat Widget, and a Mobile Tab Bar, all rendered via a shared `MainLayout`.
- **Modern design** — Framer Motion scroll & hover animations, Starbucks brand colours, Cairo typeface, glassmorphism effects, and a complete dark mode.
- **Production infrastructure** — Multi-stage Docker build (Node → Nginx), docker-compose, `nginx.conf`, GitHub Actions CI (lint → type-check → build → Docker), CodeQL, npm audit, Dependabot, and Vercel auto-deploy.

> This project is an **educational clone** built to demonstrate modern frontend engineering practices. It is not affiliated with or endorsed by Starbucks Corporation.

---

## ✨ Highlights

| | |
|--|--|
| 🌍 **Bilingual** | Full Arabic (RTL) + English (LTR) with i18next |
| 🌑 **Dark Mode** | System-aware dark theme across all pages |
| 📱 **PWA** | Installable, offline-ready progressive web app |
| 🧹 **Clean Data** | Centralized, type-safe data layer in `src/data/` |
| ⚡ **Optimized** | TanStack Query v5 for efficient data fetching |
| 🛡️ **Secure** | CodeQL + npm audit CI checks on every push |
| 🐳 **Dockerised** | Multi-stage Nginx Docker image included |

---

## 📦 Pages & Features

| Route | Page | Features |
|-------|------|----------|
| `/` | Home | Hero banner, Statement, Featured Cards |
| `/menu` | Menu | Categories grid + item detail pages |
| `/rewards` | Rewards | Loyalty programme info |
| `/gift-cards` | Gift Cards | Gift card catalogue |
| `/delivery` | Delivery | Delivery zones & info |
| `/locations` | Locations | Store finder |
| `/about-us` | About Us | Brand story |
| `/contact-us` | Contact | Contact form |
| `/sustainability` | Sustainability | Social impact |

**Persistent UI:** Navbar · Footer · Cookie Consent · Auth Modal · Chat Widget · Mobile Tab Bar

---

## 🚀 Quick Start

```bash
git clone https://github.com/Mostafa-SAID7/starbucks.git
cd starbucks
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — done! ☕

> **Full setup guide:** [docs/QUICK_START.md](docs/QUICK_START.md)

---

## 🐳 Docker

```bash
# Build & run
docker-compose up -d

# Access at
open http://localhost:3000
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **UI** | React 19 + TypeScript 6 |
| **Build** | Vite 8 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Data Fetching** | TanStack Query 5 |
| **Animation** | Framer Motion 12 |
| **Routing** | React Router 7 |
| **i18n** | i18next + react-i18next |
| **Icons** | Lucide React |
| **PWA** | vite-plugin-pwa |
| **Toasts** | Sonner |
| **SEO** | react-helmet-async |
| **Infra** | Docker + Nginx |

---

## 🔧 Available Scripts

```bash
npm run dev          # Start dev server → http://localhost:5173
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript type check
```

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mostafa-SAID7/starbucks)

Vercel auto-deploys on every push to `main` — no extra config needed when your repo is connected.

### Docker

```bash
docker build -t starbucks-eg-react .
docker run -d -p 3000:80 starbucks-eg-react
```

> **Full deployment guide:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🔐 Security & CI

Every push and PR automatically runs:

| Check | Workflow |
|-------|----------|
| Lint + TypeCheck + Build | `ci.yml` |
| Static code analysis | `codeql.yml` |
| npm vulnerability audit | `security-audit.yml` |
| Stale issue management | `stale.yml` |
| Dependency updates | `dependabot.yml` (weekly) |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [⚡ Quick Start](docs/QUICK_START.md) | Get running in 3 steps |
| [🏗️ Architecture](docs/ARCHITECTURE.md) | Data layer, hooks, and component patterns |
| [🚀 Query Guide](docs/TANSTACK_QUERY_GUIDE.md) | In-depth guide to the data-fetching layer |
| [🚢 Deployment](docs/DEPLOYMENT.md) | Vercel, Docker, Nginx guides |
| [📊 Project Summary](docs/PROJECT_SUMMARY.md) | Feature checklist & tech overview |
| [📝 Changelog](CHANGELOG.md) | Version history |
| [🤝 Contributing](CONTRIBUTING.md) | How to contribute |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ · [Back to top ↑](#-starbucks-egypt--react-clone)

</div>
