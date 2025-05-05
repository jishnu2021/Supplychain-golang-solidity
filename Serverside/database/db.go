package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDatabase() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://jishnughosh:jishnutodo@cluster0.cz215bq.mongodb.net/supplychain")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("❌ Failed to connect MongoDB:", err)
	}

	// Ping to ensure connection works
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("❌ Ping failed:", err)
	}

	DB = client.Database("supplychain")
	log.Println("✅ Connected to MongoDB database: supplychain")
}

func GetCollection(collectionName string) *mongo.Collection {
	log.Printf("📦 Using collection: %s", collectionName)
	return DB.Collection(collectionName)
}
