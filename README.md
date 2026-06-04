<div align="center">

# ☕ Starbucks Egypt

**Enterprise Full-Stack Commerce Platform**

<p align="center">
  A premium, enterprise-grade digital experience for Starbucks Egypt. <br/>
  Built with <strong>React 19</strong>, <strong>ASP.NET Core 9.0</strong>, and <strong>Clean Architecture</strong> <br/>
  to deliver high-performance, accessible, and bilingual (AR/EN) coffee commerce.
</p>

<p align="center">
  <a href="https://starbucks73.vercel.app">
    <img src="https://img.shields.io/badge/Frontend-Live_App-black?style=for-the-badge&logo=vercel" alt="Frontend Deployment" />
  </a>
  <a href="http://starbucks.runasp.net/api">
    <img src="https://img.shields.io/badge/Backend-Live_API-success?style=for-the-badge&logo=dotnet" alt="Backend Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  </a>
</p>

</div>

---

## 🚀 Live Environments

Explore the application in real-time through our live deployment environments:

| Service | Environment | Live URL |
| :--- | :--- | :--- |
| **✨ Frontend App** | Production | [starbucks73.vercel.app](https://starbucks73.vercel.app) |
| **⚙️ Backend API** | Production | [starbucks.runasp.net/api](http://starbucks.runasp.net/api) |
| **📚 API Docs** | Swagger UI | [starbucks.runasp.net/swagger](http://starbucks.runasp.net/swagger) |

---

## 🏗️ Technical Pillar

Our technology stack is selected to provide a world-class, ultra-fast, and highly scalable user experience.

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <h3>🎨 Frontend (Modern Stack)</h3>
      </td>
      <td align="center" width="50%">
        <h3>⚙️ Backend (Robust Architecture)</h3>
      </td>
    </tr>
    <tr>
      <td valign="top">
        <ul>
          <li><b>Framework:</b> React 19 + Vite</li>
          <li><b>Styling:</b> Tailwind CSS v4 (Glassmorphism & RTL support)</li>
          <li><b>State/Data:</b> TanStack Query v5 + Zustand</li>
          <li><b>Animations:</b> Framer Motion</li>
          <li><b>Localization:</b> i18next (Arabic / English)</li>
        </ul>
      </td>
      <td valign="top">
        <ul>
          <li><b>Core:</b> ASP.NET Core 9.0</li>
          <li><b>Architecture:</b> Clean Architecture & CQRS (MediatR)</li>
          <li><b>Persistence:</b> Entity Framework Core + SQL Server</li>
          <li><b>Caching:</b> Redis-backed sessions & response caching</li>
          <li><b>Security:</b> JWT Authentication & Identity</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

---

## 💻 Quick Start Guide

Want to run the project locally? Follow these simple steps.

### Frontend Setup
```bash
cd Frontend
npm install --legacy-peer-deps
npm run dev
```
> The frontend application will start on `http://localhost:5173`

### Backend Setup
```bash
cd Backend
# Start the database and Redis instances
docker-compose up -d

# Run the API server
dotnet run --project src/Starbucks.API
```
> The API will be available on `https://localhost:7082` (or your configured port). Check out `/swagger` for API documentation.

---

## 📂 Documentation Deep-Dive

For detailed insights into our technical decisions, system design, and deployment pipelines, please explore our dedicated documentation modules:

| Document | Description |
| :--- | :--- |
| [**🏗️ Architecture & Design**](docs/ARCHITECTURE.md) | Technical philosophy, system design, and project structure. |
| [**🛠️ Development Guide**](docs/DEVELOPMENT.md) | Local setup instructions, tech stack details, and coding standards. |
| [**✨ Features & Use Cases**](docs/FEATURES.md) | Checklist of platform capabilities and common user workflows. |
| [**🚢 Deployment Guide**](docs/DEPLOYMENT.md) | Production hosting configurations and CI/CD pipeline details. |
| [**🔒 Security Policy**](docs/SECURITY.md) | Security best practices, threat models, and audit results. |

---

## 🤝 Contributing & Support

We welcome contributions! Before submitting a Pull Request, please read our [Contributing Guide](docs/CONTRIBUTING.md) and review our [Code of Conduct](docs/CODE_OF_CONDUCT.md).

Need help or found a bug? Feel free to check the [Documentation Index](docs/README.md) or open a [GitHub Issue](issues).

<div align="center">
  <br/>
  <p><b>Built with ❤️ for the Starbucks Egypt Community</b></p>
</div>