# 🚀 Quick GitHub Issue Creator - TON Platform MVP

## 📋 Step-by-Step Instructions

### Step 1: Open GitHub Issue Creator
**Click here**: https://github.com/RoliesDonald/TON_platform/issues/new

### Step 2: Create Issue 1 (T001)
**Title**: `T001: Create backend project structure following Clean Architecture`
**Labels**: `backend, enhancement, priority-critical`
**Body**: Copy the content below and paste it:

```markdown
**Task ID**: T001
**Description**: Create backend project structure following Clean Architecture

**File Path**: backend/

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**Implementation Notes**:
- Follow the Clean Architecture pattern for backend code
- Implement proper error handling and logging
- Add appropriate tests when applicable

**Directory Structure to Create**:
```
backend/
├── cmd/server/main.go                    # Application entry point
├── internal/
│   ├── domain/                            # Business entities
│   │   ├── user.go
│   │   ├── vehicle.go
│   │   ├── workorder.go
│   │   ├── inventory.go
│   │   └── invoice.go
│   ├── repository/                       # Data access layer
│   │   ├── interfaces/
│   │   └── postgres/
│   ├── service/                          # Business logic
│   ├── handler/                          # HTTP handlers
│   ├── middleware/                       # HTTP middleware
│   └── config/                           # Configuration
├── pkg/                                 # Shared utilities
├── migrations/                          # Database migrations
└── tests/                               # Test files
```

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)
- [Implementation Plan](specs/001-ton-platform-setup/plan.md)
- [Task List](specs/001-ton-platform-setup/tasks.md)

**Labels**: backend,enhancement,priority-critical
```

**Click "Submit new issue"**

---

### Step 3: Create Issue 2 (T002)
**Go to**: https://github.com/RoliesDonald/TON_platform/issues/new

**Title**: `T002: Initialize Golang module with required dependencies (Gin, GORM, JWT, etc.)`
**Labels**: `backend, enhancement, priority-critical`
**Body**: Copy the content below and paste it:

```markdown
**Task ID**: T002
**Description**: Initialize Golang module with required dependencies (Gin, GORM, JWT, etc.)

**File Path**: backend/go.mod

**Context**:
This task is part of the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

**Required Dependencies**:
- `github.com/gin-gonic/gin` - HTTP web framework
- `github.com/golang-jwt/jwt/v5` - JWT authentication
- `github.com/lib/pq` - PostgreSQL driver
- `gorm.io/gorm` - ORM for database operations
- `gorm.io/driver/postgres` - PostgreSQL driver for GORM
- `github.com/spf13/viper` - Configuration management
- `github.com/go-redis/redis/v8` - Redis client
- `golang.org/x/crypto` - Password hashing (bcrypt)
- `github.com/go-playground/validator/v10` - Input validation
- `github.com/sirupsen/logrus` - Structured logging
- `github.com/golang-migrate/migrate/v4` - Database migrations

**Commands to Run**:
```bash
cd backend
go mod init ton-platform
go get github.com/gin-gonic/gin
go get github.com/golang-jwt/jwt/v5
go get github.com/lib/pq
go get gorm.io/gorm
go get gorm.io/driver/postgres
go get github.com/spf13/viper
go get github.com/go-redis/redis/v8
go get golang.org/x/crypto
go get github.com/go-playground/validator/v10
go get github.com/sirupsen/logrus
go get github.com/golang-migrate/migrate/v4
```

**Labels**: backend,enhancement,priority-critical
```

**Click "Submit new issue"**

---

### Step 4: Create Issue 3 (T008)
**Go to**: https://github.com/RoliesDonald/TON_platform/issues/new

**Title**: `T008: Setup PostgreSQL database with initial schema and migrations`
**Labels**: `backend, enhancement, priority-critical`
**Body**: Copy the content below and paste it:

```markdown
**Task ID**: T008
**Description**: Setup PostgreSQL database with initial schema and migrations

**File Path**: backend/migrations/

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

**Migration Files to Create**:
- 001_create_users_table.up.sql
- 002_create_roles_table.up.sql
- 003_create_permissions_table.up.sql
- 004_create_warehouses_table.up.sql
- 005_create_vehicles_table.up.sql

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)

**Labels**: backend,enhancement,priority-critical
```

**Click "Submit new issue"**

---

### Step 5: Create Issue 4 (T009)
**Go to**: https://github.com/RoliesDonald/TON_platform/issues/new

**Title**: `T009: Implement JWT authentication framework with bcrypt password hashing`
**Labels**: `backend, enhancement, priority-critical`
**Body**: Copy the content below and paste it:

```markdown
**Task ID**: T009
**Description**: Implement JWT authentication framework with bcrypt password hashing

**File Path**: backend/internal/middleware/auth.go

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

**Files to Create**:
- backend/internal/middleware/auth.go
- backend/internal/service/auth_service.go
- backend/internal/handler/auth_handler.go

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)

**Labels**: backend,enhancement,priority-critical
```

**Click "Submit new issue"**

---

### Step 6: Create Issue 5 (T010)
**Go to**: https://github.com/RoliesDonald/TON_platform/issues/new

**Title**: `T010: Create role-based access control (RBAC) middleware for 6 user roles`
**Labels**: `backend, enhancement, priority-critical`
**Body**: Copy the content below and paste it:

```markdown
**Task ID**: T010
**Description**: Create role-based access control (RBAC) middleware for 6 user roles

**File Path**: backend/internal/middleware/rbac.go

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

**Files to Create**:
- backend/internal/middleware/rbac.go
- backend/internal/domain/role.go
- backend/internal/domain/permission.go

**Related Documentation**:
- [Specification Document](specs/001-ton-platform-setup/spec.md)

**Labels**: backend,enhancement,priority-critical
```

**Click "Submit new issue"**

---

## 🎉 Done!

**You should now have 5 critical MVP issues created:**
✅ T001: Backend project structure
✅ T002: Go module with dependencies
✅ T008: PostgreSQL database setup
✅ T009: JWT authentication framework
✅ T010: RBAC middleware

**Next Step**: Let me know when all issues are created, and we'll start implementing T001! 🚀