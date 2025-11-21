package middleware

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"ton-platform/pkg/errors"
	"ton-platform/pkg/response"
)

// ErrorHandler provides centralized error handling
type ErrorHandler struct {
	logger *logrus.Logger
}

// NewErrorHandler creates a new error handler instance
func NewErrorHandler(logger *logrus.Logger) *ErrorHandler {
	return &ErrorHandler{
		logger: logger,
	}
}

// HandleError processes errors and returns appropriate HTTP responses
func (eh *ErrorHandler) HandleError(c *gin.Context, err error) {
	// Determine if this is one of our structured errors
	if apiErr, ok := err.(*errors.APIError); ok {
		eh.handleAPIError(c, apiErr)
		return
	}

	if customErr, ok := err.(*errors.Error); ok {
		eh.handleCustomError(c, customErr)
		return
	}

	// Handle validation errors from Gin
	if gin.IsBindingError(err) {
		eh.handleValidationError(c, err)
		return
	}

	// Handle JWT errors
	if isJWTError(err) {
		eh.handleJWTError(c, err)
		return
	}

	// Handle unknown errors as internal server errors
	eh.handleInternalError(c, err)
}

// handleAPIError handles structured API errors
func (eh *ErrorHandler) handleAPIError(c *gin.Context, apiErr *errors.APIError) {
	// Add request context to the error
	apiErr.RequestID = c.GetString("request_id")
	apiErr.TraceID = c.GetString("trace_id")

	if userID, exists := c.Get("user_id"); exists {
		if uid, ok := userID.(uint); ok {
			apiErr.UserID = uid
		}
	}

	// Log the error with context
	eh.logError(apiErr.Category, apiErr, map[string]interface{}{
		"request_id": apiErr.RequestID,
		"trace_id":   apiErr.TraceID,
		"user_id":    apiErr.UserID,
		"method":     c.Request.Method,
		"path":       c.Request.URL.Path,
		"status":     apiErr.Status,
	})

	// Return error response
	c.JSON(apiErr.Status, gin.H{
		"success": false,
		"error":   apiErr,
	})
}

// handleCustomError handles custom structured errors
func (eh *ErrorHandler) handleCustomError(c *gin.Context, customErr *errors.Error) {
	// Convert to APIError for consistency
	apiErr := &errors.APIError{
		Code:        customErr.Code,
		Message:     customErr.Message,
		Status:     customErr.StatusCode,
		Category:   customErr.Category,
		Timestamp:  customErr.Timestamp,
		RequestID:  c.GetString("request_id"),
		TraceID:    c.GetString("trace_id"),
		Metadata:   customErr.Context,
	}

	if userID, exists := c.Get("user_id"); exists {
		if uid, ok := userID.(uint); ok {
			apiErr.UserID = uid
		}
	}

	eh.handleAPIError(c, apiErr)
}

// handleValidationError handles Gin binding validation errors
func (eh *ErrorHandler) handleValidationError(c *gin.Context, err error) {
	validationErrors := extractValidationErrors(err)

	apiErr := errors.NewValidationError("Request validation failed", validationErrors)
	apiErr.RequestID = c.GetString("request_id")
	apiErr.TraceID = c.GetString("trace_id")

	if userID, exists := c.Get("user_id"); exists {
		if uid, ok := userID.(uint); ok {
			apiErr.UserID = uid
		}
	}

	eh.handleAPIError(c, apiErr)
}

// handleJWTError handles JWT authentication errors
func (eh *ErrorHandler) handleJWTError(c *gin.Context, err error) {
	apiErr := errors.NewAPIError(
		errors.ErrTokenInvalid.Error(),
		"Authentication failed: "+err.Error(),
		http.StatusUnauthorized,
		errors.ErrorCategoryAuthentication,
	)
	apiErr.RequestID = c.GetString("request_id")
	apiErr.TraceID = c.GetString("trace_id")

	eh.handleAPIError(c, apiErr)
}

// handleInternalError handles unexpected internal server errors
func (eh *ErrorHandler) handleInternalError(c *gin.Context, err error) {
	// Log the full error and stack trace for debugging
	eh.logger.WithFields(logrus.Fields{
		"error":       err.Error(),
		"stack_trace": string(debug.Stack()),
		"request_id":  c.GetString("request_id"),
		"trace_id":    c.GetString("trace_id"),
		"method":      c.Request.Method,
		"path":        c.Request.URL.Path,
		"user_agent":  c.Request.UserAgent(),
		"remote_addr": c.ClientIP(),
	}).Error("Internal server error")

	// Return generic error to client (don't expose internal details)
	apiErr := errors.NewInternalError(err, "An unexpected error occurred. Please try again later.")
	apiErr.RequestID = c.GetString("request_id")
	apiErr.TraceID = c.GetString("trace_id")

	if userID, exists := c.Get("user_id"); exists {
		if uid, ok := userID.(uint); ok {
			apiErr.UserID = uid
		}
	}

	c.JSON(apiErr.Status, gin.H{
		"success": false,
		"error":   apiErr,
	})
}

// logError logs errors with appropriate level and context
func (eh *ErrorHandler) logError(category errors.ErrorCategory, err error, context map[string]interface{}) {
	logLevel := eh.getLogLevel(category)

	// Create logger with fields
	logger := eh.logger.WithFields(logrus.Fields{
		"error_category": category,
		"error_code":     "",
		"error_message":  err.Error(),
	})

	// Extract error code if it's an APIError
	if apiErr, ok := err.(*errors.APIError); ok {
		logger = logger.WithFields(logrus.Fields{
			"error_code":   apiErr.Code,
			"status":       apiErr.Status,
			"details":      apiErr.Details,
		})
	}

	// Add additional context
	for key, value := range context {
		logger = logger.WithField(key, value)
	}

	// Log at appropriate level
	switch logLevel {
	case errors.LogLevelError:
		logger.Error("Request failed")
	case errors.LogLevelWarn:
		logger.Warn("Request completed with warning")
	case errors.LogLevelInfo:
		logger.Info("Request completed with info")
	case errors.LogLevelDebug:
		logger.Debug("Request completed with debug info")
	}
}

// getLogLevel determines the appropriate log level for an error category
func (eh *ErrorHandler) getLogLevel(category errors.ErrorCategory) errors.LogLevel {
	switch category {
	case errors.ErrorCategoryValidation:
		return errors.LogLevelWarn
	case errors.ErrorCategoryAuthentication, errors.ErrorCategoryAuthorization:
		return errors.LogLevelWarn
	case errors.ErrorCategoryBusiness, errors.ErrorCategoryExternal:
		return errors.LogLevelInfo
	case errors.ErrorCategoryDatabase, errors.ErrorCategorySystem, errors.ErrorCategoryInternal:
		return errors.LogLevelError
	case errors.ErrorCategorySecurity, errors.ErrorCategoryNetwork:
		return errors.LogLevelError
	case errors.ErrorCategoryClient:
		return errors.LogLevelWarn
	default:
		return errors.LogLevelError
	}
}

// extractValidationErrors extracts validation errors from Gin binding errors
func extractValidationErrors(err error) []errors.ValidationError {
	var validationErrors []errors.ValidationError

	// Handle JSON binding errors
	if jsonErr, ok := err.(*json.UnmarshalTypeError); ok {
		validationErrors = append(validationErrors, errors.ValidationError{
			Field:   jsonErr.Field,
			Message: "Invalid type for field " + jsonErr.Field,
			Code:    errors.ErrCodeInvalidFormat,
			Value:   jsonErr.Value,
		})
	}

	// Handle other binding errors
	validationErrors = append(validationErrors, errors.ValidationError{
		Field:   "request_body",
		Message: err.Error(),
		Code:    errors.ErrCodeInvalidFormat,
	})

	return validationErrors
}

// isJWTError checks if an error is related to JWT authentication
func isJWTError(err error) bool {
	errStr := err.Error()
	jwtErrors := []string{
		"token is expired",
		"token is invalid",
		"token not found",
		"invalid signing method",
		"signature is invalid",
	}

	for _, jwtErr := range jwtErrors {
		if contains(errStr, jwtErr) {
			return true
		}
	}

	return false
}

// contains checks if a string contains a substring (case-insensitive)
func contains(s, substr string) bool {
	return len(s) >= len(substr) &&
		   (s == substr ||
		    (len(s) > len(substr) &&
		     s[:len(substr)] == substr ||
		     s[len(s)-len(substr):] == substr ||
		     containsMiddle(s, substr)))
}

func containsMiddle(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}