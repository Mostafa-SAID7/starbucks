# 🏗️ Project Architecture

## 📊 Component Hierarchy

```
App.tsx
│
├── Navbar
│   ├── Logo (SVG)
│   ├── Desktop Menu
│   │   ├── Menu Links (القائمة، المكافآت، بطاقات الهدايا)
│   │   └── Action Buttons (Location, Cart, Login)
│   └── Mobile Menu (Sheet)
│       ├── SheetTrigger (Hamburger Icon)
│       └── SheetContent
│           ├── Menu Links
│           └── Action Buttons
│
├── Main Content
│   │
│   ├── HeroBanner
│   │   ├── Content (Text + CTA)
│   │   └── Image (Responsive)
│   │
│   ├── StatementSection
│   │   ├── Heading
│   │   ├── Body Text
│   │   └── CTA Button
│   │
│   └── FeaturedCards
│       ├── Card 1 (New Era Campaign)
│       ├── Card 2 (Delivery)
│       ├── Card 3 (Official Statement)
│       ├── Card 4 (Coffee Experience)
│       └── Card 5 (Delivery Service)
│           └── Each Card Contains:
│               ├── Image
│               ├── Title
│               ├── Description
│               └── CTA Button(s)
│
└── Footer
    ├── Desktop Layout
    │   ├── Logo
    │   ├── About Us Links
    │   ├── Contact Links
    │   └── Social Impact Links
    │
    ├── Mobile Layout (Accordion)
    │   ├── Expandable Section 1
    │   ├── Expandable Section 2
    │   └── Expandable Section 3
    │
    ├── Country Selector
    │   ├── Trigger Button
    │   └── Dropdown Menu
    │
    └── Copyright
```

---

## 🎨 Design Patterns Used

### 1. **Component Composition**
```typescript
<Card>
  <CardContent>
    <CardTitle />
    <CardDescription />
  </CardContent>
</Card>
```

### 2. **Compound Components**
```typescript
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger />
  <SheetContent />
</Sheet>
```

### 3. **Render Props Pattern**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  {children}
</motion.div>
```

### 4. **Custom Hooks** (Potential)
```typescript
// Could be added:
useMediaQuery()
useScrollPosition()
useLocalStorage()
```

---

## 📦 Data Flow

```
User Interaction
      ↓
Event Handler (onClick, onChange)
      ↓
State Update (useState)
      ↓
Component Re-render
      ↓
UI Update
```

### Example: Mobile Menu
```
User clicks hamburger
      ↓
setIsOpen(true)
      ↓
Sheet component receives open={true}
      ↓
SheetContent renders with animation
      ↓
Menu appears from left side
```

---

## 🎯 State Management

### Local State (useState)
- **Navbar**: `isOpen` - Mobile menu state
- **Footer**: `openSection` - Accordion state
- **Footer**: `showCountries` - Country selector state

### No Global State Needed
- Simple application structure
- No shared state between components
- Could add Context API or Zustand for scaling

---

## 🎨 Styling Architecture

### Tailwind CSS Layers
```css
@layer base {
  /* CSS variables, resets */
}

@layer components {
  /* Reusable component classes */
}

@layer utilities {
  /* Custom utility classes */
}
```

### Component Styling Strategy
1. **Utility Classes** - Tailwind for most styling
2. **CSS Variables** - For theme colors
3. **Class Variance Authority** - For button variants
4. **Tailwind Merge** - For conditional classes

---

## 🔄 Animation Strategy

### Framer Motion Usage

#### 1. **Entrance Animations**
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

#### 2. **Scroll Animations**
```typescript
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
```

#### 3. **Hover Effects**
```typescript
whileHover={{ scale: 1.05 }}
transition={{ duration: 0.3 }}
```

#### 4. **Conditional Rendering**
```typescript
<AnimatePresence>
  {isOpen && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
```

---

## 📱 Responsive Strategy

### Mobile-First Approach
```typescript
// Base styles for mobile
className="text-sm"

// Tablet and up
className="md:text-base"

// Desktop
className="lg:text-lg"
```

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Responsive Patterns
1. **Grid Columns**: `grid-cols-1 md:grid-cols-2`
2. **Hidden Elements**: `hidden md:flex`
3. **Spacing**: `gap-4 md:gap-6 lg:gap-8`
4. **Text Size**: `text-2xl md:text-3xl lg:text-4xl`

---

## 🔧 Build Process

```
Source Code (TypeScript + JSX)
      ↓
Vite Dev Server / Build
      ↓
TypeScript Compilation
      ↓
Tailwind CSS Processing
      ↓
React Component Bundling
      ↓
Code Splitting
      ↓
Minification
      ↓
Production Bundle
```

---

## 🎯 Performance Optimizations

### 1. **Code Splitting**
- Automatic with Vite
- Dynamic imports for large components

### 2. **Image Optimization**
- WebP format
- Responsive images with srcSet
- Lazy loading

### 3. **CSS Optimization**
- Tailwind purges unused styles
- Critical CSS inlined

### 4. **Bundle Size**
- Tree-shaking unused code
- Minification in production

---

## 🔐 Type Safety

### TypeScript Benefits
```typescript
// Props are typed
interface ButtonProps {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  children: React.ReactNode
}

// State is typed
const [isOpen, setIsOpen] = useState<boolean>(false)

// Events are typed
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
```

---

## 🧩 Reusable Components

### UI Components (`src/components/ui/`)
- **Button** - Multiple variants and sizes
- **Card** - Flexible card layouts
- **Sheet** - Mobile drawer/modal

### Feature Components (`src/components/`)
- **Navbar** - Reusable navigation
- **Footer** - Reusable footer
- **FeaturedCards** - Grid of promotional cards

---

## 📈 Scalability Considerations

### Easy to Add:
- ✅ New pages (with React Router)
- ✅ New sections (component-based)
- ✅ New UI components (shadcn/ui pattern)
- ✅ API integration (fetch/axios)
- ✅ State management (Context/Zustand)
- ✅ Authentication (Firebase/Auth0)
- ✅ Testing (Vitest/Playwright)

### Current Limitations:
- No routing (single page)
- No API integration
- No authentication
- No state persistence
- No testing setup

---

## 🎓 Best Practices Implemented

1. ✅ **Component Composition** - Small, focused components
2. ✅ **Type Safety** - Full TypeScript coverage
3. ✅ **Accessibility** - Semantic HTML, ARIA labels
4. ✅ **Responsive Design** - Mobile-first approach
5. ✅ **Performance** - Optimized builds
6. ✅ **Code Organization** - Clear folder structure
7. ✅ **Reusability** - DRY principle
8. ✅ **Maintainability** - Clean, readable code
9. ✅ **Modern Stack** - Latest technologies
10. ✅ **Documentation** - Comprehensive docs

---

**Architecture designed for scalability and maintainability! 🚀**
