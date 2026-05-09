# Phase 4: Database Migrations, Seeding & Testing

## Overview
Phase 4 focuses on ensuring the database is properly set up, seeded with initial data, and thoroughly tested. This phase validates that all previous architectural improvements work correctly in a real database environment.

## Current Status
- ✅ Phase 1-3: Architecture refactoring complete
- ✅ Backend builds successfully (Debug & Release)
- ✅ All duplicates eliminated
- ✅ Proper layer separation achieved
- ⏳ Phase 4: Database setup and validation (NEXT)

## Phase 4 Objectives

### 1. Database Migration Validation
- [ ] Verify existing migration (20260509105036_InitialCreate)
- [ ] Check migration naming conventions
- [ ] Validate migration idempotency
- [ ] Test migration rollback capability
- [ ] Document migration strategy

### 2. Data Seeding Verification
- [ ] Test DataSeeder orchestrator
- [ ] Verify all 6 seeders execute in correct order:
  - MenuCategorySeeder
  - MenuSubcategorySeeder
  - MenuItemSeeder
  - MenuItemVariantSeeder
  - LocationSeeder
  - UserSeeder
- [ ] Validate seed data integrity
- [ ] Test seed data relationships
- [ ] Verify no duplicate seeds on re-run

### 3. Database Connection Testing
- [ ] Test local database connection
- [ ] Test connection string configuration
- [ ] Verify connection pooling
- [ ] Test connection timeout handling
- [ ] Document connection requirements

### 4. Entity Relationship Validation
- [ ] Verify all foreign keys
- [ ] Check cascade delete behavior
- [ ] Validate unique constraints
- [ ] Test soft delete functionality
- [ ] Verify indexes are created

### 5. API Integration Testing
- [ ] Test GET endpoints with seeded data
- [ ] Test POST endpoints (create operations)
- [ ] Test PUT endpoints (update operations)
- [ ] Test DELETE endpoints (soft delete)
- [ ] Test filtering and pagination

### 6. Performance Testing
- [ ] Measure query performance
- [ ] Check N+1 query problems
- [ ] Validate index usage
- [ ] Test cache effectiveness
- [ ] Profile memory usage

### 7. Documentation
- [ ] Document database schema
- [ ] Document seeding process
- [ ] Document migration strategy
- [ ] Create troubleshooting guide
- [ ] Create setup instructions

## Detailed Tasks

### Task 1: Verify Migration File
**File**: `Backend/src/Starbucks.Infrastructure/Data/Migrations/20260509105036_InitialCreate.cs`

**Checklist**:
- [ ] Migration name follows convention: `YYYYMMDDHHMMSS_Description`
- [ ] Up() method creates all tables
- [ ] Down() method drops all tables
- [ ] All entity configurations are applied
- [ ] Indexes are created
- [ ] Constraints are defined

### Task 2: Test DataSeeder Execution
**File**: `Backend/src/Starbucks.Infrastructure/Data/DataSeeder.cs`

**Checklist**:
- [ ] Seeder is called from Program.cs
- [ ] Seeding happens after migrations
- [ ] All 6 seeders execute in order
- [ ] Seeding is idempotent (safe to run multiple times)
- [ ] Error handling is proper
- [ ] Logging is comprehensive

### Task 3: Validate Seed Data
**Files**: `Backend/src/Starbucks.Infrastructure/Data/Seeds/*.cs`

**Checklist**:
- [ ] MenuCategorySeeder creates 2 categories (Drinks, Food)
- [ ] MenuSubcategorySeeder creates 2 subcategories per category
- [ ] MenuItemSeeder creates 2 items per subcategory
- [ ] MenuItemVariantSeeder creates 3 variants per item
- [ ] LocationSeeder creates 2 locations
- [ ] UserSeeder creates admin and customer users
- [ ] All relationships are valid
- [ ] No orphaned records

### Task 4: Test API Endpoints
**Endpoints to Test**:
- [ ] GET /api/v1/menu - Get all menu categories
- [ ] GET /api/v1/menu/categories/{id} - Get category details
- [ ] GET /api/v1/locations - Get all locations
- [ ] GET /api/v1/locations/{id} - Get location details
- [ ] GET /api/v1/auth/profile - Get user profile (authenticated)
- [ ] POST /api/v1/auth/login - Login with seeded user
- [ ] POST /api/v1/auth/register - Register new user

### Task 5: Performance Profiling
**Metrics to Measure**:
- [ ] Average query time for menu retrieval
- [ ] Average query time for location retrieval
- [ ] Cache hit rate
- [ ] Database connection pool utilization
- [ ] Memory usage during seeding

### Task 6: Create Documentation
**Documents to Create**:
- [ ] Database Setup Guide
- [ ] Seeding Process Documentation
- [ ] Migration Strategy Document
- [ ] Troubleshooting Guide
- [ ] Performance Baseline Report

## Implementation Steps

### Step 1: Verify Current State
```bash
# Check if database exists
dotnet ef database info

# List all migrations
dotnet ef migrations list

# Check pending migrations
dotnet ef migrations pending
```

### Step 2: Create Fresh Database
```bash
# Drop existing database (if needed)
dotnet ef database drop --force

# Create database from migrations
dotnet ef database update

# Verify database was created
dotnet ef database info
```

### Step 3: Run Seeding
```bash
# The seeding happens automatically in Program.cs
# Just run the application
dotnet run

# Or run in development
dotnet run --environment Development
```

### Step 4: Verify Seeded Data
```sql
-- Check categories
SELECT * FROM MenuCategories;

-- Check subcategories
SELECT * FROM MenuSubcategories;

-- Check items
SELECT * FROM MenuItems;

-- Check variants
SELECT * FROM MenuItemVariants;

-- Check locations
SELECT * FROM Locations;

-- Check users
SELECT * FROM Users;
```

### Step 5: Test API Endpoints
```bash
# Get menu
curl http://localhost:5000/api/v1/menu

# Get locations
curl http://localhost:5000/api/v1/locations

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@starbucks.eg","password":"Admin@123"}'
```

## Success Criteria

### Database
- ✅ Migration executes without errors
- ✅ All tables are created
- ✅ All constraints are applied
- ✅ All indexes are created

### Seeding
- ✅ All seeders execute successfully
- ✅ Correct number of records created
- ✅ All relationships are valid
- ✅ Seeding is idempotent

### API
- ✅ All GET endpoints return data
- ✅ All POST endpoints create records
- ✅ All PUT endpoints update records
- ✅ All DELETE endpoints soft-delete records
- ✅ Pagination works correctly
- ✅ Filtering works correctly

### Performance
- ✅ Query time < 100ms for menu retrieval
- ✅ Query time < 100ms for location retrieval
- ✅ Cache hit rate > 80%
- ✅ Memory usage < 100MB

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Migration fails | Database not created | Test migration in isolation first |
| Seeding fails | Incomplete data | Add comprehensive error handling |
| Data integrity issues | Corrupted relationships | Validate all foreign keys |
| Performance issues | Slow API responses | Profile queries and add indexes |
| Connection issues | API can't reach DB | Test connection string configuration |

## Timeline

| Task | Duration | Status |
|------|----------|--------|
| Verify migration | 30 min | ⏳ TODO |
| Test seeding | 1 hour | ⏳ TODO |
| Validate data | 1 hour | ⏳ TODO |
| Test API endpoints | 2 hours | ⏳ TODO |
| Performance testing | 1 hour | ⏳ TODO |
| Documentation | 1 hour | ⏳ TODO |
| **Total** | **6.5 hours** | ⏳ TODO |

## Next Phase (Phase 5)

After Phase 4 is complete, Phase 5 will focus on:
- [ ] API endpoint implementation for incomplete features
- [ ] Authentication & Authorization testing
- [ ] Rate limiting validation
- [ ] CORS configuration testing
- [ ] Error handling verification
- [ ] Logging & Monitoring setup

## Notes

- All previous phases (1-3) are complete and verified
- Backend builds successfully in both Debug and Release
- No compilation errors or warnings (except BCrypt compatibility)
- Architecture is clean with proper layer separation
- All duplicates have been eliminated
- Ready to proceed with database validation

## References

- [Entity Framework Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [Data Seeding](https://learn.microsoft.com/en-us/ef/core/modeling/data-seeding)
- [Connection Strings](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-strings)
- [Performance Tuning](https://learn.microsoft.com/en-us/ef/core/performance/)
