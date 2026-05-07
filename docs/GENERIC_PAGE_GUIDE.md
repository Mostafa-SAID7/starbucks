# GenericPage - Quick Start Guide

## 🎯 What is GenericPage?

A **reusable, data-driven page component** that eliminates repetitive code for content-heavy pages like Privacy Policy, Terms of Use, Cookie Notice, etc.

### Before vs After

**Before**: 150+ lines of repetitive JSX per page  
**After**: 5 lines using GenericPage ✨

---

## 🚀 Quick Start (3 Steps)

### Step 1: Create Your Data

Create a JSON file in `src/data/my-page.json`:

```json
{
  "title": {
    "ar": "عنوان الصفحة",
    "en": "Page Title"
  },
  "sections": [
    {
      "id": "intro",
      "title": {
        "ar": "مقدمة",
        "en": "Introduction"
      },
      "paragraphs": [
        {
          "ar": "هذا نص تجريبي باللغة العربية",
          "en": "This is sample text in English"
        }
      ]
    }
  ]
}
```

### Step 2: Export Your Data

In `src/data/index.ts`:

```typescript
export { default as myPage } from "./my-page.json";
```

### Step 3: Create Your Page

In `src/pages/MyPage/MyPage.tsx`:

```tsx
import { GenericPage } from "@/pages/GenericPage";
import { myPage } from "@/data";

export const MyPage = () => {
  return <GenericPage data={myPage} seoTitle="My Page" />;
};
```

**Done!** 🎉

---

## 📦 What You Get

✅ Automatic bilingual support (AR/EN)  
✅ RTL layout for Arabic  
✅ Dark mode support  
✅ Responsive design  
✅ SEO optimization  
✅ Consistent Starbucks styling  
✅ Accessibility features  
✅ Sticky sidebar image layout (optional)

---

## 🖼️ Sticky Sidebar Image Layout

For pages that need a **full-height sticky image** alongside content (like Community Impact page):

### Usage

Add `sidebarImage` to your data:

```json
{
  "title": {
    "ar": "التأثير المجتمعي",
    "en": "Community Impact"
  },
  "sidebarImage": "https://example.com/hero-image.jpg",
  "intro": {
    "paragraphs": [
      {
        "ar": "محتوى الصفحة",
        "en": "Page content"
      }
    ]
  },
  "sections": [...]
}
```

### Features

- **Full Height**: Image takes 100vh (full viewport height)
- **Sticky Position**: Image stays fixed while content scrolls
- **RTL Support**: Image appears on left in Arabic, right in English
- **Responsive**: Hidden on mobile, visible on desktop (lg+)
- **No Extra Scrollbars**: Uses main body scrollbar only
- **Two-Column Layout**: Content (50%) + Image (50%)

### When to Use

✅ Hero/campaign pages with strong visual identity  
✅ Impact stories with emotional imagery  
✅ Brand storytelling pages  
❌ Text-heavy documentation pages  
❌ Pages with many sections (use regular layout)

---

## 🎨 Content Types Supported

### 1. Simple Text

```json
{
  "paragraphs": [{ "ar": "نص", "en": "Text" }]
}
```

### 2. Bullet Lists

```json
{
  "list": [
    { "ar": "عنصر", "en": "Item" },
    { "ar": "رابط", "en": "Link", "link": "https://example.com" }
  ]
}
```

### 3. Subsections

```json
{
  "subsections": [
    {
      "title": { "ar": "عنوان فرعي", "en": "Subtitle" },
      "paragraphs": [{ "ar": "محتوى", "en": "Content" }]
    }
  ]
}
```

### 4. Styled Boxes (Types)

```json
{
  "types": [
    {
      "id": "type-1",
      "label": { "ar": "نوع", "en": "Type" },
      "text": { "ar": "وصف", "en": "Description" }
    }
  ]
}
```

### 5. Contact Information

```json
{
  "contactInfo": {
    "email": "info@starbucks.eg",
    "phone": "+20 123 456 7890",
    "phoneTel": "+201234567890",
    "address": { "ar": "القاهرة", "en": "Cairo" }
  }
}
```

### 6. Definitions

```json
{
  "definitions": [
    {
      "term": { "ar": "مصطلح", "en": "Term" },
      "definition": { "ar": "تعريف", "en": "Definition" }
    }
  ]
}
```

---

## 🔧 Advanced Features

### Add Sidebar

```tsx
const Sidebar = (
  <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl">
    <h3>Quick Links</h3>
    <ul>
      <li><a href="/menu">Menu</a></li>
    </ul>
  </div>
);

const data = {
  title: { ar: "...", en: "..." },
  sidebar: Sidebar,
  sections: [...]
};
```

### Add Accordion

```tsx
<GenericPage
  data={myPage}
  showAccordion={true}
  accordionTitle={{ ar: "المزيد", en: "More Info" }}
  accordionSectionIndices={[1, 2, 3]} // Show sections 1, 2, 3
/>
```

### Add Intro Section

```json
{
  "intro": {
    "title": { "ar": "مرحباً", "en": "Welcome" },
    "paragraphs": [{ "ar": "مقدمة", "en": "Introduction" }]
  }
}
```

---

## 📝 Real Examples

### Privacy Policy

```tsx
import { GenericPage } from "@/pages/GenericPage";
import { privacyStatement } from "@/data";

export const PrivacyStatementPage = () => (
  <GenericPage
    data={privacyStatement}
    seoTitle="Privacy Statement"
    showAccordion={true}
    accordionSectionIndices={[1, 2, 3, 4]}
  />
);
```

### Terms of Use

```tsx
import { GenericPage } from "@/pages/GenericPage";
import { termsOfUse } from "@/data";

export const TermsOfUsePage = () => (
  <GenericPage data={termsOfUse} seoTitle="Terms of Use" showAccordion={true} />
);
```

---

## 🎯 When to Use GenericPage

### ✅ Perfect For:

- Privacy policies
- Terms of service
- Cookie notices
- FAQ pages
- About pages
- Legal documents
- Help/Support pages

### ❌ Not Suitable For:

- Home page (custom design)
- Menu pages (special layout)
- Contact forms (interactive)
- Product pages (e-commerce)

---

## 🐛 Troubleshooting

### Issue: Content not showing

**Solution**: Check your data structure matches `GenericPageData` type

### Issue: Wrong language

**Solution**: Ensure both `ar` and `en` keys exist in all `LocalizedText` objects

### Issue: Styling looks off

**Solution**: GenericPage uses Tailwind classes - ensure Tailwind is configured

---

## 📚 Full Documentation

The component logic is documented extensively via inline comments within `src/pages/GenericPage.tsx` and its type definitions.

---

## 💡 Tips

1. **Keep it simple** - Start with basic paragraphs, add complexity as needed
2. **Test both languages** - Always check AR and EN versions
3. **Use semantic IDs** - Section IDs should describe content
4. **Reuse data** - Same data structure works for all pages
5. **Stay consistent** - Follow existing page patterns

---

## 🎉 Benefits

- **90% less code** per page
- **Consistent styling** across all pages
- **Easier maintenance** - update data, not code
- **Faster development** - new pages in minutes
- **Type-safe** - TypeScript catches errors
- **Accessible** - WCAG compliant out of the box

---

**Ready to create your first GenericPage?** Follow the Quick Start above! 🚀
