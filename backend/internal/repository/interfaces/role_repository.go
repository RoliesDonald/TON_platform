package interfaces

import "ton-platform/internal/domain"

// RoleRepository defines the interface for role data access operations
type RoleRepository interface {
	// CRUD operations
	Create(role *domain.Role) error
	GetByID(id uint) (*domain.Role, error)
	GetByName(name string) (*domain.Role, error)
	Update(role *domain.Role) error
	Delete(id uint) error

	// Query operations
	GetAll() ([]*domain.Role, error)
	GetActiveRoles() ([]*domain.Role, error)

	// Search and filtering
	Search(query string) ([]*domain.Role, error)
	GetByStatus(isActive bool) ([]*domain.Role, error)

	// Permission management
	GetPermissions(roleID uint) ([]domain.Permission, error)
	AssignPermission(roleID, permissionID uint) error
	RemovePermission(roleID, permissionID uint) error
	HasPermission(roleID, permissionID uint) (bool, error)

	// User role assignment
	GetUsersWithRole(roleID uint) ([]*domain.User, error)
	GetUserRoles(userID uint) ([]*domain.Role, error)
}