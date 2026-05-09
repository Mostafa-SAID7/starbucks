# React Component Architectural Analysis

## Executive Summary

This analysis covers 9 React components from the Starbucks Egypt frontend. The codebase demonstrates good use of modern React patterns (hooks, React Query, lazy loading) but has several architectural concerns that should be addressed to improve maintainability, testability, and performance.

---

## 1. PROP DRILLING PATTERNS

### Issue: Moderate Prop Drilling in Page Components

**Severity:** Medium

#### HomePage.tsx (Lines 1-80)
```typescript
// Props passed through component hierarchy
const HomePageContent: React.FC<{ heroData: any }> = ({ heroData }) => {
  // heroData is passed down but only used for specific properties
  return (
    <Banner
      title={t("pages:home.hero.title")}
      description={t("pages:home.hero.description")}
      ctaText={t("pages:home.hero.ctaText")}
      ctaLink={heroData.ctaLink}  // ← Prop drilling
      imageUrl={heroData.imageUrl}  // ← Prop drilling
      secondaryImageUrl={heroData.secondaryImageUrls?.[lang]}  // ← Prop drilling
      imageAlt={t("pages:home.hero.imageAlt")}
      isRTL={lang === "ar"}
    />
  );
};
```

**Problem:** `heroData` is passed from `HomePage` → `HomePageContent` → `Banner`. The intermediate component doesn't use most of the data.

**Recommendation:** Use React Context for language/RTL state instead of passing through props.

---

#### MenuPage.tsx (Lines 1-150)
```typescript
// Multiple levels of prop drilling
const MenuPageContent: React.FC<{ menuData: any }> = ({ menuData }) => {
  // menuData contains: categories, allergyInfo, sidebar
  // All passed to child components
  
  return (
    <>
      {categories.map((category: MenuCategory, index: number) => (
        <motion.div
          onMouseEnter={() => {
            if (category.id) prefetchCategory(category.id);  // ← Business logic in UI
          }}
        >
          {/* ... */}
        </motion.div>
      ))}
    </>
  );
};
```

**Problem:** 
- `menuData` object is passed but only specific properties are used
- Business logic (prefetching) mixed with UI rendering
- Language state (`lang`, `isRTL`) derived multiple times

---

#### MenuCategoryPage.tsx & MenuItemPage.tsx (Similar Pattern)
Both pages follow the same pattern:
- Fetch multiple data sources (`useMenuData`, `useMenuCategory`/`useMenuItem`)
- Pass combined data through props
- Derive language state multiple times

**Recommendation:** Create a custom hook to encapsulate data fetching and language logic.

---

### Navbar.tsx (Lines 1-350)
```typescript
// Extensive prop drilling through lazy-loaded components
<Suspense fallback={null}>
  <SearchModal
    isOpen={isSearchOpen}
    onClose={() => setIsSearchOpen(false)}
  />
</Suspense>
<Suspense fallback={null}>
  <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
</Suspense>
```

**Problem:** Modal state is managed in Navbar but could be in a global context.

---

## 2. BUSINESS LOGIC INSIDE UI COMPONENTS

### Issue: Critical - Multiple Instances

**Severity:** High

#### MenuPage.tsx (Lines 60-70)
```typescript
const prefetchCategory = (categoryId: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.menu.byCategory(categoryId),
    queryFn: () => menuFetchers.fetchMenuCategory(categoryId),
    staleTime: 60 * 60 * 1000,
  });
};

// Used directly in JSX
onMouseEnter={() => {
  if (category.id) prefetchCategory(category.id);  // ← Business logic in event handler
}}
```

**Problem:** Query prefetching logic is defined and executed inside the component. This should be extracted to a custom hook.

---

#### LocationsPage.tsx (Lines 30-60)
```typescript
const handleUseMyLocation = useCallback(() => {
  if (!navigator.geolocation) {
    setGeoStatus("error");
    return;
  }
  setGeoStatus("loading");
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Reverse geocode with free Nominatim API
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { "Accept-Language": currentLang } }
        );
        const data = await res.json();
        const city = data?.address?.city || data?.address?.town || data?.address?.suburb || "";
        if (city) {
          setSearch(city);
        }
        setGeoStatus("idle");
      } catch {
        setGeoStatus("error");
      }
    },
    () => {
      setGeoStatus("error");
    },
    { timeout: 8000 }
  );
}, [currentLang]);
```

**Problem:** 
- Geolocation and reverse geocoding logic mixed with UI state management
- API call to external service (Nominatim) in component
- Should be extracted to a custom hook: `useGeolocation()`

---

#### ContactUsPage.tsx (Lines 30-50)
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    setSubmitted(true);
  }, 1200);  // ← Mock submission logic in component
};
```

**Problem:** Form submission logic is hardcoded with a mock timeout. Should be extracted to a custom hook or service.

---

#### Navbar.tsx (Lines 100-130)
```typescript
// Language toggle logic mixed with navigation
const toggleLanguage = useCallback(() => {
  const newLang = lang === "ar" ? "en" : "ar";
  const pathParts = location.pathname.split("/");
  const pathWithoutLang = pathParts.slice(2).join("/");
  const newPath = `/${newLang}${pathWithoutLang ? "/" + pathWithoutLang : ""}`;
  
  i18n.changeLanguage(newLang);
  setIsMobileMenuOpen(false);
  navigate(newPath);
  
  toast.success(
    newLang === "ar"
      ? "تم تغيير اللغة إلى العربية"
      : "Language changed to English",
  );
}, [i18n, lang, location.pathname, navigate]);
```

**Problem:** Language switching logic should be in a custom hook or service, not in the Navbar component.

---

#### ChatWidget.tsx (Lines 40-60)
```typescript
const handleSend = () => {
  if (!message.trim()) return;
  
  const userMsg = { id: Date.now(), text: message, isBot: false };
  setMessages((prev) => [...prev, userMsg]);
  setMessage("");
  
  // Mock bot response
  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: t("common:chat.bot_response"),
        isBot: true,
      },
    ]);
  }, 1000);  // ← Mock logic in component
};
```

**Problem:** Chat logic (message handling, bot responses) should be extracted to a service or custom hook.

---

## 3. COMPONENT COMPLEXITY ANALYSIS

### Complexity Metrics

| Component | LOC | Hooks | State Variables | Complexity |
|-----------|-----|-------|-----------------|------------|
| HomePage.tsx | 80 | 3 | 2 | Low |
| MenuPage.tsx | 150 | 4 | 3 | Medium |
| MenuCategoryPage.tsx | 140 | 3 | 2 | Medium |
| MenuItemPage.tsx | 145 | 3 | 2 | Medium |
| LocationsPage.tsx | 220 | 4 | 4 | High |
| ContactUsPage.tsx | 200 | 3 | 5 | High |
| Navbar.tsx | 350 | 8 | 8 | Very High |
| MenuGrid.tsx | 35 | 1 | 0 | Low |
| ChatWidget.tsx | 110 | 3 | 3 | Medium |

### High Complexity Components

#### Navbar.tsx - **CRITICAL**
- **Lines of Code:** 350+
- **Hooks Used:** 8 (useState, useEffect, useRef, useCallback, useTranslation, useTheme, useQueryClient, useNavigation)
- **State Variables:** 8 (isMobileMenuOpen, isSearchOpen, isAuthOpen, isScrolled, mobileMenuRef, hamburgerButtonRef, prevPathname, lang)
- **Issues:**
  - Multiple useEffect hooks (4+) managing different concerns
  - Complex conditional rendering logic
  - Manages mobile menu, search, auth, theme, language, scroll state
  - Should be split into smaller components

**Recommendation:** Break into sub-components:
```typescript
// Suggested refactoring
<Navbar>
  <NavbarLogo />
  <NavbarDesktopMenu />
  <NavbarUtilities>
    <LocationButton />
    <SearchButton />
    <LanguageToggle />
    <ThemeToggle />
    <AccountButton />
  </NavbarUtilities>
  <NavbarMobileMenu />
</Navbar>
```

---

#### LocationsPage.tsx - **HIGH**
- **Lines of Code:** 220+
- **Hooks Used:** 4 (useState, useCallback, useTranslation, useLocations)
- **State Variables:** 4 (search, geoStatus, messages, messagesEndRef)
- **Issues:**
  - Geolocation logic mixed with UI
  - Reverse geocoding API call in component
  - Complex filtering logic
  - Multiple concerns: search, geolocation, city display

---

#### ContactUsPage.tsx - **HIGH**
- **Lines of Code:** 200+
- **Hooks Used:** 3 (useState, useTranslation, useContactInfo)
- **State Variables:** 5 (form fields: name, email, phone, subject, message, submitted, loading)
- **Issues:**
  - Form state management is verbose
  - Mock submission logic in component
  - No form validation logic
  - Should use a form library (react-hook-form, Formik)

---

## 4. TYPESCRIPT TYPING QUALITY

### Issue: Weak Typing in Multiple Components

**Severity:** Medium

#### HomePage.tsx (Line 8)
```typescript
const HomePageContent: React.FC<{ heroData: any }> = ({ heroData }) => {
  // ↑ Using 'any' type - loses type safety
```

**Problem:** `any` type defeats TypeScript's purpose. Should define proper interface.

**Recommendation:**
```typescript
interface HeroData {
  ctaLink: string;
  imageUrl: string;
  secondaryImageUrls?: Record<'ar' | 'en', string>;
}

const HomePageContent: React.FC<{ heroData: HeroData }> = ({ heroData }) => {
  // ...
};
```

---

#### MenuPage.tsx (Line 13)
```typescript
const MenuPageContent: React.FC<{ menuData: any }> = ({ menuData }) => {
  // ↑ Using 'any' type
```

---

#### MenuCategoryPage.tsx (Line 1)
```typescript
// No explicit typing for category data
const { data: category, isLoading: isCategoryLoading } = useMenuCategory(categoryId || "");
```

---

#### LocationsPage.tsx (Line 1)
```typescript
export const LocationsPage: React.FC = () => {
  // ↑ No props interface (though none are used)
  // But internal state could be better typed
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">("idle");
  // ↑ Good - literal type union
};
```

---

#### Navbar.tsx (Line 1)
```typescript
// Good typing for NavItem
import { NavItem } from "@/types";

// But some state could be better typed
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// Could be more explicit about what this controls
```

---

#### ChatWidget.tsx (Line 10)
```typescript
const [messages, setMessages] = useState<
  { id: number; text: string; isBot: boolean }[]
>(() => [
  {
    id: 1,
    text: t("common:chat.welcome_message"),
    isBot: true,
  },
]);
// ↑ Good inline typing, but should extract to interface
```

**Recommendation:** Create a types file for each component:
```typescript
// types/chat.ts
export interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
}

export type GeoStatus = "idle" | "loading" | "error";
```

---

## 5. DUPLICATED STATE

### Issue: Language State Derived Multiple Times

**Severity:** Medium

#### Across Multiple Components
```typescript
// HomePage.tsx (Lines 45-46)
const { i18n } = useTranslation();
const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

// MenuPage.tsx (Lines 14-15)
const { i18n } = useTranslation(["pages", "common"]);
const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

// MenuCategoryPage.tsx (Lines 8-9)
const { i18n } = useTranslation(["pages", "common"]);
const isRTL = i18n.language === "ar";

// LocationsPage.tsx (Lines 10-11)
const { i18n } = useTranslation();
const isRTL = i18n.language === "ar";
const currentLang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

// Navbar.tsx (Lines 50-56)
const lang = (
  urlLang && (urlLang === "ar" || urlLang === "en")
    ? urlLang
    : i18n.language === "ar"
      ? "ar"
      : "en"
) as "ar" | "en";
const isRTL = lang === "ar";
```

**Problem:** 
- Language derivation logic repeated in 9+ components
- Inconsistent patterns (some use `lang`, some use `isRTL`)
- Violates DRY principle

**Recommendation:** Create a custom hook:
```typescript
// hooks/useLanguage.ts
export function useLanguage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
  
  return { lang, isRTL, i18n };
}

// Usage in components
const { lang, isRTL } = useLanguage();
```

---

### Text Alignment Class Duplication

```typescript
// MenuPage.tsx (Line 16)
const textAlignClass = isRTL ? "text-right" : "text-left";

// MenuCategoryPage.tsx (Line 10)
const textAlignClass = isRTL ? "text-right" : "text-left";

// MenuItemPage.tsx (Line 20)
const textAlignClass = isRTL ? "text-right" : "text-left";

// ContactUsPage.tsx (Line 25)
const textAlignClass = isRTL ? "text-right" : "text-left";
```

**Recommendation:** Create a utility function:
```typescript
// lib/classUtils.ts
export const getTextAlignClass = (isRTL: boolean) => 
  isRTL ? "text-right" : "text-left";

export const getItemsAlignClass = (isRTL: boolean) => 
  isRTL ? "items-end" : "items-start";
```

---

## 6. MEMORY LEAKS & EXCESSIVE RE-RENDERS

### Issue: Potential Memory Leaks

**Severity:** Medium

#### HomePage.tsx (Lines 50-65)
```typescript
useEffect(() => {
  let isMounted = true;
  const loadTranslations = async () => {
    setIsTranslationLoaded(false);
    try {
      const translations = await import(`../../locales/${lang}/pages/home.json`);
      if (isMounted) {
        i18n.addResourceBundle(lang, "pages", { home: translations.default }, true, true);
        setIsTranslationLoaded(true);
      }
    } catch (err) {
      if (isMounted) setIsTranslationLoaded(true);
    }
  };
  loadTranslations();
  return () => { isMounted = false; };
}, [lang, i18n]);
```

**Problem:** 
- Dynamic imports in useEffect can cause memory issues
- `isMounted` flag is a workaround for missing AbortController
- Pattern repeated in MenuPage, MenuCategoryPage, MenuItemPage

**Recommendation:** Use AbortController:
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  const loadTranslations = async () => {
    try {
      const translations = await import(`../../locales/${lang}/pages/home.json`);
      if (!controller.signal.aborted) {
        i18n.addResourceBundle(lang, "pages", { home: translations.default }, true, true);
        setIsTranslationLoaded(true);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setIsTranslationLoaded(true);
      }
    }
  };
  
  loadTranslations();
  return () => controller.abort();
}, [lang, i18n]);
```

---

#### Navbar.tsx (Lines 110-130)
```typescript
// Multiple useEffect hooks managing scroll
useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Separate useEffect for escape key
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [isMobileMenuOpen]);

// Separate useEffect for route changes
useEffect(() => {
  if (prevPathname.current !== location.pathname) {
    if (isMobileMenuOpen) {
      setTimeout(() => setIsMobileMenuOpen(false), 0);
    }
    prevPathname.current = location.pathname;
  }
}, [location.pathname, isMobileMenuOpen]);
```

**Problem:** 
- Multiple event listeners added/removed
- Potential memory leaks if cleanup not called
- Could be consolidated

---

#### LocationsPage.tsx (Lines 30-60)
```typescript
navigator.geolocation.getCurrentPosition(
  async (position) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { "Accept-Language": currentLang } }
      );
      // ...
    } catch {
      setGeoStatus("error");
    }
  },
  () => {
    setGeoStatus("error");
  },
  { timeout: 8000 }
);
```

**Problem:** 
- No AbortController for fetch
- If component unmounts during fetch, state update will occur on unmounted component
- Should use AbortController

---

### Excessive Re-renders

#### Navbar.tsx (Lines 50-56)
```typescript
const lang = (
  urlLang && (urlLang === "ar" || urlLang === "en")
    ? urlLang
    : i18n.language === "ar"
      ? "ar"
      : "en"
) as "ar" | "en";
const isRTL = lang === "ar";
```

**Problem:** 
- `lang` and `isRTL` are recalculated on every render
- Should be memoized with `useMemo`

**Recommendation:**
```typescript
const { lang, isRTL } = useMemo(() => {
  const computedLang = (
    urlLang && (urlLang === "ar" || urlLang === "en")
      ? urlLang
      : i18n.language === "ar"
        ? "ar"
        : "en"
  ) as "ar" | "en";
  return { lang: computedLang, isRTL: computedLang === "ar" };
}, [urlLang, i18n.language]);
```

---

## 7. HOOK USAGE PATTERNS

### Issue: Inconsistent Hook Usage

**Severity:** Low-Medium

#### Navbar.tsx - Multiple useRef Usage
```typescript
const mobileMenuRef = useRef<HTMLDivElement>(null);
const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
const prevPathname = useRef(location.pathname);
```

**Problem:** 
- `prevPathname` is used to track previous value - should use custom hook
- Multiple refs make component harder to follow

**Recommendation:** Create `usePrevious` hook:
```typescript
// hooks/usePrevious.ts
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage
const prevPathname = usePrevious(location.pathname);
```

---

#### ChatWidget.tsx - useRef for Auto-scroll
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  if (isOpen) {
    scrollToBottom();
  }
}, [messages, isOpen]);
```

**Problem:** 
- Manual scroll management is fragile
- Should use a library or custom hook

**Recommendation:** Create `useAutoScroll` hook:
```typescript
// hooks/useAutoScroll.ts
export function useAutoScroll(dependency: any) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [dependency]);
  
  return ref;
}
```

---

#### LocationsPage.tsx - useCallback with Many Dependencies
```typescript
const handleUseMyLocation = useCallback(() => {
  // ... geolocation logic
}, [currentLang]);
```

**Problem:** 
- `currentLang` changes frequently, causing callback recreation
- Could use `useRef` for stable reference

---

## 8. SEPARATION OF UI AND DATA LOGIC

### Issue: Insufficient Separation

**Severity:** High

#### Current State
- **Data Fetching:** ✅ Good - Using React Query hooks (useMenuData, useLocations, etc.)
- **Business Logic:** ❌ Poor - Mixed with UI components
- **State Management:** ⚠️ Partial - Some global state, but language state duplicated
- **API Calls:** ⚠️ Partial - Some in components (LocationsPage geolocation)

#### Recommended Architecture

```
src/
├── components/
│   ├── pages/
│   │   ├── HomePage.tsx (UI only)
│   │   ├── MenuPage.tsx (UI only)
│   │   └── ...
│   ├── layout/
│   │   └── Navbar.tsx (UI only)
│   └── widgets/
│       └── ChatWidget.tsx (UI only)
├── hooks/
│   ├── queries/
│   │   ├── useMenuData.ts
│   │   ├── useLocations.ts
│   │   └── ...
│   ├── useLanguage.ts (NEW)
│   ├── useGeolocation.ts (NEW)
│   ├── useFormSubmit.ts (NEW)
│   ├── usePrefetchCategory.ts (NEW)
│   └── ...
├── services/
│   ├── geolocationService.ts (NEW)
│   ├── chatService.ts (NEW)
│   ├── formService.ts (NEW)
│   └── ...
├── lib/
│   ├── classUtils.ts (NEW)
│   ├── constants.ts
│   └── ...
└── types/
    ├── pages.ts
    ├── components.ts
    └── ...
```

---

## SUMMARY OF RECOMMENDATIONS

### Priority 1 (Critical)
1. **Extract business logic from components**
   - Create `useGeolocation()` hook for LocationsPage
   - Create `useFormSubmit()` hook for ContactUsPage
   - Create `usePrefetchCategory()` hook for MenuPage
   - Create `useLanguageToggle()` hook for Navbar

2. **Break down Navbar component**
   - Split into 5-6 smaller components
   - Reduce from 350 LOC to ~100 LOC per component

3. **Fix TypeScript typing**
   - Replace all `any` types with proper interfaces
   - Create type definitions for page data structures

### Priority 2 (High)
1. **Create custom hooks for duplicated logic**
   - `useLanguage()` - Language state management
   - `usePrevious()` - Track previous values
   - `useAutoScroll()` - Auto-scroll functionality

2. **Extract utility functions**
   - `getTextAlignClass()`, `getItemsAlignClass()`
   - Centralize class name generation

3. **Fix memory leaks**
   - Replace `isMounted` flag with AbortController
   - Add proper cleanup for all event listeners

### Priority 3 (Medium)
1. **Reduce component complexity**
   - ContactUsPage: Use react-hook-form
   - LocationsPage: Extract search and filtering logic

2. **Improve state management**
   - Consider Context API for modal states (Search, Auth)
   - Centralize language state

3. **Add proper error handling**
   - Wrap API calls with error boundaries
   - Add retry logic for failed requests

---

## Code Examples for Refactoring

### Example 1: Extract useLanguage Hook
```typescript
// hooks/useLanguage.ts
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function useLanguage() {
  const { i18n } = useTranslation();
  const { lang: urlLang } = useParams<{ lang: string }>();
  
  const lang = (
    urlLang && (urlLang === "ar" || urlLang === "en")
      ? urlLang
      : i18n.language === "ar"
        ? "ar"
        : "en"
  ) as "ar" | "en";
  
  const isRTL = lang === "ar";
  
  return { lang, isRTL, i18n };
}

// Usage in components
const { lang, isRTL } = useLanguage();
```

### Example 2: Extract useGeolocation Hook
```typescript
// hooks/useGeolocation.ts
import { useState, useCallback } from "react";

export type GeoStatus = "idle" | "loading" | "error";

export function useGeolocation() {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [city, setCity] = useState<string>("");
  
  const getCurrentCity = useCallback(async (lang: string) => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    
    setGeoStatus("loading");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": lang } }
          );
          const data = await res.json();
          const foundCity = data?.address?.city || data?.address?.town || data?.address?.suburb || "";
          setCity(foundCity);
          setGeoStatus("idle");
        } catch {
          setGeoStatus("error");
        }
      },
      () => setGeoStatus("error"),
      { timeout: 8000 }
    );
  }, []);
  
  return { geoStatus, city, getCurrentCity };
}
```

### Example 3: Refactored Navbar Component
```typescript
// components/layout/Navbar/Navbar.tsx
import { NavbarHeader } from "./NavbarHeader";
import { NavbarDesktopMenu } from "./NavbarDesktopMenu";
import { NavbarUtilities } from "./NavbarUtilities";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  return (
    <>
      <nav>
        <NavbarHeader />
        <NavbarDesktopMenu />
        <NavbarUtilities
          onSearchOpen={() => setIsSearchOpen(true)}
          onAuthOpen={() => setIsAuthOpen(true)}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </nav>
      <NavbarMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
```

---

## Testing Recommendations

1. **Unit Tests for Custom Hooks**
   - Test `useLanguage()` with different URL params
   - Test `useGeolocation()` with mock geolocation API
   - Test `usePrefetchCategory()` with React Query

2. **Component Tests**
   - Test Navbar with different screen sizes
   - Test form submission in ContactUsPage
   - Test language switching in all pages

3. **Integration Tests**
   - Test navigation flow across pages
   - Test language persistence across routes
   - Test data fetching and caching

---

## Conclusion

The codebase demonstrates good use of modern React patterns but needs refactoring to improve maintainability and testability. The main issues are:

1. Business logic mixed with UI components
2. Duplicated state and utility logic
3. High component complexity (especially Navbar)
4. Weak TypeScript typing
5. Potential memory leaks

Implementing these recommendations will result in:
- ✅ Better code reusability
- ✅ Easier testing
- ✅ Improved performance
- ✅ Better maintainability
- ✅ Reduced bundle size
