# TON Platform Backend

Clean Architecture backend for the TON Platform - Integrated Business Management System for Vehicle Rental, Workshop Service, and Spare Parts Shop.

## 🏗️ Architecture

This backend follows Clean Architecture principles with the following structure:

```
backend/
├── cmd/server/           # Application entry points
├── internal/             # Private application code
│   ├── config/          # Configuration management
│   ├── domain/          # Business entities and interfaces
│   ├── handler/         # HTTP handlers (controllers)
│   ├── middleware/      # HTTP middleware
│   ├── repository/      # Data access layer
│   └── service/         # Business logic
├── pkg/                 # Shared libraries
├── migrations/          # Database migrations
└── tests/              # Test files
```

## 🚀 Getting Started

### Prerequisites

- Go 1.21+
- PostgreSQL 14+
- Redis 6+

### Database Setup

The database is already running via Docker Compose:

```bash
# Check database status
docker compose ps
```

Connection details:
- Host: localhost:5432
- Database: ton_platform
- User: ton_user
- Password: ton_password

### Installation

1. Clone the repository
2. Navigate to backend directory
3. Copy environment configuration:

```bash
cp .env.example .env
```

4. Install dependencies:

```bash
go mod tidy
```

5. Run the application:

```bash
go run cmd/server/main.go
```

### Running Tests

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...
```

## 📚 API Endpoints

### Health Check

- `GET /health` - Application health status

### API v1

- `GET /api/v1/ping` - API ping endpoint

### Authentication (Coming Soon)

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh

## 🔧 Configuration

The application uses environment variables for configuration. See `.env.example` for all available options.

## 📝 Features Implemented

- ✅ Clean Architecture project structure
- ✅ Domain entities for all business objects
- ✅ Configuration management
- ✅ HTTP middleware (CORS, Logging, Recovery)
- ✅ Standard API response format
- ✅ Health check endpoint
- ✅ PostgreSQL and Redis integration ready

## 🚧 Next Steps

1. Complete authentication system (T009)
2. Implement RBAC middleware (T010)
3. Create database migrations (T008)
4. Add user management endpoints
5. Implement vehicle management
6. Add work order management
7. Create inventory system
8. Add invoicing and payments

## 🛠️ Technology Stack

- **Language**: Go 1.21+
- **Web Framework**: Gin
- **Database**: PostgreSQL with GORM ORM
- **Cache**: Redis
- **Authentication**: JWT
- **Logging**: Logrus
- **Configuration**: Viper
- **Testing**: Go testing library

## 📋 Development Status

### Critical MVP Issues Created

- ✅ T001: Backend project structure - **COMPLETED**
- ✅ T002: Go module with dependencies - **COMPLETED**
- ⏳ T008: PostgreSQL database setup
- ⏳ T009: JWT authentication framework
- ⏳ T010: RBAC middleware

### Current Version

**v1.0.0-alpha** - Foundation and structure complete