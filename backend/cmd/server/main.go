package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"ton-platform/internal/config"
	"ton-platform/internal/database"
	"ton-platform/internal/handler"
	"ton-platform/internal/middleware"
	"ton-platform/internal/repository/postgres"
	"ton-platform/internal/service"
	"ton-platform/pkg/response"
	"ton-platform/pkg/rbac"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Setup logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.InfoLevel)

	// Set Gin mode
	gin.SetMode(cfg.Server.Mode)

	// Connect to database
	db, err := database.NewConnection(&cfg.Database, logger)
	if err != nil {
		logger.WithError(err).Fatal("Failed to connect to database")
	}
	defer database.CloseConnection(db, logger)

	// Initialize repositories
	userRepo := postgres.NewUserRepositoryPostgres(db)
	roleRepo := postgres.NewRoleRepositoryPostgres(db)

	// Initialize services
	authService := service.NewAuthService(userRepo, roleRepo, cfg.JWT.Secret, logger)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService, logger)
	roleHandler := handler.NewRoleHandler(roleRepo, logger)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(cfg.JWT.Secret, logger)
	rbacMiddleware := middleware.NewRBACMiddleware(roleRepo, logger)

	// Create Gin router
	router := gin.New()

	// Add global middleware
	router.Use(middleware.Logging(logger))
	router.Use(middleware.Recovery(logger))
	router.Use(middleware.CORS())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		// Check database health
		dbHealth := "healthy"
		if err := database.HealthCheck(db); err != nil {
			dbHealth = "unhealthy: " + err.Error()
		}

		response.Success(c, http.StatusOK, "TON Platform API is running", gin.H{
			"status":     "healthy",
			"version":    "1.0.0",
			"service":    "TON Platform Backend",
			"database":   dbHealth,
			"timestamp":  time.Now().UTC(),
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Authentication routes (public)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
			auth.POST("/validate", authHandler.ValidateToken)
		}

		// Protected authentication routes
		protectedAuth := v1.Group("/auth")
		protectedAuth.Use(authMiddleware.RequireAuth())
		{
			protectedAuth.GET("/profile", authHandler.GetProfile)
			protectedAuth.POST("/change-password", authHandler.ChangePassword)
			protectedAuth.POST("/logout", authHandler.Logout)
		}

		// Example protected routes
		protected := v1.Group("/protected")
		protected.Use(authMiddleware.RequireAuth())
		{
			protected.GET("/me", func(c *gin.Context) {
				userID, exists := c.Get("user_id")
				if !exists {
					response.Error(c, http.StatusUnauthorized, "User not found in context", "user_context_missing")
					return
				}
				username, _ := c.Get("username")
				email, _ := c.Get("email")
				role, _ := c.Get("role")

				response.Success(c, http.StatusOK, "Protected route accessed successfully", gin.H{
					"user_id":  userID,
					"username": username,
					"email":    email,
					"role":     role,
				})
			})
		}

		// Role management routes (admin only)
		roles := v1.Group("/roles")
		roles.Use(authMiddleware.RequireAuth())
		roles.Use(rbacMiddleware.RequirePermission(rbac.ResourceRole, rbac.ActionRead))
		{
			roles.GET("", roleHandler.GetAll)
			roles.GET("/:id", roleHandler.GetByID)

			// Admin-only role management
			rolesCreate := roles.Group("")
			rolesCreate.Use(rbacMiddleware.RequirePermission(rbac.ResourceRole, rbac.ActionCreate))
			rolesCreate.POST("", roleHandler.Create)

			rolesUpdate := roles.Group("/:id")
			rolesUpdate.Use(rbacMiddleware.RequirePermission(rbac.ResourceRole, rbac.ActionUpdate))
			rolesUpdate.PUT("", roleHandler.Update)
			rolesUpdate.DELETE("", roleHandler.Delete)

			// Permission management
			roles.GET("/:id/permissions", roleHandler.GetPermissions)

			permAssign := roles.Group("/:id/permissions")
			permAssign.Use(rbacMiddleware.RequirePermission(rbac.ResourceRole, rbac.ActionUpdate))
			permAssign.POST("", roleHandler.AssignPermission)
			permAssign.DELETE("/:permissionId", roleHandler.RemovePermission)

			// User management
			roles.GET("/:id/users", roleHandler.GetUsers)
		}

		// Permission management routes
		permissions := v1.Group("/permissions")
		permissions.Use(authMiddleware.RequireAuth())
		permissions.Use(rbacMiddleware.RequirePermission(rbac.ResourcePermission, rbac.ActionRead))
		{
			permissions.GET("", roleHandler.GetAllPermissions)
		}

		// RBAC demonstration routes
		demo := v1.Group("/demo")
		demo.Use(authMiddleware.RequireAuth())
		{
			// Vehicle management examples
			vehiclesRead := demo.Group("/vehicles")
			vehiclesRead.Use(rbacMiddleware.RequireVehicleRead())
			vehiclesRead.GET("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Vehicle list accessed", gin.H{
					"message": "You have permission to read vehicles",
					"permission": "vehicle:read",
				})
			})

			vehiclesCreate := demo.Group("/vehicles")
			vehiclesCreate.Use(rbacMiddleware.RequireVehicleCreate())
			vehiclesCreate.POST("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Vehicle creation accessed", gin.H{
					"message": "You have permission to create vehicles",
					"permission": "vehicle:create",
				})
			})

			vehiclesUpdate := demo.Group("/vehicles")
			vehiclesUpdate.Use(rbacMiddleware.RequireVehicleUpdate())
			vehiclesUpdate.PUT("/:id", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Vehicle update accessed", gin.H{
					"message": "You have permission to update vehicles",
					"permission": "vehicle:update",
				})
			})

			// Work order examples
			workOrdersRead := demo.Group("/work-orders")
			workOrdersRead.Use(rbacMiddleware.RequireWorkOrderRead())
			workOrdersRead.GET("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Work order list accessed", gin.H{
					"message": "You have permission to read work orders",
					"permission": "work_order:read",
				})
			})

			workOrdersCreate := demo.Group("/work-orders")
			workOrdersCreate.Use(rbacMiddleware.RequireWorkOrderCreate())
			workOrdersCreate.POST("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Work order creation accessed", gin.H{
					"message": "You have permission to create work orders",
					"permission": "work_order:create",
				})
			})

			workOrdersAssign := demo.Group("/work-orders")
			workOrdersAssign.Use(rbacMiddleware.RequireWorkOrderAssign())
			workOrdersAssign.PUT("/:id/assign", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Work order assignment accessed", gin.H{
					"message": "You have permission to assign work orders",
					"permission": "work_order:assign",
				})
			})

			// Inventory examples
			inventoryRead := demo.Group("/inventory")
			inventoryRead.Use(rbacMiddleware.RequireInventoryRead())
			inventoryRead.GET("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Inventory accessed", gin.H{
					"message": "You have permission to read inventory",
					"permission": "inventory:read",
				})
			})

			inventoryUpdate := demo.Group("/inventory")
			inventoryUpdate.Use(rbacMiddleware.RequireInventoryUpdate())
			inventoryUpdate.PUT("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Inventory update accessed", gin.H{
					"message": "You have permission to update inventory",
					"permission": "inventory:update",
				})
			})

			// Invoice examples
			invoicesRead := demo.Group("/invoices")
			invoicesRead.Use(rbacMiddleware.RequireInvoiceRead())
			invoicesRead.GET("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Invoice list accessed", gin.H{
					"message": "You have permission to read invoices",
					"permission": "invoice:read",
				})
			})

			invoicesCreate := demo.Group("/invoices")
			invoicesCreate.Use(rbacMiddleware.RequireInvoiceCreate())
			invoicesCreate.POST("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Invoice creation accessed", gin.H{
					"message": "You have permission to create invoices",
					"permission": "invoice:create",
				})
			})

			// Dashboard examples
			dashboardsMain := demo.Group("/dashboards")
			dashboardsMain.Use(rbacMiddleware.RequireDashboardAccess())
			dashboardsMain.GET("/main", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Main dashboard accessed", gin.H{
					"message": "You have permission to access the main dashboard",
					"permission": "dashboard:read",
				})
			})

			dashboardsReports := demo.Group("/dashboards")
			dashboardsReports.Use(rbacMiddleware.RequireReportRead())
			dashboardsReports.GET("/reports", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Reports dashboard accessed", gin.H{
					"message": "You have permission to access reports",
					"permission": "report:read",
				})
			})

			// Resource owner example
			resourceOwner := demo.Group("/my-work-orders")
			resourceOwner.Use(rbacMiddleware.RequireResourceOwner("work_order", "id"))
			resourceOwner.GET("/:id", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Personal work order accessed", gin.H{
					"message": "You can access your own work orders",
					"work_order_id": c.Param("id"),
				})
			})

			// Multiple permissions example (OR logic)
			multiPerm := demo.Group("/multi-permission")
			multiPerm.Use(rbacMiddleware.RequireAnyPermission([]rbac.PermissionDefinition{
				{Resource: rbac.ResourceWorkOrder, Action: rbac.ActionRead},
				{Resource: rbac.ResourceVehicle, Action: rbac.ActionRead},
			}))
			multiPerm.GET("", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Multi-permission route accessed", gin.H{
					"message": "You have access to either work orders OR vehicles",
					"permissions_required": []string{"work_order:read", "vehicle:read"},
				})
			})
		}

		// Legacy admin routes
		admin := v1.Group("/admin")
		admin.Use(authMiddleware.RequireAuth())
		admin.Use(authMiddleware.RequireAdmin())
		{
			admin.GET("/dashboard", func(c *gin.Context) {
				response.Success(c, http.StatusOK, "Admin dashboard accessed", gin.H{
					"message": "Welcome to admin dashboard",
				})
			})
		}

		// Placeholder routes for development
		v1.GET("/ping", func(c *gin.Context) {
			response.Success(c, http.StatusOK, "API v1 is working", gin.H{
				"message": "pong",
				"version": "1.0.0",
			})
		})
	}

	// Start server
	port := cfg.Server.Port
	logger.WithFields(logrus.Fields{
		"port":    port,
		"mode":    cfg.Server.Mode,
		"version": "1.0.0",
		"database": cfg.Database.Host + ":" + cfg.Database.Port + "/" + cfg.Database.DBName,
	}).Info("Starting TON Platform API server")

	if err := router.Run(":" + port); err != nil {
		logger.WithError(err).Fatal("Failed to start server")
	}
}