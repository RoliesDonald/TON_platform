package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"

	"ton-platform/internal/service"
	"ton-platform/pkg/response"
	"ton-platform/pkg/security"
)

// AuthHandler handles authentication HTTP requests
type AuthHandler struct {
	authService *service.AuthService
	validator   *validator.Validate
	logger      *logrus.Logger
}

// NewAuthHandler creates a new authentication handler
func NewAuthHandler(authService *service.AuthService, logger *logrus.Logger) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validator:   validator.New(),
		logger:      logger,
	}
}

// Register handles user registration
// @Summary Register a new user account
// @Description Creates a new user account with the provided details
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body service.RegisterRequest true "User registration request"
// @Success 200 {object} response.AuthResponse "Registration successful"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 409 {object} response.Response "User already exists"
// @Router /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req service.RegisterRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind registration request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	// Validate request
	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Registration validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Attempt registration
	result, err := h.authService.Register(&req)
	if err != nil {
		h.logger.WithError(err).Error("Registration failed")
		if err.Error() == "user with this email already exists" ||
			err.Error() == "username already exists" {
			response.Error(c, http.StatusConflict, "Account already exists", err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Registration failed", err.Error())
		}
		return
	}

	// Registration successful
	response.Success(c, http.StatusCreated, "User registered successfully", result)
}

// Login handles user authentication
// @Summary Authenticate user and return tokens
// @Description Validates user credentials and returns JWT tokens
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body service.LoginRequest true "Login request"
// @Success 200 {object} response.AuthResponse "Login successful"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 401 {object} response.Response "Invalid credentials"
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind login request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	// Validate request
	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Login validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Attempt login
	result, err := h.authService.Login(&req)
	if err != nil {
		h.logger.WithError(err).Error("Login failed")
		if err.Error() == "invalid email or password" || err.Error() == "account is inactive" {
			response.Error(c, http.StatusUnauthorized, "Authentication failed", err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Login failed", err.Error())
		}
		return
	}

	// Login successful
	h.logger.WithFields(logrus.Fields{
		"user_id":  result.User.ID,
		"email":   result.User.Email,
	}).Info("User logged in successfully")

	response.Success(c, http.StatusOK, "Login successful", result)
}

// RefreshToken handles JWT token refresh
// @Summary Refresh access token using refresh token
// @Description Generates new access token from valid refresh token
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body service.RefreshTokenRequest true "Token refresh request"
// @Success 200 {object} response.AuthResponse "Token refreshed successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 401 {object} response.Response "Invalid refresh token"
// @Router /auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req service.RefreshTokenRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind refresh token request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	// Validate request
	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Refresh token validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Attempt token refresh
	result, err := h.authService.RefreshToken(&req)
	if err != nil {
		h.logger.WithError(err).Error("Token refresh failed")
		if err.Error() == "invalid refresh token" || err.Error() == "refresh token expired" {
			response.Error(c, http.StatusUnauthorized, "Token refresh failed", err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Token refresh failed", err.Error())
		}
		return
	}

	// Token refresh successful
	response.Success(c, http.StatusOK, "Token refreshed successfully", result)
}

// ValidateToken validates a JWT token
// @Summary Validate JWT token and return user information
// @Description Validates the provided JWT token and returns user information
// @Tags authentication
// @Accept json
// @Produce json
// @Success 200 {object} service.UserInfo "Token is valid"
// @Failure 401 {object} response.Response "Invalid token"
// @Router /auth/validate [post]
func (h *AuthHandler) ValidateToken(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		response.Error(c, http.StatusBadRequest, "Authorization header is required", "Missing authorization header")
		return
	}

	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	// Validate token
	result, err := h.authService.ValidateToken(tokenString)
	if err != nil {
		h.logger.WithError(err).Error("Token validation failed")
		response.Error(c, http.StatusUnauthorized, "Invalid token", err.Error())
		return
	}

	// Token is valid
	response.Success(c, http.StatusOK, "Token is valid", result)
}

// ChangePassword handles password change request
// @Summary Change user password
// @Description Changes the user's password after validating the current password
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body struct {currentPassword string "Current password" validate:"required" newPassword string "New password" validate:"required"} true "Password change request"
// @Success 200 {object} response.Response "Password changed successfully"
// @Failure 400 {object} response.Response "Validation error"
// @Failure 401 {object} response.Response "Invalid current password"
// @Router /auth/change-password [post]
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "User not authenticated")
		return
	}

	id, ok := userID.(uint)
	if !ok {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", "Invalid user ID format")
		return
	}

	var req struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required"`
	}

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.WithError(err).Error("Failed to bind password change request")
		response.Error(c, http.StatusBadRequest, "Invalid request format", err.Error())
		return
	}

	// Validate request
	if err := h.validator.Struct(&req); err != nil {
		h.logger.WithError(err).Error("Password change validation failed")
		response.ValidationError(c, "Validation failed", err)
		return
	}

	// Validate new password
	if err := security.ValidatePassword(req.NewPassword); err != nil {
		h.logger.WithError(err).Error("Password validation failed")
		response.Error(c, http.StatusBadRequest, "Invalid new password", err.Error())
		return
	}

	// Attempt password change
	if err := h.authService.ChangePassword(id, req.CurrentPassword, req.NewPassword); err != nil {
		h.logger.WithError(err).Error("Password change failed")
		if err.Error() == "current password is incorrect" {
			response.Error(c, http.StatusUnauthorized, "Password change failed", err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Password change failed", err.Error())
		}
		return
	}

	// Password change successful
	h.logger.WithField("user_id", id).Info("Password changed successfully")
	response.Success(c, http.StatusOK, "Password changed successfully", nil)
}

// Logout handles user logout
// @Summary Logout user
// @Description Logs out the user and optionally revokes the token
// @Tags authentication
// @Accept json
// @Produce json
// @Success 200 {object} response.Response "Logout successful"
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "User not authenticated")
		return
	}

	id, ok := userID.(uint)
	if !ok {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", "Invalid user ID format")
		return
	}

	// Logout user
	if err := h.authService.Logout(id); err != nil {
		h.logger.WithError(err).Error("Logout failed")
		response.Error(c, http.StatusInternalServerError, "Logout failed", err.Error())
		return
	}

	// Logout successful
	h.logger.WithField("user_id", id).Info("User logged out successfully")
	response.Success(c, http.StatusOK, "Logout successful", nil)
}

// GetProfile retrieves user profile information
// @Summary Get user profile
// @Description Returns the authenticated user's profile information
// @Tags authentication
// @Produce json
// @Success 200 {object} service.UserInfo "User profile retrieved successfully"
// @Failure 401 {object} response.Response "Authentication required"
// @Router /auth/profile [get]
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "User not authenticated")
		return
	}

	id, ok := userID.(uint)
	if !ok {
		response.Error(c, http.StatusBadRequest, "Invalid user ID", "Invalid user ID format")
		return
	}

	// Get user profile
	profile, err := h.authService.GetUserProfile(id)
	if err != nil {
		h.logger.WithError(err).Error("Failed to get user profile")
		response.Error(c, http.StatusInternalServerError, "Failed to get profile", err.Error())
		return
	}

	// Profile retrieved successfully
	response.Success(c, http.StatusOK, "Profile retrieved successfully", profile)
}