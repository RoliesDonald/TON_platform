package postgres

import (
	"fmt"
	"time"

	"gorm.io/gorm"

	"ton-platform/internal/domain"
	"ton-platform/internal/repository/interfaces"
)

// UserRepositoryPostgres implements UserRepository interface using PostgreSQL
type UserRepositoryPostgres struct {
	db *gorm.DB
}

// NewUserRepositoryPostgres creates a new PostgreSQL user repository
func NewUserRepositoryPostgres(db *gorm.DB) interfaces.UserRepository {
	return &UserRepositoryPostgres{db: db}
}

// Create creates a new user
func (r *UserRepositoryPostgres) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

// GetByID retrieves a user by ID
func (r *UserRepositoryPostgres) GetByID(id uint) (*domain.User, error) {
	var user domain.User
	if err := r.db.Preload("Role").First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// GetByEmail retrieves a user by email
func (r *UserRepositoryPostgres) GetByEmail(email string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Preload("Role").Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// GetByUsername retrieves a user by username
func (r *UserRepositoryPostgres) GetByUsername(username string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Preload("Role").Where("username = ?", username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// Update updates a user
func (r *UserRepositoryPostgres) Update(user *domain.User) error {
	return r.db.Save(user).Error
}

// Delete deletes a user
func (r *UserRepositoryPostgres) Delete(id uint) error {
	return r.db.Delete(&domain.User{}, id).Error
}

// GetAll retrieves all users with pagination
func (r *UserRepositoryPostgres) GetAll(offset, limit int) ([]*domain.User, error) {
	var users []*domain.User
	if err := r.db.Preload("Role").Offset(offset).Limit(limit).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetByRoleID retrieves users by role ID
func (r *UserRepositoryPostgres) GetByRoleID(roleID uint) ([]*domain.User, error) {
	var users []*domain.User
	if err := r.db.Preload("Role").Where("role_id = ?", roleID).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetActiveUsers retrieves all active users
func (r *UserRepositoryPostgres) GetActiveUsers() ([]*domain.User, error) {
	var users []*domain.User
	if err := r.db.Preload("Role").Where("is_active = ?", true).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// FindByEmailOrUsername finds a user by email or username
func (r *UserRepositoryPostgres) FindByEmailOrUsername(identifier string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Preload("Role").Where("email = ? OR username = ?", identifier, identifier).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// UpdateLastLogin updates the user's last login time
func (r *UserRepositoryPostgres) UpdateLastLogin(userID uint) error {
	// Create a raw SQL update to avoid loading the entire user
	return r.db.Exec("UPDATE users SET updated_at = ?, last_login = ? WHERE id = ?",
		time.Now(), time.Now(), userID).Error
}

// Search users by query string
func (r *UserRepositoryPostgres) Search(query string, offset, limit int) ([]*domain.User, error) {
	var users []*domain.User
	searchQuery := fmt.Sprintf("%%%s%%", query)
	if err := r.db.Preload("Role").Where("username ILIKE ? OR email ILIKE ? OR first_name ILIKE ? OR last_name ILIKE ?",
		searchQuery, searchQuery, searchQuery, searchQuery).
		Offset(offset).Limit(limit).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetByStatus retrieves users by active status
func (r *UserRepositoryPostgres) GetByStatus(isActive bool) ([]*domain.User, error) {
	var users []*domain.User
	if err := r.db.Preload("Role").Where("is_active = ?", isActive).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// AssignRole assigns a role to a user
func (r *UserRepositoryPostgres) AssignRole(userID, roleID uint) error {
	return r.db.Model(&domain.User{}).Where("id = ?", userID).Update("role_id", roleID).Error
}

// RemoveRole removes a user's role assignment
func (r *UserRepositoryPostgres) RemoveRole(userID uint) error {
	return r.db.Model(&domain.User{}).Where("id = ?", userID).Update("role_id", nil).Error
}