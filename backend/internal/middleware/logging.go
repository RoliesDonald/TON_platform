package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// Logging middleware for HTTP requests
func Logging(logger *logrus.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Process request
		c.Next()

		// Log request details
		duration := time.Since(start)
		statusCode := c.Writer.Status()

		entry := logger.WithFields(logrus.Fields{
			"method":     c.Request.Method,
			"path":       c.Request.URL.Path,
			"status":     statusCode,
			"duration":   duration,
			"ip":         c.ClientIP(),
			"user_agent": c.Request.UserAgent(),
		})

		if len(c.Errors) > 0 {
			// Log errors
			entry.Error(c.Errors.String())
		} else {
			if statusCode >= 500 {
				entry.Error("Internal server error")
			} else if statusCode >= 400 {
				entry.Warn("Client error")
			} else {
				entry.Info("Request completed")
			}
		}
	}
}