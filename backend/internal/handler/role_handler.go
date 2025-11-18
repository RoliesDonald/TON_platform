package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"

	"ton-platform/internal/domain"
	"ton-platform/internal/repository/interfaces"
	"ton-platform/pkg/rbac"
	"ton-platform/pkg/response"
)

// RoleHandler handles role HTTP requests
type RoleHandler struct {
	roleRepo   interfaces.RoleRepository
	validator  *validator.Validate
	logger     *logrus.Logger
	rbacPerms  rbac.RolePermissionMap
}

// NewRoleHandler creates a new role handler
func NewRoleHandler(roleRepo interfaces.RoleRepository, logger *logrus.Logger) *RoleHandler {
	return &RoleHandler{
		roleRepo:  roleRepo,
		validator: validator.New(),
		logger:    logger,
		rbacPerms: rbac.GetDefaultRolePermissions(),
	}
}

// CreateRoleRequest represents role creation request
type CreateRoleRequest struct {
	Name        string `json:"name" validate:"required,min=2,max=50"`
	Description string `json:"description" validate:"max=200"`
}

// UpdateRoleRequest represents role update request
type UpdateRoleRequest struct {
	Name        string `json:"name" validate:"required,min=2,max=50"`
	Description string `json:"description" validate:"max=200"`
}

// AssignPermissionRequest represents permission assignment request
type AssignPermissionRequest struct {
	PermissionID uint `json:"permission_id" validate:"required"`
}

// Create creates a new role
// @Summary Create a new role
// @Description Creates a new system role
// @Tags roles
// @Accept json
// @Produce json
// @Param request body CreateRoleRequest true "Role creation request"
// @Success 201 {object} response.Response "Role created successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 409 {object} response.Response "Role already exists"
// @Router /roles [post]
func (h *RoleHandler) Create(c *gin.Context) {
	var req CreateRoleRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind role creation request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Role creation validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Check if role already exists
	existingRole, err := h.roleRepo.GetByName(req.Name)
	if err == nil && existingRole != nil {
		response.Error(c, http.StatusConflict, "Role with this name already exists", "duplicate_role_name")
		return
	}

	// Create role
	role := &domain.Role{
		Name:        req.Name,
		Description: req.Description,
	}

	if err := h.roleRepo.Create(role); err != nil {
		h.logger.WithError(err).Error("Role creation failed")
		response.Error(c, http.StatusInternalServerError, "Failed to create role", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"role_id":   role.ID,
		"role_name": role.Name,
	}).Info("Role created successfully")

	response.Success(c, http.StatusCreated, "Role created successfully", role)
}

// GetAll retrieves all roles
// @Summary Get all roles
// @Description Retrieves all system roles
// @Tags roles
// @Produce json
// @Success 200 {object} response.Response "Roles retrieved successfully"
// @Router /roles [get]
func (h *RoleHandler) GetAll(c *gin.Context) {
	roles, err := h.roleRepo.GetAll()
	if err != nil {
		h.logger.WithError(err).Error("Failed to retrieve roles")
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve roles", err.Error())
		return
	}

	// Add default permissions to each role
	roleData := make([]gin.H, len(roles))
	for i, role := range roles {
		permissions := h.rbacPerms.GetRolePermissions(role.Name)

		roleData[i] = gin.H{
			"id":           role.ID,
			"name":         role.Name,
			"description":  role.Description,
			"created_at":   role.CreatedAt,
			"updated_at":   role.UpdatedAt,
			"permissions":  permissions,
			"permission_count": len(permissions),
		}
	}

	response.Success(c, http.StatusOK, "Roles retrieved successfully", roleData)
}

// GetByID retrieves a role by ID
// @Summary Get role by ID
// @Description Retrieves a specific role by ID
// @Tags roles
// @Produce json
// @Param id path int true "Role ID"
// @Success 200 {object} response.Response "Role retrieved successfully"
// @Failure 404 {object} response.Response "Role not found"
// @Router /roles/{id} [get]
func (h *RoleHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	role, err := h.roleRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", id).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Get role permissions
	permissions, err := h.roleRepo.GetPermissions(role.ID)
	if err != nil {
		h.logger.WithError(err).WithField("role_id", role.ID).Error("Failed to get role permissions")
		permissions = []domain.Permission{} // Continue without permissions
	}

	// Get default permissions as well
	defaultPerms := h.rbacPerms.GetRolePermissions(role.Name)
	defaultPermStrings := make([]string, len(defaultPerms))
	for i, perm := range defaultPerms {
		defaultPermStrings[i] = perm.String()
	}

	roleData := gin.H{
		"id":               role.ID,
		"name":             role.Name,
		"description":      role.Description,
		"created_at":       role.CreatedAt,
		"updated_at":       role.UpdatedAt,
		"permissions":      permissions,
		"default_permissions": defaultPermStrings,
		"users_count":      0, // TODO: Implement user count
	}

	response.Success(c, http.StatusOK, "Role retrieved successfully", roleData)
}

// Update updates a role
// @Summary Update role
// @Description Updates an existing role
// @Tags roles
// @Accept json
// @Produce json
// @Param id path int true "Role ID"
// @Param request body UpdateRoleRequest true "Role update request"
// @Success 200 {object} response.Response "Role updated successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 404 {object} response.Response "Role not found"
// @Router /roles/{id} [put]
func (h *RoleHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	var req UpdateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind role update request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Role update validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Check if role exists
	role, err := h.roleRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", id).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Check if another role with the same name exists
	existingRole, err := h.roleRepo.GetByName(req.Name)
	if err == nil && existingRole != nil && existingRole.ID != role.ID {
		response.Error(c, http.StatusConflict, "Role with this name already exists", "duplicate_role_name")
		return
	}

	// Update role
	role.Name = req.Name
	role.Description = req.Description

	if err := h.roleRepo.Update(role); err != nil {
		h.logger.WithError(err).Error("Role update failed")
		response.Error(c, http.StatusInternalServerError, "Failed to update role", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"role_id":   role.ID,
		"role_name": role.Name,
	}).Info("Role updated successfully")

	response.Success(c, http.StatusOK, "Role updated successfully", role)
}

// Delete deletes a role
// @Summary Delete role
// @Description Deletes a role from the system
// @Tags roles
// @Produce json
// @Param id path int true "Role ID"
// @Success 200 {object} response.Response "Role deleted successfully"
// @Failure 404 {object} response.Response "Role not found"
// @Failure 409 {object} response.Response "Role cannot be deleted (has users)"
// @Router /roles/{id} [delete]
func (h *RoleHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	// Check if role exists
	role, err := h.roleRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", id).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Check if role has users assigned
	users, err := h.roleRepo.GetUsersWithRole(role.ID)
	if err != nil {
		h.logger.WithError(err).Error("Failed to check role users")
	} else if len(users) > 0 {
		response.Error(c, http.StatusConflict, "Cannot delete role with assigned users", "role_has_users")
		return
	}

	// Prevent deletion of built-in roles
	builtInRoles := []string{"Administrator", "Area Manager", "Service Advisor", "Mechanic", "Warehouse Staff", "Driver", "Accountant"}
	for _, builtInRole := range builtInRoles {
		if role.Name == builtInRole {
			response.Error(c, http.StatusConflict, "Cannot delete built-in system role", "cannot_delete_builtin_role")
			return
		}
	}

	if err := h.roleRepo.Delete(uint(id)); err != nil {
		h.logger.WithError(err).Error("Role deletion failed")
		response.Error(c, http.StatusInternalServerError, "Failed to delete role", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"role_id":   role.ID,
		"role_name": role.Name,
	}).Info("Role deleted successfully")

	response.Success(c, http.StatusOK, "Role deleted successfully", nil)
}

// GetPermissions retrieves all permissions for a role
// @Summary Get role permissions
// @Description Retrieves all permissions assigned to a role
// @Tags roles
// @Produce json
// @Param id path int true "Role ID"
// @Success 200 {object} response.Response "Permissions retrieved successfully"
// @Failure 404 {object} response.Response "Role not found"
// @Router /roles/{id}/permissions [get]
func (h *RoleHandler) GetPermissions(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	// Check if role exists
	_, err = h.roleRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", id).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Get role permissions
	permissions, err := h.roleRepo.GetPermissions(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", id).Error("Failed to get role permissions")
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve permissions", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Permissions retrieved successfully", permissions)
}

// AssignPermission assigns a permission to a role
// @Summary Assign permission to role
// @Description Assigns a permission to a role
// @Tags roles
// @Accept json
// @Produce json
// @Param id path int true "Role ID"
// @Param request body AssignPermissionRequest true "Permission assignment request"
// @Success 200 {object} response.Response "Permission assigned successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 404 {object} response.Response "Role or permission not found"
// @Router /roles/{id}/permissions [post]
func (h *RoleHandler) AssignPermission(c *gin.Context) {
	idStr := c.Param("id")
	roleID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	var req AssignPermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind permission assignment request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Permission assignment validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Check if role exists
	_, err = h.roleRepo.GetByID(uint(roleID))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", roleID).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Assign permission
	if err := h.roleRepo.AssignPermission(uint(roleID), req.PermissionID); err != nil {
		h.logger.WithError(err).Error("Permission assignment failed")
		response.Error(c, http.StatusInternalServerError, "Failed to assign permission", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"role_id":       roleID,
		"permission_id": req.PermissionID,
	}).Info("Permission assigned to role successfully")

	response.Success(c, http.StatusOK, "Permission assigned successfully", nil)
}

// RemovePermission removes a permission from a role
// @Summary Remove permission from role
// @Description Removes a permission from a role
// @Tags roles
// @Produce json
// @Param id path int true "Role ID"
// @Param permissionId path int true "Permission ID"
// @Success 200 {object} response.Response "Permission removed successfully"
// @Failure 404 {object} response.Response "Role not found"
// @Router /roles/{id}/permissions/{permissionId} [delete]
func (h *RoleHandler) RemovePermission(c *gin.Context) {
	idStr := c.Param("id")
	roleID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	permissionIdStr := c.Param("permissionId")
	permissionID, err := strconv.ParseUint(permissionIdStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid permission ID", err.Error())
		return
	}

	// Check if role exists
	_, err = h.roleRepo.GetByID(uint(roleID))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", roleID).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Remove permission
	if err := h.roleRepo.RemovePermission(uint(roleID), uint(permissionID)); err != nil {
		h.logger.WithError(err).Error("Permission removal failed")
		response.Error(c, http.StatusInternalServerError, "Failed to remove permission", err.Error())
		return
	}

	h.logger.WithFields(logrus.Fields{
		"role_id":       roleID,
		"permission_id": permissionID,
	}).Info("Permission removed from role successfully")

	response.Success(c, http.StatusOK, "Permission removed successfully", nil)
}

// GetUsers retrieves users with a specific role
// @Summary Get users by role
// @Description Retrieves all users assigned to a specific role
// @Tags roles
// @Produce json
// @Param id path int true "Role ID"
// @Success 200 {object} response.Response "Users retrieved successfully"
// @Failure 404 {object} response.Response "Role not found"
// @Router /roles/{id}/users [get]
func (h *RoleHandler) GetUsers(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid role ID", err.Error())
		return
	}

	// Check if role exists
	role, err := h.roleRepo.GetByID(uint(id))
	if err != nil {
		h.logger.WithError(err).WithField("role_id", id).Error("Role not found")
		response.Error(c, http.StatusNotFound, "Role not found", err.Error())
		return
	}

	// Get users with role
	users, err := h.roleRepo.GetUsersWithRole(uint(id))
	if err != nil {
		h.logger.WithError(err).Error("Failed to get role users")
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
		"role": role,
		"users": userData,
		"count": len(userData),
	})
}

// GetAllPermissions retrieves all available permissions in the system
// @Summary Get all permissions
// @Description Retrieves all available system permissions
// @Tags roles
// @Produce json
// @Success 200 {object} response.Response "Permissions retrieved successfully"
// @Router /permissions [get]
func (h *RoleHandler) GetAllPermissions(c *gin.Context) {
	permissions := rbac.GetAllPermissionDefinitions()

	// Group permissions by resource
	groupedPermissions := make(map[string][]rbac.PermissionDefinition)
	for _, perm := range permissions {
		resource := string(perm.Resource)
		groupedPermissions[resource] = append(groupedPermissions[resource], perm)
	}

	response.Success(c, http.StatusOK, "Permissions retrieved successfully", gin.H{
		"permissions": permissions,
		"grouped":     groupedPermissions,
		"total_count": len(permissions),
	})
}