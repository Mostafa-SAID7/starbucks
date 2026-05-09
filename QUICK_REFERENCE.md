# Quick Reference Guide - Architecture Improvements

## 🚀 Quick Start

### Using New Hooks

#### useLanguage
```typescript
import { useLanguage } from "@/hooks";

const { lang, isRTL, i18n, changeLanguage } = useLanguage();
```

#### useGeolocation
```typescript
import { useGeolocation } from "@/hooks";

const { geoStatus, city, error, getCurrentCity, reset } = useGeolocation();

// Usage
const handleClick = async () => {
  await getCurrentCity('en');
};
```

#### usePrefetchMenuCategory
```typescript
import { usePrefetchMenuCategory, usePrefetchMenuItem, usePrefetchPage } from "@/hooks";

const prefetchCategory = usePrefetchMenuCategory();
const prefetchItem = usePrefetchMenuItem();
const prefetchPage = usePrefetchPage();

// Usage
<div onMouseEnter={() => prefetchCategory(categoryId)}>
  {category.name}
</div>
```

#### usePrevious
```typescript
import { usePrevious } from "@/hooks";

const prevPathname = usePrevious(location.pathname);

useEffect(() => {
  if (prevPathname !== location.pathname) {
    // Route changed
  }
}, [location.pathname, prevPathname]);
```

#### useAutoScroll
```typescript
import { useAutoScroll, useScrollToTop, useScrollPosition } from "@/hooks";

// Auto-scroll to element
const messagesEndRef = useAutoScroll([messages]);

// Scroll to top
const scrollToTop = useScrollToTop([pathname]);

// Detect scroll position
const isScrolled = useScrollPosition(100);
```

#### useLanguageToggle
```typescript
import { useLanguageToggle } from "@/hooks";

const toggleLanguage = useLanguageToggle();

// Usage
<button onClick={() => toggleLanguage()}>
  {lang === 'ar' ? 'English' : 'العربية'}
</button>

// Or switch to specific language
<button onClick={() => toggleLanguage('ar')}>العربية</button>
```

### Using Class Utilities

```typescript
import {
  getTextAlignClass,
  getItemsAlignClass,
  getFlexDirectionClass,
  getMarginClass,
  getPaddingClass,
  getTranslateClass,
  getOriginClass,
  getPositionClass,
} from "@/lib/classUtils";

// Usage
const textAlign = getTextAlignClass(isRTL);
const itemsAlign = getItemsAlignClass(isRTL);
const flexDir = getFlexDirectionClass(isRTL);
const margin = getMarginClass(isRTL, 'l', '4');
const padding = getPaddingClass(isRTL, 'r', '8');
```

---

## 📋 Migration Checklist

### For Each Component

- [ ] Replace language derivation with `useLanguage()`
- [ ] Replace class name logic with `classUtils` functions
- [ ] Extract business logic to custom hooks
- [ ] Replace `useRef` for previous values with `usePrevious()`
- [ ] Replace manual scroll logic with `useAutoScroll()`
- [ ] Add proper TypeScript types
- [ ] Add AbortController for fetch calls
- [ ] Add unit tests

---

## 🔍 Common Patterns

### Pattern 1: Language-Aware Component

**Before**:
```typescript
export function MyComponent() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
  const textAlignClass = isRTL ? "text-right" : "text-left";
  
  return <div className={textAlignClass}>{content}</div>;
}
```

**After**:
```typescript
import { useLanguage } from "@/hooks";
import { getTextAlignClass } from "@/lib/classUtils";

export function MyComponent() {
  const { lang, isRTL } = useLanguage();
  const textAlignClass = getTextAlignClass(isRTL);
  
  return <div className={textAlignClass}>{content}</div>;
}
```

### Pattern 2: Prefetch on Hover

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

<div onMouseEnter={() => prefetchPage(slug)}>
  {item.name}
</div>
```

**After**:
```typescript
import { usePrefetchPage } from "@/hooks";

const prefetchPage = usePrefetchPage();

<div onMouseEnter={() => prefetchPage(slug)}>
  {item.name}
</div>
```

### Pattern 3: Geolocation

**Before**:
```typescript
const [geoStatus, setGeoStatus] = useState("idle");
const [city, setCity] = useState("");

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
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { "Accept-Language": currentLang } }
        );
        const data = await res.json();
        const foundCity = data?.address?.city || "";
        if (foundCity) {
          setCity(foundCity);
        }
        setGeoStatus("idle");
      } catch {
        setGeoStatus("error");
      }
    },
    () => setGeoStatus("error"),
    { timeout: 8000 }
  );
}, [currentLang]);
```

**After**:
```typescript
import { useGeolocation } from "@/hooks";
import { useLanguage } from "@/hooks";

const { geoStatus, city, getCurrentCity } = useGeolocation();
const { lang } = useLanguage();

const handleUseMyLocation = () => {
  getCurrentCity(lang);
};
```

### Pattern 4: Auto-Scroll

**Before**:
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

return (
  <div className="messages">
    {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
    <div ref={messagesEndRef} />
  </div>
);
```

**After**:
```typescript
import { useAutoScroll } from "@/hooks";

const messagesEndRef = useAutoScroll([messages, isOpen]);

return (
  <div className="messages">
    {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
    <div ref={messagesEndRef} />
  </div>
);
```

### Pattern 5: Track Previous Value

**Before**:
```typescript
const prevPathname = useRef(location.pathname);

useEffect(() => {
  if (prevPathname.current !== location.pathname) {
    // Route changed
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    prevPathname.current = location.pathname;
  }
}, [location.pathname, isMobileMenuOpen]);
```

**After**:
```typescript
import { usePrevious } from "@/hooks";

const prevPathname = usePrevious(location.pathname);

useEffect(() => {
  if (prevPathname && prevPathname !== location.pathname && isMobileMenuOpen) {
    setIsMobileMenuOpen(false);
  }
}, [location.pathname, prevPathname, isMobileMenuOpen]);
```

---

## 🧪 Testing Examples

### Test useLanguage Hook
```typescript
import { renderHook } from "@testing-library/react";
import { useLanguage } from "@/hooks";

describe("useLanguage", () => {
  it("should return correct language from URL", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            {children}
          </I18nextProvider>
        </BrowserRouter>
      ),
    });

    expect(result.current.lang).toBe("ar");
    expect(result.current.isRTL).toBe(true);
  });
});
```

### Test useGeolocation Hook
```typescript
import { renderHook, act } from "@testing-library/react";
import { useGeolocation } from "@/hooks";

describe("useGeolocation", () => {
  it("should get current city", async () => {
    const { result } = renderHook(() => useGeolocation());

    act(() => {
      result.current.getCurrentCity("en");
    });

    expect(result.current.geoStatus).toBe("loading");

    // Wait for async operation
    await waitFor(() => {
      expect(result.current.geoStatus).not.toBe("loading");
    });
  });
});
```

---

## 📚 Documentation Files

- **IMPLEMENTATION_GUIDE.md** - Detailed implementation guide with all phases
- **REFACTORING_SUMMARY.md** - Quick summary of what was done
- **ARCHITECTURE_IMPROVEMENTS.md** - Complete analysis with before/after
- **QUICK_REFERENCE.md** - This file

---

## 🆘 Troubleshooting

### Language not updating
**Solution**: Use `useLanguage()` hook instead of deriving locally

### Prefetch not working
**Solution**: Verify query keys match and slug is correct

### Mobile menu not closing
**Solution**: Check that `onNavClick` callback is properly passed

### Geolocation not working
**Solution**: Check browser permissions and HTTPS requirement

### Memory leaks
**Solution**: Use AbortController for fetch calls

---

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review code comments
3. Check git history
4. Ask team members
5. Create GitHub issue

---

## ✨ Summary

**Phase 1 & 2 Complete**:
- ✅ 7 custom hooks created
- ✅ 1 utility module created
- ✅ 5 Navbar components refactored
- ✅ 3 documentation files created

**Next**: Phase 3 - Component Refactoring
