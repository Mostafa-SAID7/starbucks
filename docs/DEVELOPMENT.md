<div align="center">

# 🛠️ Development Guide

**Guidelines for setting up the development environment, technology stack, and coding standards.**

</div>

---

## 1. Prerequisites

Before starting, ensure your local machine is equipped with the following:

- **Node.js**: v20 or higher
- **.NET SDK**: v9.0 or higher
- **SQL Server**: Local instance or Docker container
- **Redis**: Local instance or Docker container (optional for dev)
- **Git**: For version control

---

## 2. Quick Start

### 1. Clone & Prepare
```bash
git clone <repository-url>
cd starbucks-eg-react
```

### 2. Backend Setup
```bash
cd Backend

# Start infrastructure via Docker
docker-compose up -d

# Build and Run
dotnet restore
dotnet run --project src/Starbucks.API
```
> The API runs on `https://localhost:7082` by default.

### 3. Frontend Setup
```bash
cd Frontend
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```
> The UI runs on `http://localhost:5173` by default.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **State Management**: TanStack Query (Server), Zustand (Client)
- **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **Form Handling**: React Hook Form + Zod
- **i18n**: i18next

### Backend
- **Framework**: ASP.NET Core 9.0
- **Database**: SQL Server (EF Core)
- **Caching**: Redis
- **Patterns**: CQRS with MediatR, Repository Pattern, Clean Architecture
- **Validation**: FluentValidation
- **Logging**: Serilog

---

## 4. Coding Standards

### Frontend Best Practices
- Use **functional components** and React Hooks.
- Prefix custom hooks with `use`.
- Maintain strictly typed props and API responses.
- Use **CSS logical properties** (e.g., `margin-inline`, `padding-block`) for automatic RTL compatibility.

### Backend Best Practices
- Follow **Clean Architecture** boundaries strictly.
- Ensure all business logic stays in the `Application` layer.
- Use **async/await** for all I/O bound operations.
- Write meaningful unit tests for all CQRS Handlers.

---

## 5. Deployment Commands

### Production Build

**Frontend**
```bash
cd Frontend
npm run build
```

**Backend**
```bash
cd Backend
dotnet publish -c Release
```

---

<div align="center">
  <b>Related Documents</b> <br/>
  <a href="ARCHITECTURE.md">ARCHITECTURE.md</a> &nbsp;&bull;&nbsp; <a href="FEATURES.md">FEATURES.md</a>
</div>
