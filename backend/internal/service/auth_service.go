package service

import (
	"errors"
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/sirupsen/logrus"

	"ton-platform/internal/domain"
	"ton-platform/internal/repository/interfaces"
	"ton-platform/pkg/security"
)

// AuthService handles authentication business logic
type AuthService struct {
	userRepo      interfaces.UserRepository
	roleRepo      interfaces.RoleRepository
	passwordHasher *security.PasswordHasher
	jwtManager    *security.JWTManager
	validator     *validator.Validate
	logger        *logrus.Logger
}

// RegisterRequest represents user registration request
type RegisterRequest struct {
	Username  string `json:"username" validate:"required,min=3,max=50"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=6"`
	FirstName string `json:"first_name" validate:"required,min=1,max=100"`
	LastName  string `json:"last_name" validate:"required,min=1,max=100"`
	RoleID    uint   `json:"role_id" validate:"required"`
}

// LoginRequest represents user login request
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// RefreshTokenRequest represents token refresh request
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// AuthResponse represents authentication response
type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	ExpiresAt    time.Time `json:"expires_at"`
	TokenType    string    `json:"token_type"`
	User         UserInfo  `json:"user"`
}

// UserInfo represents user information for auth response
type UserInfo struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Role      string    `json:"role"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

// NewAuthService creates a new authentication service
func NewAuthService(
	userRepo interfaces.UserRepository,
	roleRepo interfaces.RoleRepository,
	jwtSecret string,
	logger *logrus.Logger,
) *AuthService {
	return &AuthService{
		userRepo:      userRepo,
		roleRepo:      roleRepo,
		passwordHasher: security.NewPasswordHasher(),
		jwtManager:    security.NewJWTManager(jwtSecret, 15*time.Minute, 7*24*time.Hour),
		validator:     validator.New(),
		logger:        logger,
	}
}

// Register creates a new user account
func (s *AuthService) Register(req *RegisterRequest) (*AuthResponse, error) {
	// Validate request
	if err := s.validator.Struct(req); err != nil {
		s.logger.WithError(err).Error("Validation failed during registration")
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Additional password validation
	if err := security.ValidatePassword(req.Password); err != nil {
		s.logger.WithError(err).Error("Password validation failed")
		return nil, err
	}

	// Check if user already exists
	if existingUser, _ := s.userRepo.GetByEmail(req.Email); existingUser != nil {
		return nil, errors.New("user with this email already exists")
	}

	if existingUser, _ := s.userRepo.GetByUsername(req.Username); existingUser != nil {
		return nil, errors.New("username already exists")
	}

	// Validate role exists
	_, err := s.roleRepo.GetByID(req.RoleID)
	if err != nil {
		s.logger.WithError(err).Error("Role validation failed")
		return nil, fmt.Errorf("invalid role: %w", err)
	}

	// Hash password
	hashedPassword, err := s.passwordHasher.HashPassword(req.Password)
	if err != nil {
		s.logger.WithError(err).Error("Password hashing failed")
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user
	user := &domain.User{
		Username:  req.Username,
		Email:     req.Email,
		Password:  hashedPassword,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		RoleID:    req.RoleID,
		IsActive:  true,
	}

	if err := s.userRepo.Create(user); err != nil {
		s.logger.WithError(err).Error("User creation failed")
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Load user with role information
	user, err = s.userRepo.GetByID(user.ID)
	if err != nil {
		s.logger.WithError(err).Error("Failed to load user after creation")
		return nil, fmt.Errorf("failed to load user: %w", err)
	}

	s.logger.WithFields(logrus.Fields{
		"user_id":  user.ID,
		"email":    user.Email,
		"username": user.Username,
		"role":     user.Role.Name,
	}).Info("User registered successfully")

	// Generate JWT tokens
	tokenPair, err := s.jwtManager.GenerateTokenPair(
		user.ID,
		user.Username,
		user.Role.Name,
		user.Email,
	)
	if err != nil {
		s.logger.WithError(err).Error("Token generation failed")
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	// Prepare response
	return &AuthResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
		ExpiresAt:    tokenPair.ExpiresAt,
		TokenType:    tokenPair.TokenType,
		User: UserInfo{
			ID:        user.ID,
			Username:  user.Username,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
	Role:      user.Role.Name,
			IsActive:  user.IsActive,
			CreatedAt: user.CreatedAt,
		},
	}, nil
}

// Login authenticates a user and returns tokens
func (s *AuthService) Login(req *LoginRequest) (*AuthResponse, error) {
	// Validate request
	if err := s.validator.Struct(req); err != nil {
		s.logger.WithError(err).Error("Validation failed during login")
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Find user by email
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		s.logger.WithFields(logrus.Fields{
			"email": req.Email,
		}).Warn("Login attempt with non-existent email")
		return nil, errors.New("invalid email or password")
	}

	// Check if user is active
	if !user.IsActive {
		s.logger.WithFields(logrus.Fields{
			"user_id": user.ID,
			"email":   user.Email,
		}).Warn("Login attempt for inactive user")
		return nil, errors.New("account is inactive")
	}

	// Verify password using bcrypt for ALL users
	if err := s.passwordHasher.CheckPassword(user.Password, req.Password); err != nil {
		s.logger.WithFields(logrus.Fields{
			"user_id": user.ID,
			"email":   user.Email,
			"error":   err.Error(),
		}).Warn("Login attempt with invalid password")
		return nil, errors.New("invalid email or password")
	}

	// Password is correct
	s.logger.WithFields(logrus.Fields{
		"user_id": user.ID,
		"email":   user.Email,
	}).Info("User logged in successfully")

	// Load user with role information
	user, err = s.userRepo.GetByID(user.ID)
	if err != nil {
		s.logger.WithError(err).Error("Failed to load user during login")
		return nil, fmt.Errorf("failed to load user: %w", err)
	}

	// Update last login time
	if err := s.updateLastLogin(user.ID); err != nil {
		s.logger.WithError(err).Error("Failed to update last login time")
		// Don't fail login due to this error
	}

	s.logger.WithFields(logrus.Fields{
		"user_id":  user.ID,
		"email":    user.Email,
		"username": user.Username,
		"role":     user.Role.Name,
	}).Info("User logged in successfully")

	// Generate JWT tokens
	tokenPair, err := s.jwtManager.GenerateTokenPair(
		user.ID,
		user.Username,
		user.Role.Name,
		user.Email,
	)
	if err != nil {
		s.logger.WithError(err).Error("Token generation failed")
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	// Prepare response
	return &AuthResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
		ExpiresAt:    tokenPair.ExpiresAt,
		TokenType:    tokenPair.TokenType,
		User: UserInfo{
			ID:        user.ID,
			Username:  user.Username,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
	Role:      user.Role.Name,
			IsActive:  user.IsActive,
			CreatedAt: user.CreatedAt,
		},
	}, nil
}

// RefreshToken generates new access token from refresh token
func (s *AuthService) RefreshToken(req *RefreshTokenRequest) (*AuthResponse, error) {
	// Validate request
	if err := s.validator.Struct(req); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Validate refresh token
	claims, err := s.jwtManager.ValidateToken(req.RefreshToken)
	if err != nil {
		return nil, fmt.Errorf("invalid refresh token: %w", err)
	}

	// Check if refresh token is expired
	if s.jwtManager.IsTokenExpired(req.RefreshToken) {
		return nil, errors.New("refresh token expired")
	}

	// Load user with role information
	user, err := s.userRepo.GetByID(claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	if !user.IsActive {
		return nil, errors.New("user account is inactive")
	}

	s.logger.WithFields(logrus.Fields{
		"user_id": user.ID,
		"email":   user.Email,
	}).Info("Token refreshed successfully")

	// Generate new token pair
	tokenPair, err := s.jwtManager.RefreshToken(req.RefreshToken)
	if err != nil {
		return nil, fmt.Errorf("failed to refresh token: %w", err)
	}

	// Prepare response
	return &AuthResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
		ExpiresAt:    tokenPair.ExpiresAt,
		TokenType:    tokenPair.TokenType,
		User: UserInfo{
			ID:        user.ID,
			Username:  user.Username,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
	Role:      user.Role.Name,
			IsActive:  user.IsActive,
			CreatedAt: user.CreatedAt,
		},
	}, nil
}

// ValidateToken validates a JWT token and returns user information
func (s *AuthService) ValidateToken(tokenString string) (*UserInfo, error) {
	claims, err := s.jwtManager.ValidateToken(tokenString)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	// Load user information
	user, err := s.userRepo.GetByID(claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	if !user.IsActive {
		return nil, errors.New("user account is inactive")
	}

	return &UserInfo{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Role:      user.Role.Name,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt,
	}, nil
}

// ChangePassword changes user password
func (s *AuthService) ChangePassword(userID uint, currentPassword, newPassword string) error {
	// Validate new password
	if err := security.ValidatePassword(newPassword); err != nil {
		return err
	}

	// Get user
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	// Verify current password
	if err := s.passwordHasher.CheckPassword(user.Password, currentPassword); err != nil {
		return errors.New("current password is incorrect")
	}

	// Hash new password
	hashedPassword, err := s.passwordHasher.HashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash new password: %w", err)
	}

	// Update password
	user.Password = hashedPassword
	if err := s.userRepo.Update(user); err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	s.logger.WithFields(logrus.Fields{
		"user_id": userID,
	}).Info("Password changed successfully")

	return nil
}

// Logout handles user logout (optional - can blacklist tokens if needed)
func (s *AuthService) Logout(userID uint) error {
	s.logger.WithFields(logrus.Fields{
		"user_id": userID,
	}).Info("User logged out")

	// In a production environment, you might want to:
	// 1. Add the token to a blacklist/revocation list
	// 2. Store revoked tokens in Redis with TTL
	// 3. Implement token versioning

	return nil
}

// updateLastLogin updates the user's last login time
func (s *AuthService) updateLastLogin(userID uint) error {
	// This would typically be implemented in the repository
	// For now, we'll just log it
	s.logger.WithField("user_id", userID).Debug("Last login time updated")
	return nil
}

// GetUserProfile returns user profile information
func (s *AuthService) GetUserProfile(userID uint) (*UserInfo, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	return &UserInfo{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Role:      user.Role.Name,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt,
	}, nil
}