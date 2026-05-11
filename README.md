# ☕ Starbucks Egypt - Enterprise Full-Stack

[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://starbucks73.vercel.app)
[![Backend Status](https://img.shields.io/badge/Backend-Live-success?style=for-the-badge&logo=dotnet)](http://starbucks.runasp.net/api)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A premium, enterprise-grade digital experience for Starbucks Egypt. Built with **React 19**, **ASP.NET Core 9.0**, and **Clean Architecture** to deliver high-performance, accessible, and bilingual (AR/EN) coffee commerce.

---

## 🚀 Live Environments

| Component | Service | URL |
| :--- | :--- | :--- |
| **✨ Frontend** | Production App | [starbucks73.vercel.app](https://starbucks73.vercel.app) |
| **⚙️ Backend** | RESTful API | [starbucks.runasp.net/api](http://starbucks.runasp.net/api) |
| **📚 API Docs** | Swagger UI | [starbucks.runasp.net/swagger](http://starbucks.runasp.net/swagger) |

---

## 🏗️ Technical Pillar

### Frontend (Modern Stack)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Glassmorphism & RTL support)
- **Data:** TanStack Query v5 + Zustand
- **Animations:** Framer Motion

### Backend (Robust Architecture)
- **Core:** ASP.NET Core 9.0 (Clean Architecture)
- **Persistence:** Entity Framework Core + SQL Server
- **Caching:** Redis-backed sessions and response caching
- **Patterns:** CQRS with MediatR & Repository Pattern

---

## 📂 Documentation Deep-Dive

For detailed information, please refer to our dedicated documentation modules:

- [**🏗️ Architecture & Design**](docs/ARCHITECTURE.md)
  *Technical philosophy, system design, and folder structure.*
- [**🛠️ Development Guide**](docs/DEVELOPMENT.md)
  *Setup instructions, technology stack, and coding standards.*
- [**✨ Features & Use Cases**](docs/FEATURES.md)
  *Checklist of capabilities and common user workflows.*
- [**🚢 Deployment Guide**](docs/DEPLOYMENT.md)
  *Production hosting guides and CI/CD pipeline details.*
- [**🔒 Security Policy**](docs/SECURITY.md)
  *Security best practices and audit results.*

---

## 💻 Quick Start

### Frontend
```bash
cd Frontend
npm install --legacy-peer-deps
npm run dev
```

### Backend
```bash
cd Backend
docker-compose up -d
dotnet run --project src/Starbucks.API
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) and [Code of Conduct](docs/CODE_OF_CONDUCT.md).

---

## 🆘 Support

Need help? Check the [Documentation Index](docs/README.md) or open a [GitHub Issue](issues).

---

**Built with ❤️ for the Starbucks Egypt Community**