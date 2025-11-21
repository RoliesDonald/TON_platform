package domain

import "time"

// User represents a user in the TON Platform system
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"uniqueIndex;not null"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"column:password_hash;not null"` // Hidden in JSON
	FirstName string    `json:"first_name" gorm:"not null"`
	LastName  string    `json:"last_name" gorm:"not null"`
	RoleID    uint      `json:"role_id" gorm:"not null"`
	Role      Role      `json:"role" gorm:"foreignKey:RoleID"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Role represents a user role in the system
type Role struct {
	ID          uint         `json:"id" gorm:"primaryKey"`
	Name        string       `json:"name" gorm:"uniqueIndex;not null"`
	Description string       `json:"description"`
	Permissions []Permission `json:"permissions" gorm:"many2many:role_permissions;"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

// Permission represents a system permission
type Permission struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"uniqueIndex;not null"`
	Resource    string `json:"resource" gorm:"not null"` // api endpoint/resource
	Action      string `json:"action" gorm:"not null"`   // create, read, update, delete
	Description string `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// UserRoles constants
const (
	RoleMechanic       = "Mechanic"
	RoleServiceAdvisor = "Service Advisor"
	RoleWarehouseStaff = "Warehouse Staff"
	RoleDriver         = "Driver"
	RoleAreaManager    = "Area Manager"
	RoleAccountant     = "Accountant"
)

// Permission actions
const (
	ActionCreate = "create"
	ActionRead   = "read"
	ActionUpdate = "update"
	ActionDelete = "delete"
)

// Resources
const (
	ResourceUsers        = "users"
	ResourceVehicles     = "vehicles"
	ResourceWorkOrders   = "work_orders"
	ResourceInventory    = "inventory"
	ResourceInvoices     = "invoices"
	ResourceReports      = "reports"
)