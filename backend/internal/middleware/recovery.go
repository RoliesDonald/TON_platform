package middleware

import (
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// Recovery middleware for handling panics
func Recovery(logger *logrus.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Log the panic with stack trace
				logger.WithFields(logrus.Fields{
					"error": err,
					"stack": string(debug.Stack()),
					"path":  c.Request.URL.Path,
					"method": c.Request.Method,
				}).Error("Panic recovered")

				// Return appropriate error response
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"message": "Internal server error",
					"error":   "An unexpected error occurred",
				})
			}
		}()

		c.Next()
	}
}