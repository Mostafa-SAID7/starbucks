# 🏗️ Project Architecture

Detailed technical overview of the Starbucks Egypt React engineering patterns.

## 1. State Management Strategy

The application employs a **Dual-State** architecture to separate local UI interactions from persistent server data:

### Server State (TanStack Query)
- **Source of Truth:** Asynchronous data from `src/data/`.
- **Logic:** Custom hooks in `src/hooks/queries/` wrap `useQuery` to provide typed, cached data.
- **Caching:** We use a stale-while-revalidate strategy. Static content (About, Sustainability) is cached for 24h, while dynamic content (Menu) is cached for 1h.

### UI State (Context & Hooks)
- **Navigation:** Managed via `useNavigation` to sync route changes with UI elements.
- **Theme:** `useTheme` manages the Light/Dark mode preference in `localStorage`.
- **Language:** `i18next` context handles the global `ar`/`en` toggle.

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

## 3. GenericPage Pattern

The `GenericPage` is a recursive renderer that allows creating 80% of the site's pages using only JSON configuration.

- **Sections:** Pages are composed of an array of section objects (Hero, ImageText, Accordion, etc.).
- **Dynamic Routing:** `GenericPageWrapper` catches slugs and fetches the corresponding JSON from `src/data/pages/`.
- **Benefits:** Minimizes boilerplate, ensures design consistency, and centralizes SEO metadata management.

---
*For folder organization, see [STRUCTURE.md](STRUCTURE.md).*
*For flow diagrams, see [System_Design.md](System_Design.md).*
