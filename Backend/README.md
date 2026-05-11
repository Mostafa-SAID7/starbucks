# ⚙️ Starbucks Egypt — Backend API

The enterprise-grade RESTful API powering the Starbucks Egypt application.

---

## 🏗️ Architecture

Built with **ASP.NET Core 9.0** following **Clean Architecture** principles:

- **Domain**: Enterprise logic and entities.
- **Application**: CQRS (MediatR), DTOs, and Validators.
- **Infrastructure**: Data access (EF Core + SQL Server) and Redis.
- **API**: Controllers and Middleware.

---

## 🚀 Quick Start

To run the backend locally:

```bash
cd Backend

# 1. Start dependencies (SQL Server, Redis)
docker-compose up -d

# 2. Run the application
dotnet run --project src/Starbucks.API
```

---

## 📚 Related Documentation

For the full project overview and technical deep-dives, please refer to the root documentation:

- [**🏠 Main Project README**](../README.md)
- [**🏗️ Architecture & Design**](../docs/ARCHITECTURE.md)
- [**🛠️ Development Guide**](../docs/DEVELOPMENT.md)
- [**🚢 Deployment Guide**](../docs/DEPLOYMENT.md)

---
*Built with ❤️ for the Starbucks Egypt Community.*
