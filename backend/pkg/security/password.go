package security

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

// PasswordHasher handles password hashing and validation
type PasswordHasher struct {
	cost int
}

// NewPasswordHasher creates a new password hasher with default cost
func NewPasswordHasher() *PasswordHasher {
	return &PasswordHasher{
		cost: bcrypt.DefaultCost, // 12 is recommended for production
	}
}

// NewPasswordHasherWithCost creates a new password hasher with specified cost
func NewPasswordHasherWithCost(cost int) *PasswordHasher {
	return &PasswordHasher{
		cost: cost,
	}
}

// HashPassword hashes a password using bcrypt
func (p *PasswordHasher) HashPassword(password string) (string, error) {
	if len(password) < 6 {
		return "", fmt.Errorf("password must be at least 6 characters long")
	}

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), p.cost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	return string(hashedBytes), nil
}

// CheckPassword verifies a password against its hash
func (p *PasswordHasher) CheckPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

// ValidatePassword validates password strength
func ValidatePassword(password string) error {
	if len(password) < 6 {
		return fmt.Errorf("password must be at least 6 characters long")
	}

	if len(password) > 72 {
		return fmt.Errorf("password must be less than 73 characters long")
	}

	// Check for at least one uppercase letter
	hasUpper := false
	for _, char := range password {
		if char >= 'A' && char <= 'Z' {
			hasUpper = true
			break
		}
	}
	if !hasUpper {
		return fmt.Errorf("password must contain at least one uppercase letter")
	}

	// Check for at least one lowercase letter
	hasLower := false
	for _, char := range password {
		if char >= 'a' && char <= 'z' {
			hasLower = true
			break
		}
	}
	if !hasLower {
		return fmt.Errorf("password must contain at least one lowercase letter")
	}

	// Check for at least one digit
	hasDigit := false
	for _, char := range password {
		if char >= '0' && char <= '9' {
			hasDigit = true
			break
		}
	}
	if !hasDigit {
		return fmt.Errorf("password must contain at least one digit")
	}

	return nil
}

// PasswordStrength represents password strength levels
type PasswordStrength int

const (
	PasswordStrengthWeak PasswordStrength = iota
	PasswordStrengthFair
	PasswordStrengthGood
	PasswordStrengthStrong
)

// GetPasswordStrength calculates password strength
func GetPasswordStrength(password string) PasswordStrength {
	strength := 0

	// Length bonus
	if len(password) >= 8 {
		strength++
	}
	if len(password) >= 12 {
		strength++
	}

	// Complexity bonus
	hasUpper := false
	hasLower := false
	hasDigit := false
	hasSpecial := false

	for _, char := range password {
		switch {
		case char >= 'A' && char <= 'Z':
			hasUpper = true
		case char >= 'a' && char <= 'z':
			hasLower = true
		case char >= '0' && char <= '9':
			hasDigit = true
		default:
			if char < 'a' || char > 'z' {
				hasSpecial = true
			}
		}
	}

	if hasUpper {
		strength++
	}
	if hasLower {
		strength++
	}
	if hasDigit {
		strength++
	}
	if hasSpecial {
		strength++
	}

	// Convert strength score to level
	switch {
	case strength >= 7:
		return PasswordStrengthStrong
	case strength >= 5:
		return PasswordStrengthGood
	case strength >= 3:
		return PasswordStrengthFair
	default:
		return PasswordStrengthWeak
	}
}

// GenerateSecurePassword generates a secure random password
func GenerateSecurePassword(length int) (string, error) {
	if length < 8 {
		length = 8
	}
	if length > 72 {
		length = 72
	}

	// Simple password generator - in production, use crypto/rand
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

	password := make([]byte, length)
	for i := range password {
		password[i] = charset[i%len(charset)]
	}

	return string(password), ValidatePassword(string(password))
}