# 🔍 T001 Implementation Preview: Backend Project Structure

## 📋 What We'll Build

**Clean Architecture for TON Platform Backend**

```
backend/
├── cmd/
│   └── server/
│       └── main.go                    # Application entry point
├── internal/
│   ├── domain/                        # Business entities and interfaces
│   │   ├── user.go                    # User entity and interfaces
│   │   ├── vehicle.go                 # Vehicle entity
│   │   ├── workorder.go               # Work Order entity
│   │   ├── inventory.go               # Inventory entities
│   │   └── invoice.go                 # Invoice entities
│   ├── repository/                    # Data access layer
│   │   ├── interfaces/
│   │   │   ├── user_repository.go     # Repository interfaces
│   │   │   ├── vehicle_repository.go  # Vehicle repository interface
│   │   │   └── ...
│   │   └── postgres/                  # PostgreSQL implementations
│   │       ├── user_postgres.go
│   │       ├── vehicle_postgres.go
│   │       └── ...
│   ├── service/                       # Business logic layer
│   │   ├── auth_service.go
│   │   ├── vehicle_service.go
│   │   ├── workorder_service.go
│   │   └── ...
│   ├── handler/                       # HTTP handlers (controllers)
│   │   ├── auth_handler.go
│   │   ├── vehicle_handler.go
│   │   ├── workorder_handler.go
│   │   └── ...
│   ├── middleware/                    # HTTP middleware
│   │   ├── auth.go                    # JWT authentication
│   │   ├── rbac.go                    # Role-based access control
│   │   ├── cors.go                    # CORS handling
│   │   └── logging.go                 # Request logging
│   └── config/                        # Configuration management
│       ├── database.go                # Database configuration
│       ├── redis.go                   # Redis configuration
│       └── jwt.go                     # JWT configuration
├── pkg/                               # Shared utilities
│   ├── response/                      # HTTP response utilities
│   ├── validator/                     # Input validation
│   └── utils/                         # General utilities
├── migrations/                        # Database migration files
│   ├── 001_create_users_table.up.sql
│   ├── 002_create_vehicles_table.up.sql
│   └── ...
├── tests/                             # Test files
│   ├── unit/                          # Unit tests
│   ├── integration/                   # Integration tests
│   └── contract/                      # API contract tests
├── go.mod                             # Go module file
├── go.sum                             # Go dependencies lock
├── Dockerfile                         # Docker configuration
└── README.md                          # Backend documentation
```

## 🚀 Key Components We'll Create

### 1. **Application Entry Point** (`cmd/server/main.go`)
```go
package main

import (
    "log"
    "github.com/gin-gonic/gin"
    "ton-platform/internal/config"
    "ton-platform/internal/middleware"
    "ton-platform/internal/handler"
)

func main() {
    // Load configuration
    cfg := config.Load()

    // Initialize database
    db := config.InitDB(cfg.Database)

    // Initialize Redis
    redis := config.InitRedis(cfg.Redis)

    // Setup Gin router
    router := gin.Default()

    // Apply middleware
    router.Use(middleware.Logging())
    router.Use(middleware.CORS())

    // Setup routes
    handler.SetupRoutes(router, db, redis)

    // Start server
    log.Printf("Server starting on port %s", cfg.Server.Port)
    router.Run(":" + cfg.Server.Port)
}
```

### 2. **Domain Layer** (`internal/domain/user.go`)
```go
package domain

import "time"

type User struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
    Username  string    `json:"username" gorm:"uniqueIndex;not null"`
    Email     string    `json:"email" gorm:"uniqueIndex;not null"`
    Password  string    `json:"-" gorm:"not null"` // Hidden in JSON
    FirstName string    `json:"first_name" gorm:"not null"`
    LastName  string    `json:"last_name" gorm:"not null"`
    RoleID    uint      `json:"role_id" gorm:"not null"`
    Role      Role      `json:"role" gorm:"foreignKey:RoleID"`
    IsActive  bool      `json:"is_active" gorm:"default:true"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type Role struct {
    ID          uint            `json:"id" gorm:"primaryKey"`
    Name        string          `json:"name" gorm:"uniqueIndex;not null"`
    Description string          `json:"description"`
    Permissions []Permission    `json:"permissions" gorm:"many2many:role_permissions;"`
}

type Permission struct {
    ID          uint   `json:"id" gorm:"primaryKey"`
    Name        string `json:"name" gorm:"uniqueIndex;not null"`
    Resource    string `json:"resource" gorm:"not null"` // api endpoint/resource
    Action      string `json:"action" gorm:"not null"`   // create, read, update, delete
    Description string `json:"description"`
}
```

### 3. **Repository Interface** (`internal/repository/interfaces/user_repository.go`)
```go
package interfaces

import (
    "ton-platform/internal/domain"
)

type UserRepository interface {
    Create(user *domain.User) error
    GetByID(id uint) (*domain.User, error)
    GetByEmail(email string) (*domain.User, error)
    Update(user *domain.User) error
    Delete(id uint) error
    GetAll(offset, limit int) ([]*domain.User, error)
    GetByRoleID(roleID uint) ([]*domain.User, error)
}
```

### 4. **Service Layer** (`internal/service/auth_service.go`)
```go
package service

import (
    "errors"
    "golang.org/x/crypto/bcrypt"
    "github.com/golang-jwt/jwt/v5"
    "ton-platform/internal/domain"
    "ton-platform/internal/repository/interfaces"
)

type AuthService struct {
    userRepo interfaces.UserRepository
    jwtSecret string
}

func NewAuthService(userRepo interfaces.UserRepository, jwtSecret string) *AuthService {
    return &AuthService{
        userRepo: userRepo,
        jwtSecret: jwtSecret,
    }
}

func (s *AuthService) Register(user *domain.User) error {
    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }

    user.Password = string(hashedPassword)
    return s.userRepo.Create(user)
}

func (s *AuthService) Login(email, password string) (string, *domain.User, error) {
    user, err := s.userRepo.GetByEmail(email)
    if err != nil {
        return "", nil, errors.New("invalid credentials")
    }

    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
    if err != nil {
        return "", nil, errors.New("invalid credentials")
    }

    token := s.generateToken(user)
    return token, user, nil
}
```

### 5. **Configuration Management** (`internal/config/database.go`)
```go
package config

import (
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

type DatabaseConfig struct {
    Host     string
    Port     string
    User     string
    Password string
    DBName   string
    SSLMode  string
}

func InitDB(cfg DatabaseConfig) (*gorm.DB, error) {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
        cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode)

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, err
    }

    return db, nil
}
```

## 🔧 Technical Decisions Made

### **1. Clean Architecture Principles**
- **Domain Layer**: Pure business logic, no dependencies
- **Repository Layer**: Data access abstraction
- **Service Layer**: Business logic orchestration
- **Handler Layer**: HTTP request/response handling

### **2. Technology Stack Integration**
- **GORM**: For database operations with PostgreSQL
- **Gin**: High-performance HTTP framework
- **JWT**: For stateless authentication
- **bcrypt**: For secure password hashing
- **Redis**: For session management and caching

### **3. Security Considerations**
- Password hashing with bcrypt (cost 12)
- JWT tokens with proper expiration
- Role-based access control (RBAC)
- Input validation and sanitization

## 🎯 Next Steps After T001

1. **T002**: Initialize Go module with dependencies
2. **T008**: Set up database with migrations
3. **T009**: Implement JWT authentication
4. **T010**: Add RBAC middleware

## 📊 Progress Tracking

- **T001 Status**: Ready to implement
- **Estimated Time**: 30-45 minutes
- **Dependencies**: None (can be done independently)
- **Testing**: Will create unit tests for each layer

---

## 💡 Ready to Start?

**Current Setup**:
- ✅ PostgreSQL running on localhost:5432
- ✅ Redis running on localhost:6379
- ✅ Clean Architecture plan ready
- ✅ GitHub issues content prepared

**Implementation Order**:
1. Create directory structure
2. Initialize Go module (T002)
3. Set up basic main.go
4. Create domain entities
5. Set up repository interfaces
6. Configure database connection

Would you like me to **start implementing T001** now, or would you prefer to **create the GitHub issues first**?