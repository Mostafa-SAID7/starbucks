# ⚡ Quick Start

## Prerequisites

- **Node.js** 20+ · **npm** · **Git**

---

## 1 · Clone & Install

```bash
git clone https://github.com/Mostafa-SAID7/starbucks.git
cd starbucks
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to the `vite-plugin-pwa` peer dependency override.

## 2 · Start Dev Server

```bash
npm run dev
# → http://localhost:5173
```

## 3 · (Optional) Docker

```bash
docker-compose up -d
# → http://localhost:3000
```

---

## Available Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | TypeScript type check only |

---

## Customisation

### Brand Colours
Edit `src/index.css`:
```css
@theme {
  --color-starbucks-green: #006241;
  --color-starbucks-dark: #1e3932;
  --color-starbucks-gold: #cba258;
}
```

### Add a New Page
1. Create `src/pages/MyPage.tsx`
2. Export it from `src/pages/index.ts`
3. Add a route in `src/App.tsx`

### Switch Language
The app reads from `i18n.language` — toggle via the language button in the Navbar. Content lives in `src/data/*.json` under `ar` / `en` keys.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 5173 busy | `npx kill-port 5173` |
| Peer dep errors | `npm install --legacy-peer-deps` |
| Stale Vite cache | `rm -rf node_modules/.vite && npm run dev` |
| Clean reinstall | `rm -rf node_modules && npm install --legacy-peer-deps` |

---

➡️ **For full deployment options see [DEPLOYMENT.md](DEPLOYMENT.md)**
➡️ **For architecture details see [ARCHITECTURE.md](ARCHITECTURE.md)**
