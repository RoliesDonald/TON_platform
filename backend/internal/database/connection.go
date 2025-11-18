package database

import (
	"fmt"
	"time"

	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"

	"ton-platform/internal/config"
)

// NewConnection creates a new database connection
func NewConnection(cfg *config.DatabaseConfig, logger *logrus.Logger) (*gorm.DB, error) {
	dsn := cfg.GetDSN()

	// Configure GORM logger
	gormLogLevel := gormLogger.Silent
	if logger.Level == logrus.DebugLevel {
		gormLogLevel = gormLogger.Info
	}

	// Open database connection
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormLogger.Default.LogMode(gormLogLevel),
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Configure connection pool
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxOpenConns(100)           // Maximum number of open connections
	sqlDB.SetMaxIdleConns(10)            // Maximum number of idle connections
	sqlDB.SetConnMaxLifetime(time.Hour)  // Maximum lifetime of a connection
	sqlDB.SetConnMaxIdleTime(time.Minute * 30) // Maximum idle time for a connection

	// Test connection
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	logger.WithFields(logrus.Fields{
		"host":     cfg.Host,
		"port":     cfg.Port,
		"dbname":   cfg.DBName,
		"ssl_mode": cfg.SSLMode,
	}).Info("Database connection established successfully")

	return db, nil
}

// CloseConnection closes the database connection
func CloseConnection(db *gorm.DB, logger *logrus.Logger) error {
	if db == nil {
		return nil
	}

	sqlDB, err := db.DB()
	if err != nil {
		logger.WithError(err).Error("Failed to get underlying sql.DB for closing")
		return err
	}

	if err := sqlDB.Close(); err != nil {
		logger.WithError(err).Error("Failed to close database connection")
		return err
	}

	logger.Info("Database connection closed successfully")
	return nil
}

// HealthCheck performs a database health check
func HealthCheck(db *gorm.DB) error {
	if db == nil {
		return fmt.Errorf("database connection is nil")
	}

	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("database health check failed: %w", err)
	}

	return nil
}