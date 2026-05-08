# 🛠️ Project Setup & Quick Start

## Prerequisites
- **Node.js:** 20.x or higher (LTS recommended)
- **npm:** 10.x or higher
- **Docker:** (Optional) for containerized local testing

---

## 1. Local Installation

```bash
# Clone the repository
git clone https://github.com/Mostafa-SAID7/starbucks.git
cd starbucks

# Install dependencies (flag required for PWA plugin)
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env
```

---

## 2. Development

```bash
# Start Vite dev server
npm run dev
# → http://localhost:5173
```

### Available Scripts
| Command | Action |
|---------|--------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Generate production bundle in `/dist` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint static analysis |
| `npx tsc --noEmit` | Run TypeScript type check |

---

## 3. Docker (Optional)

```bash
# Build and run containers
docker-compose up -d
# → http://localhost:3000
```

---

## 💡 Development Tips
- **Language Switch:** Content is fetched based on `i18n.language`. Data resides in `src/data/` under `ar`/`en` keys.
- **Adding Pages:** Create component in `src/pages/`, export from `src/pages/index.ts`, and add route in `App.tsx`.
- **Troubleshooting:** If you see port conflicts, run `npx kill-port 5173`. For fresh installs, `rm -rf node_modules && npm install --legacy-peer-deps`.
