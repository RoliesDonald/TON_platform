package middleware

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"ton-platform/internal/repository/interfaces"
	"ton-platform/pkg/rbac"
)

// RBACMiddleware provides role-based access control middleware
type RBACMiddleware struct {
	roleRepo interfaces.RoleRepository
	logger   *logrus.Logger
	permissions rbac.RolePermissionMap
}

// NewRBACMiddleware creates a new RBAC middleware
func NewRBACMiddleware(roleRepo interfaces.RoleRepository, logger *logrus.Logger) *RBACMiddleware {
	return &RBACMiddleware{
		roleRepo:    roleRepo,
		logger:      logger,
		permissions: rbac.GetDefaultRolePermissions(),
	}
}

// RequirePermission middleware requires user to have specific permission
func (m *RBACMiddleware) RequirePermission(resource rbac.Resource, action rbac.Action) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "User role is not available",
				"error":   "role_not_found",
			})
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user role format",
				"error":   "invalid_role_format",
			})
			c.Abort()
			return
		}

		// Check permission using default permission map
		if m.permissions.HasPermission(roleStr, resource, action) {
			c.Next()
			return
		}

		// If not found in default map, check database for dynamic permissions
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "User ID is not available",
				"error":   "user_id_not_found",
			})
			c.Abort()
			return
		}

		userIDUint, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user ID format",
				"error":   "invalid_user_id_format",
			})
			c.Abort()
			return
		}

		hasPermission, err := m.checkDatabasePermission(userIDUint, resource, action)
		if err != nil {
			m.logger.WithError(err).Error("Failed to check database permission")
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to verify permissions",
				"error":   "permission_check_failed",
			})
			c.Abort()
			return
		}

		if hasPermission {
			c.Next()
			return
		}

		// Log denied access
		m.logger.WithFields(logrus.Fields{
			"user_id":  userIDUint,
			"role":     roleStr,
			"resource": resource,
			"action":   action,
			"path":     c.Request.URL.Path,
		}).Warn("Access denied due to insufficient permissions")

		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": fmt.Sprintf("Insufficient permissions. Required: %s:%s", resource, action),
			"error":   "insufficient_permissions",
			"details": fmt.Sprintf("Role '%s' does not have permission to %s %s", roleStr, action, resource),
		})
		c.Abort()
	}
}

// RequireAnyPermission middleware requires user to have any of the specified permissions
func (m *RBACMiddleware) RequireAnyPermission(permissions []rbac.PermissionDefinition) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "User role is not available",
				"error":   "role_not_found",
			})
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user role format",
				"error":   "invalid_role_format",
			})
			c.Abort()
			return
		}

		// Check if user has any of the required permissions
		for _, perm := range permissions {
			if m.permissions.HasPermission(roleStr, perm.Resource, perm.Action) {
				c.Next()
				return
			}
		}

		// If not found in default permissions, check database
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "User ID is not available",
				"error":   "user_id_not_found",
			})
			c.Abort()
			return
		}

		userIDUint, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user ID format",
				"error":   "invalid_user_id_format",
			})
			c.Abort()
			return
		}

		// Check database for any of the permissions
		for _, perm := range permissions {
			hasPermission, err := m.checkDatabasePermission(userIDUint, perm.Resource, perm.Action)
			if err != nil {
				m.logger.WithError(err).Error("Failed to check database permission")
				continue
			}
			if hasPermission {
				c.Next()
				return
			}
		}

		// Log denied access
		permStrings := make([]string, len(permissions))
		for i, perm := range permissions {
			permStrings[i] = perm.String()
		}

		m.logger.WithFields(logrus.Fields{
			"user_id":     userIDUint,
			"role":        roleStr,
			"permissions": strings.Join(permStrings, ", "),
			"path":        c.Request.URL.Path,
		}).Warn("Access denied due to insufficient permissions (any of)")

		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "Insufficient permissions. Requires at least one of: " + strings.Join(permStrings, ", "),
			"error":   "insufficient_permissions",
		})
		c.Abort()
	}
}

// RequireResourceOwner middleware requires user to own the resource or have admin permissions
func (m *RBACMiddleware) RequireResourceOwner(resourceType string, resourceIDParam string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "User ID is not available",
				"error":   "user_id_not_found",
			})
			c.Abort()
			return
		}

		userIDUint, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user ID format",
				"error":   "invalid_user_id_format",
			})
			c.Abort()
			return
		}

		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "User role is not available",
				"error":   "role_not_found",
			})
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user role format",
				"error":   "invalid_role_format",
			})
			c.Abort()
			return
		}

		// Administrators can access all resources
		if roleStr == "Administrator" {
			c.Next()
			return
		}

		// Get resource ID from URL parameter
		resourceIDStr := c.Param(resourceIDParam)
		if resourceIDStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": fmt.Sprintf("Resource ID parameter '%s' is required", resourceIDParam),
				"error":   "missing_resource_id",
			})
			c.Abort()
			return
		}

		resourceID, err := strconv.ParseUint(resourceIDStr, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid resource ID format",
				"error":   "invalid_resource_id",
			})
			c.Abort()
			return
		}

		// Check if user owns the resource
		isOwner, err := m.checkResourceOwnership(userIDUint, resourceType, uint(resourceID))
		if err != nil {
			m.logger.WithError(err).Error("Failed to check resource ownership")
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to verify resource ownership",
				"error":   "ownership_check_failed",
			})
			c.Abort()
			return
		}

		if !isOwner {
			m.logger.WithFields(logrus.Fields{
				"user_id":      userIDUint,
				"role":         roleStr,
				"resource_type": resourceType,
				"resource_id":  resourceID,
				"path":         c.Request.URL.Path,
			}).Warn("Access denied due to insufficient resource ownership")

			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Access denied. You can only access your own resources",
				"error":   "resource_access_denied",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// checkDatabasePermission checks if user has permission in database
func (m *RBACMiddleware) checkDatabasePermission(userID uint, resource rbac.Resource, action rbac.Action) (bool, error) {
	// Get user's roles from database
	userRoles, err := m.roleRepo.GetUserRoles(userID)
	if err != nil {
		return false, fmt.Errorf("failed to get user roles: %w", err)
	}

	// Check each role for the required permission
	for _, role := range userRoles {
		permissions, err := m.roleRepo.GetPermissions(role.ID)
		if err != nil {
			continue // Skip this role if we can't get permissions
		}

		for _, perm := range permissions {
			// Parse permission name (should be in format "resource:action")
			permDef, err := rbac.ParsePermission(perm.Name)
			if err != nil {
				continue // Skip invalid permission format
			}

			if permDef.Resource == resource && permDef.Action == action {
				return true, nil
			}
		}
	}

	return false, nil
}

// checkResourceOwnership checks if user owns a specific resource
func (m *RBACMiddleware) checkResourceOwnership(userID uint, resourceType string, resourceID uint) (bool, error) {
	// This is a simplified implementation
	// In a real application, you would have specific methods to check ownership
	// for different resource types

	switch resourceType {
	case "work_order":
		// Check if work order is assigned to this user
		// This would require a WorkOrderRepository
		// For now, we'll return false and let the application handle this
		return false, nil
	case "vehicle":
		// Check if vehicle is assigned to this user
		return false, nil
	case "customer":
		// Check if customer was created by this user
		return false, nil
	default:
		return false, fmt.Errorf("unsupported resource type: %s", resourceType)
	}
}

// Helper functions for common permission checks

// RequireUserRead requires user read permission
func (m *RBACMiddleware) RequireUserRead() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceUser, rbac.ActionRead)
}

// RequireUserCreate requires user create permission
func (m *RBACMiddleware) RequireUserCreate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceUser, rbac.ActionCreate)
}

// RequireUserUpdate requires user update permission
func (m *RBACMiddleware) RequireUserUpdate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceUser, rbac.ActionUpdate)
}

// RequireUserDelete requires user delete permission
func (m *RBACMiddleware) RequireUserDelete() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceUser, rbac.ActionDelete)
}

// RequireVehicleRead requires vehicle read permission
func (m *RBACMiddleware) RequireVehicleRead() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceVehicle, rbac.ActionRead)
}

// RequireVehicleCreate requires vehicle create permission
func (m *RBACMiddleware) RequireVehicleCreate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceVehicle, rbac.ActionCreate)
}

// RequireVehicleUpdate requires vehicle update permission
func (m *RBACMiddleware) RequireVehicleUpdate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceVehicle, rbac.ActionUpdate)
}

// RequireVehicleDelete requires vehicle delete permission
func (m *RBACMiddleware) RequireVehicleDelete() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceVehicle, rbac.ActionDelete)
}

// RequireWorkOrderRead requires work order read permission
func (m *RBACMiddleware) RequireWorkOrderRead() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceWorkOrder, rbac.ActionRead)
}

// RequireWorkOrderCreate requires work order create permission
func (m *RBACMiddleware) RequireWorkOrderCreate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceWorkOrder, rbac.ActionCreate)
}

// RequireWorkOrderUpdate requires work order update permission
func (m *RBACMiddleware) RequireWorkOrderUpdate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceWorkOrder, rbac.ActionUpdate)
}

// RequireWorkOrderAssign requires work order assign permission
func (m *RBACMiddleware) RequireWorkOrderAssign() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceWorkOrder, rbac.ActionAssign)
}

// RequireInventoryRead requires inventory read permission
func (m *RBACMiddleware) RequireInventoryRead() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceInventory, rbac.ActionRead)
}

// RequireInventoryUpdate requires inventory update permission
func (m *RBACMiddleware) RequireInventoryUpdate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceInventory, rbac.ActionUpdate)
}

// RequireInvoiceRead requires invoice read permission
func (m *RBACMiddleware) RequireInvoiceRead() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceInvoice, rbac.ActionRead)
}

// RequireInvoiceCreate requires invoice create permission
func (m *RBACMiddleware) RequireInvoiceCreate() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceInvoice, rbac.ActionCreate)
}

// RequireReportRead requires report read permission
func (m *RBACMiddleware) RequireReportRead() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceReport, rbac.ActionRead)
}

// RequireDashboardAccess requires dashboard access permission
func (m *RBACMiddleware) RequireDashboardAccess() gin.HandlerFunc {
	return m.RequirePermission(rbac.ResourceDashboard, rbac.ActionRead)
}