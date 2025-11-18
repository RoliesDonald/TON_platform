package interfaces

import "ton-platform/internal/domain"

// UserRepository defines the interface for user data access operations
type UserRepository interface {
	// CRUD operations
	Create(user *domain.User) error
	GetByID(id uint) (*domain.User, error)
	GetByEmail(email string) (*domain.User, error)
	GetByUsername(username string) (*domain.User, error)
	Update(user *domain.User) error
	Delete(id uint) error

	// Query operations
	GetAll(offset, limit int) ([]*domain.User, error)
	GetByRoleID(roleID uint) ([]*domain.User, error)
	GetActiveUsers() ([]*domain.User, error)

	// Authentication specific
	FindByEmailOrUsername(identifier string) (*domain.User, error)
	UpdateLastLogin(userID uint) error

	// Search and filtering
	Search(query string, offset, limit int) ([]*domain.User, error)
	GetByStatus(isActive bool) ([]*domain.User, error)

	// Role management
	AssignRole(userID, roleID uint) error
	RemoveRole(userID uint) error
}