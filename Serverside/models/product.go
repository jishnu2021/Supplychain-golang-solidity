package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HistoryEntry struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
}

type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string             `bson:"name" json:"name"`
	Category    string             `bson:"category" json:"category"`
	Status      string             `bson:"status" json:"status"`
	Origin      string             `bson:"origin" json:"origin"`
	Destination string             `bson:"destination" json:"destination"`
	Owner       string             `bson:"owner" json:"owner"`
	History     []HistoryEntry     `bson:"history" json:"history"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}
