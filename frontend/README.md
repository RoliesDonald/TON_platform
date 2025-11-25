# TON Platform - Fleet Management System

**A comprehensive vehicle fleet management and maintenance tracking system built with Next.js 16, TypeScript, and Shadcn UI.**

## 🚀 Overview

The TON Platform is a full-stack application designed for managerial and administrative roles in vehicle fleet management. It provides real-time tracking, work order management, invoicing, and comprehensive reporting capabilities.

### Key Features

- 🔐 **Role-Based Authentication** (6 user roles: Admin, Manager, Accountant, Service Advisor, Mechanic, Driver)
- 📍 **Real-Time Vehicle Tracking** with map integration
- 🛠️ **Work Order Management** with parts and labor tracking
- 💰 **Invoicing & Payment System** with payment link generation
- 📊 **Comprehensive Reporting** and analytics
- 📱 **Responsive Design** for desktop, tablet, and mobile
- ⚡ **Real-Time Updates** and notifications

## 🏗️ Architecture

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, and Shadcn UI
- **Backend**: Go (Golang) with PostgreSQL database and Redis
- **Authentication**: JWT-based with role-based access control (RBAC)
- **Database**: PostgreSQL with comprehensive schemas for fleet management
- **API**: RESTful API endpoints with proper validation and error handling

## 📦 Project Structure

```
/Documents/TON/
├── frontend/                 # Next.js application (Port 3000)
│   ├── src/
│   │   ├── app/               # Next.js 13+ App Router pages
│   │   │   ├── dashboard/      # Dashboard and management pages
│   │   │   ├── invoices/       # Invoice management
│   │   │   └── login/         # Authentication
│   │   ├── components/        # Reusable UI components
│   │   └── contexts/          # React contexts (Auth, etc.)
│   ├── components.json        # Shadcn UI configuration
│   ├── package.json
│   └── README.md
│
├── backend/                  # Go backend application (Port 8080)
│   ├── cmd/                  # Command-line applications
│   ├── internal/             # Internal packages
│   ├── migrations/           # Database migrations
│   ├── pkg/                  # Public packages
│   └── main.go               # Backend entry point
│
├── database/                 # Database setup and scripts
├── docker-compose.yml         # Full stack Docker configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Go** 1.21+ (for backend)
- **Docker** and Docker Compose
- **PostgreSQL** (or use Docker)
- **Redis** (optional, for caching)

### Option 1: Frontend Only (Recommended for Development)

#### Frontend Setup

```bash
# Navigate to frontend directory
cd /home/rdonald/Documents/TON/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Login with any of these demo accounts:**
- **Admin**: `admin@ton.com` (password: `password`)
- **Manager**: `manager@ton.com` (password: `password`)
- **Accountant**: `accountant@ton.com` (password: `password`)
- **Service Advisor**: `service@ton.com` (password: `password`)
- **Mechanic**: `mechanic@ton.com` (password: `password`)
- **Driver**: `driver@ton.com` (password: `password`)

### Option 2: Full Stack with Docker

#### Using Docker Compose (Recommended)

```bash
# Navigate to project root
cd /home/rdonald/Documents/TON

# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# Check services status
docker-compose ps
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432
- **Redis**: localhost:6379

#### Stop Services

```bash
docker-compose down
```

### Option 3: Backend + Frontend Separately

#### Backend Setup

```bash
# Navigate to backend directory
cd /home/rdonald/Documents/TON/backend

# Install Go dependencies
go mod download

# Run backend server
go run cmd/server/main.go
```

#### Frontend Setup (see Option 1)

```bash
# In a separate terminal
cd /home/rdonald/Documents/TON/frontend
npm install
npm run dev
```

## 🔧 Development

### Frontend Development

```bash
# Install new dependencies
npm install [package-name]

# Add Shadcn UI components
npx shadcn@latest add [component-name]

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run type checking
npx tsc --noEmit
```

### Backend Development

```bash
# Run server in development mode
go run cmd/server/main.go

# Build binary
go build -o bin/server cmd/server/main.go

# Run binary
./bin/server

# Run tests
go test ./...

# Run with environment file
source .env && go run cmd/server/main.go
```

### Database Management

```bash
# Run database migrations
go run cmd/migrate/main.go

# Create new migration
migrate create -ext sql -seq 1 -dir migrations create_users_table

# Rollback migration
migrate -path migrations down 1
```

## 🗄️ Available Pages

### Authentication
- `/login` - Login page with role-based access

### Dashboard (Role-Based)
- `/dashboard` - Main dashboard with quick stats and navigation

### Work Orders
- `/dashboard/workorders` - Work orders overview and statistics
- `/dashboard/workorders/active` - Active work orders table view
- `/dashboard/workorders/create` - Create new work order form
- `/dashboard/workorders/history` - Historical work orders with pagination

### Vehicle Tracking
- `/dashboard/tracking` - Real-time vehicle tracking with map

### Invoicing
- `/dashboard/invoices` - Invoice management (Accountant/Admin/Manager)
- `/invoices/[id]` - Individual invoice details with payment actions

### Fleet Management
- `/dashboard/fleet` - Vehicle fleet management
- `/dashboard/fleet/vehicles` - Vehicle list and details
- `/dashboard/fleet/status` - Fleet status overview
- `/dashboard/fleet/maintenance` - Maintenance schedule

### Reports & Analytics
- `/dashboard/reports` - Reports and analytics
- `/dashboard/reports/fleet` - Fleet performance reports
- `/dashboard/reports/financial` - Financial reports
- `/dashboard/reports/maintenance` - Maintenance reports

### User Management (Admin Only)
- `/dashboard/users` - User management and roles

### System Settings (Admin Only)
- `/dashboard/settings` - System configuration

## 🔐 Authentication & Roles

### User Roles

1. **Admin**: Full system access, user management, system settings
2. **Manager**: Fleet management, work orders, invoicing, reports
3. **Accountant**: Invoicing, payment processing, financial reports
4. **Service Advisor**: Work orders, vehicle tracking, fleet management
5. **Mechanic**: Work order management, job sheets
6. **Driver**: Basic access, vehicle status viewing

### Authentication Flow

1. JWT-based authentication with secure token storage
2. Role-based access control (RBAC) for all pages and actions
3. Automatic session validation and refresh
4. Secure logout with session cleanup

## 🚀 Deployment

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### Backend (.env)
```env
SERVER_PORT=8080
GIN_MODE=debug
DB_HOST=localhost
DB_PORT=5432
DB_USER=ton_user
DB_PASSWORD=ton_password
DB_NAME=ton_platform
DB_SSLMODE=disable
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key-here
JWT_ACCESS_EXPIRE_TIME=15
JWT_REFRESH_EXPIRE_TIME=168
```

### Production Deployment with Docker

1. **Build Docker Images:**
```bash
docker-compose -f docker-compose.yml build
```

2. **Production Environment:**
```bash
# Copy production environment file
cp .env.production .env

# Deploy with production configuration
docker-compose -f docker-compose.yml up -d
```

### Manual Deployment

#### Frontend (Vercel/Netlify)

```bash
# Build application
npm run build

# Deploy to Vercel
npx vercel --prod

# Or Netlify
npm run build
npx netlify deploy --prod --dir=.next
```

#### Backend (Docker/Cloud)

```bash
# Build Go binary
CGO_ENABLED=0 GOOS=linux go build -o ton-backend cmd/server/main.go

# Create Docker image
docker build -t ton-backend .

# Deploy to cloud provider
docker run -p 8080:8080 ton-backend
```

## 📊 Features Implemented

### ✅ Frontend (Next.js)
- [x] Authentication system with 6 user roles
- [x] Responsive design with mobile support
- [x] Role-based navigation and access control
- [x] Vehicle tracking dashboard
- [x] Work order management with table views
- [x] Invoice management with payment links
- [x] Real-time data updates
- [x] Search and filtering capabilities
- [x] Form validation and error handling
- [x] Loading states and skeleton screens

### ✅ Backend (Go)
- [x] Clean architecture with proper separation
- [x] PostgreSQL database with GORM
- [x] JWT authentication with bcrypt
- [x] RBAC system implementation
- [x] RESTful API endpoints
- [x] Database migrations
- [x] Environment-based configuration
- [x] Comprehensive logging

### ✅ Database (PostgreSQL)
- [x] User management schemas
- [x] Vehicle fleet data models
- [x] Work order and service tracking
- [x] Invoice and payment management
- [x] Parts and inventory management
- [x] Historical data and audit trails

### 🚧 In Progress

- **Mobile App**: Flutter application for drivers and mechanics
- **Real-time Notifications**: WebSocket implementation
- **Advanced Reporting**: Custom report builder
- **API Integration**: Third-party service integrations

## 🛠️ API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/validate` - Token validation

### Vehicles
- `GET /api/v1/vehicles/fleet-status` - Get fleet status
- `GET /api/v1/vehicles/{id}` - Get vehicle details
- `POST /api/v1/vehicles` - Create vehicle
- `PUT /api/v1/vehicles/{id}` - Update vehicle

### Work Orders
- `GET /api/v1/workorders` - List work orders
- `GET /api/v1/workorders/{id}` - Get work order details
- `POST /api/v1/workorders` - Create work order
- `PUT /api/v1/workorders/{id}/assign` - Assign work order

### Invoices
- `GET /api/v1/invoices` - List invoices
- `GET /api/v1/invoices/{id}` - Get invoice details
- `POST /api/v1/invoices/{id}/generate-payment` - Generate payment link
- `GET /api/v1/invoices/{id}/payment-status` - Check payment status

## 🧪 Testing

### Frontend Tests

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e

# Run integration tests
npm run test:integration
```

### Backend Tests

```bash
# Run all tests
go test ./...

# Run specific test file
go test ./internal/auth

# Run tests with coverage
go test -cover ./...

# Run benchmarks
go test -bench ./...
```

## 📈 Monitoring & Logging

### Frontend
- React Query for API state management
- Custom error boundary components
- Performance monitoring with Web Vitals
- User interaction analytics

### Backend
- Structured logging with log levels
- Request/response logging middleware
- Performance metrics tracking
- Database query optimization

## 🔒 Security Considerations

### Authentication
- JWT tokens with secure storage
- CSRF protection
- Rate limiting implementation
- Session timeout management
- Password hashing with bcrypt

### API Security
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- API key authentication for external services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Use meaningful commit messages
- Ensure all tests pass before submitting

## 📝 Documentation

- **[README_TON_Implementation.md](README_TON_Implementation.md)** - Detailed implementation documentation
- **[API Documentation](./docs/api.md)** - API endpoint documentation
- **[Database Schema](./docs/database.md)** - Database schema documentation
- **[Deployment Guide](./docs/deployment.md)** - Deployment instructions

## 🐛 Troubleshooting

### Common Issues

**Frontend:**
- Authentication not working → Check environment variables and API URL
- Components not loading → Run `npm install` and check imports
- Build errors → Check TypeScript configuration and dependencies

**Backend:**
- Database connection failed → Check database credentials and connectivity
- API endpoints not working → Check server logs and database migrations
- Authentication errors → Verify JWT secret and token generation

**Docker:**
- Container not starting → Check port conflicts and environment variables
- Database connection issues → Check Docker network configuration
- Build failures → Check Dockerfile and dependencies

### Support

For issues and questions:
1. Check existing [Issues](https://github.com/your-repo/ton-platform/issues)
2. Create a new issue with detailed information
3. Include error messages, logs, and environment details
4. Provide steps to reproduce the issue

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Project Maintainer**: [Your Name](mailto:your.email@example.com)
- **Project Repository**: [GitHub](https://github.com/your-repo/ton-platform)
- **Documentation**: [Project Wiki](https://github.com/your-repo/ton-platform/wiki)

---

**🎯 Thank you for using the TON Platform!** We're constantly improving and would love your feedback and contributions.
