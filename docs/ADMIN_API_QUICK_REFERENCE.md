# Admin Panel API Quick Reference

**Base URL:** `/api/v1/admin`  
**Authentication:** Bearer token required  
**Authorization:** Admin or SuperAdmin role required (unless noted)

---

## User Management

### List Users
```
GET /users?pageNumber=1&pageSize=20&searchTerm=&role=
```
**Response:** `PagedResult<UserManagementDto>`

### Get User Details
```
GET /users/{id}
```
**Response:** `UserManagementDto`

### Create User
```
POST /users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+201234567890",
  "password": "SecurePassword123",
  "role": "Customer",
  "dateOfBirth": "1990-01-01"
}
```
**Response:** `UserManagementDto`

### Update User
```
PUT /users/{id}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+201234567890",
  "role": "Employee",
  "dateOfBirth": "1990-01-01"
}
```
**Response:** `UserManagementDto`

### Delete User (SuperAdmin only)
```
DELETE /users/{id}
```
**Response:** 204 No Content

### Disable User
```
POST /users/{id}/disable
```
**Response:** 200 OK

### Enable User
```
POST /users/{id}/enable
```
**Response:** 200 OK

### Reset Password
```
POST /users/{id}/reset-password
```
**Response:** `{ "temporaryPassword": "..." }`

### Change User Role (SuperAdmin only)
```
POST /users/{id}/role
Content-Type: application/json

{
  "role": "Manager"
}
```
**Response:** `UserManagementDto`

### Get User Activity
```
GET /users/{id}/activity?pageNumber=1&pageSize=20
```
**Response:** `PagedResult<UserActivityDto>`

### Get User Login History
```
GET /users/{id}/login-history?pageNumber=1&pageSize=20
```
**Response:** `PagedResult<UserLoginHistoryDto>`

---

## Analytics

### Dashboard Statistics
```
GET /analytics/dashboard
```
**Response:** `DashboardStatsDto`

### Sales Analytics
```
GET /analytics/sales?startDate=2026-01-01&endDate=2026-12-31
```
**Response:** `List<SalesAnalyticsDto>`

### User Analytics
```
GET /analytics/users?startDate=2026-01-01&endDate=2026-12-31
```
**Response:** `List<UserAnalyticsDto>`

### Order Analytics
```
GET /analytics/orders?startDate=2026-01-01&endDate=2026-12-31
```
**Response:** `List<OrderAnalyticsDto>`

### Location Performance
```
GET /analytics/locations
```
**Response:** `List<LocationPerformanceDto>`

### Menu Item Popularity
```
GET /analytics/menu-items
```
**Response:** `List<MenuItemPopularityDto>`

---

## Category Management

### List Categories
```
GET /categories?pageNumber=1&pageSize=20
```
**Response:** `PagedResult<CategoryManagementDto>`

### Get Category Details
```
GET /categories/{id}
```
**Response:** `CategoryManagementDto`

### Create Category
```
POST /categories
Content-Type: application/json

{
  "nameEn": "Hot Drinks",
  "nameAr": "المشروبات الساخنة",
  "descriptionEn": "Hot beverages",
  "descriptionAr": "المشروبات الساخنة",
  "image": "https://example.com/image.jpg",
  "displayOrder": 1
}
```
**Response:** `CategoryManagementDto`

### Update Category
```
PUT /categories/{id}
Content-Type: application/json

{
  "nameEn": "Hot Drinks",
  "nameAr": "المشروبات الساخنة",
  "displayOrder": 1,
  "isActive": true
}
```
**Response:** `CategoryManagementDto`

### Delete Category
```
DELETE /categories/{id}
```
**Response:** 204 No Content

---

## System Monitoring

### System Health Status
```
GET /monitoring/health
```
**Response:** `SystemHealthDto`

### Error Logs
```
GET /monitoring/errors?pageNumber=1&pageSize=20&severity=Error
```
**Response:** `PagedResult<ErrorLogDto>`

### Audit Logs
```
GET /monitoring/audit?pageNumber=1&pageSize=20&action=CREATE
```
**Response:** `PagedResult<AuditLogDto>`

### Performance Metrics
```
GET /monitoring/performance?startDate=2026-01-01&endDate=2026-12-31
```
**Response:** `List<PerformanceMetricsDto>`

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": ["Validation error message"]
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred",
  "traceId": "0HN1GKQR7AQKL:00000001"
}
```

---

## Role Permissions

| Feature | SuperAdmin | Admin | Manager |
|---------|:----------:|:-----:|:-------:|
| User Management | ✅ | ✅ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| Change Roles | ✅ | ❌ | ❌ |
| Analytics (Full) | ✅ | ✅ | ✅ |
| Category Management | ✅ | ✅ | ✅ |
| System Monitoring | ✅ | ✅ | ❌ |
| Content Moderation | ✅ | ✅ | ❌ |

---

## Common Filters

### User Filters
- `searchTerm`: Search by name or email
- `role`: Filter by user role (Customer, Employee, Manager, Admin, SuperAdmin)
- `isEmailVerified`: Filter by email verification status
- `isLocked`: Filter by account lock status
- `createdAfter`: Filter by creation date (after)
- `createdBefore`: Filter by creation date (before)

### Error Log Filters
- `severity`: Filter by severity (Info, Warning, Error, Critical)
- `startDate`: Filter by date range (start)
- `endDate`: Filter by date range (end)
- `searchTerm`: Search by message or path
- `statusCode`: Filter by HTTP status code

### Audit Log Filters
- `action`: Filter by action (CREATE, UPDATE, DELETE)
- `entityType`: Filter by entity type (User, Category, MenuItem)
- `userId`: Filter by user ID
- `startDate`: Filter by date range (start)
- `endDate`: Filter by date range (end)
- `searchTerm`: Search by notes or entity ID

---

## Pagination

All list endpoints support pagination:
- `pageNumber`: Page number (default: 1)
- `pageSize`: Items per page (default: 20)

Response includes:
```json
{
  "items": [...],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 5,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

---

## Date Format

All dates use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.fffZ`

Example: `2026-05-09T14:30:00.000Z`

---

## Rate Limiting

- **Limit:** 1000 requests per hour per user
- **Header:** `X-RateLimit-Remaining`
- **Status:** 429 Too Many Requests when exceeded

---

## Audit Logging

All admin actions are automatically logged with:
- User ID and email
- Action type (CREATE, UPDATE, DELETE)
- Entity type and ID
- Before/after values (JSON)
- Timestamp
- IP address

---

## Examples

### Create a new admin user
```bash
curl -X POST http://localhost:5000/api/v1/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "phoneNumber": "+201234567890",
    "password": "SecurePassword123",
    "role": "Admin"
  }'
```

### Get dashboard statistics
```bash
curl -X GET http://localhost:5000/api/v1/admin/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get system health
```bash
curl -X GET http://localhost:5000/api/v1/admin/monitoring/health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated:** May 9, 2026  
**API Version:** 1.0

