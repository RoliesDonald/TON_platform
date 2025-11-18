# 🚀 GitHub Issue Creation Guide - TON Platform

## 🎯 Fastest Method: Manual Issue Creation (5 minutes)

### Step 1: Go to GitHub
Open: https://github.com/RoliesDonald/TON_platform/issues/new

### Step 2: Create First Issue (T001)

**Title**: `T001: Create backend project structure following Clean Architecture`

**Labels**: `backend, enhancement, priority-critical`

**Body**:
```markdown
**Task ID**: T001
**User Story**:
**Description**: Create backend project structure following Clean Architecture

**File Path**: backend/

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**Implementation Notes**:
- Follow the Clean Architecture pattern for backend code
- Use TypeScript for frontend development
- Implement proper error handling and logging
- Add appropriate tests when applicable

**Detailed Requirements**:
- Create Clean Architecture directory structure
- Set up `backend/cmd/server/` for application entry point
- Create `backend/internal/` for private application code
- Set up `backend/pkg/` for shared libraries
- Create `backend/migrations/` for database migration files
- Set up `backend/tests/` for test files

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)
- [Implementation Plan](specs/001-ton-platform-setup/plan.md)
- [Task List](specs/001-ton-platform-setup/tasks.md)
```

### Step 3: Create Second Issue (T002)

**Title**: `T002: Initialize Golang module with required dependencies (Gin, GORM, JWT, etc.)`

**Labels**: `backend, enhancement, priority-critical`

**Body**:
```markdown
**Task ID**: T002
**Description**: Initialize Golang module with required dependencies (Gin, GORM, JWT, etc.)

**File Path**: backend/go.mod

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**Implementation Notes**:
- Follow the Clean Architecture pattern for backend code
- Add required dependencies: Gin, GORM, JWT, PostgreSQL driver, etc.
- Set up proper Go module structure

**Required Dependencies**:
- `github.com/gin-gonic/gin` - HTTP web framework
- `github.com/golang-jwt/jwt/v5` - JWT authentication
- `github.com/lib/pq` - PostgreSQL driver
- `gorm.io/gorm` - ORM for database operations
- `github.com/spf13/viper` - Configuration management
- `github.com/go-redis/redis/v8` - Redis client
- `golang.org/x/crypto` - Password hashing (bcrypt)
- `github.com/go-playground/validator/v10` - Input validation

**Related Documentation**:
- [Task List](specs/001-ton-platform-setup/tasks.md)
```

### Step 4: Create Third Issue (T008)

**Title**: `T008: Setup PostgreSQL database with initial schema and migrations`

**Labels**: `backend, enhancement, priority-critical`

**Body**:
```markdown
**Task ID**: T008
**Description**: Setup PostgreSQL database with initial schema and migrations

**File Path**: backend/migrations/

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**Database Connection Info**:
- Host: localhost:5432
- Database: ton_platform
- User: ton_user
- Password: ton_password

**Schema Requirements**:
- users table (authentication and roles)
- roles table (6 user roles)
- permissions table (RBAC matrix)
- warehouses table (multi-location inventory)
- vehicles table (fleet management)
- work_orders table (workshop operations)
- inventory_items table (spare parts)
- inventory_transactions table (stock movements)
- invoices table (billing)
- payments table (payment processing)

**Related Documentation**:
- [Implementation Plan](specs/001-ton-platform-setup/plan.md)
```

### Step 5: Create Fourth Issue (T009)

**Title**: `T009: Implement JWT authentication framework with bcrypt password hashing`

**Labels**: `backend, enhancement, priority-critical`

**Body**:
```markdown
**Task ID**: T009
**Description**: Implement JWT authentication framework with bcrypt password hashing

**File Path**: backend/internal/middleware/auth.go

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**Implementation Requirements**:
- JWT token generation and validation
- bcrypt password hashing (minimum 12 rounds)
- Secure token storage and refresh mechanism
- Password recovery functionality
- Session management with Redis

**Authentication Endpoints**:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout

**Security Considerations**:
- Secure password hashing
- JWT token expiration (short access token, longer refresh token)
- Rate limiting for login attempts
- Input validation and sanitization

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)
```

### Step 6: Create Fifth Issue (T010)

**Title**: `T010: Create role-based access control (RBAC) middleware for 6 user roles`

**Labels**: `backend, enhancement, priority-critical`

**Body**:
```markdown
**Task ID**: T010
**Description**: Create role-based access control (RBAC) middleware for 6 user roles

**File Path**: backend/internal/middleware/rbac.go

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**User Roles** (from specification):
1. **Junior/Senior Mechanic** - Workshop operations, parts usage, engine scanning
2. **Service Advisor** - Work order management, customer communication
3. **Warehouse Staff** - Inventory management, stock transfers
4. **Driver/Coordinator** - Service requests, vehicle tracking
5. **Area Manager** - PS allocation approval, fleet tracking dashboard
6. **Accountant** - Billing, payment reconciliation

**Implementation Requirements**:
- Role-based middleware for API endpoints
- Permission matrix implementation
- Role assignment and validation
- Secure role switching (for administrators)

**Permission Matrix**:
- Each role has specific permissions for different endpoints
- Middleware should check user role before allowing access
- Proper error responses for unauthorized access

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)
```

---

## 🎉 After Creating Issues

Once you've created all 5 issues, you'll have:

✅ **T001**: Backend project structure
✅ **T002**: Golang module and dependencies
✅ **T008**: PostgreSQL database setup
✅ **T009**: JWT authentication framework
✅ **T010**: RBAC middleware

**Next Step**: Start coding T001 - Create the backend directory structure! 🚀

---

## 🔄 Alternative Methods

### Method A: Use Generated Files
Copy content from:
- `github-issues/T001-create-backend-project-structure-following-clean-architecture.md`
- `github-issues/T002-initialize-golang-module-with-required-dependencies-gin-gorm-jwt-etc.md`
- `github-issues/T008-setup-postgresql-database-with-initial-schema-and-migrations.md`
- `github-issues/T009-implement-jwt-authentication-framework-with-bcrypt-password-hashing.md`
- `github-issues/T010-create-role-based-access-control-rbac-middleware-for-6-user-roles.md`

### Method B: Use API Script
```bash
# Run the script with your GitHub token
export GITHUB_TOKEN=ghp_your_token_here
./create-critical-issues.sh
```

---

**🎯 Recommended**: Use the manual method above - it's fastest and most reliable!