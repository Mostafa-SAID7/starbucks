# ⚡ Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd starbucks-eg-react
npm install
```

### 2️⃣ Start Development Server
```bash
npm run dev
```

### 3️⃣ Open in Browser
Navigate to: **http://localhost:5173**

---

## 📱 What You'll See

✅ **Sticky Navbar** with Starbucks logo and Arabic menu  
✅ **Hero Banner** with Gaza donation message  
✅ **Statement Section** with official Starbucks content  
✅ **5 Featured Cards** with hover effects and CTAs  
✅ **Footer** with links and country selector  

---

## 🎨 Key Features

- **RTL Layout** - Full Arabic right-to-left support
- **Responsive** - Works on mobile, tablet, and desktop
- **Animated** - Smooth Framer Motion transitions
- **Modern** - React 18 + TypeScript + Vite
- **Styled** - Tailwind CSS with Starbucks theme

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Navbar.tsx       # Top navigation
│   ├── HeroBanner.tsx   # Hero section
│   ├── StatementSection.tsx
│   ├── FeaturedCards.tsx
│   └── Footer.tsx
├── lib/
│   └── utils.ts         # Helper functions
├── App.tsx              # Main app
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## 🎯 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  starbucks: {
    green: '#006241',
    dark: '#1e3932',
    gold: '#cba258',
  }
}
```

### Update Content
Edit component files in `src/components/`

### Add New Section
1. Create component in `src/components/YourSection.tsx`
2. Import in `src/App.tsx`
3. Add to JSX: `<YourSection />`

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

### Dependencies Issue?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build Errors?
```bash
# Clear cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

---

## ✨ Tips

1. **Hot Reload** - Changes appear instantly in browser
2. **TypeScript** - Hover over code for type hints
3. **Tailwind** - Use IntelliSense for class suggestions
4. **Components** - Reuse UI components from `ui/` folder
5. **RTL** - All layouts automatically support Arabic

---

**Happy Coding! 🎉**

Built with ❤️ using React + Vite + TypeScript + Tailwind CSS
