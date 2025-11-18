package postgres

import (
	"fmt"

	"gorm.io/gorm"

	"ton-platform/internal/domain"
	"ton-platform/internal/repository/interfaces"
)

// RoleRepositoryPostgres implements RoleRepository interface using PostgreSQL
type RoleRepositoryPostgres struct {
	db *gorm.DB
}

// NewRoleRepositoryPostgres creates a new PostgreSQL role repository
func NewRoleRepositoryPostgres(db *gorm.DB) interfaces.RoleRepository {
	return &RoleRepositoryPostgres{db: db}
}

// Create creates a new role
func (r *RoleRepositoryPostgres) Create(role *domain.Role) error {
	return r.db.Create(role).Error
}

// GetByID retrieves a role by ID
func (r *RoleRepositoryPostgres) GetByID(id uint) (*domain.Role, error) {
	var role domain.Role
	if err := r.db.First(&role, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("role not found")
		}
		return nil, err
	}
	return &role, nil
}

// GetByName retrieves a role by name
func (r *RoleRepositoryPostgres) GetByName(name string) (*domain.Role, error) {
	var role domain.Role
	if err := r.db.Where("name = ?", name).First(&role).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("role not found")
		}
		return nil, err
	}
	return &role, nil
}

// Update updates a role
func (r *RoleRepositoryPostgres) Update(role *domain.Role) error {
	return r.db.Save(role).Error
}

// Delete deletes a role
func (r *RoleRepositoryPostgres) Delete(id uint) error {
	return r.db.Delete(&domain.Role{}, id).Error
}

// GetAll retrieves all roles
func (r *RoleRepositoryPostgres) GetAll() ([]*domain.Role, error) {
	var roles []*domain.Role
	if err := r.db.Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

// GetActiveRoles retrieves all active roles
func (r *RoleRepositoryPostgres) GetActiveRoles() ([]*domain.Role, error) {
	var roles []*domain.Role
	if err := r.db.Where("is_active = ?", true).Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

// Search roles by query string
func (r *RoleRepositoryPostgres) Search(query string) ([]*domain.Role, error) {
	var roles []*domain.Role
	searchQuery := fmt.Sprintf("%%%s%%", query)
	if err := r.db.Where("name ILIKE ? OR description ILIKE ?", searchQuery, searchQuery).Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

// GetByStatus retrieves roles by active status
func (r *RoleRepositoryPostgres) GetByStatus(isActive bool) ([]*domain.Role, error) {
	var roles []*domain.Role
	if err := r.db.Where("is_active = ?", isActive).Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

// GetPermissions retrieves permissions for a role
func (r *RoleRepositoryPostgres) GetPermissions(roleID uint) ([]domain.Permission, error) {
	var role domain.Role
	if err := r.db.Preload("Permissions").First(&role, roleID).Error; err != nil {
		return nil, err
	}
	return role.Permissions, nil
}

// AssignPermission assigns a permission to a role
func (r *RoleRepositoryPostgres) AssignPermission(roleID, permissionID uint) error {
	// Check if assignment already exists
	var count int64
	r.db.Table("role_permissions").Where("role_id = ? AND permission_id = ?", roleID, permissionID).Count(&count)
	if count > 0 {
		return nil // Already assigned
	}

	// Create new assignment
	return r.db.Exec("INSERT INTO role_permissions (role_id, permission_id, created_at) VALUES (?, ?, ?)",
		roleID, permissionID, "NOW").Error
}

// RemovePermission removes a permission from a role
func (r *RoleRepositoryPostgres) RemovePermission(roleID, permissionID uint) error {
	return r.db.Exec("DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?",
		roleID, permissionID).Error
}

// HasPermission checks if a role has a specific permission
func (r *RoleRepositoryPostgres) HasPermission(roleID, permissionID uint) (bool, error) {
	var count int64
	err := r.db.Table("role_permissions").Where("role_id = ? AND permission_id = ?", roleID, permissionID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// GetUsersWithRole retrieves users that have a specific role
func (r *RoleRepositoryPostgres) GetUsersWithRole(roleID uint) ([]*domain.User, error) {
	var users []*domain.User
	if err := r.db.Preload("Role").Where("role_id = ?", roleID).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetUserRoles retrieves all roles assigned to a user
func (r *RoleRepositoryPostgres) GetUserRoles(userID uint) ([]*domain.Role, error) {
	// This is a simplified implementation for single role per user
	var user domain.User
	if err := r.db.Preload("Role").First(&user, userID).Error; err != nil {
		return nil, err
	}

	// Since we have single role per user in our current schema
	if user.RoleID > 0 {
		var role domain.Role
		if err := r.db.First(&role, user.RoleID).Error; err != nil {
			return nil, err
		}
		return []*domain.Role{&role}, nil
	}

	return []*domain.Role{}, nil
}