package config

import (
	"fmt"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Port           string
	DatabaseURL    string
	RedisURL       string
	AccessSecret    string
	RefreshSecret   string
	TokenTTL        time.Duration
	RefreshTokenTTL time.Duration
}

func LoadConfig() *Config {
	tokenTTL, _ := time.ParseDuration(getEnv("JWT_ACCESS_EXPIRES_IN", "15m"))
	refreshTokenTTL, _ := time.ParseDuration(getEnv("JWT_REFRESH_EXPIRES_IN", "168h"))

	return &Config{
		Port:           getEnv("PORT", "8001"),
		DatabaseURL:    getEnv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/mportal?sslmode=disable"),
		RedisURL:       getEnv("REDIS_URL", "redis://localhost:6379"),
		AccessSecret:    getEnv("JWT_ACCESS_SECRET", "super-secret-access-key"),
		RefreshSecret:   getEnv("JWT_REFRESH_SECRET", "super-secret-refresh-key"),
		TokenTTL:        tokenTTL,
		RefreshTokenTTL: refreshTokenTTL,
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func ConnectDatabase(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %w", err)
	}

	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";").Error; err != nil {
		return nil, fmt.Errorf("failed to create uuid extension: %w", err)
	}

	return db, nil
}
