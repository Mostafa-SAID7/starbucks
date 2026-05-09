# Admin Panel Quick Reference Guide

**Quick Links to Key Documents:**

## 📚 Main Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [Admin Panel Architecture](../Backend/docs/ADMIN_PANEL_ARCHITECTURE.md) | Complete design and implementation guide | 30 min |
| [Duplicate Analysis](./DUPLICATE_ANALYSIS_AND_CONSOLIDATION.md) | Identify and fix code duplicates | 20 min |
| [Admin Panel Summary](./ADMIN_PANEL_SUMMARY.md) | Overview and quick reference | 15 min |

---

## 🎯 Admin Panel Features at a Glance

### 1. User Management
- **Endpoints:** 11 (GET, POST, PUT, DELETE, POST actions)
- **Features:** CRUD, role management, activity tracking, password reset
- **Roles:** Admin, SuperAdmin

### 2. Content Moderation
- **Endpoints:** 6 (GET, POST)
- **Features:** Approve/reject content, flag items, audit trail
- **Roles:** Admin, SuperAdmin

### 3. Analytics & Reporting
- **Endpoints:** 7 (GET, POST)
- **Features:** Dashboard, sales, users, orders, locations, menu items, reports
- **Roles:** Admin, SuperAdmin, Manager (read-only)

### 4. Category Management
- **Endpoints:** 10 (GET, POST, PUT, DELETE)
- **Features:** CRUD categories, menu items, bulk operations
- **Roles:** Admin, SuperAdmin, Manager (read-only)

### 5. System Monitoring
- **Endpoints:** 5 (GET)
- **Features:** Health status, error logs, audit logs, performance, database
- **Roles:** Admin, SuperAdmin

---

## 🔧 Consolidation Tasks (Priority Order)

### Priority 1: Delete Duplicates
```bash
# Delete these files
rm Backend/src/StarbucksEgypt.Application/Common/Models/PaginatedList.cs
rm Frontend/src/services/api/ApiService.ts
rm Frontend/src/services/api/config.ts
rm Frontend/src/services/api/cache.ts
rm Frontend/src/services/api/retry.ts
```

### Priority 2: Create New Files
```bash
# Create these files
touch Backend/src/StarbucksEgypt.Domain/Enums/ErrorType.cs
touch Frontend/src/types/common/pagination.ts
touch Frontend/src/hooks/common/usePagination.ts
touch Frontend/src/lib/validation/schemas.ts
touch Frontend/src/hooks/common/useFormValidation.ts
touch Frontend/src/lib/errorMapping.ts
```

### Priority 3: Update Imports
```bash
# Find all imports of deleted files
grep -r "PaginatedList" Backend/src/
grep -r "ApiService" Frontend/src/

# Update to use new locations
# PaginatedList → PagedResult<T>
# ApiService → api from @/lib/api
```

---

## 📊 API Endpoint Summary

### User Management
```
GET    /api/v1/admin/users                    (List)
GET    /api/v1/admin/users/{id}               (Get)
POST   /api/v1/admin/users                    (Create)
PUT    /api/v1/admin/users/{id}               (Update)
DELETE /api/v1/admin/users/{id}               (Delete)
POST   /api/v1/admin/users/{id}/disable       (Disable)
POST   /api/v1/admin/users/{id}/enable        (Enable)
POST   /api/v1/admin/users/{id}/reset-password (Reset)
POST   /api/v1/admin/users/{id}/role          (Change Role)
GET    /api/v1/admin/users/{id}/activity      (Activity)
GET    /api/v1/admin/users/{id}/login-history (History)
```

### Analytics
```
GET    /api/v1/admin/analytics/dashboard      (Dashboard)
GET    /api/v1/admin/analytics/sales          (Sales)
GET    /api/v1/admin/analytics/users          (Users)
GET    /api/v1/admin/analytics/orders         (Orders)
GET    /api/v1/admin/analytics/locations      (Locations)
GET    /api/v1/admin/analytics/menu-items     (Menu Items)
POST   /api/v1/admin/analytics/reports        (Reports)
```

### Categories
```
GET    /api/v1/admin/categories               (List)
GET    /api/v1/admin/categories/{id}          (Get)
POST   /api/v1/admin/categories               (Create)
PUT    /api/v1/admin/categories/{id}          (Update)
DELETE /api/v1/admin/categories/{id}          (Delete)
GET    /api/v1/admin/menu-items               (List Items)
GET    /api/v1/admin/menu-items/{id}          (Get Item)
POST   /api/v1/admin/menu-items               (Create Item)
PUT    /api/v1/admin/menu-items/{id}          (Update Item)
DELETE /api/v1/admin/menu-items/{id}          (Delete Item)
POST   /api/v1/admin/bulk-operations          (Bulk)
```

### Moderation
```
GET    /api/v1/admin/moderation/pending       (Pending)
GET    /api/v1/admin/moderation/flagged       (Flagged)
POST   /api/v1/admin/moderation/{id}/approve  (Approve)
POST   /api/v1/admin/moderation/{id}/reject   (Reject)
POST   /api/v1/admin/moderation/{id}/flag     (Flag)
GET    /api/v1/admin/moderation/history       (History)
```

### Monitoring
```
GET    /api/v1/admin/monitoring/health        (Health)
GET    /api/v1/admin/monitoring/errors        (Errors)
GET    /api/v1/admin/monitoring/audit         (Audit)
GET    /api/v1/admin/monitoring/performance   (Performance)
GET    /api/v1/admin/monitoring/database      (Database)
```

**Total: 37 endpoints**

---

## 🔐 Role-Based Access Control

| Feature | SuperAdmin | Admin | Manager | Employee | Customer |
|---------|:----------:|:-----:|:-------:|:--------:|:--------:|
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Content Moderation | ✅ | ✅ | ❌ | ❌ | ❌ |
| Analytics (Full) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Category Management | ✅ | ✅ | ✅ | ❌ | ❌ |
| System Monitoring | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change Admin Roles | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 📁 File Structure

### Backend
```
Backend/src/StarbucksEgypt.API/Controllers/
├── AdminController.cs
└── Admin/
    ├── UserManagementController.cs
    ├── ContentModerationController.cs
    ├── AnalyticsController.cs
    ├── CategoryManagementController.cs
    └── SystemMonitoringController.cs

Backend/src/StarbucksEgypt.Application/Features/Admin/
├── Users/ (Commands & Queries)
├── ContentModeration/
├── Analytics/
├── CategoryManagement/
└── SystemMonitoring/

Backend/src/StarbucksEgypt.Application/DTOs/Admin/
├── Users/
├── ContentModeration/
├── Analytics/
├── CategoryManagement/
└── SystemMonitoring/
```

### Frontend
```
Frontend/src/pages/AdminPanel/
├── AdminLayout.tsx
├── Dashboard/
├── UserManagement/
├── ContentModeration/
├── Analytics/
├── CategoryManagement/
└── SystemMonitoring/

Frontend/src/components/admin/
├── AdminSidebar.tsx
├── AdminHeader.tsx
├── AdminTable.tsx
├── AdminChart.tsx
├── PermissionGuard.tsx
└── ...

Frontend/src/hooks/admin/
├── useAdminUsers.ts
├── useAdminAnalytics.ts
├── useAdminCategories.ts
├── useAdminModeration.ts
└── useAdminMonitoring.ts

Frontend/src/services/admin/
├── adminUserService.ts
├── adminAnalyticsService.ts
├── adminCategoryService.ts
├── adminModerationService.ts
└── adminMonitoringService.ts
```

---

## 🚀 Implementation Timeline

| Phase | Duration | Focus | Deliverables |
|-------|----------|-------|--------------|
| 1 | Week 1-2 | Foundation | Controllers, DTOs, Auth, Audit |
| 2 | Week 3-4 | Core Features | Analytics, Categories, Frontend |
| 3 | Week 5-6 | Advanced | Moderation, Monitoring, Dashboard |
| 4 | Week 7-8 | Polish | Testing, Optimization, Docs |

**Total: 4-5 weeks (170 hours)**

---

## 🔍 Duplicate Patterns Found

| Pattern | Backend | Frontend | Action |
|---------|---------|----------|--------|
| Pagination | PagedResult<T> + PaginatedList<T> | None | Delete PaginatedList |
| Error Handling | Result<T> | AppError | Add ErrorType enum |
| Caching | Redis | In-memory | Document strategy |
| API Service | N/A | ApiService + api.ts | Delete ApiService |
| Token Management | TokenService | Interceptor | Add rotation |
| Validation | FluentValidation | None | Create Zod schemas |

---

## ✅ Pre-Implementation Checklist

- [ ] Read Admin Panel Architecture document
- [ ] Read Duplicate Analysis document
- [ ] Review API endpoint specifications
- [ ] Understand role-based access control
- [ ] Review file structure
- [ ] Understand implementation timeline
- [ ] Set up development environment
- [ ] Create feature branches
- [ ] Set up testing framework

---

## 🎓 Key Concepts

### CQRS Pattern
- Commands: Modify data (Create, Update, Delete)
- Queries: Read data (Get, List)
- Handlers: Process commands/queries
- Result<T>: Standardized response

### Clean Architecture
- Domain: Entities, enums, interfaces
- Application: DTOs, commands, queries, services
- Infrastructure: Database, external services
- API: Controllers, middleware

### Authorization
- Roles: SuperAdmin, Admin, Manager, Employee, Customer
- Attributes: [Authorize(Roles = "Admin")]
- Guards: PermissionGuard component
- Audit: AuditLog entity

---

## 📞 Quick Help

**Q: Where do I start?**
A: Read the Admin Panel Architecture document first

**Q: How do I implement a new feature?**
A: Follow the CQRS pattern with Commands/Queries

**Q: How do I handle authorization?**
A: Use [Authorize(Roles = "...")] attributes

**Q: How do I add a new admin page?**
A: Create page in pages/AdminPanel/, add route, add service

**Q: How do I test admin features?**
A: Create unit tests for services, integration tests for APIs

---

## 🔗 Related Documents

- [Full Architecture](../Backend/docs/ADMIN_PANEL_ARCHITECTURE.md)
- [Duplicate Analysis](./DUPLICATE_ANALYSIS_AND_CONSOLIDATION.md)
- [Admin Summary](./ADMIN_PANEL_SUMMARY.md)
- [Accessibility Implementation](../Frontend/src/lib/ACCESSIBILITY_IMPLEMENTATION.md)

---

**Last Updated:** May 9, 2026  
**Version:** 1.0  
**Status:** Ready for Implementation
