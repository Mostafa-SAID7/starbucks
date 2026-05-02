<div align="center">

# ☕ Starbucks Egypt - React Clone

<img src="public/favicon.svg" alt="Starbucks Logo" width="120" height="120">

### A pixel-perfect, responsive clone of Starbucks Egypt website

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[Live Demo](https://starbucks-eg-react.vercel.app) • [Documentation](docs/) • [Report Bug](https://github.com/Mostafa-SAID7/starbucks/issues) • [Request Feature](https://github.com/Mostafa-SAID7/starbucks/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🐳 Docker](#-docker)
- [📁 Project Structure](#-project-structure)
- [🎨 Tech Stack](#-tech-stack)
- [📚 Documentation](#-documentation)
- [🛠️ Development](#️-development)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

<table>
<tr>
<td>

### 🎯 Core Features
- ✅ **React 18** with TypeScript
- ✅ **Vite** for blazing fast builds
- ✅ **Tailwind CSS** with custom theme
- ✅ **shadcn/ui** components
- ✅ **Framer Motion** animations
- ✅ **RTL Support** for Arabic

</td>
<td>

### 🎨 Design Features
- ✅ **Pixel-perfect** design
- ✅ **Fully responsive** (mobile-first)
- ✅ **Smooth animations**
- ✅ **Hover effects**
- ✅ **Cairo font** (Google Fonts)
- ✅ **Starbucks branding**

</td>
</tr>
</table>

### 📱 Implemented Sections

| Section | Description | Status |
|---------|-------------|--------|
| **Navbar** | Sticky header with logo, menu, and mobile drawer | ✅ Complete |
| **Hero Banner** | Full-width banner with CTA | ✅ Complete |
| **Statement** | Official Starbucks statement section | ✅ Complete |
| **Featured Cards** | 5 promotional cards with animations | ✅ Complete |
| **Footer** | Multi-column links with country selector | ✅ Complete |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Mostafa-SAID7/starbucks.git

# Navigate to project directory
cd starbucks

# Install dependencies
npm install

# Start development server
npm run dev
```

🎉 Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🐳 Docker

### Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access the app at [http://localhost:3000](http://localhost:3000)

### Using Docker

```bash
# Build image
docker build -t starbucks-eg-react .

# Run container
docker run -d -p 3000:80 --name starbucks-app starbucks-eg-react

# Stop container
docker stop starbucks-app
```

---

## 📁 Project Structure

```
starbucks-eg-react/
├── .github/                    # GitHub workflows & configs
│   ├── workflows/
│   │   ├── ci.yml             # CI/CD pipeline
│   │   ├── deploy.yml         # Deployment workflow
│   │   └── codeql.yml         # Security analysis
│   └── dependabot.yml         # Dependency updates
├── docs/                       # Documentation
│   ├── PROJECT_SUMMARY.md     # Complete project summary
│   ├── QUICK_START.md         # Quick start guide
│   └── ARCHITECTURE.md        # Technical architecture
├── public/                     # Static assets
│   └── favicon.svg            # Starbucks favicon
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── sheet.tsx
│   │   ├── Navbar.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── StatementSection.tsx
│   │   ├── FeaturedCards.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose config
├── nginx.conf                 # Nginx configuration
├── tailwind.config.js         # Tailwind configuration
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies
```

---

## 🎨 Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
<br>React 18
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
<br>Vite
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind" />
<br>Tailwind
</td>
<td align="center" width="96">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="48" height="48" alt="Docker" />
<br>Docker
</td>
</tr>
</table>

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.5 | UI framework |
| **TypeScript** | 6.0.2 | Type safety |
| **Vite** | 8.0.10 | Build tool |
| **Tailwind CSS** | 4.2.4 | Styling |
| **Framer Motion** | 12.38.0 | Animations |
| **Lucide React** | 1.14.0 | Icons |
| **shadcn/ui** | Latest | UI components |

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

| Document | Description |
|----------|-------------|
| [📊 Project Summary](docs/PROJECT_SUMMARY.md) | Complete overview of the project |
| [⚡ Quick Start Guide](docs/QUICK_START.md) | Get started in 3 steps |
| [🏗️ Architecture](docs/ARCHITECTURE.md) | Technical architecture & patterns |

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Starbucks Egypt
VITE_API_URL=https://api.example.com
```

### Customization

#### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  starbucks: {
    green: '#006241',  // Primary
    dark: '#1e3932',   // Dark green
    gold: '#cba258',   // Accent
  }
}
```

#### Add New Component

```bash
# Create component
touch src/components/YourComponent.tsx

# Import in App.tsx
import YourComponent from './components/YourComponent'
```

---

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mostafa-SAID7/starbucks)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Mostafa-SAID7/starbucks)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy with Docker

```bash
# Build and push to registry
docker build -t mostafasaid7/starbucks-eg-react .
docker push mostafasaid7/starbucks-eg-react

# Deploy to server
docker pull mostafasaid7/starbucks-eg-react
docker run -d -p 80:80 mostafasaid7/starbucks-eg-react
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Original design by [Starbucks Egypt](https://www.starbucks.eg)
- Built with modern web technologies
- Inspired by the official Starbucks website

---

## 📞 Contact & Support

<div align="center">

### Need Help?

📧 Email: mostafa.said@example.com  
🐛 Issues: [GitHub Issues](https://github.com/Mostafa-SAID7/starbucks/issues)  
💬 Discussions: [GitHub Discussions](https://github.com/Mostafa-SAID7/starbucks/discussions)

### Show Your Support

If you found this project helpful, please consider giving it a ⭐️!

[![GitHub stars](https://img.shields.io/github/stars/Mostafa-SAID7/starbucks?style=social)](https://github.com/Mostafa-SAID7/starbucks/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Mostafa-SAID7/starbucks?style=social)](https://github.com/Mostafa-SAID7/starbucks/network/members)

</div>

---

<div align="center">

**Built with ❤️ using React + TypeScript + Vite + Tailwind CSS**

[⬆ Back to Top](#-starbucks-egypt---react-clone)

</div>
