# TON Vehicle Management System - Database Integration

## Overview

This document describes the complete database integration for the TON Vehicle Management System, which has been migrated from a mock database system to a real PostgreSQL implementation based on your existing Prisma schema.

## 🗄️ Database Schema

The system now uses a comprehensive PostgreSQL database schema that includes:

### Core Entities
- **Companies** - Vehicle rental companies, service providers, suppliers, etc.
- **Employees** - Staff members with role-based access control
- **Vehicles** - Complete vehicle fleet management
- **Spare Parts** - Inventory management with warehouse support
- **Work Orders** - Service and maintenance tracking
- **Invoices** - Billing and financial management
- **Services** - Service catalog and pricing
- **Warehouses** - Multi-location inventory management

### Key Features
- ✅ **Role-Based Access Control (RBAC)** - Complete employee permission system
- ✅ **Multi-Company Support** - Parent-child company relationships
- ✅ **Vehicle Management** - Full lifecycle tracking from registration to disposal
- ✅ **Service Management** - Work orders, estimates, and invoices
- ✅ **Inventory Management** - Spare parts with warehouse tracking
- ✅ **Contract Management** - Service contracts and agreements

## 📋 Database Setup

### Prerequisites
- PostgreSQL 12+ installed and running
- Node.js 16+ installed
- npm/yarn package manager

### 1. Database Creation
```sql
-- Create database
CREATE DATABASE ton_database;

-- Create user (optional, you can use existing postgres user)
CREATE USER ton_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ton_database TO ton_user;
```

### 2. Schema Initialization
```bash
# Run the schema creation script
psql -h localhost -U ton_user -d ton_database -f database/schema.sql
```

### 3. Data Seeding
```bash
# Run the seed data script
psql -h localhost -U ton_user -d ton_database -f database/seed.sql
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ton_database
DB_USER=ton_user
DB_PASSWORD=your_actual_password
```

### Database Connection
The system uses a connection pool for optimal performance:

```typescript
// Connection pool configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ton_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
```

## 🏗️ Application Architecture

### Database Helper Functions
The system provides a clean abstraction layer in `/src/lib/database.ts`:

```typescript
export interface DatabaseHelper {
  // Companies
  findCompanyById(id: string): Promise<any>;
  findCompaniesByType(type: string): Promise<any>;
  createCompany(data: any): Promise<any>;
  updateCompany(id: string, data: any): Promise<any>;

  // Employees
  findEmployeeById(id: string): Promise<any>;
  findEmployeeByEmail(email: string): Promise<any>;

  // Vehicles
  findVehicleById(id: string): Promise<any>;
  findVehiclesByCompany(companyId: string): Promise<any>;
  createVehicle(data: any): Promise<any>;
  updateVehicle(id: string, data: any): Promise<any>;
  deleteVehicle(id: string): Promise<boolean>;

  // Authentication
  validateSession(sessionId: string): Promise<any>;
  createSession(userId: string): Promise<string>;
  deleteSession(sessionId: string): Promise<boolean>;
}
```

### API Integration
All API routes have been updated to use the PostgreSQL database while maintaining the same interfaces:

```typescript
// Example: Vehicle API Route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (companyId) {
    const vehicles = await dbHelpers.findVehiclesByCompany(companyId);
    return NextResponse.json({ success: true, data: vehicles });
  }
  // ... rest of the logic
}
```

## 🔐 Authentication & Authorization

### Role-Based Access Control (RBAC)
The system implements comprehensive RBAC with the following roles:

- **SUPER_ADMIN** - Full system access
- **ADMIN** - Administrative access
- **FLEET_MANAGER** - Fleet management
- **SERVICE_ADVISOR** - Service management
- **MECHANIC** - Service technician
- **VEHICLE_RENTAL_COMPANY** - Vehicle rental company access

### Company Types
- **RENTAL_COMPANY** - Vehicle rental businesses
- **SERVICE_MAINTENANCE** - Service providers
- **SUPPLIER** - Parts suppliers
- **INTERNAL** - System management
- **CUSTOMER** - Vehicle owners

### Permission System
```typescript
// Example permission checks
export const canRegisterVehicles = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === "admin" || user.role === "vehicle_rental_company";
};

export const canViewAllVehicles = (user: User | null): boolean => {
  if (!user) return false;
  return ["admin", "manager"].includes(user.role);
};
```

## 📊 Data Models

### Vehicle Model
```typescript
interface Vehicle {
  id: string;
  vehicleId: string;
  companyId: string;
  companyName: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    category: "sedan" | "suv" | "truck" | "van" | "luxury";
    plateNumber: string;
    vin: string;
    color: string;
    mileage: number;
  };
  specifications: {
    engine: string;
    transmission: "automatic" | "manual";
    fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
    seats: number;
    doors: number;
    features: string[];
  };
  rental: {
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    deposit: number;
    currency: string;
    available: boolean;
    location: string;
    minimumRentalDays: number;
  };
  status: "available" | "rented" | "maintenance" | "reserved";
  // ... additional fields
}
```

### Company Model
```typescript
interface Company {
  id: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  contact: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  businessDetails: {
    establishedYear: number;
    businessLicense: string;
    taxId: string;
    description: string;
  };
  partnership: {
    status: "active" | "inactive" | "prospective";
    contractStart: string;
    contractEnd: string;
    commissionRate: number;
    monthlyRevenue: number;
  };
  // ... additional fields
}
```

## 🚀 Getting Started

### 1. Database Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Create database and user
sudo -u postgres psql
CREATE DATABASE ton_database;
CREATE USER ton_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ton_database TO ton_user;
\q
```

### 2. Schema Installation
```bash
# Navigate to project directory
cd /path/to/TON/frontend

# Install dependencies
npm install

# Run database schema
psql -h localhost -U ton_user -d ton_database -f ../database/schema.sql

# Run seed data
psql -h localhost -U ton_user -d ton_database -f ../database/seed.sql
```

### 3. Application Configuration
```bash
# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Start the development server
npm run dev
```

### 4. Test the Integration
- Navigate to `http://localhost:3000/dashboard/vehicle-rental/vehicles`
- Log in with default credentials (check seed data)
- Test vehicle creation, editing, and deletion
- Verify RBAC permissions are working correctly

## 🔄 Migration from Mock Data

The system has been designed to maintain backward compatibility. The mock data helper functions have been updated to use the PostgreSQL database while preserving the same API interfaces:

```typescript
// Before (Mock)
export const dbHelpers = {
  findCompanyById: (id: string) => mockCompanies.find(c => c.id === id),
  // ... synchronous operations
};

// After (PostgreSQL)
export const dbHelpers = {
  findCompanyById: async (id: string) => await db.findCompanyById(id),
  // ... asynchronous operations with error handling
};
```

## 🛠️ Development Tools

### Database Queries
The system provides direct access to the database pool for custom queries:

```typescript
import { db } from '@/lib/database';

// Custom query example
const result = await db.query(`
  SELECT v.*, c.company_name
  FROM vehicles v
  JOIN companies c ON v.owner_id = c.id
  WHERE c.company_type = $1
`, ['RENTAL_COMPANY']);
```

### Error Handling
Comprehensive error handling is built into all database operations:

```typescript
try {
  const vehicle = await db.findVehicleById(id);
  if (!vehicle) {
    return NextResponse.json(
      { success: false, error: 'Vehicle not found' },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: vehicle });
} catch (error) {
  console.error('Database error:', error);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

## 📈 Performance Considerations

### Connection Pooling
- Default pool size: 20 connections
- Configurable based on your PostgreSQL server capacity
- Automatic connection cleanup on application shutdown

### Query Optimization
- Indexed on frequently queried columns
- Database triggers for updated_at timestamps
- Proper foreign key relationships

### Caching
- Consider implementing Redis caching for frequently accessed data
- Session management for authentication

## 🔒 Security Features

### Input Validation
- All database inputs are properly sanitized
- SQL injection prevention through parameterized queries
- Type validation at the application layer

### Authentication
- Session-based authentication with PostgreSQL storage
- Secure session validation with timeout handling
- Password hashing with bcrypt (for implementation)

### Authorization
- Role-based access control (RBAC)
- Company-level data isolation
- API endpoint protection

## 📝 API Documentation

### Vehicle Management Endpoints

#### GET /api/vehicles
- **Query Parameters**: `companyId`, `search`
- **Description**: Retrieve vehicles with optional filtering
- **Response**: Array of vehicle objects

#### POST /api/vehicles
- **Body**: Vehicle creation data
- **Description**: Create a new vehicle
- **Response**: Created vehicle object

#### GET /api/vehicles/[id]
- **Parameters**: `id` (vehicle ID)
- **Description**: Retrieve specific vehicle
- **Response**: Vehicle object

#### PUT /api/vehicles/[id]
- **Parameters**: `id` (vehicle ID)
- **Body**: Vehicle update data
- **Description**: Update vehicle information
- **Response**: Updated vehicle object

#### DELETE /api/vehicles/[id]
- **Parameters**: `id` (vehicle ID)
- **Description**: Delete a vehicle
- **Response**: Success confirmation

## 🧪 Testing

### Unit Tests
```typescript
// Example test
import { db } from '@/lib/database';

describe('Database Integration', () => {
  test('should create and retrieve vehicle', async () => {
    const vehicleData = {
      licensePlate: 'TEST-001',
      vehicleMake: 'Toyota',
      model: 'Camry',
      // ... other fields
    };

    const created = await db.createVehicle(vehicleData);
    expect(created).toBeDefined();

    const retrieved = await db.findVehicleById(created.id);
    expect(retrieved.vehicle_make).toBe('Toyota');
  });
});
```

### Integration Tests
Test the complete API workflow including authentication, RBAC, and data operations.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify connection parameters in .env.local
   - Ensure database exists and user has permissions

2. **Module Not Found Error**
   - Run `npm install` to install dependencies
   - Check that `pg` and `@types/pg` are installed

3. **Permission Denied Errors**
   - Verify database user permissions
   - Check RBAC role assignments
   - Ensure authentication is properly configured

### Debug Mode
Enable detailed logging by setting `NODE_ENV=development` in your environment.

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js PostgreSQL Best Practices](https://node-postgres.com/)
- [Database Design Patterns](https://www.postgresql.org/docs/current/ddl-design.html)

---

## 🎯 Next Steps

1. **Production Deployment** - Set up production PostgreSQL server
2. **Monitoring** - Implement database performance monitoring
3. **Backup Strategy** - Configure automated database backups
4. **API Documentation** - Generate comprehensive API docs
5. **Testing Suite** - Implement comprehensive test coverage