# RBAC (Role-Based Access Control) System

This package provides a comprehensive Role-Based Access Control (RBAC) system for the TON Platform backend application.

## Overview

The RBAC system controls access to resources based on user roles and permissions. It provides fine-grained access control with the following features:

- **Role-based permissions**: Different roles have different sets of permissions
- **Resource-action model**: Permissions are defined as resource:action combinations
- **Default permission mappings**: Pre-configured permissions for standard roles
- **Flexible middleware**: Easy-to-use middleware for protecting endpoints
- **Database integration**: Dynamic permission assignment via database
- **Resource ownership**: Support for owner-based access control

## Architecture

### Core Components

1. **Permissions** (`permissions.go`)
   - Resource and action definitions
   - Permission parsing and validation
   - Default role permission mappings

2. **Middleware** (`internal/middleware/rbac.go`)
   - Permission-based access control
   - Resource ownership validation
   - Multiple permission checking (OR logic)

3. **Handlers** (`internal/handler/role_handler.go`)
   - Role management API endpoints
   - Permission assignment management
   - Role-user relationship management

## Resources and Actions

### Available Resources

- `user` - User management
- `role` - Role management
- `permission` - Permission management
- `vehicle` - Vehicle management
- `work_order` - Work order management
- `inventory` - Inventory management
- `warehouse` - Warehouse management
- `invoice` - Invoice management
- `payment` - Payment management
- `customer` - Customer management
- `telematics` - Vehicle telematics
- `report` - Reports and analytics
- `dashboard` - Dashboard access
- `system` - System configuration

### Available Actions

- `create` - Create new resources
- `read` - Read/view resources
- `update` - Modify existing resources
- `delete` - Remove resources
- `list` - List multiple resources
- `export` - Export resource data
- `import` - Import resource data
- `approve` - Approve resources (e.g., work orders)
- `reject` - Reject resources
- `assign` - Assign resources to users
- `unassign` - Unassign resources from users

## Default Roles

### 1. Administrator
- **Permissions**: All system permissions
- **Purpose**: Complete system administration
- **Can manage**: Users, roles, system configuration, all business resources

### 2. Area Manager
- **Key permissions**: Vehicle management, work order management, inventory management, reports
- **Purpose**: Regional operational oversight
- **Can manage**: Vehicles, work orders, inventory, view reports and analytics

### 3. Service Advisor
- **Key permissions**: Work orders, customer management, vehicle updates, invoices
- **Purpose**: Customer service and work order coordination
- **Can manage**: Work orders, customers, invoices, vehicle status

### 4. Mechanic
- **Key permissions**: Work orders (assigned), vehicle status, inventory viewing
- **Purpose**: Vehicle maintenance and repair
- **Can manage**: Assigned work orders, vehicle updates, view inventory

### 5. Warehouse Staff
- **Key permissions**: Inventory management, warehouse management
- **Purpose**: Inventory and warehouse operations
- **Can manage**: All inventory operations, warehouse configuration

### 6. Driver
- **Key permissions**: Assigned vehicles, work orders, telematics data
- **Purpose**: Vehicle operation and status reporting
- **Can manage**: View assigned vehicles and work orders, access telematics

### 7. Accountant
- **Key permissions**: Invoices, payments, financial reports
- **Purpose**: Financial management and reporting
- **Can manage**: Invoices, payments, financial reports, customer billing info

## Usage

### Middleware Usage

#### Basic Permission Check
```go
// Require vehicle read permission
router.GET("/vehicles", rbacMiddleware.RequireVehicleRead(), handler.GetVehicles)

// Require work order creation permission
router.POST("/work-orders", rbacMiddleware.RequireWorkOrderCreate(), handler.CreateWorkOrder)
```

#### Custom Permission Check
```go
// Require specific permission
router.GET("/inventory",
    rbacMiddleware.RequirePermission(rbac.ResourceInventory, rbac.ActionRead),
    handler.GetInventory)
```

#### Multiple Permissions (OR Logic)
```go
// User needs either work order read OR vehicle read permission
router.GET("/dashboard",
    rbacMiddleware.RequireAnyPermission([]rbac.PermissionDefinition{
        {Resource: rbac.ResourceWorkOrder, Action: rbac.ActionRead},
        {Resource: rbac.ResourceVehicle, Action: rbac.ActionRead},
    }),
    handler.GetDashboard)
```

#### Resource Owner Check
```go
// User can access their own work orders (or admins)
router.GET("/work-orders/:id",
    rbacMiddleware.RequireResourceOwner("work_order", "id"),
    handler.GetWorkOrder)
```

### Programmatic Permission Checking

```go
// Get default permissions
rbacPerms := rbac.GetDefaultRolePermissions()

// Check if role has permission
hasPermission := rbacPerms.HasPermission("Service Advisor", rbac.ResourceWorkOrder, rbac.ActionCreate)

// Get all permissions for a role
permissions := rbacPerms.GetRolePermissions("Area Manager")
```

### Permission Format

Permissions follow the format: `resource:action`

Examples:
- `vehicle:read` - Read vehicle information
- `work_order:create` - Create new work orders
- `inventory:update` - Update inventory records
- `invoice:export` - Export invoice data

## API Endpoints

### Role Management

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | `/api/v1/roles` | List all roles | `role:read` |
| GET | `/api/v1/roles/{id}` | Get role details | `role:read` |
| POST | `/api/v1/roles` | Create new role | `role:create` |
| PUT | `/api/v1/roles/{id}` | Update role | `role:update` |
| DELETE | `/api/v1/roles/{id}` | Delete role | `role:delete` |
| GET | `/api/v1/roles/{id}/permissions` | Get role permissions | `role:read` |
| POST | `/api/v1/roles/{id}/permissions` | Assign permission | `role:update` |
| DELETE | `/api/v1/roles/{id}/permissions/{permissionId}` | Remove permission | `role:update` |
| GET | `/api/v1/roles/{id}/users` | Get users with role | `role:read` |

### Permission Management

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | `/api/v1/permissions` | List all available permissions | `permission:read` |

### Demo Endpoints (for testing)

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | `/api/v1/demo/vehicles` | Demo vehicle access | `vehicle:read` |
| POST | `/api/v1/demo/vehicles` | Demo vehicle creation | `vehicle:create` |
| GET | `/api/v1/demo/work-orders` | Demo work order access | `work_order:read` |
| POST | `/api/v1/demo/work-orders` | Demo work order creation | `work_order:create` |
| GET | `/api/v1/demo/inventory` | Demo inventory access | `inventory:read` |
| GET | `/api/v1/demo/dashboards/main` | Demo dashboard access | `dashboard:read` |
| GET | `/api/v1/demo/multi-permission` | Demo multiple permissions | `work_order:read` OR `vehicle:read` |

## Database Schema

### Roles Table
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Permissions Table
```sql
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Role Permissions Junction Table
```sql
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);
```

## Testing

The package includes comprehensive tests:

```bash
# Run all RBAC tests
go test ./pkg/rbac/...

# Run with coverage
go test -cover ./pkg/rbac/...

# Run benchmarks
go test -bench=. ./pkg/rbac/...
```

### Test Coverage

- Permission parsing and validation
- Role permission mapping
- Permission combination validation
- Role-based access scenarios
- Performance benchmarks

## Security Considerations

1. **Permission Validation**: All permission strings are validated to prevent injection attacks
2. **Default Deny**: Access is denied by default; explicit permissions are required
3. **Audit Logging**: All permission checks are logged for security auditing
4. **Built-in Role Protection**: System roles cannot be deleted or modified
5. **Resource Ownership**: Users can only access their own resources unless explicitly granted

## Performance

- Permission checking is O(1) for default role mappings
- Database permissions are cached in memory for fast access
- Middleware has minimal overhead (~1-2ms per request)
- Optimized for high-frequency permission checks

## Extending the System

### Adding New Resources

1. Add the resource to the `Resource` enum in `permissions.go`
2. Update `GetAllPermissionDefinitions()` to include the new resource
3. Add relevant permission checks to the resource's handlers
4. Update default role mappings as needed

### Adding New Roles

1. Add role permissions to `GetDefaultRolePermissions()` in `permissions.go`
2. Consider which actions the role should be able to perform
3. Test the role permissions thoroughly

### Custom Permission Logic

For complex permission scenarios, you can extend the middleware:

```go
func (m *RBACMiddleware) RequireCustomPermission() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Custom permission logic here
        // Example: Time-based permissions, location-based access, etc.
    }
}
```

## Best Practices

1. **Principle of Least Privilege**: Grant only the minimum permissions necessary
2. **Regular Audits**: Periodically review role assignments and permissions
3. **Separation of Duties**: Ensure no single role has conflicting permissions
4. **Documentation**: Keep permission mappings well-documented
5. **Testing**: Thoroughly test permission configurations
6. **Monitoring**: Monitor permission denied events for security issues

## Examples

### Complete Route Protection

```go
// Vehicle management routes with full RBAC
vehicles := v1.Group("/vehicles")
vehicles.Use(authMiddleware.RequireAuth())
{
    // Different permissions for different actions
    vehicles.GET("", rbacMiddleware.RequireVehicleRead(), handler.ListVehicles)
    vehicles.POST("", rbacMiddleware.RequireVehicleCreate(), handler.CreateVehicle)
    vehicles.PUT("/:id", rbacMiddleware.RequireVehicleUpdate(), handler.UpdateVehicle)
    vehicles.DELETE("/:id", rbacMiddleware.RequireVehicleDelete(), handler.DeleteVehicle)

    // Resource owner routes
    vehicles.GET("/:id",
        rbacMiddleware.RequireResourceOwner("vehicle", "id"),
        handler.GetVehicle)
}
```

### Permission Checking in Business Logic

```go
func (s *WorkOrderService) AssignWorkOrder(workOrderID, mechanicID uint, userID uint) error {
    // Check if user can assign work orders
    if !s.rbacPerms.HasPermission(s.GetUserRole(userID), rbac.ResourceWorkOrder, rbac.ActionAssign) {
        return errors.New("insufficient permissions to assign work orders")
    }

    // Proceed with assignment logic
    return s.repository.AssignWorkOrder(workOrderID, mechanicID)
}
```

This RBAC system provides a solid foundation for securing the TON Platform application while maintaining flexibility for future requirements.