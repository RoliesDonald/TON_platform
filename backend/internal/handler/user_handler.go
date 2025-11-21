package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"

	"ton-platform/internal/domain"
	"ton-platform/internal/repository/interfaces"
	"ton-platform/pkg/response"
	"ton-platform/pkg/security"
)

// UserHandler handles user management HTTP requests
type UserHandler struct {
	userRepo   interfaces.UserRepository
	roleRepo   interfaces.RoleRepository
	validator  *validator.Validate
	logger     *logrus.Logger
}

// NewUserHandler creates a new user handler
func NewUserHandler(userRepo interfaces.UserRepository, roleRepo interfaces.RoleRepository, logger *logrus.Logger) *UserHandler {
	return &UserHandler{
		userRepo:  userRepo,
		roleRepo:  roleRepo,
		validator: validator.New(),
		logger:    logger,
	}
}

// CreateUserRequest represents user creation request for admins
type CreateUserRequest struct {
	Username  string `json:"username" validate:"required,min=3,max=50"`
	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name" validate:"required,min=1,max=100"`
	LastName  string `json:"last_name" validate:"required,min=1,max=100"`
	RoleID    uint   `json:"role_id" validate:"required"`
	Password  string `json:"password" validate:"required,min=6"`
	IsActive  *bool  `json:"is_active"`
}

// UpdateUserRequest represents user update request
type UpdateUserRequest struct {
	Username  string `json:"username" validate:"omitempty,min=3,max=50"`
	Email     string `json:"email" validate:"omitempty,email"`
	FirstName string `json:"first_name" validate:"omitempty,min=1,max=100"`
	LastName  string `json:"last_name" validate:"omitempty,min=1,max=100"`
	RoleID    uint   `json:"role_id"`
	IsActive  *bool  `json:"is_active"`
}

// AssignRoleRequest represents role assignment request
type AssignRoleRequest struct {
	RoleID uint `json:"role_id" validate:"required"`
}

// GetAll retrieves all users with pagination
// @Summary Get all users
// @Description Retrieves all users with pagination (admin only)
// @Tags users
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Success 200 {object} response.Response "Users retrieved successfully"
// @Router /users [get]
func (h *UserHandler) GetAll(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	users, err := h.userRepo.GetAll(offset, limit)
	if err != nil {
		h.logger.WithError(err).Error("Failed to retrieve users")
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve users", err.Error())
		return
	}

	userData := make([]gin.H, len(users))
	for i, user := range users {
		roleName := "No Role"
		if user.Role.ID != 0 {
			roleName = user.Role.Name
		}

		userData[i] = gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"role_id":    user.RoleID,
			"role_name":  roleName,
			"is_active":  user.IsActive,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		}
	}

	response.Success(c, http.StatusOK, "Users retrieved successfully", gin.H{
		"users": userData,
		"pagination": gin.H{
			"page":  page,
			"limit": limit,
			"count": len(userData),
		},
	})
}

// GetByID retrieves a user by ID
// @Summary Get user by ID
// @Description Retrieves a specific user by ID (admin only)
// @Tags users
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} response.Response "User retrieved successfully"
// @Failure 404 {object} response.Response "User not found"
// @Router /users/{id} [get]
func (h *UserHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", err.Error())
		return
	}

	user, err := h.userRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("user_id", id).Error("User not found")
		response.Error(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	roleName := "No Role"
	if user.Role.ID != 0 {
		roleName = user.Role.Name
	}

	userData := gin.H{
		"id":         user.ID,
		"username":   user.Username,
		"email":      user.Email,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"role_id":    user.RoleID,
		"role":       user.Role,
		"role_name":  roleName,
		"is_active":  user.IsActive,
		"created_at": user.CreatedAt,
		"updated_at": user.UpdatedAt,
	}

	response.Success(c, http.StatusOK, "User retrieved successfully", userData)
}

// Create creates a new user (admin only)
// @Summary Create a new user
// @Description Creates a new user account (admin only)
// @Tags users
// @Accept json
// @Produce json
// @Param request body CreateUserRequest true "User creation request"
// @Success 201 {object} response.Response "User created successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 409 {object} response.Response "User already exists"
// @Router /users [post]
func (h *UserHandler) Create(c *gin.Context) {
	var req CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind user creation request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("User creation validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Check if user already exists
	if existingUser, _ := h.userRepo.GetByEmail(req.Email); existingUser != nil {
		response.Error(c, http.StatusConflict, "User with this email already exists", "duplicate_email")
		return
	}

	if existingUser, _ := h.userRepo.GetByUsername(req.Username); existingUser != nil {
		response.Error(c, http.StatusConflict, "Username already exists", "duplicate_username")
		return
	}

	// Validate role exists
	_, err := h.roleRepo.GetByID(req.RoleID)
	if err != nil {
		h.logger.WithError(err).Error("Role validation failed")
		response.Error(c, http.StatusBadRequest, "Invalid role", "role_not_found")
		return
	}

	// Set default active status
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	// Hash password
	passwordHasher := security.NewPasswordHasher()
	hashedPassword, err := passwordHasher.HashPassword(req.Password)
	if err != nil {
		h.logger.WithError(err).Error("Password hashing failed")
		response.Error(c, http.StatusInternalServerError, "Failed to process password", err.Error())
		return
	}

	// Create user
	user := &domain.User{
		Username:  req.Username,
		Email:     req.Email,
		Password:  hashedPassword,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		RoleID:    req.RoleID,
		IsActive:  isActive,
	}

	if err := h.userRepo.Create(user); err != nil {
		h.logger.WithError(err).Error("User creation failed")
		response.Error(c, http.StatusInternalServerError, "Failed to create user", err.Error())
		return
	}

	// Load user with role information
	user, err = h.userRepo.GetByID(user.ID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to load user after creation")
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve created user", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"user_id":  user.ID,
		"email":    user.Email,
		"username": user.Username,
		"role":     user.Role.Name,
	}).Info("User created successfully by admin")

	response.Success(c, http.StatusCreated, "User created successfully", user)
}

// Update updates a user (admin only)
// @Summary Update user
// @Description Updates an existing user (admin only)
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param request body UpdateUserRequest true "User update request"
// @Success 200 {object} response.Response "User updated successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 404 {object} response.Response "User not found"
// @Router /users/{id} [put]
func (h *UserHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", err.Error())
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind user update request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("User update validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Get existing user
	user, err := h.userRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("user_id", id).Error("User not found")
		response.Error(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	// Check for duplicate email if email is being updated
	if req.Email != "" && req.Email != user.Email {
		if existingUser, _ := h.userRepo.GetByEmail(req.Email); existingUser != nil {
			response.Error(c, http.StatusConflict, "User with this email already exists", "duplicate_email")
			return
		}
		user.Email = req.Email
	}

	// Check for duplicate username if username is being updated
	if req.Username != "" && req.Username != user.Username {
		if existingUser, _ := h.userRepo.GetByUsername(req.Username); existingUser != nil {
			response.Error(c, http.StatusConflict, "Username already exists", "duplicate_username")
			return
		}
		user.Username = req.Username
	}

	// Update fields if provided
	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.RoleID != 0 {
		// Validate role exists
		_, err := h.roleRepo.GetByID(req.RoleID)
		if err != nil {
			h.logger.WithError(err).Error("Role validation failed")
			response.Error(c, http.StatusBadRequest, "Invalid role", "role_not_found")
			return
		}
		user.RoleID = req.RoleID
	}
	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}

	if err := h.userRepo.Update(user); err != nil {
		h.logger.WithError(err).Error("User update failed")
		response.Error(c, http.StatusInternalServerError, "Failed to update user", err.Error())
		return
	}

	// Load updated user with role information
	user, err = h.userRepo.GetByID(user.ID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to load updated user")
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve updated user", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"user_id":  user.ID,
		"email":    user.Email,
		"username": user.Username,
		"role":     user.Role.Name,
	}).Info("User updated successfully by admin")

	response.Success(c, http.StatusOK, "User updated successfully", user)
}

// Delete deletes a user (admin only)
// @Summary Delete user
// @Description Deletes a user from the system (admin only)
// @Tags users
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} response.Response "User deleted successfully"
// @Failure 404 {object} response.Response "User not found"
// @Router /users/{id} [delete]
func (h *UserHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", err.Error())
		return
	}

	// Check if user exists
	user, err := h.userRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("user_id", id).Error("User not found")
		response.Error(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	// Prevent self-deletion
	currentUserID, exists := c.Get("user_id")
	if exists {
		currentID, ok := currentUserID.(uint)
		if ok && currentID == uint(id) {
			response.Error(c, http.StatusBadRequest, "Cannot delete your own account", "self_deletion_not_allowed")
			return
		}
	}

	if err := h.userRepo.Delete(uint(id)); err != nil {
		h.logger.WithError(err).Error("User deletion failed")
		response.Error(c, http.StatusInternalServerError, "Failed to delete user", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"user_id":  user.ID,
		"email":    user.Email,
		"username": user.Username,
	}).Info("User deleted successfully by admin")

	response.Success(c, http.StatusOK, "User deleted successfully", nil)
}

// AssignRole assigns a role to a user (admin only)
// @Summary Assign role to user
// @Description Assigns a role to a user (admin only)
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param request body AssignRoleRequest true "Role assignment request"
// @Success 200 {object} response.Response "Role assigned successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 404 {object} response.Response "User or role not found"
// @Router /users/{id}/assign-role [post]
func (h *UserHandler) AssignRole(c *gin.Context) {
	idStr := c.Param("id")
	userID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", err.Error())
		return
	}

	var req AssignRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind role assignment request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Role assignment validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Check if user exists
	_, err = h.userRepo.GetByID(uint(userID))
	if err != nil {
		h.logger.WithError(err).WithField("user_id", userID).Error("User not found")
		response.Error(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	// Check if role exists
	role, err := h.roleRepo.GetByID(req.RoleID)
	if err != nil {
		h.logger.WithError(err).WithField("role_id", req.RoleID).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Assign role
	if err := h.userRepo.AssignRole(uint(userID), req.RoleID); err != nil {
		h.logger.WithError(err).Error("Role assignment failed")
		response.Error(c, http.StatusInternalServerError, "Failed to assign role", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"user_id":   userID,
		"role_id":   req.RoleID,
		"role_name": role.Name,
	}).Info("Role assigned to user successfully by admin")

	response.Success(c, http.StatusOK, "Role assigned successfully", gin.H{
		"user_id":   userID,
		"role_id":   req.RoleID,
		"role_name": role.Name,
	})
}

// RemoveRole removes a user's role assignment (admin only)
// @Summary Remove role from user
// @Description Removes a user's role assignment (admin only)
// @Tags users
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} response.Response "Role removed successfully"
// @Failure 404 {object} response.Response "User not found"
// @Router /users/{id}/remove-role [delete]
func (h *UserHandler) RemoveRole(c *gin.Context) {
	idStr := c.Param("id")
	userID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", err.Error())
		return
	}

	// Check if user exists
	user, err := h.userRepo.GetByID(uint(userID))
	if err != nil {
		h.logger.WithError(err).WithField("user_id", userID).Error("User not found")
		response.Error(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	// Remove role
	if err := h.userRepo.RemoveRole(uint(userID)); err != nil {
		h.logger.WithError(err).Error("Role removal failed")
		response.Error(c, http.StatusInternalServerError, "Failed to remove role", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"user_id":   userID,
		"role_name": user.Role.Name,
	}).Info("Role removed from user successfully by admin")

	response.Success(c, http.StatusOK, "Role removed successfully", gin.H{
		"user_id": userID,
	})
}

// GetByRole retrieves users by role
// @Summary Get users by role
// @Description Retrieves all users with a specific role (admin only)
// @Tags users
// @Produce json
// @Param roleId path int true "Role ID"
// @Success 200 {object} response.Response "Users retrieved successfully"
// @Failure 404 {object} response.Response "Role not found"
// @Router /users/role/{roleId} [get]
func (h *UserHandler) GetByRole(c *gin.Context) {
	roleIdStr := c.Param("roleId")
	roleID, err := strconv.ParseUint(roleIdStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	// Check if role exists
	role, err := h.roleRepo.GetByID(uint(roleID))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", roleID).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Get users with role
	users, err := h.userRepo.GetByRoleID(uint(roleID))
	if err != nil {
		h.logger.WithError(err).Error("Failed to get users by role")
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve users", err.Error())
		return
	}

	userData := make([]gin.H, len(users))
	for i, user := range users {
		userData[i] = gin.H{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"is_active":  user.IsActive,
			"created_at": user.CreatedAt,
		}
	}

	response.Success(c, http.StatusOK, "Users retrieved successfully", gin.H{
		"role":  role,
		"users": userData,
		"count": len(userData),
	})
}