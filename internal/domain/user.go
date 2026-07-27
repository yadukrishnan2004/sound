package domain

import (
	"context"
	"time"
)

type User struct {
	ID       string    `json:"id"`
	Email    string    `json:"email"`
	Password string    `json:"-"`
	CreateAt time.Time `json:"create_at"`
}

type RegisterDto struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type LoginDto struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type RefreshTokenDto struct {
	RefreshToken string `json:"refresh_token"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type UserRepository interface{
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string)(*User, error)
	GetByID(ctx context.Context, id string)(*User, error)
}

type RedisRepository interface{
	StoreRefreshToken(ctx context.Context, userID, tokenID string, ttl time.Duration) error
	ValidateRefreshToken(ctx context.Context, userID, tokenID string) (bool, error)
	DeleteRefreshToken(ctx context.Context, userID, tokenID string) error
}