package main

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"-" gorm:"column:password_hash"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	IsActive  bool   `json:"is_active"`
	Role      string `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	ExpiresAt    time.Time `json:"expires_at"`
	TokenType    string    `json:"token_type"`
	User         UserInfo  `json:"user"`
}

type UserInfo struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Role      string    `json:"role"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

var db *gorm.DB

func main() {
	// Database connection
	dsn := "host=postgres user=ton_user password=ton_password dbname=ton_platform port=5432 sslmode=disable TimeZone=UTC"
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate
	db.AutoMigrate(&User{})

	// Gin router
	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"message": "TON Platform API is running",
		})
	})

	// Auth endpoints
	r.POST("/api/v1/auth/login", login)
	r.POST("/api/v1/auth/logout", authMiddleware(), logout)
	r.GET("/api/v1/auth/profile", authMiddleware(), profile)

	// Ping endpoint
	r.GET("/api/v1/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"version": "1.0.0",
		})
	})

	fmt.Println("🚀 Starting TON Platform API on :8080")
	log.Fatal(r.Run(":8080"))
}

func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"message": "Invalid request format",
			"error":   err.Error(),
		})
		return
	}

	// Demo credentials: accept any email with password "password"
	if req.Password == "password" {
		log.Printf("✅ Demo login successful for %s", req.Email)

		// Create mock tokens
		token := "mock-jwt-token-" + fmt.Sprintf("%d", time.Now().Unix())

		// Determine user role based on email pattern
		role := "User"
		firstName := "Demo"
		lastName := "User"

		if strings.Contains(req.Email, "admin") {
			role = "Administrator"
			firstName = "Admin"
			lastName = "User"
		} else if strings.Contains(req.Email, "sarah") || strings.Contains(req.Email, "michael") {
			role = "Fleet Manager"
			firstName = strings.Split(req.Email, ".")[0]
			lastName = strings.Split(strings.Split(req.Email, "@")[0], ".")[1]
		} else if strings.Contains(req.Email, "emily") {
			role = "Finance Manager"
			firstName = "Emily"
			lastName = "Davis"
		} else if strings.Contains(req.Email, "robert") || strings.Contains(req.Email, "lisa") {
			role = "Service Advisor"
			firstName = strings.Split(req.Email, ".")[0]
			lastName = strings.Split(strings.Split(req.Email, "@")[0], ".")[1]
		} else if strings.Contains(req.Email, "james") {
			role = "Mechanic"
			firstName = "James"
			lastName = "Taylor"
		} else if strings.Contains(req.Email, "david") {
			role = "Driver"
			firstName = "David"
			lastName = "Brown"
		}

		response := AuthResponse{
			AccessToken:  token,
			RefreshToken: token + "-refresh",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			TokenType:    "Bearer",
			User: UserInfo{
				ID:        1,
				Username:  strings.Split(req.Email, "@")[0],
				Email:     req.Email,
				FirstName: firstName,
				LastName:  lastName,
				Role:      role,
				IsActive:  true,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
		}

		c.JSON(200, gin.H{
			"success": true,
			"message": "Login successful",
			"data":    response,
		})
		return
	}

	// For non-demo credentials, return error
	c.JSON(401, gin.H{
		"success": false,
		"message": "Authentication failed",
		"error":   "invalid email or password - use password 'password' for demo",
	})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{
				"success": false,
				"message": "Authorization header required",
			})
			c.Abort()
			return
		}

		// Simple token validation
		if authHeader[:7] != "Bearer " {
			c.JSON(401, gin.H{
				"success": false,
				"message": "Invalid token format",
			})
			c.Abort()
			return
		}

		token := authHeader[7:]
		if len(token) < 10 {
			c.JSON(401, gin.H{
				"success": false,
				"message": "Invalid token",
			})
			c.Abort()
			return
		}

		// Set mock user context
		c.Set("user_id", uint(1))
		c.Set("email", "admin@tonplatform.com")
		c.Set("username", "admin")
		c.Set("role", "admin")
		
		c.Next()
	}
}

func logout(c *gin.Context) {
	userID := c.GetUint("user_id")
	email := c.GetString("email")
	username := c.GetString("username")

	// Log the logout
	log.Printf("🚪 User logged out: %s (ID: %d)", email, userID)

	// In a real implementation, you might:
	// - Add the token to a blacklist
	// - Clear the user's session
	// - Revoke the refresh token
	// For now, we'll just log it out

	c.JSON(200, gin.H{
		"success": true,
		"message": "Logout successful",
		"data": gin.H{
			"user_id":  userID,
			"username": username,
			"email":    email,
		},
	})
}

func profile(c *gin.Context) {
	userID := c.GetUint("user_id")
	email := c.GetString("email")
	username := c.GetString("username")
	role := c.GetString("role")

	c.JSON(200, gin.H{
		"success": true,
		"message": "Profile retrieved successfully",
		"data": gin.H{
			"id":       userID,
			"username": username,
			"email":    email,
			"role":     role,
		},
	})
}
