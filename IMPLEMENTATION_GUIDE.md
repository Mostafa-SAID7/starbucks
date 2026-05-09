# Starbucks Egypt - Architecture Refactoring Implementation Guide

## Overview

This guide documents the comprehensive refactoring of the Starbucks Egypt React Frontend to address critical architectural issues and improve code quality, maintainability, and performance.

## Phase 1: Custom Hooks (✅ COMPLETED)

### Created Hooks

#### 1. **useLanguage.ts** ✅
- **Purpose**: Centralize language state derivation
- **Replaces**: 9+ duplicated language derivations across components
- **Usage**:
  ```typescript
  const { lang, isRTL, i18n, changeLanguage } = useLanguage();
  ```
- **Benefits**:
  - Single source of truth for language state
  - Memoized to prevent unnecessary recalculations
  - Type-safe with Language type

#### 2. **useGeolocation.ts** ✅
- **Purpose**: Extract geolocation logic from LocationsPage
- **Features**:
  - Browser geolocation API integration
  - Reverse geocoding with Nominatim API
  - Proper AbortController for cleanup
  - Error handling with specific error messages
- **Usage**:
  ```typescript
  const { geoStatus, city, error, getCurrentCity, reset } = useGeolocation();
  ```
- **Benefits**:
  - Reusable across components
  - Proper memory leak prevention
  - Testable in isolation

#### 3. **usePrefetchMenuCategory.ts** ✅
- **Purpose**: Extract query prefetching logic from components
- **Includes**:
  - `usePrefetchMenuCategory()` - Prefetch menu categories
  - `usePrefetchMenuItem()` - Prefetch menu items
  - `usePrefetchPage()` - Prefetch pages
- **Usage**:
  ```typescript
  const prefetchCategory = usePrefetchMenuCategory();
  <div onMouseEnter={() => prefetchCategory(categoryId)}>
  ```
- **Benefits**:
  - Business logic extracted from UI
  - Consistent cache configuration
  - Easy to test

#### 4. **usePrevious.ts** ✅
- **Purpose**: Track previous values for comparison
- **Usage**:
  ```typescript
  const prevPathname = usePrevious(location.pathname);
  ```
- **Benefits**:
  - Replaces useRef pattern for tracking previous values
  - Cleaner code
  - Reusable pattern

#### 5. **useAutoScroll.ts** ✅
- **Purpose**: Auto-scroll functionality for chat, logs, etc.
- **Includes**:
  - `useAutoScroll()` - Auto-scroll to element
  - `useScrollToTop()` - Scroll to top
  - `useScrollPosition()` - Detect scroll position
- **Usage**:
  ```typescript
  const messagesEndRef = useAutoScroll([messages]);
  ```
- **Benefits**:
  - Reusable scroll patterns
  - Cleaner component code
  - Better separation of concerns

#### 6. **useLanguageToggle.ts** ✅
- **Purpose**: Extract language switching logic from Navbar
- **Features**:
  - URL navigation with language prefix
  - i18n integration
  - Toast notifications
- **Usage**:
  ```typescript
  const toggleLanguage = useLanguageToggle();
  <button onClick={() => toggleLanguage('ar')}>العربية</button>
  ```
- **Benefits**:
  - Reusable across components
  - Consistent language switching behavior
  - Testable

### Utility Functions

#### **classUtils.ts** ✅
- **Purpose**: RTL/LTR-aware class name generation
- **Functions**:
  - `getTextAlignClass()` - Text alignment
  - `getItemsAlignClass()` - Items alignment
  - `getFlexDirectionClass()` - Flex direction
  - `getMarginClass()` - Margin with direction
  - `getPaddingClass()` - Padding with direction
  - And 5+ more utility functions
- **Benefits**:
  - Eliminates duplicated class name logic
  - Consistent RTL/LTR handling
  - Easy to maintain

---

## Phase 2: Navbar Refactoring (✅ COMPLETED)

### Before: 350+ LOC, 8 hooks, 8 state variables

### After: 4 components, ~100 LOC each

#### **Navbar.tsx** (Main Component)
- **LOC**: ~120
- **Responsibility**: Orchestration and state management
- **State**:
  - `isMobileMenuOpen`
  - `isSearchOpen`
  - `isAuthOpen`
  - `isScrolled`

#### **NavbarHeader.tsx**
- **LOC**: ~20
- **Responsibility**: Logo and branding
- **Props**: `lang`, `onClose`

#### **NavbarDesktopMenu.tsx**
- **LOC**: ~80
- **Responsibility**: Desktop navigation items
- **Props**: `navItems`, `lang`, `prefetchPage`

#### **NavbarUtilities.tsx**
- **LOC**: ~100
- **Responsibility**: Location, search, language, theme, account buttons
- **Props**: `lang`, `theme`, `onToggleTheme`, `onSearchOpen`, `onAuthOpen`

#### **NavbarMobileMenu.tsx**
- **LOC**: ~80
- **Responsibility**: Mobile navigation overlay
- **Props**: `navItems`, `lang`, `isRTL`, `onNavClick`

### Benefits
- ✅ Each component ~100 LOC (testable)
- ✅ Single responsibility principle
- ✅ Easier to maintain
- ✅ Easier to test
- ✅ Better code reusability

---

## Phase 3: Component Refactoring (IN PROGRESS)

### LocationsPage.tsx
**Current Issues**:
- Geolocation logic in component
- Reverse geocoding API call in component
- Complex filtering logic

**Refactoring Plan**:
```typescript
// Before
const handleUseMyLocation = useCallback(() => {
  // 30+ lines of geolocation logic
}, [currentLang]);

// After
const { geoStatus, city, getCurrentCity } = useGeolocation();
const handleUseMyLocation = () => {
  getCurrentCity(lang);
};
```

### ContactUsPage.tsx
**Current Issues**:
- Manual form state management
- Mock submission logic
- No validation

**Refactoring Plan**:
- Integrate react-hook-form
- Create useContactForm hook
- Add Zod validation

### MenuPage.tsx
**Current Issues**:
- Prefetch logic in component
- Language derivation

**Refactoring Plan**:
- Use `usePrefetchMenuCategory()` hook
- Use `useLanguage()` hook

---

## Phase 4: TypeScript Typing (IN PROGRESS)

### Current Issues
- Multiple `any` types
- Weak typing in page components

### Refactoring Plan

#### Create Type Definitions
```typescript
// types/pages.ts
export interface HeroData {
  ctaLink: string;
  imageUrl: string;
  secondaryImageUrls?: Record<Language, string>;
}

export interface MenuPageProps {
  menuData: MenuData;
}

// types/forms.ts
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
```

#### Replace `any` Types
```typescript
// Before
const HomePageContent: React.FC<{ heroData: any }> = ({ heroData }) => {

// After
const HomePageContent: React.FC<{ heroData: HeroData }> = ({ heroData }) => {
```

---

## Phase 5: Memory Leak Fixes (IN PROGRESS)

### Issue: Using `isMounted` Flag

**Before**:
```typescript
useEffect(() => {
  let isMounted = true;
  const loadData = async () => {
    const data = await fetchData();
    if (isMounted) {
      setData(data);
    }
  };
  loadData();
  return () => { isMounted = false; };
}, []);
```

**After**:
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  const loadData = async () => {
    try {
      const data = await fetchData({ signal: controller.signal });
      setData(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return; // Component unmounted
      }
      setError(err);
    }
  };
  
  loadData();
  return () => controller.abort();
}, []);
```

---

## Phase 6: Form Architecture (PLANNED)

### Integrate react-hook-form

```typescript
// hooks/forms/useAuthForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function useAuthForm() {
  return useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });
}
```

### Update AuthModal.tsx
```typescript
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useAuthForm();
  const { login } = useAuth();
  
  const onSubmit = async (data: LoginData) => {
    await login(data);
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

---

## Implementation Checklist

### Phase 1: Custom Hooks ✅
- [x] Create useLanguage.ts
- [x] Create useGeolocation.ts
- [x] Create usePrefetchMenuCategory.ts
- [x] Create usePrevious.ts
- [x] Create useAutoScroll.ts
- [x] Create useLanguageToggle.ts
- [x] Create classUtils.ts
- [x] Create hooks/index.ts

### Phase 2: Navbar Refactoring ✅
- [x] Refactor Navbar.tsx
- [x] Create NavbarHeader.tsx
- [x] Create NavbarDesktopMenu.tsx
- [x] Create NavbarUtilities.tsx
- [x] Create NavbarMobileMenu.tsx
- [x] Test Navbar functionality

### Phase 3: Component Refactoring 🔄
- [ ] Refactor LocationsPage.tsx
- [ ] Refactor ContactUsPage.tsx
- [ ] Refactor MenuPage.tsx
- [ ] Refactor MenuCategoryPage.tsx
- [ ] Refactor MenuItemPage.tsx
- [ ] Refactor HomePage.tsx

### Phase 4: TypeScript Typing 🔄
- [ ] Create comprehensive type definitions
- [ ] Replace all `any` types
- [ ] Add proper interfaces for page data
- [ ] Add proper interfaces for forms

### Phase 5: Memory Leak Fixes 🔄
- [ ] Replace isMounted flags with AbortController
- [ ] Fix event listener cleanup
- [ ] Add proper fetch cleanup

### Phase 6: Form Architecture 🔄
- [ ] Install react-hook-form and zod
- [ ] Create form hooks
- [ ] Update AuthModal.tsx
- [ ] Update ContactUsPage.tsx
- [ ] Add form validation

### Phase 7: Testing 🔄
- [ ] Unit tests for custom hooks
- [ ] Component tests for Navbar
- [ ] Integration tests for navigation
- [ ] E2E tests for critical flows

---

## Migration Guide

### For Developers

#### Using New Hooks

**Before**:
```typescript
const { i18n } = useTranslation();
const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
const isRTL = lang === "ar";
```

**After**:
```typescript
const { lang, isRTL } = useLanguage();
```

#### Using Class Utilities

**Before**:
```typescript
const textAlignClass = isRTL ? "text-right" : "text-left";
const itemsAlignClass = isRTL ? "items-end" : "items-start";
```

**After**:
```typescript
import { getTextAlignClass, getItemsAlignClass } from "@/lib/classUtils";

const textAlignClass = getTextAlignClass(isRTL);
const itemsAlignClass = getItemsAlignClass(isRTL);
```

#### Using Prefetch Hooks

**Before**:
```typescript
const queryClient = useQueryClient();
const prefetchPage = useCallback((slug: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.pages.bySlug(slug),
    queryFn: () => pageFetchers.fetchPageBySlug(slug),
    staleTime: CACHE_TIMES.PAGE_STALE,
  });
}, [queryClient]);
```

**After**:
```typescript
const prefetchPage = usePrefetchPage();
```

---

## Performance Impact

### Expected Improvements

1. **Bundle Size**: -5-10% (removed duplicated logic)
2. **Component Render Time**: -20-30% (memoized hooks)
3. **Memory Usage**: -15% (proper cleanup with AbortController)
4. **Developer Experience**: +50% (cleaner code, better reusability)

### Metrics to Monitor

- Bundle size (gzip)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Memory usage over time

---

## Testing Strategy

### Unit Tests

```typescript
// hooks/__tests__/useLanguage.test.ts
describe("useLanguage", () => {
  it("should return correct language from URL", () => {
    // Test implementation
  });

  it("should return RTL for Arabic", () => {
    // Test implementation
  });
});
```

### Component Tests

```typescript
// components/layout/Navbar/__tests__/Navbar.test.tsx
describe("Navbar", () => {
  it("should render all utilities", () => {
    // Test implementation
  });

  it("should toggle mobile menu", () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/navigation.test.ts
describe("Navigation Flow", () => {
  it("should navigate between pages", () => {
    // Test implementation
  });

  it("should persist language across navigation", () => {
    // Test implementation
  });
});
```

---

## Rollout Plan

### Week 1: Hooks & Utilities
- Deploy custom hooks
- Update Navbar component
- Monitor for issues

### Week 2: Component Refactoring
- Refactor LocationsPage
- Refactor ContactUsPage
- Refactor MenuPage

### Week 3: TypeScript & Testing
- Add comprehensive types
- Add unit tests
- Add integration tests

### Week 4: Form Architecture
- Integrate react-hook-form
- Update form components
- Add form validation

---

## Troubleshooting

### Issue: Language not updating across components

**Solution**: Ensure all components use `useLanguage()` hook instead of deriving language locally.

### Issue: Prefetch not working

**Solution**: Verify that `usePrefetchPage()` is called with correct slug and that query keys match.

### Issue: Mobile menu not closing

**Solution**: Check that `onNavClick` callback is properly passed and called in NavbarMobileMenu.

---

## Next Steps

1. ✅ Complete Phase 1-2 (Custom Hooks & Navbar)
2. 🔄 Start Phase 3 (Component Refactoring)
3. 🔄 Continue Phase 4-6 (TypeScript, Memory Leaks, Forms)
4. 🔄 Add comprehensive tests
5. 🔄 Monitor performance metrics
6. 🔄 Gather team feedback
7. 🔄 Iterate and improve

---

## Resources

- [React Hooks Best Practices](https://react.dev/reference/react/hooks)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [AbortController API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

---

## Questions & Support

For questions or issues during implementation, please refer to:
- Architecture documentation
- Code comments
- Team discussions
- Code review feedback
