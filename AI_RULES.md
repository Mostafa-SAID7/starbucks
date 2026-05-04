## 🎯 Component Patterns (with Examples)

### Correct Component Structure
```tsx
// src/components/ExampleComponent.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ExampleProps {
  title: string
  isActive?: boolean
}

export const ExampleComponent: React.FC<ExampleProps> = ({ title, isActive = false }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "p-6 rounded-2xl",
        isActive ? "bg-starbucks-green text-white" : "bg-white dark:bg-zinc-900"
      )}
    >
      <h3 className={`text-xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
        {title}
      </h3>
    </motion.div>
  )
}

export default ExampleComponent
```

### Incorrect Patterns (DO NOT DO)
```tsx
// ❌ DON'T: Inline styles
<div style={{ color: 'green' }}>

// ❌ DON'T: Direct Tailwind without RTL consideration
<div className="ml-4">  // Use ms-4 instead

// ❌ DON'T: Missing TypeScript types
export const BadComponent = (props) => { ... }

// ❌ DON'T: Hardcoded strings (use i18n)
<h1>Welcome</h1>  // Use {t('common.welcome')} instead
```

---

## 🚫 Anti-Patterns (Never Do These)

### State Management
- ❌ **NEVER** use Redux, Zustand, MobX, or any global state library
- ❌ **NEVER** lift state higher than necessary
- ❌ **NEVER** use `useReducer` for simple state (use `useState`)
- ✅ **DO** use local `useState` + lift only when needed

### Styling
- ❌ **NEVER** use CSS files (`.css`) for component styling
- ❌ **NEVER** use inline `style={{}}` objects
- ❌ **NEVER** use `!important` in Tailwind classes
- ✅ **DO** use Tailwind utilities + `cn()` for conditionals

### Data
- ❌ **NEVER** hardcode content strings in components
- ❌ **NEVER** create data objects inside components
- ✅ **DO** store all content in `src/data/*.json`

### Routing
- ❌ **NEVER** use `window.location` for navigation
- ❌ **NEVER** use `<a href>` for internal links
- ✅ **DO** use `Link` from `react-router-dom`

---

## 🧩 Page Creation Checklist

When creating a new page, follow this checklist:

- [ ] Create folder: `src/pages/NewPage/NewPage.tsx`
- [ ] Create barrel export: `src/pages/NewPage/index.ts`
- [ ] Export from `src/pages/index.ts`
- [ ] Add route in `src/App.tsx` with lazy loading
- [ ] Add skeleton component in `src/components/skeletons/`
- [ ] Add data file in `src/data/` (with `ar` and `en` keys)
- [ ] Use `StaticPageLayout` or create custom layout
- [ ] Add `SEO` component with proper title
- [ ] Test in both Arabic (RTL) and English (LTR)
- [ ] Test in light and dark mode
- [ ] Test on mobile viewport

---

## 🎨 Tailwind Class Priority Order

Follow this order for consistent styling:

1. **Layout**: `container`, `flex`, `grid`, `block`, `hidden`
2. **Positioning**: `relative`, `absolute`, `fixed`, `sticky`
3. **Spacing**: `p-*`, `m-*`, `gap-*`, `space-*`
4. **Sizing**: `w-*`, `h-*`, `min-*`, `max-*`
5. **Typography**: `text-*`, `font-*`, `leading-*`, `tracking-*`
6. **Colors**: `bg-*`, `text-*`, `border-*`
7. **Borders**: `border`, `rounded-*`, `ring-*`
8. **Effects**: `shadow-*`, `opacity-*`, `blur-*`
9. **Transforms**: `scale-*`, `rotate-*`, `translate-*`
10. **Transitions**: `transition-*`, `duration-*`, `ease-*`
11. **Dark/RTL**: `dark:*`, `rtl:*`

Example:
```tsx
<div className="
  flex items-center gap-4           // Layout & Positioning
  p-6                                // Spacing
  w-full md:w-1/2                      // Sizing & Responsive
  text-lg font-bold                    // Typography
  bg-white dark:bg-zinc-900            // Colors
  border border-gray-200 rounded-2xl     // Borders
  shadow-lg                           // Effects
  hover:scale-105 transition-transform  // Transforms & Transitions
">
```

---

## 🔍 Search & Navigation Rules

### SearchModal Usage
- Import from `@/components/search/SearchModal`
- Search data comes from `menu.json` (flattened in component)
- Trending terms are in `navbar.json` → `search.trending`
- Results show: image, title, description, category, subcategory

### Navbar Rules
- Desktop: horizontal nav with underline animation (`layoutId="nav-underline"`)
- Mobile: slide-down menu with staggered animations
- Language toggle: switches `i18n.language` between `'ar'` and `'en'`
- Theme toggle: uses `useTheme()` hook
- Auth modal: controlled via `isAuthOpen` state

---

## 📱 Mobile-First Responsive Rules

### Breakpoints
- **Default**: Mobile (< 640px)
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

### Mobile Tab Bar
- Visible only on mobile (`md:hidden`)
- Fixed at bottom with `pb-safe` for safe area
- Active tab has `layoutId="active-tab-pill"` animation
- Icons: Home, ShoppingBag (Menu), MapPin (Locations), User (Account)

### Responsive Pattern
```tsx
// ✅ CORRECT: Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card />
  <Card />
  <Card />
</div>

// ❌ WRONG: Desktop-first
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
```

---

## 🌐 Data Flow Examples

### Accessing Bilingual Data
```tsx
import { aboutUs } from '@/data'
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { i18n } = useTranslation()
  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en'
  
  // Access bilingual data
  const title = aboutUs.hero.text.title[lang]
  const description = aboutUs.hero.text.description[lang]
  
  return <h1>{title}</h1>
}
```

### Adding New Data
1. Add to `src/data/new-file.json`:
```json
{
  "ar": { "title": "عنوان عربي" },
  "en": { "title": "English Title" }
}
```
2. Export in `src/data/index.ts`:
```ts
import newData from './new-file.json'
export { newData }
```
3. Use in component as shown above.

---

## 🎭 Animation Recipes

### Page Enter Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <YourContent />
</motion.div>
```

### Staggered Children
```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }}
  initial="hidden"
  animate="show"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Hover Scale with Spring
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Click Me
</motion.button>
```

---

## 🔧 Utility Functions

### Class Merge Utility (`src/lib/utils.ts`)
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Usage:
```tsx
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  "hover:scale-105"
)}>
```

---

## 📦 Bundle & Performance

### Lazy Loading Pages (Already configured in App.tsx)
```tsx
const HomePage = lazy(() => import('@/pages/HomePage'))
// Used with <Suspense fallback={<HomeSkeleton />}>
```

### Image Optimization
- Use `loading="lazy"` for below-fold images
- Use `decoding="async"` for better performance
- Always provide `alt` text (bilingual if needed)
- Use WebP format when possible (already used from Starbucks CDN)

### Scrollbar Configuration
Already configured in `src/index.css`:
- Thin scrollbar (6px width)
- Starbucks green thumb (`#006241`)
- Dark mode support via CSS variables
- Hide scrollbar utility: `scrollbar-hide` class

---

## 🚨 Error Handling Rules

- ❌ **NEVER** use `try/catch` unless specifically requested by user
- ✅ **DO** let errors bubble up to be fixed (you'll see them)
- ✅ **DO** use TypeScript to catch errors at compile time
- ✅ **DO** check for `undefined` when accessing nested data:
```tsx
const category = data.categories?.find(c => c.id === id)
if (!category) return <NotFound />
```

---

## 📝 Commit Message Convention

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests

### Examples:
```
feat(menu): add new seasonal drinks category
fix(footer): correct RTL alignment in country selector
docs: update AI_RULES.md with animation recipes
style(navbar): format code with prettier
refactor(components): split large component into smaller ones
```

---

## 🏁 Quick Reference

| Task | Use This |
|------|-----------|
| Create page | `src/pages/PageName/PageName.tsx` |
| Create component | `src/components/[category]/ComponentName.tsx` |
| Add styling | Tailwind classes + `cn()` |
| Add animation | `framer-motion` + `ANIMATIONS` constants |
| Add route | `App.tsx` with `lazy()` + `Suspense` |
| Add content | `src/data/*.json` with `ar`/`en` keys |
| Add types | `src/types/*.ts` |
| Show toast | `toast.success()` from `sonner` |
| Get icon | `lucide-react` |
| Navigate | `Link` or `useNavigate()` from `react-router-dom` |
| Translate | `useTranslation()` + `t('key')` |
| Theme toggle | `useTheme()` hook |
| SEO | `<SEO title="..." />` component |