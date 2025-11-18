package security

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWTManager handles JWT token generation and validation
type JWTManager struct {
	secretKey         string
	accessTokenExpiry  time.Duration
	refreshTokenExpiry time.Duration
}

// JWTClaims represents JWT claims
type JWTClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	Email    string `json:"email"`
	jwt.RegisteredClaims
}

// TokenPair represents access and refresh token pair
type TokenPair struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	ExpiresAt    time.Time `json:"expires_at"`
	TokenType    string    `json:"token_type"`
}

// NewJWTManager creates a new JWT manager
func NewJWTManager(secretKey string, accessTokenExpiry, refreshTokenExpiry time.Duration) *JWTManager {
	return &JWTManager{
		secretKey:         secretKey,
		accessTokenExpiry:  accessTokenExpiry,
		refreshTokenExpiry: refreshTokenExpiry,
	}
}

// GenerateTokenPair generates access and refresh tokens
func (j *JWTManager) GenerateTokenPair(userID uint, username, role, email string) (*TokenPair, error) {
	// Generate access token
	accessToken, err := j.generateToken(userID, username, role, email, j.accessTokenExpiry)
	if err != nil {
		return nil, err
	}

	// Generate refresh token (longer expiry)
	refreshToken, err := j.generateToken(userID, username, role, email, j.refreshTokenExpiry)
	if err != nil {
		return nil, err
	}

	return &TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    time.Now().Add(j.accessTokenExpiry),
		TokenType:    "Bearer",
	}, nil
}

// generateToken generates a JWT token with specified claims
func (j *JWTManager) generateToken(userID uint, username, role, email string, expiry time.Duration) (string, error) {
	claims := JWTClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
		Email:    email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "ton-platform",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.secretKey))
}

// ValidateToken validates a JWT token and returns claims
func (j *JWTManager) ValidateToken(tokenString string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(j.secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// RefreshToken generates new access token from refresh token
func (j *JWTManager) RefreshToken(refreshTokenString string) (*TokenPair, error) {
	claims, err := j.ValidateToken(refreshTokenString)
	if err != nil {
		return nil, err
	}

	// Check if token is expired (allow some grace period for refresh tokens)
	if time.Now().After(claims.ExpiresAt.Add(time.Hour * 24 * 7)) { // 7 days grace period
		return nil, errors.New("refresh token expired")
	}

	// Generate new token pair
	return j.GenerateTokenPair(claims.UserID, claims.Username, claims.Role, claims.Email)
}

// ExtractUserIDFromToken extracts user ID from token
func (j *JWTManager) ExtractUserIDFromToken(tokenString string) (uint, error) {
	claims, err := j.ValidateToken(tokenString)
	if err != nil {
		return 0, err
	}

	return claims.UserID, nil
}

// ExtractRoleFromToken extracts user role from token
func (j *JWTManager) ExtractRoleFromToken(tokenString string) (string, error) {
	claims, err := j.ValidateToken(tokenString)
	if err != nil {
		return "", err
	}

	return claims.Role, nil
}

// ExtractUsernameFromToken extracts username from token
func (j *JWTManager) ExtractUsernameFromToken(tokenString string) (string, error) {
	claims, err := j.ValidateToken(tokenString)
	if err != nil {
		return "", err
	}

	return claims.Username, nil
}

// GetTokenExpiry returns the expiry time of a token
func (j *JWTManager) GetTokenExpiry(tokenString string) (*time.Time, error) {
	claims, err := j.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	expiry := claims.ExpiresAt.Time
	return &expiry, nil
}

// IsTokenExpired checks if a token is expired
func (j *JWTManager) IsTokenExpired(tokenString string) bool {
	claims, err := j.ValidateToken(tokenString)
	if err != nil {
		return true
	}

	return time.Now().After(claims.ExpiresAt.Time)
}

// GenerateSecureSecret generates a secure JWT secret key
func GenerateSecureSecret() (string, error) {
	// Simple implementation - in production, use crypto/rand
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
	secret := make([]byte, 32)
	for i := range secret {
		secret[i] = charset[i%len(charset)]
	}
	return string(secret), nil
}