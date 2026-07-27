package config

import "os"

type Config struct {
	Port             string
	DBHost           string
	DBPort           string
	DBUser           string
	DBPassword       string
	DBName           string
	RedisPort        string
	RedisHost        string
	JWTSecret        string
	JWTRefreshSecret string
}


func LoadConfig() *Config{
	return &Config{
		Port:             getEnv("PORT", "8080"),
		DBHost:           getEnv("DB_HOST", "localhost"),
		DBPort:           getEnv("DB_PORT", "5432"),
		DBUser:           getEnv("DB_USER", "auth_user"),
		DBPassword:       getEnv("DB_PASSWORD", "auth_password"),
		DBName:           getEnv("DB_NAME", "auth_db"),
		RedisHost:        getEnv("REDIS_HOST", "localhost"),
		RedisPort:        getEnv("REDIS_PORT", "6379"),
		JWTSecret:        getEnv("JWT_SECRET", "default_jwt_secret"),
		JWTRefreshSecret: getEnv("JWT_REFRESH_SECRET", "default_refresh_secret"),
	}
}

func getEnv(key, defaultValue string) string{
	if val, exists := os.LookupEnv(key); exists {
		return val
	}
	return defaultValue
}