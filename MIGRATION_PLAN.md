# Language State Migration Plan

## Overview

Migrate 11 components from duplicated language derivation to centralized `useLanguage()` hook.

**Total Effort**: 2-3 hours  
**Files to Update**: 11  
**Lines to Change**: ~50-60

---

## Components to Migrate

### 1. SustainabilityPage.tsx

**Location**: `Frontend/src/pages/SustainabilityPage/SustainabilityPage.tsx`

**Current Code** (Lines 11-14):
```typescript
const SustainabilityPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { t: i18nextT, i18n } = useTranslation(["pages", "common"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
```

**New Code**:
```typescript
const SustainabilityPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { lang, isRTL } = useLanguage();
  const { t: i18nextT } = useTranslation(["pages", "common"]);
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 12-14 with new code
- Remove `i18n` from useTranslation

---

### 2. MiddleEastPage.tsx

**Location**: `Frontend/src/pages/MiddleEastPage/MiddleEastPage.tsx`

**Current Code** (Lines 11-14):
```typescript
const MiddleEastPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { t: i18nextT, i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
```

**New Code**:
```typescript
const MiddleEastPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { lang, isRTL } = useLanguage();
  const { t: i18nextT } = useTranslation();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 12-14 with new code
- Remove `i18n` from useTranslation

---

### 3. MenuPage.tsx (2 instances)

**Location**: `Frontend/src/pages/MenuPage/MenuPage.tsx`

#### Instance 1: MenuPageContent (Lines 15-18)

**Current Code**:
```typescript
const MenuPageContent: React.FC<{ menuData: any }> = ({ menuData }) => {
  const { t, i18n } = useTranslation(["pages", "common"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
  const textAlignClass = isRTL ? "text-right" : "text-left";
```

**New Code**:
```typescript
const MenuPageContent: React.FC<{ menuData: any }> = ({ menuData }) => {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation(["pages", "common"]);
  const textAlignClass = getTextAlignClass(isRTL);
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Add import: `import { getTextAlignClass } from "@/lib/classUtils";`
- Replace lines 16-19 with new code
- Replace textAlignClass with utility function

#### Instance 2: MenuPage (Lines 162-164)

**Current Code**:
```typescript
export const MenuPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
```

**New Code**:
```typescript
export const MenuPage = () => {
  const { lang } = useLanguage();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 162-164 with new code

---

### 4. HomePage.tsx (2 instances)

**Location**: `Frontend/src/pages/HomePage/HomePage.tsx`

#### Instance 1: HomePageContent (Lines 9-12)

**Current Code**:
```typescript
const HomePageContent: React.FC<{ heroData: any }> = ({ heroData }) => {
  const { t, i18n } = useTranslation(["common", "errors", "pages"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const pageTitle = lang === "ar" ? "ستاربكس مصر" : "Starbucks Egypt";
```

**New Code**:
```typescript
const HomePageContent: React.FC<{ heroData: any }> = ({ heroData }) => {
  const { lang } = useLanguage();
  const { t } = useTranslation(["common", "errors", "pages"]);
  const pageTitle = lang === "ar" ? "ستاربكس مصر" : "Starbucks Egypt";
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 10-12 with new code

#### Instance 2: HomePage (Lines 47-50)

**Current Code**:
```typescript
export const HomePage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false);
```

**New Code**:
```typescript
export const HomePage = () => {
  const { lang } = useLanguage();
  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false);
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 48-50 with new code

---

### 5. GenericPage.tsx

**Location**: `Frontend/src/pages/GenericPage.tsx`

**Current Code** (Lines 22-26):
```typescript
}) => {
  const { t, i18n } = useTranslation(["pages", "common"]);
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = i18n.language === "ar";
  const slug = propSlug || data.slug;
```

**New Code**:
```typescript
}) => {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation(["pages", "common"]);
  const slug = propSlug || data.slug;
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 23-26 with new code

---

### 6. DeliveryPage.tsx

**Location**: `Frontend/src/pages/DeliveryPage/DeliveryPage.tsx`

**Current Code** (Lines 11-14):
```typescript
const DeliveryPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
```

**New Code**:
```typescript
const DeliveryPageContent: React.FC<{ data: GenericPageData }> = ({ data }) => {
  const { lang, isRTL } = useLanguage();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 12-14 with new code

---

### 7. CommunityImpactPage.tsx

**Location**: `Frontend/src/pages/CommunityImpactPage/CommunityImpactPage.tsx`

**Current Code** (Lines 10-12):
```typescript
export const CommunityImpactPage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
```

**New Code**:
```typescript
export const CommunityImpactPage = () => {
  const { lang } = useLanguage();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 11-12 with new code

---

### 8. AuthModal.tsx

**Location**: `Frontend/src/components/widgets/AuthModal.tsx`

**Current Code** (Lines 11-14):
```typescript
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t, i18n } = useTranslation();
  const { login, register, isLoading, error, clearError } = useAuth();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
```

**New Code**:
```typescript
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { lang, isRTL } = useLanguage();
  const { t } = useTranslation();
  const { login, register, isLoading, error, clearError } = useAuth();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 12-15 with new code

---

### 9. OfflineIndicator.tsx

**Location**: `Frontend/src/components/ui/OfflineIndicator.tsx`

**Current Code** (Lines 15-18):
```typescript
  const [showIndicator, setShowIndicator] = useState(() => !navigator.onLine);
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
  const isRTL = lang === "ar";
```

**New Code**:
```typescript
  const [showIndicator, setShowIndicator] = useState(() => !navigator.onLine);
  const { lang, isRTL } = useLanguage();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 16-18 with new code

---

### 10. LiveRegion.tsx (3 instances)

**Location**: `Frontend/src/components/accessibility/LiveRegion.tsx`

#### Instance 1: LoadingAnnouncement (Lines 38-40)

**Current Code**:
```typescript
export function LoadingAnnouncement({ isLoading }: { isLoading: boolean }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
```

**New Code**:
```typescript
export function LoadingAnnouncement({ isLoading }: { isLoading: boolean }) {
  const { lang } = useLanguage();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 39-40 with new code

#### Instance 2: ErrorAnnouncement (Lines 56-58)

**Current Code**:
```typescript
export function ErrorAnnouncement({ error }: { error: Error | null }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
```

**New Code**:
```typescript
export function ErrorAnnouncement({ error }: { error: Error | null }) {
  const { lang } = useLanguage();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 57-58 with new code

#### Instance 3: SuccessAnnouncement (Lines 78-80)

**Current Code**:
```typescript
export function SuccessAnnouncement({ message }: { message?: string }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";
```

**New Code**:
```typescript
export function SuccessAnnouncement({ message }: { message?: string }) {
  const { lang } = useLanguage();
```

**Changes**:
- Add import: `import { useLanguage } from "@/hooks";`
- Replace lines 79-80 with new code

---

## Migration Checklist

### Phase 1: Page Components (5 files)
- [ ] SustainabilityPage.tsx
- [ ] MiddleEastPage.tsx
- [ ] MenuPage.tsx (2 instances)
- [ ] HomePage.tsx (2 instances)
- [ ] GenericPage.tsx
- [ ] DeliveryPage.tsx
- [ ] CommunityImpactPage.tsx

### Phase 2: Component Widgets (1 file)
- [ ] AuthModal.tsx

### Phase 3: UI Components (2 files)
- [ ] OfflineIndicator.tsx
- [ ] LiveRegion.tsx (3 instances)

### Phase 4: Verification
- [ ] Run linter
- [ ] Run type checker
- [ ] Run tests
- [ ] Manual testing

---

## Testing Strategy

### Unit Tests
```typescript
// Test that components use useLanguage hook
describe("SustainabilityPage", () => {
  it("should use useLanguage hook", () => {
    // Verify hook is called
  });

  it("should render with correct language", () => {
    // Verify language is applied
  });
});
```

### Integration Tests
```typescript
// Test language switching across components
describe("Language Switching", () => {
  it("should update all components when language changes", () => {
    // Verify all components update
  });
});
```

---

## Rollout Plan

### Step 1: Prepare (15 min)
- Create feature branch
- Review migration plan
- Set up testing environment

### Step 2: Migrate (90 min)
- Migrate page components (45 min)
- Migrate widget components (20 min)
- Migrate UI components (25 min)

### Step 3: Test (30 min)
- Run linter
- Run type checker
- Run tests
- Manual testing

### Step 4: Review & Merge (15 min)
- Code review
- Merge to main
- Deploy

**Total Time**: 2.5 hours

---

## Success Criteria

✅ All 11 components migrated  
✅ No duplicated language derivation  
✅ All tests passing  
✅ No TypeScript errors  
✅ No linter warnings  
✅ Manual testing successful  

---

## Rollback Plan

If issues occur:
1. Revert to previous commit
2. Investigate issue
3. Fix and re-test
4. Re-deploy

---

## Notes

- All components should use `useLanguage()` hook
- Remove `i18n` from useTranslation when not needed
- Use `getTextAlignClass()` utility for class names
- Verify no prop drilling of language state
- Update imports in each file

---

## Summary

This migration will:
- ✅ Eliminate 11+ duplicated language derivations
- ✅ Improve code consistency
- ✅ Reduce bundle size
- ✅ Improve maintainability
- ✅ Improve developer experience

**Estimated Effort**: 2-3 hours  
**Expected Impact**: High  
**Risk Level**: Low
