package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"ton-platform/pkg/security"
)

// AuthMiddleware provides JWT authentication middleware
type AuthMiddleware struct {
	jwtManager *security.JWTManager
	logger     *logrus.Logger
}

// NewAuthMiddleware creates a new authentication middleware
func NewAuthMiddleware(jwtSecret string, logger *logrus.Logger) *AuthMiddleware {
	return &AuthMiddleware{
		jwtManager: security.NewJWTManager(jwtSecret, 15*time.Minute, 7*24*time.Hour),
		logger:     logger,
	}
}

// RequireAuth middleware requires valid JWT token
func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Authorization header is required",
				"error":   "missing_authorization_header",
			})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>" format
		tokenParts := strings.SplitN(authHeader, " ", 2)
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid authorization header format",
				"error":   "invalid_authorization_format",
			})
			c.Abort()
			return
		}

		token := tokenParts[1]
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Token is required",
				"error":   "missing_token",
			})
			c.Abort()
			return
		}

		// Validate token and extract claims
		claims, err := m.jwtManager.ValidateToken(token)
		if err != nil {
			m.logger.WithFields(logrus.Fields{
				"error": err.Error(),
				"token": token[:20] + "...", // Log only part of token
			}).Warn("Invalid token in authentication middleware")

			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid or expired token",
				"error":   "invalid_token",
			})
			c.Abort()
			return
		}

		// Check if token is expired
		if m.jwtManager.IsTokenExpired(token) {
			m.logger.WithField("user_id", claims.UserID).Warn("Expired token used")
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Token has expired",
				"error":   "token_expired",
			})
			c.Abort()
			return
		}

		// Add user information to context
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Set("user_claims", claims)

		m.logger.WithFields(logrus.Fields{
			"user_id":  claims.UserID,
			"username": claims.Username,
			"role":     claims.Role,
			"path":     c.Request.URL.Path,
		}).Debug("User authenticated")

		c.Next()
	}
}

// OptionalAuth middleware validates token if present but doesn't require it
func (m *AuthMiddleware) OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// No authorization header, continue without authentication
			c.Next()
			return
		}

		// Extract token from "Bearer <token>" format
		tokenParts := strings.SplitN(authHeader, " ", 2)
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			// Invalid format, continue without authentication
			c.Next()
			return
		}

		token := tokenParts[1]
		if token == "" {
			// No token, continue without authentication
			c.Next()
			return
		}

		// Try to validate token
		claims, err := m.jwtManager.ValidateToken(token)
		if err != nil {
			// Invalid token, continue without authentication
			c.Next()
			return
		}

		// Check if token is expired
		if m.jwtManager.IsTokenExpired(token) {
			// Expired token, continue without authentication
			c.Next()
			return
		}

		// Valid token, add user information to context
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Set("user_claims", claims)

		m.logger.WithFields(logrus.Fields{
			"user_id": claims.UserID,
			"username": claims.Username,
			"role":     claims.Role,
			"path":     c.Request.URL.Path,
		}).Debug("User authenticated with optional middleware")

		c.Next()
	}
}

// RequireRole middleware requires user to have specific role
func (m *AuthMiddleware) RequireRole(requiredRoles ...string) gin.HandlerFunc {
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

		role, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid user role format",
				"error":   "invalid_role_format",
			})
			c.Abort()
			return
		}

		// Check if user has required role
		hasRequiredRole := false
		for _, requiredRole := range requiredRoles {
			if role == requiredRole {
				hasRequiredRole = true
				break
			}
		}

		if !hasRequiredRole {
			m.logger.WithFields(logrus.Fields{
				"user_role":      role,
				"required_roles": requiredRoles,
				"path":           c.Request.URL.Path,
			}).Warn("User does not have required role")

			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Insufficient permissions",
				"error":   "insufficient_permissions",
				"details": fmt.Sprintf("Required roles: %v, Current role: %s", requiredRoles, role),
			})
			c.Abort()
			return
		}

		m.logger.WithFields(logrus.Fields{
			"user_role": role,
			"path":     c.Request.URL.Path,
		}).Debug("Role authorization passed")

		c.Next()
	}
}

// RequireAdmin middleware requires user to be an administrator
func (m *AuthMiddleware) RequireAdmin() gin.HandlerFunc {
	return m.RequireRole("Administrator")
}

// RequireAreaManager middleware requires user to be an Area Manager or Administrator
func (m *AuthMiddleware) RequireAreaManager() gin.HandlerFunc {
	return m.RequireRole("Administrator", "Area Manager")
}

// RequireServiceAdvisor middleware requires user to be a Service Advisor or above
func (m *AuthMiddleware) RequireServiceAdvisor() gin.HandlerFunc {
	return m.RequireRole("Administrator", "Area Manager", "Service Advisor")
}

// RequireMechanic middleware requires user to be a Mechanic
func (m *AuthMiddleware) RequireMechanic() gin.HandlerFunc {
	return m.RequireRole("Mechanic")
}

// RequireWarehouseStaff middleware requires user to be Warehouse Staff
func (m *AuthMiddleware) RequireWarehouseStaff() gin.HandlerFunc {
	return m.RequireRole("Warehouse Staff")
}

// RequireDriver middleware requires user to be a Driver
func (m *AuthMiddleware) RequireDriver() gin.HandlerFunc {
	return m.RequireRole("Driver")
}

// RequireAccountant middleware requires user to be an Accountant
func (m *AuthMiddleware) RequireAccountant() gin.HandlerFunc {
	return m.RequireRole("Accountant")
}

// GetUserID retrieves user ID from context (helper function)
func GetUserID(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, false
	}

	id, ok := userID.(uint)
	return id, ok
}

// GetUserRole retrieves user role from context (helper function)
func GetUserRole(c *gin.Context) (string, bool) {
	role, exists := c.Get("role")
	if !exists {
		return "", false
	}

	roleStr, ok := role.(string)
	return roleStr, ok
}

// GetUsername retrieves username from context (helper function)
func GetUsername(c *gin.Context) (string, bool) {
	username, exists := c.Get("username")
	if !exists {
		return "", false
	}

	usernameStr, ok := username.(string)
	return usernameStr, ok
}

// GetUserEmail retrieves user email from context (helper function)
func GetUserEmail(c *gin.Context) (string, bool) {
	email, exists := c.Get("email")
	if !exists {
		return "", false
	}

	emailStr, ok := email.(string)
	return emailStr, ok
}

// GetUserClaims retrieves full JWT claims from context (helper function)
func GetUserClaims(c *gin.Context) (*security.JWTClaims, bool) {
	claims, exists := c.Get("user_claims")
	if !exists {
		return nil, false
	}

	claimsStruct, ok := claims.(*security.JWTClaims)
	return claimsStruct, ok
}